import React, { useState } from "react";
import { RecordsProps, SelectedRecord } from "../types";
import { useChromaDB } from "../context/ChromaDBContext";


export const Records: React.FC<RecordsProps> = ({ data }) => {
  const {   addToCollection,curCollectionName } = useChromaDB(); 
  const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // States for the add form fields:
  const [newId, setNewId] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [newMetadata, setNewMetadata] = useState("");
  const [newEmbedding, setNewEmbedding] = useState("");

  const handleAddRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Convert embedding string into an array of numbers
      const embeddingArray = newEmbedding.split(",").map((s) => Number(s.trim()));
      // Parse metadata JSON
      const metadataObj = JSON.parse(newMetadata);
      // Call the API using your provided format
      const response = await addToCollection(curCollectionName,{
        id: newId,
        embedding: embeddingArray,
        metadata: metadataObj,
        document: newDocument,
      });
      console.log("Record added:", response);
      // Reset the form fields and close the form
      setNewId("");
      setNewDocument("");
      setNewMetadata("");
      setNewEmbedding("");
      setShowAddForm(false);
      // Optionally, you might refresh the records here
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Error adding record. Please ensure your inputs are correct.");
    }
  };

  if (!data) {
    return (
      <div style={{ textAlign: "center", color: "black" }}>
        No collection data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {data.ids.map((id, index) => (
          <div
            key={id}
            onClick={() =>
              setSelectedRecord({
                id,
                document: data.documents[index],
                metadata: data.metadatas[index],
                embedding: data.embeddings?.[index],
              })
            }
            style={{
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "12px",
              width: "200px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              color: "black",
              transition: "transform 0.1s ease",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1rem" }}>ID</div>
            <div
              style={{
                fontSize: "0.875rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {id}
            </div>
            <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "#111" }}>
              {data.documents[index]?.slice(0, 40)}...
            </div>
          </div>
        ))}
      </div>

      {/* Modal for record details and add form */}
      {selectedRecord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80%",
              overflowY: "auto",
              color: "black",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
                Record Details
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "black",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <strong>ID:</strong> {selectedRecord.id}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Document:</strong>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  marginTop: "4px",
                  background: "#f3f4f6",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {selectedRecord.document}
              </div>
            </div>
            {selectedRecord.metadata && (
              <div style={{ marginBottom: "12px" }}>
                <strong>Metadata:</strong>
                <pre
                  style={{
                    background: "#f3f4f6",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginTop: "4px",
                  }}
                >
                  {JSON.stringify(selectedRecord.metadata, null, 2)}
                </pre>
              </div>
            )}
            {selectedRecord.embedding && (
              <div style={{ marginBottom: "12px" }}>
                <strong>Embedding:</strong> [
                {selectedRecord.embedding.slice(0, 5).join(", ")}
                {selectedRecord.embedding.length > 5 ? ", ..." : ""}
                ]
              </div>
            )}

            {/* Add Record Section */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  background: "#05192D",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                {showAddForm ? "Cancel" : "Add New Record"}
              </button>

              {showAddForm && (
                <form
                  onSubmit={handleAddRecord}
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Record ID"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                    }}
                    required
                  />
                  <textarea
                    placeholder="Document"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                      resize: "vertical",
                    }}
                    required
                  />
                  <textarea
                    placeholder='Metadata (JSON format), e.g.: {"key": "value"}'
                    value={newMetadata}
                    onChange={(e) => setNewMetadata(e.target.value)}
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                      resize: "vertical",
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Embedding (comma separated numbers)"
                    value={newEmbedding}
                    onChange={(e) => setNewEmbedding(e.target.value)}
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                    }}
                    required
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#05192D",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    Add Record
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
