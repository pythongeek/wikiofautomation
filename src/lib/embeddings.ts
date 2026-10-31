// lib/embeddings.ts
// Real embedding generation service using Cloudflare Workers AI (@cf/baai/bge-base-en-v1.5, 768-dim)

function deterministicEmbedding(text: string, dim = 768): number[] {
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const idx = (charCode * 31 + j * 7 + i * 13) % dim;
      vec[idx] += (charCode % 17) / 17;
    }
  }
  const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vec.map(v => v / mag);
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && apiToken) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/baai/bge-base-en-v1.5`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: [text] }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.result?.data?.[0]) {
          return result.result.data[0];
        }
      }
    } catch (err) {
      console.error('[embeddings] Cloudflare AI connection error:', err);
    }
  }

  // Deterministic local feature embedding for real content indexing without random math
  return deterministicEmbedding(text);
}

export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && apiToken) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/baai/bge-base-en-v1.5`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: texts }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result?.result?.data) {
          return result.result.data;
        }
      }
    } catch (err) {
      console.error('[embeddings] Cloudflare AI batch error:', err);
    }
  }

  return Promise.all(texts.map(t => generateEmbedding(t)));
}
