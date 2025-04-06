import React, { useState } from 'react';
import { useChromaDB } from '../context/ChromaDBContext';
import { SelectedRecord } from '../types';
import { Plus } from 'lucide-react';

const RecordPanel: React.FC = () => {
  const { collectionData } = useChromaDB();
  const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);
  const [addModal,setAddModal]  = useState(false);

  if (!collectionData) {
    return (
      <div
        style={{
          width: '100%',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#f3f4f6',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'black' }}>No collection data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '16px',
        }}
      >
        Chroma Records
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width:'30%'
        }} onClick={()=>setAddModal(!addModal)} >
          <Plus size={16} />
          Add
        </button>
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {collectionData.ids.map((id, index) => (
          <div
            key={id}
            onClick={() =>
              setSelectedRecord({
                id,
                document: collectionData.documents[index],
                metadata: collectionData.metadatas[index],
                embedding: collectionData.embeddings?.[index],
              })
            }
            style={{
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px',
              width: '200px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              color: 'black',
              transition: 'transform 0.1s ease',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>ID</div>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'black',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {id}
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '8px', color: '#111' }}>
              {collectionData.documents[index]?.slice(0, 40)}...
            </div>
          </div>
        ))}
      </div>
      {addModal &&
          <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
               <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80%',
              overflowY: 'auto',
              color: 'black',
            }}
          >
          </div>
        </div>
      }

      {/* Modal */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80%',
              overflowY: 'auto',
              color: 'black',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Record Details
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'black',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>ID:</strong> {selectedRecord.id}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Document:</strong>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  marginTop: '4px',
                  background: '#f3f4f6',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                {selectedRecord.document}
              </div>
            </div>
            {selectedRecord.metadata && (
              <div style={{ marginBottom: '12px' }}>
                <strong>Metadata:</strong>
                <pre
                  style={{
                    background: '#f3f4f6',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '4px',
                  }}
                >
                  {JSON.stringify(selectedRecord.metadata, null, 2)}
                </pre>
              </div>
            )}
            {selectedRecord.embedding && (
              <div style={{ marginBottom: '12px' }}>
                <strong>Embedding:</strong> [
                {selectedRecord.embedding.slice(0, 5).join(', ')}
                {selectedRecord.embedding.length > 5 ? ', ...' : ''}
                ]
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { RecordPanel };
