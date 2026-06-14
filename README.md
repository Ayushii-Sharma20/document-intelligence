# Document Intelligence + Agentic RAG

## Overview

Document Intelligence is an AI-powered document processing and question-answering system built using FastAPI, Next.js, ChromaDB, OCR, and Google Gemini.

The application allows users to upload PDF documents, extract text, classify content, perform semantic search, and ask questions using Retrieval-Augmented Generation (RAG) with citation support.

## Features

* Single PDF Upload
* Bulk PDF Upload
* OCR Text Extraction
* Document Classification
* Semantic Search
* ChromaDB Vector Storage
* Agentic RAG
* Multi-turn Chat
* Document-specific Search
* Citation Generation
* Citation Image Preview
* PDF Validation
* File Size Validation

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript

### Backend

* FastAPI
* Python

### AI

* Google Gemini
* Gemini Embeddings

### Database

* ChromaDB

## Architecture

Next.js Frontend

↓

FastAPI Backend

↓

OCR + PDF Parser

↓

Document Classification

↓

ChromaDB Vector Store

↓

Gemini LLM

↓

Answer + Citations

## Setup


```

## Security Decisions

* PDF-only uploads
* 10 MB upload limit
* Input validation
* Safe filename handling
* Environment variable based API keys
* Restricted CORS configuration

## Sample Documents
* Invoice
* Privacy Policy
* Research Paper
* Employee Handbook
* Medical Report

## Future Improvements

* Authentication
* Voice Input
* Cloud Storage
* Rate Limiting
* Advanced Table Extraction

## Challenges Faced

* Handling OCR extraction from different PDF formats.
* Implementing document-specific retrieval in ChromaDB.
* Preventing irrelevant responses from the LLM.
* Maintaining citation accuracy for retrieved content.
* Handling multiple document uploads and indexing workflows.
* Managing frontend-backend communication and CORS configuration.

