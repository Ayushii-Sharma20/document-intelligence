
"use client";

import { useState } from "react";

export default function UploadPage() {
  const [mode, setMode] = useState("single");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const uploadDocuments = async () => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      if (mode === "single") {
        if (!file) {
          alert("Please select a PDF file");
          setLoading(false);
          return;
        }

        formData.append("file", file);

        const response = await fetch(
          "https://document-intelligence-s6en.onrender.com/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setResult(data);
      } else {
        if (!files) {
          alert("Please select PDF files");
          setLoading(false);
          return;
        }

        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }

        const response = await fetch(
          "https://document-intelligence-s6en.onrender.com/bulk-upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#2563eb,#7c3aed)",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          📄 Upload Documents
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Upload and index PDF files
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() => setMode("single")}
            style={{
              padding: "12px 25px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background:
                mode === "single"
                  ? "#2563eb"
                  : "#e5e7eb",
              color:
                mode === "single"
                  ? "white"
                  : "black",
            }}
          >
            Single Upload
          </button>

          <button
            onClick={() => setMode("bulk")}
            style={{
              padding: "12px 25px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background:
                mode === "bulk"
                  ? "#16a34a"
                  : "#e5e7eb",
              color:
                mode === "bulk"
                  ? "white"
                  : "black",
            }}
          >
            Bulk Upload
          </button>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3>Select PDF File</h3>

          <input
            type="file"
            accept=".pdf"
            multiple={mode === "bulk"}
            onChange={(e) => {
              if (mode === "single") {
                setFile(
                  e.target.files?.[0] || null
                );
              } else {
                setFiles(
                  e.target.files
                );
              }
            }}
          />

          {mode === "single" && file && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#dbeafe",
                borderRadius: "8px",
              }}
            >
              📄 {file.name}
            </div>
          )}

          {mode === "bulk" && files && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#dcfce7",
                borderRadius: "8px",
              }}
            >
              📚 {files.length} file(s)
              selected
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <button
            onClick={uploadDocuments}
            disabled={loading}
            style={{
              background:
                loading
                  ? "#94a3b8"
                  : "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 30px",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading
              ? "⏳ Uploading..."
              : "📤 Upload"}
          </button>
        </div>

        {loading && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fef3c7",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            ⏳ Uploading and indexing
            document...
          </div>
        )}

        {result && !loading && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#dcfce7",
              borderRadius: "10px",
            }}
          >
            <h3>
              ✅ Upload Successful
            </h3>

            <div
  style={{
    background: "#dcfce7",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
  }}
>
  <h3>✅ Document Uploaded Successfully</h3>

  <p>
    <strong>File:</strong>{" "}
    {result.document}
  </p>

  <p>
    <strong>Pages:</strong>{" "}
    {result.total_pages}
  </p>

  <a href="/chat">
    <button
      style={{
        marginTop: "15px",
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      💬 Chat With Document
    </button>
  </a>
</div>
          </div>
        )}
      </div>
    </div>
  );
}