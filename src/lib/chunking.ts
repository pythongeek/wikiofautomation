// lib/chunking.ts
// Smart Chunking Engine for RAG pipeline

export interface Chunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    sourceId: string;
    title: string;
    url: string;
    createdAt: string;
  };
}

export class SmartChunkingEngine {
  chunk(text: string, maxChunkSize = 500, overlap = 50): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        const words = currentChunk.split(' ');
        currentChunk = words.slice(-Math.floor(overlap / 5)).join(' ') + ' ' + sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
  }

  chunkProduct(product: { id: string; name: string; description: string; features?: string[]; price: number; category: string; slug: string }): Chunk[] {
    const chunks: Chunk[] = [];
    const baseMetadata = {
      source: 'product',
      sourceId: product.id,
      title: product.name,
      url: `/marketplace/${product.category}/${product.slug}`,
      createdAt: new Date().toISOString(),
    };
    chunks.push({
      id: `prod-${product.id}-main`,
      content: `Product: ${product.name}. Category: ${product.category}. Price: $${product.price}. Description: ${product.description}`,
      metadata: baseMetadata,
    });
    if (product.features) {
      for (let i = 0; i < product.features.length; i++) {
        chunks.push({
          id: `prod-${product.id}-feat-${i}`,
          content: `Product ${product.name} feature: ${product.features[i]}`,
          metadata: { ...baseMetadata, title: `${product.name} - Feature ${i + 1}` },
        });
      }
    }
    return chunks;
  }

  chunkBlogPost(post: { id: string; title: string; content: string; slug: string; created_at?: string }): Chunk[] {
    return this.chunk(post.content, 500, 50).map((c, i) => ({
      id: `blog-${post.id}-chunk-${i}`,
      content: c,
      metadata: {
        source: 'blog',
        sourceId: post.id,
        title: post.title,
        url: `/news/${post.slug}`,
        createdAt: post.created_at || new Date().toISOString(),
      },
    }));
  }

  chunkPage(page: { id: string; title: string; content: string; slug: string }): Chunk[] {
    return this.chunk(page.content, 800, 100).map((c, i) => ({
      id: `page-${page.id}-chunk-${i}`,
      content: c,
      metadata: {
        source: 'page',
        sourceId: page.id,
        title: page.title,
        url: `/${page.slug}`,
        createdAt: new Date().toISOString(),
      },
    }));
  }
}
