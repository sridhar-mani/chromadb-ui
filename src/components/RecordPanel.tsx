import React from 'react';
import { useChromaDB } from '../context/ChromaDBContext';
import { Records } from './Records';

const RecordPanel: React.FC = () => {
  const { collectionData } = useChromaDB();

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        padding: '16px',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '16px',
        }}
      >
        Chroma Records
      </h2>

      <Records data={collectionData} />
    </div>
  );
};

export  {RecordPanel};
