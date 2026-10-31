// POST /api/chat — Ada AI SSE Streaming Chat (production)
// Uses real RAG retrieval from content collections + Minimax M3 streaming.

import type { APIRoute } from 'astro';
import { retrieve } from '~/lib/ada/rag.ts';
import { ADA_SYSTEM_PROMPT } from '~/lib/ada/prompts.ts';

export const prerender = false;

function env(name: string): string | undefined {
  return (import.meta.env?.[name] ?? process.env[name]) as string | undefined;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const messages: { role: string; content: string }[] = body.messages || [];
    const userQuestion =
      messages.length > 0
        ? messages[messages.length - 1].content
        : 'What is Wiki of Automation?';

    // ── 1. RAG Retrieval: keyword-scored chunks from content collections ──
    const ragChunks = await retrieve(userQuestion, 5);

    const context = ragChunks
      .map(
        (c, i) =>
          `[${i + 1}] ${c.title} (${c.kind}/${c.category})\nURL: https://wikiofautomation.com${c.url}\nSnippet: ${c.snippet}`,
      )
      .join('\n\n');

    // ── 2. Build the full prompt with RAG context ──
    const userWithContext = context
      ? `Here is relevant context from Wiki of Automation. Use it to ground your answer — cite sources with markdown links using the exact URLs provided. Be creative, specific, and helpful.\n\n${context}\n\n---\n\nUser question: ${userQuestion}`
      : `User question: ${userQuestion}\n\nAnswer helpfully. If our wiki doesn't cover this topic, say so honestly and suggest what the user could explore next.`;

    // ── 3. Resolve Minimax API credentials ──
    const apiKey =
      env('MINIMAX_API_KEY') ??
      env('PUBLIC_MINIMAX_API_KEY') ??
      env('LLM_API_KEY');
    const baseUrl =
      env('MINIMAX_BASE_URL') ??
      env('PUBLIC_MINIMAX_BASE_URL') ??
      env('LLM_API_URL') ??
      'https://api.minimax.io/v1';
    const rawModel =
      env('MINIMAX_MODEL') ??
      env('PUBLIC_MINIMAX_MODEL') ??
      env('LLM_MODEL') ??
      'MiniMax-M3';
    const model = rawModel.replace(/^minimax\//i, '');

    if (!apiKey) {
      // Return a helpful SSE error message instead of crashing
      return sseError(
        'Minimax API key is not configured. Please set MINIMAX_API_KEY in your Hostinger environment variables.',
      );
    }

    // ── 4. Call Minimax M3 with streaming enabled ──
    const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

    const minimaxRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 1200,
        stream: true,
        messages: [
          { role: 'system', content: ADA_SYSTEM_PROMPT },
          { role: 'user', content: userWithContext },
        ],
      }),
    });

    if (!minimaxRes.ok) {
      const errBody = await minimaxRes.text().catch(() => '');
      console.error(`[chat] Minimax ${minimaxRes.status}: ${errBody.slice(0, 200)}`);
      return sseError(
        `Minimax API returned ${minimaxRes.status}. The AI service may be temporarily unavailable.`,
      );
    }

    // ── 5. Proxy the Minimax SSE stream to the client ──
    // Minimax returns standard OpenAI-compatible SSE chunks.
    // We forward them directly, then append our source links at the end.

    const minimaxBody = minimaxRes.body;
    if (!minimaxBody) {
      return sseError('Minimax returned an empty response body.');
    }

    const sourceLinks = ragChunks
      .filter((c) => c.url)
      .map(
        (c) =>
          `- [${c.title}](https://wikiofautomation.com${c.url})`,
      )
      .join('\n');

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const reader = minimaxBody.getReader();
        let done = false;

        try {
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              const text = decoder.decode(value, { stream: true });
              // Forward all SSE data lines directly
              controller.enqueue(encoder.encode(text));
            }
          }

          // After Minimax stream ends, append source links as a final chunk
          if (sourceLinks) {
            const linksContent = `\n\n📚 **Sources:**\n${sourceLinks}`;
            const payload = JSON.stringify({
              choices: [{ delta: { content: linksContent } }],
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          console.error('[chat] Stream relay error:', err);
          const errPayload = JSON.stringify({
            choices: [
              {
                delta: {
                  content:
                    '\n\n⚠️ Stream interrupted. Please try again.',
                },
              },
            ],
          });
          controller.enqueue(encoder.encode(`data: ${errPayload}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[chat] Unexpected error:', error);
    return sseError('An unexpected error occurred. Please try again.');
  }
};

/** Helper: return an SSE stream that delivers a single error message, then [DONE]. */
function sseError(message: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const payload = JSON.stringify({
        choices: [{ delta: { content: `⚠️ ${message}` } }],
      });
      controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
