import os
from dotenv import load_dotenv
import google.generativeai as genai
import chromadb

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

client = chromadb.PersistentClient(path="db")

collection = client.get_or_create_collection(
    name="documents"
)


def get_embedding(text):

    response = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text
    )

    return response["embedding"]


def store_document(doc_name, pages):

    ids = []
    documents = []
    embeddings = []
    metadatas = []

    chunk_size = 500

    for page_data in pages:

        page_num = page_data["page"]
        text = page_data["text"]
        image = page_data["image"]

        if not text:
            continue

        for i in range(0, len(text), chunk_size):

            chunk = text[i:i + chunk_size]

            ids.append(
                f"{doc_name}_{page_num}_{i}"
            )

            documents.append(chunk)

            embeddings.append(
                get_embedding(chunk)
            )

            metadatas.append({
                "document": doc_name,
                "page": page_num,
                "image": image
            })

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )

def search_document(
    query,
    document_name=None
):

    query_embedding = get_embedding(
        query
    )

    if document_name:

        results = collection.query(
            query_embeddings=[
                query_embedding
            ],
            n_results=3,
            where={
                "document":
                document_name
            }
        )

    else:

     results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=3
    )

    return {
        "documents":
        results["documents"][0],

        "metadata":
        results["metadatas"][0]
    }