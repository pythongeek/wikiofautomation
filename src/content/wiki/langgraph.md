---
title: LangGraph
bangla_title: ল্যাংগ্রাফ (LangGraph)
category: frameworks
tags: [agent-framework, python, typescript, multi-agent]
created: '2026-08-01'
updated: '2026-08-01'
summary: A stateful, orchestration framework for building agentic and multi-agent workflows with cyclic graph loops.
bangla_summary: সাইক্লিক গ্রাফ লুপের সাথে এজেন্টিক এবং মাল্টি-এজেন্ট ওয়ার্কফ্লো তৈরির জন্য একটি স্টেটফুল অর্কেস্ট্রেশন ফ্রেমওয়ার্ক।
sources:
  - title: LangGraph Documentation
    url: https://langchain-ai.github.io/langgraph/
infobox:
  kind: Agent Orchestration Framework
  first_release: '2024'
  license: MIT
  language: Python, TypeScript
  repo: https://github.com/langchain-ai/langgraph
  site: https://langchain-ai.github.io/langgraph/
---

# LangGraph

**LangGraph** is a library for building stateful, multi-actor applications with LLMs. It extends the LangChain ecosystem by allowing developers to define cyclic workflows and agent loops using a graph representation (Nodes and Edges).

## Key Features

- **Cyclic Graphs**: Unlike standard linear chains, LangGraph allows loops, essential for iterative refinement.
- **State Management**: Built-in persistence for conversation states and memory checkpoints.
- **Human-in-the-Loop**: Pause execution to wait for user approval or input.
