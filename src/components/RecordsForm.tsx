import React, { useState } from 'react';
import { useChromaDB } from '../context/ChromaDBContext';

function RecordsForm({ modalOpen }) {

    const [record,setRecord] = useState({
        doc_id:"",
        doc_content:"",
        metadata:{}
    })
    const {addRecord} = useChromaDB();

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setRecord({
            ...record,
            [name]:value
        })
    }

  return (
    <div style={styles.overlay}>
    <div style={styles.modal}>
      <h2 style={styles.header}>Add Records</h2>
      <div style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Document ID:</label>
          <input
            name="doc_id"
            value={record.doc_id}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Content:</label>
          <textarea
            name="doc_content"
            value={record.doc_content}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Metadata:</label>
          <input
            name="metadata"
            value={record.metadata}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={() => addRecord(record)} style={styles.submitButton}>
            Add Record
          </button>
          <button onClick={modalOpen} style={styles.closeButton}>Close</button>
        </div>
      </div>
    </div>
  </div>
  );
}

const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '350px',
      maxWidth: '100%',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      fontSize: '22px',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '15px',
      color: '#333',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '15px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      width: '30%',
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
      width: '65%',
      outline: 'none',
      transition: 'border 0.3s ease',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s ease',
    },
    closeButton: {
      backgroundColor: '#ff5c5c',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s ease',
    },
  };
export default RecordsForm;
