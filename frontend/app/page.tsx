"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [documents, setDocuments] =
    useState<string[]>([]);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/documents"
    )
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
      })
      .catch((err) =>
        console.log(err)
      );
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #2563eb, #7c3aed)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "60px",
          borderRadius: "25px",
          width: "900px",
          textAlign: "center",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          📄 Document Intelligence
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "40px",
          }}
        >
          Upload, Analyze and Search PDFs
        </p>

        <a href="/upload">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "16px 30px",
              borderRadius: "12px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📤 Upload Documents
          </button>
        </a>

        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <h3>📑 OCR</h3>
            <p>Extract text from PDFs</p>
          </div>

         
        </div>

        <div
          style={{
            marginTop: "50px",
            textAlign: "left",
          }}
        >
          <h2>
            📚 Recent Documents
          </h2>

          {documents.length === 0 ? (
            <p>
              No documents uploaded yet
            </p>
          ) : (
            documents
              .slice(-5)
              .reverse()
              .map((doc) => (
                <div
                  key={doc}
                  style={{
                    padding: "12px",
                    marginTop: "10px",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "10px",
                    background:
                      "#f8fafc",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.location.href =
                      `/chat?document=${encodeURIComponent(
                        doc
                      )}`;
                  }}
                >
                  📄 {doc}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}