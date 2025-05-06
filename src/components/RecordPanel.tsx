import React from 'react';
import { useChromaDB } from '../context/ChromaDBContext';

const RecordPanel = () => {
  const { collectionData } = useChromaDB();

  if (!collectionData) {
    return (
      <div style={{ 
        width: '100%',
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <p style={{ color: '#6b7280' }}>No collection data available</p>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '95%',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      overflowY:'hidden',
    }}>
      <div style={{ 
        width:'95%',
        padding: '5px 10px',
        borderBottom: '1px solid #e5e7eb',
      display:'flex'
        ,justifyContent:'space-between'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827'
        }}>Collection Records</h2>
        <button style={{ padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          
          }}>+ Add Record</button>
      </div>

      <div style={{ padding: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {collectionData.ids.map((id, index) => (
            <div key={id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>ID: {id}</span>
              </div>
              
              {collectionData.documents[index] && (
                <div style={{ fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '500' }}>Document: </span>
                  <span style={{ color: '#4b5563' }}>
                    {collectionData.documents[index]}
                  </span>
                </div>
              )}
              
              {collectionData.metadatas[index] && (
                <div style={{ fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '500' }}>Metadata: </span>
                  <pre style={{ 
                    color: '#4b5563',
                    margin: 0,
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {JSON.stringify(collectionData.metadatas[index], null, 2)}
                  </pre>
                </div>
              )}

              {collectionData.embeddings && collectionData.embeddings[index] && (
                <div style={{ fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '500' }}>Embedding: </span>
                  <span style={{ color: '#4b5563' }}>
                    [{collectionData.embeddings[index].slice(0, 3).join(', ')}
                    {collectionData.embeddings[index].length > 3 ? '...' : ''}]
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordPanel;