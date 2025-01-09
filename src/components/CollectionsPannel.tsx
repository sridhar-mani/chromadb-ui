import React, { useState, useEffect, FormEvent } from 'react';
import { useChromaDB } from '../context/ChromaDBContext';
import { Plus, Trash2, Database, Loader } from 'lucide-react';
import type { Collection } from '../types';

export const CollectionsPanel: React.FC = () => {
  const { 
    client,
    collections, 
    loading,
    connected,
    embeddingFunction,
    createCollection, 
    deleteCollection,
    refreshCollections,
    getRecords
  } = useChromaDB();
  
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && client) {
      refreshCollections();
    }
  }, [connected, client, refreshCollections]);


  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => {
      refreshCollections().catch(err => {
        console.error('Error refreshing collections:', err);
        setError('Failed to refresh collections');
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [connected, refreshCollections]);

  const handleCreateCollection = async (e: string) => {
    
    if (!newCollectionName.trim()) return;

    try {
      setError(null);
      await createCollection({
        name: newCollectionName.trim(),
        embeddingFunction: embeddingFunction || undefined
      });
      setNewCollectionName('');
      await refreshCollections();
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(`Failed to create collection "${newCollectionName}": ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteCollection = async (name: string): Promise<void> => {
    if (!window.confirm(`Are you sure you want to delete collection "${name}"?`)) {
      return;
    }

    try {
      setError(null);
      await deleteCollection(name);
      await refreshCollections();
    } catch (err) {
      console.error('Error deleting collection:', err);
      setError(`Failed to delete collection "${name}": ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleGetRecords = async (name: string): Promise<void> => {
    try {
      const res = await getRecords(name);
      console.log(res);
    } catch (err) {
      console.error('Error getting records:', err);
      setError(`Failed to get records from "${name}": ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{
      height: '55%',
      backgroundColor: 'white',
      borderRadius: '4px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      WebkitBorderRadius:25,
      width:'93%'
    }}>
      <h2 style={{margin: '0 0 0px 0', fontSize: '1.1rem'}}>Collections</h2>
  
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '15px'
      }}>
        <input style={{
          flex: 1,
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }} value={newCollectionName} onChange={(e)=>setNewCollectionName(e.target.value)} placeholder="New collection name" />
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }} onClick={()=>handleCreateCollection(newCollectionName)} >
          <Plus size={16} />
          Add
        </button>
      </div>
  
     {connected? <div style={{flex: 1, overflow: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse',color:'black'}}>
          <thead style={{position: 'sticky', top: 0, backgroundColor: 'white'}}>
            <tr>
              <th style={{textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee'}}>Name</th>
              <th style={{textAlign: 'right', padding: '8px', borderBottom: '2px solid #eee'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections?.map(name => (
              <tr key={name}>
                <td style={{padding: '8px', borderBottom: '1px solid #eee'}}>{name}</td>
                <td style={{textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee'}}>
                  <button style={{
                    marginRight: '8px',
                    border: 'none',
                    background: 'none',
                    color: '#007bff',
                    cursor: 'pointer'
                  }} onClick={()=>handleGetRecords(name)} >View</button>
                  <button style={{
                    border: 'none',
                    background: 'none',
                    color: '#dc3545',
                    cursor: 'pointer'
                  }} onClick={()=>handleDeleteCollection(name)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>:<h3 style={{color:'red'}}>Not connected to any collection</h3>}
    </div>
  );


};

export default CollectionsPanel;