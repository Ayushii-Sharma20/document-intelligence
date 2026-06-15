"use client";

import { useState } from "react";

export default function BulkUploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async () => {
    if (!files) return;

    setLoading(true);

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch(
        "https://document-intelligence-s6en.onrender.com/bulk-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          width: "800px",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "#ea580c",
            marginBottom: "20px",
          }}
        >
          📚 Bulk Upload Documents
        </h1>

        <input
          type="file"
          multiple
          onChange={(e) =>
            setFiles(e.target.files)
          }
        />

        <br />
        <br />

        <button
          onClick={uploadFiles}
          disabled={loading}
          style={{
            background: "#ea580c",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Uploading..."
            : "Upload Files"}
        </button>

        {result && (
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h2>Results</h2>

            {result.map(
              (
                item: any,
                index: number
              ) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                >
                  <p>
                    <strong>File:</strong>{" "}
                    {item.file}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {item.status}
                  </p>

                  {item.error && (
                    <p>
                      <strong>Error:</strong>{" "}
                      {item.error}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}