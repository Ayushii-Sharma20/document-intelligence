"use client";
export const dynamic = "force-dynamic";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

function ChatContent() {
  const searchParams = useSearchParams();

  const documentFromUrl =
    searchParams.get("document");

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
  useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [documents, setDocuments] =
    useState<string[]>([]);

  const [selectedDocument,
    setSelectedDocument] =
    useState("");

  useEffect(() => {

    fetch(
      "https://document-intelligence-s6en.onrender.com/documents"
    )
      .then((res) => res.json())
      .then((data) => {

        setDocuments(data);

        if (documentFromUrl) {

          setSelectedDocument(
            documentFromUrl
          );

        } else if (
          data.length === 1
        ) {

          setSelectedDocument(
            data[0]
          );

        }
      })
      .catch((err) => {
        console.log(err);
      });

  }, [documentFromUrl]);

  const askQuestion = async () => {

    if (!question) return;

    setLoading(true);

    try {

      const res = await fetch(
        "https://document-intelligence-s6en.onrender.com/ask",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            question,
            document:
              selectedDocument,
          }),
        }
      );

      const data =
        await res.json();

      setMessages((prev) => [
  ...prev,
  {
    question,
    answer: data.answer,
    citations: data.citations,
  },
]);

setQuestion("");

    } catch (error) {

      console.error(error);

    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "#2563eb",
            marginBottom: "25px",
          }}
        >
          💬 Chat With Documents
        </h1>

        {selectedDocument && (
          <div
            style={{
              background:
                "#dbeafe",
              padding: "14px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
              color:
                "#1e40af",
              fontWeight:
                "bold",
            }}
          >
            📄 Active Document:
            {" "}
            {selectedDocument}
          </div>
        )}

        {documents.length > 1 &&
          !documentFromUrl && (
            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <label>
                <strong>
                  Select Document
                </strong>
              </label>

              <br />
              <br />

              <select
                value={
                  selectedDocument
                }
                onChange={(e) =>
                  setSelectedDocument(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #ccc",
                }}
              >
                <option value="">
                  Choose Document
                </option>

                {documents.map(
                  (doc) => (
                    <option
                      key={doc}
                      value={doc}
                    >
                      {doc}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

        <input
          type="text"
          placeholder="Ask a question about your document..."
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius:
              "10px",
            border:
              "1px solid #ccc",
            marginBottom:
              "15px",
          }}
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          style={{
            background:
              "#16a34a",
            color: "white",
            border: "none",
            padding:
              "12px 25px",
            borderRadius:
              "10px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "⏳ Thinking..."
            : "Ask"}
        </button>

       {messages.length === 0 && (
  <div
    style={{
      marginTop: "30px",
      textAlign: "center",
      color: "#666",
      padding: "40px",
      background: "#f8fafc",
      borderRadius: "12px",
    }}
  >
    💡 Ask a question about the selected document.
  </div>
)}

{messages.map(
  (message, messageIndex) => (
    <div
      key={messageIndex}
      style={{
        marginTop: "30px",
      }}
    >
      <h3>Question</h3>

      <div
        style={{
          background: "#eef2ff",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        {message.question}
      </div>

      <h3
        style={{
          marginTop: "20px",
        }}
      >
        Answer
      </h3>

      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          lineHeight: "1.8",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.answer}
      </div>

      <h3
        style={{
          marginTop: "20px",
        }}
      >
        Citations
      </h3>

      {message.citations?.map(
        (
          citation: any,
          index: number
        ) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "10px",
            }}
          >
            <p>
              <b>Document:</b>{" "}
              {citation.document}
            </p>

            <p>
              <b>Page:</b>{" "}
              {citation.page}
            </p>

            <a
              href={`https://document-intelligence-s6en.onrender.com/images/${citation.image
                .split("\\")
                .pop()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`https://document-intelligence-s6en.onrender.com/images/${citation.image
                  .split("\\")
                  .pop()}`}
                alt="Citation"
                width="300"
                style={{
                  marginTop: "10px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              />
            </a>
          </div>
        )
      )}
    </div>
  )
)}

      </div>
    </div>
  );
}
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}