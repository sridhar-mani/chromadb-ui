import React from 'react';
import { ChromaDBProvider } from "../context/ChromaDBContext";
import { ConnectionPanel } from "./ConnectionPanel";
import { CollectionsPanel } from "./CollectionsPannel";
import { RecordPanel } from "./RecordPanel";

export const ChromaDBUI: React.FC = () => {
  return (
    <ChromaDBProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          backgroundColor: "#f9fafb",
          color: "black",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <aside
            style={{
              width: "20%",
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            <ConnectionPanel />
            <CollectionsPanel />
          </aside>
          <main
            style={{
              width: "80%",
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "#f9fafb",
            }}
          >
            <RecordPanel />
          </main>
        </div>
      </div>
    </ChromaDBProvider>
  );
};

export default ChromaDBUI;
