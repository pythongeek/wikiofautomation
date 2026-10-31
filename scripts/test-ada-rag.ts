/**
 * scripts/test-ada-rag.ts — Comprehensive Verification Test Suite for Ada AI & Site Knowledge
 */
import { retrieve } from '../src/lib/ada/rag';
import { adaChat } from '../src/lib/ada/client';
import { ADA_SYSTEM_PROMPT } from '../src/lib/ada/prompts';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🤖 ADA AI CHATBOT & RAG KNOWLEDGE VERIFICATION SUITE');
  console.log('====================================================\n');

  const testQueries = [
    {
      category: '1. Framework & Workflow Knowledge',
      query: 'What is n8n and how does its workflow execution engine work?',
      expectedKeywords: ['n8n', 'workflow', 'node', 'fair-code'],
    },
    {
      category: '2. Protocol Knowledge',
      query: 'What is Model Context Protocol (MCP) and how does WebMCP connect external tool servers?',
      expectedKeywords: ['MCP', 'Model Context Protocol', 'JSON-RPC', 'tool'],
    },
    {
      category: '3. Agent Swarms & Comparisons',
      query: 'How does LangGraph compare to AutoGen for multi-agent swarms?',
      expectedKeywords: ['LangGraph', 'AutoGen', 'agent', 'swarm'],
    },
    {
      category: '4. Marketplace Assets & Listings',
      query: 'What AI agents and prompt suites are available in the marketplace?',
      expectedKeywords: ['marketplace', 'agent', 'prompt', 'Claude'],
    },
    {
      category: '5. Creator Publishing & Monetization',
      query: 'How do creators publish tools on /marketplace/publish and what is the revenue split?',
      expectedKeywords: ['publish', 'creator', 'revenue', '90%'],
    },
    {
      category: '6. Admin & Knowledge Graph',
      query: 'What can admins manage in /admin/knowledge-graph and the Obsidian Brain Dashboard?',
      expectedKeywords: ['admin', 'graph', 'revenue', 'views'],
    },
  ];

  let passedTests = 0;

  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    console.log(`[TEST ${i + 1}/6] Category: ${test.category}`);
    console.log(`Query: "${test.query}"`);

    // 1. Test RAG Vector/Keyword Retrieval
    const chunks = await retrieve(test.query, 5);
    console.log(`-> RAG Retrieval Matched: ${chunks.length} chunks`);
    if (chunks.length > 0) {
      console.log(`   Top Match: "${chunks[0].title}" (${chunks[0].url})`);
    }

    // 2. Build Context Prompt & Call MiniMax AI M3
    const contextStr = chunks
      .map((c, idx) => `[#${idx + 1} ${c.kind}] ${c.title}\nURL: ${c.url}\nSnippet: ${c.snippet}`)
      .join('\n\n');

    const userWithContext = `Context from wiki of automation:\n\n${contextStr}\n\nUser question: ${test.query}\n\nAnswer concisely grounded in context with URLs.`;

    try {
      const response = await adaChat(
        [
          { role: 'system', content: ADA_SYSTEM_PROMPT },
          { role: 'user', content: userWithContext },
        ],
        { temperature: 0.3, maxTokens: 400 }
      );

      console.log(`\n🤖 Ada AI Response (${response.ms}ms, ${response.totalTokens} tokens):`);
      console.log(`"${response.content.trim()}"\n`);

      // Verify keywords in retrieved chunks or AI output
      const contentUpper = (response.content + ' ' + chunks.map(c => c.title + ' ' + c.snippet).join(' ')).toUpperCase();
      const hasKeywords = test.expectedKeywords.some(kw => contentUpper.includes(kw.toUpperCase()));

      if (chunks.length > 0 && response.content.length > 10 && hasKeywords) {
        console.log(`✓ STATUS: PASSED\n`);
        passedTests++;
      } else {
        console.log(`⚠ STATUS: CHECK FAILED\n`);
      }
    } catch (err: any) {
      console.log(`❌ STATUS: ERROR (${err?.message})\n`);
    }
  }

  console.log('====================================================');
  console.log(`TEST SUITE COMPLETE: ${passedTests}/${testQueries.length} PASSED`);
  console.log('====================================================');
}

runTestSuite();
