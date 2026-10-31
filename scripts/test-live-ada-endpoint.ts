/**
 * scripts/test-live-ada-endpoint.ts — Detailed RAG & Ada AI API Verification Audit
 */
import fs from 'fs';

async function testAdaEndpoint(query: string, label: string) {
  console.log(`\n----------------------------------------------------`);
  console.log(`[TEST ITEM] ${label}`);
  console.log(`Query: "${query}"`);

  const url = 'http://localhost:4321/api/ada';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });

    const statusText = `${res.status} ${res.statusText}`;
    const text = await res.text();
    console.log(`-> Target: ${url} (Status: ${statusText})`);
    console.log(`-> Response Body: "${text}"`);
  } catch (err: any) {
    console.log(`-> Error: ${err?.message}`);
  }
}

async function runLiveVerification() {
  console.log('====================================================');
  console.log('🌐 ADA AI API RAG RETRIEVAL & ERROR HANDLING AUDIT');
  console.log('====================================================');

  await testAdaEndpoint('What is n8n and how does its workflow execution engine work?', '1. Framework & Workflow Knowledge');
  await testAdaEndpoint('What is Model Context Protocol (MCP) and WebMCP specs?', '2. Protocol Knowledge');
  await testAdaEndpoint('How does LangGraph compare to AutoGen for multi-agent swarms?', '3. Multi-Agent Swarm Comparison');

  console.log('\n====================================================');
  console.log('✓ AUDIT COMPLETE');
  console.log('====================================================');
}

runLiveVerification();
