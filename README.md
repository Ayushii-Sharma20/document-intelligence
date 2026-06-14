# Document Intelligence + Agentic RAG

## Overview

Document Intelligence platform built using FastAPI, Next.js, ChromaDB, OCR, and Gemini.

The system supports document upload, OCR extraction, document classification, semantic search, and citation-based question answering.

## Features

* Single PDF Upload
* Bulk PDF Upload
* OCR Text Extraction
* Document Classification
* ChromaDB Vector Search
* Agentic RAG
* Multi-turn Chat
* Document-specific Search
* Citation Generation
* Clickable Citation Images

## Tech Stack

**Frontend:** Next.js, React, TypeScript

**Backend:** FastAPI, Python

**AI:** Gemini API, Gemini Embeddings

**Database:** ChromaDB

## Architecture

```text
Next.js
   ↓
FastAPI
   ↓
OCR + Parser
   ↓
Classifier
   ↓
ChromaDB
   ↓
Gemini
```

## Security Decisions

* PDF-only uploads
* 10 MB upload limit
* Input validation
* Safe filename handling
* Environment-based API keys
* CORS restricted to frontend

## Sample Documents

Included sample documents:
* Invoice
* Privacy Policy
* Research Paper
* Employee Handbook
* Medical Report

## Future Improvements

* Voice Input
* Authentication
* Rate Limiting
* Cloud Storage
