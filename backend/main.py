import os
from pathlib import Path

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Body
from fastapi.staticfiles import StaticFiles
from typing import List

from parser import process_pdf
from vector_store import search_document
from classifier import model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://document-intelligence-bay.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/images",
    StaticFiles(directory="page_images"),
    name="images"
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/")
def home():
    return {
        "message": "running"
    }


@app.get("/documents")
def get_documents():

    documents = []

    if not os.path.exists("uploads"):
        return []

    for filename in os.listdir("uploads"):

        if filename.endswith(".pdf"):
            documents.append(filename)

    return documents


@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:

        return {
            "error":
            "File exceeds 10MB limit"
        }

    await file.seek(0)

    safe_filename = Path(
        file.filename
    ).name

    extension = os.path.splitext(
        safe_filename
    )[1].lower()

    if extension != ".pdf":

        return {
            "error":
            "Only PDF files allowed"
        }

    try:

        result = process_pdf(file)

        return result

    except Exception as e:

        return {
            "error": str(e)
        }


@app.post("/bulk-upload")
async def bulk_upload(
    files: List[UploadFile] = File(...)
):

    results = []

    for file in files:

        try:

            content = await file.read()

            if len(content) > MAX_FILE_SIZE:

                results.append({
                    "file": file.filename,
                    "status": "failed",
                    "error":
                    "File exceeds 10MB limit"
                })

                continue

            await file.seek(0)

            safe_filename = Path(
                file.filename
            ).name

            extension = os.path.splitext(
                safe_filename
            )[1].lower()

            if extension != ".pdf":

                results.append({
                    "file": file.filename,
                    "status": "failed",
                    "error":
                    "Only PDF files allowed"
                })

                continue

            results.append({
                "file": file.filename,
                "status": [
                    "Parsing"
                ]
            })

            process_pdf(file)

            results[-1]["status"].append(
                "Classifying"
            )

            results[-1]["status"].append(
                "Indexed"
            )

        except Exception as e:

            results.append({
                "file": file.filename,
                "status": "failed",
                "error": str(e)
            })

    return results
@app.post("/ask")
def ask_question(
    data: dict = Body(...)
):

    question = data.get(
        "question",
        ""
    )

    if not question.strip():

        return {
            "error":
            "Question cannot be empty"
        }

    document_name = data.get(
        "document"
    )

    if not document_name:

        return {
            "error":
            "Please select a document"
        }

    print(
        "Searching document:",
        document_name
    )

    results = search_document(
        question,
        document_name
    )

    if not results["documents"]:

        return {
            "question":
            question,
            "answer":
            "No relevant information found.",
            "citations": []
        }

    chunks = results["documents"]

    if len(chunks) == 0:

        return {
            "question":
            question,
            "answer":
            "No relevant information found.",
            "citations": []
        }

    metadata = results["metadata"]

    context = "\n\n".join(
        chunks
    )

    prompt = f"""
Answer the question using ONLY the context below.

If the answer is not present,
say: No relevant information found.

Context:
{context}

Question:
{question}
"""

    try:

        response = model.generate_content(
            prompt
        )

        answer = response.text

    except Exception:

        answer = (
            "Relevant document content:\n\n"
            + "\n\n".join(
                chunks[:2]
            )
        )

    citations = []

    for item in metadata:

        citations.append({
            "document":
            item["document"],

            "page":
            item["page"],

            "image":
            item["image"]
        })

    return {
        "question":
        question,

        "answer":
        answer,

        "citations":
        citations
    }