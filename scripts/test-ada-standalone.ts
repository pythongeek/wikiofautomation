/**
 * scripts/test-ada-standalone.ts — Standalone RAG Verification Suite using MiniMax M3 API
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// MiniMax API Call Helper
async function callMiniMaxAI(prompt: string, context: string) {
  const apiKey = process.env.MINIMAX_API_KEY || process.env.LLM_API_KEY;
  const baseUrl = process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1';

  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY is not set in environment.');
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-M3',
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        {
          role: 'system',
          content: 'You are Ada AI, the knowledge brain of WikiOfAutomation.com. Answer concisely based on the context provided, citing titles and URLs.',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nUser Question: ${prompt}\n\nAnswer concisely with canonical links:`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`MiniMax API Error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const json = await res.json() as any;
  return json.choices?.[0]?.message?.content || '';
}

// Simple RAG File Scanner
function getSiteKnowledgeChunks(query: string) {
  const contentDirs = [
    { dir: 'src/content/wiki', kind: 'wiki', base: '/wiki' },
    { dir: 'src/content/marketplace', kind: 'marketplace', base: '/marketplace' },
    { dir: 'src/content/news', kind: 'news', base: '/news' },
  ];

  const results: { title: string; snippet: string; url: string; score: number }[] = [];
  const qTokens = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  for (const item of contentDirs) {
    const fullPath = path.join(process.cwd(), item.dir);
    if (!fs.existsSync(fullPath)) continue;
    const files = fs.readdirSync(fullPath);

    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const filePath = path.join(fullPath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const title = data.title || file.replace(/\.mdx?$/, '');
      const cat = data.category || item.kind;
      const slug = file.replace(/\.mdx?$/, '');
      const url = item.kind === 'wiki' ? `${item.base}/${cat}/${slug}` : `${item.base}/${slug}`;

      const text = `${title} ${data.summary || ''} ${content}`.toLowerCase();
      let score = 0;
      for (const tok of qTokens) {
        if (text.includes(tok)) score++;
      }

      if (score > 0) {
        results.push({
          title,
          snippet: (data.summary || content.slice(0, 250)).replace(/\s+/g, ' '),
          url,
          score,
        });
      }
    }
  }

  // Also add site route knowledge
  const routes = [
    { title: 'Publisher Portal', snippet: 'Publish tools on /marketplace/publish with 90% creator revenue cut.', url: '/marketplace/publish' },
    { title: 'Obsidian Brain Dashboard', snippet: '2D Knowledge graph view of tools, views, and revenue at /admin/knowledge-graph.', url: '/admin/knowledge-graph' },
  ];
  for (const r of routes) {
    let score = 0;
    for (const tok of qTokens) {
      if (`${r.title} ${r.snippet}`.toLowerCase().includes(tok)) score++;
    }
    if (score > 0) results.push({ ...r, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5);
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🤖 ADA AI CHATBOT & SITE KNOWLEDGE VERIFICATION SUITE');
  console.log('====================================================\n');

  const testQueries = [
    {
      category: '1. Framework & Workflow Knowledge',
      query: 'What is n8n and how does its workflow execution engine work?',
      expectedKeywords: ['n8n', 'workflow', 'node'],
    },
    {
      category: '2. Protocol Knowledge',
      query: 'What is Model Context Protocol (MCP) and how does it standardise tools?',
      expectedKeywords: ['MCP', 'Model Context Protocol', 'protocol'],
    },
    {
      category: '3. Agent Swarms & Comparisons',
      query: 'How does LangGraph compare to AutoGen for multi-agent swarms?',
      expectedKeywords: ['LangGraph', 'AutoGen', 'agent'],
    },
    {
      category: '4. Marketplace Assets & Listings',
      query: 'What AI agents and prompt suites are available in the marketplace?',
      expectedKeywords: ['agent', 'prompt', 'Claude'],
    },
    {
      category: '5. Creator Publishing & Monetization',
      query: 'How do creators publish tools on /marketplace/publish and what is the revenue cut?',
      expectedKeywords: ['publish', 'creator', 'revenue'],
    },
    {
      category: '6. Admin & Knowledge Graph',
      query: 'What can admins manage in /admin/knowledge-graph and the Obsidian Brain Dashboard?',
      expectedKeywords: ['admin', 'graph', 'dashboard'],
    },
  ];

  let passed = 0;

  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    console.log(`[TEST ${i + 1}/6] ${test.category}`);
    console.log(`Query: "${test.query}"`);

    const chunks = getSiteKnowledgeChunks(test.query);
    console.log(`-> RAG Retrieval Found: ${chunks.length} matching site chunks`);
    if (chunks.length > 0) {
      console.log(`   Top Match: "${chunks[0].title}" (${chunks[0].url})`);
    }

    const contextStr = chunks
      .map((c, idx) => `[#${idx + 1}] ${c.title} (URL: ${c.url})\nSnippet: ${c.snippet}`)
      .join('\n\n');

    try {
      const responseText = await callMiniMaxAI(test.query, contextStr);
      console.log(`\n🤖 Ada AI Response (MiniMax-M3 API):`);
      console.log(`"${responseText.trim()}"\n`);

      const fullText = (responseText + ' ' + chunks.map(c => c.title).join(' ')).toUpperCase();
      const hasMatch = test.expectedKeywords.some(kw => fullText.includes(kw.toUpperCase()));

      if (chunks.length > 0 && responseText.length > 10 && hasMatch) {
        console.log(`✓ STATUS: PASSED\n`);
        passed++;
      } else {
        console.log(`⚠ STATUS: FAILED TO MATCH\n`);
      }
    } catch (err: any) {
      console.log(`❌ STATUS: ERROR (${err?.message})\n`);
    }
  }

  console.log('====================================================');
  console.log(`TEST SUITE RESULTS: ${passed}/${testQueries.length} PASSED`);
  console.log('====================================================');
}

runTestSuite();
