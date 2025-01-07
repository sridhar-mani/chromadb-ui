// src/components/ChromaDBUI.tsx
import React, { useState, useEffect } from 'react';
import {ChromaClient} from 'chromadb'

interface ChromaDBConfig {
  serverUrl: string;
  tenant?: string;
  database?: string;
}

export const ChromaDBUI: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:6789');
//   const [client, setClient] = useState(() => new ChromaClient({ serverUrl }));
const client = new ChromaClient({path:'http://localhost:6789'})
  const [collections, setCollections] = useState<any[]>([]);
  const [tenant, setTenant] = useState('default_tenant');
  const [database, setDatabase] = useState('default_database');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<any>(false);

  const checkConnection = async () => {
    setError(null);
    setLoading(true);
    try {
        const connected = await client.listCollections();
        console.log(connected)
    //   const connected = await client.checkConnection();
      setIsConnected(connected);
      if (!connected) {
        setError('Cannot connect to ChromaDB server');
      }
    } catch (err) {
      setError('Failed to connect to ChromaDB server');
      setIsConnected(false);
    }
    setLoading(false);
  };

  const handleServerChange = (e: React.FormEvent) => {
    e.preventDefault();
    setClient(new ChromaClient({ serverUrl }));
    checkConnection();
  };

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      client.setTenantAndDatabase(tenant, database);
      const collectionsData = await client.getCollections();
      setCollections(collectionsData);
    } catch (error) {
      console.error('Failed to load collections:', error);
      setError('Failed to load collections');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        ChromaDB Collections Explorer
      </div>

      {/* Server Configuration */}
      <form 
        onSubmit={handleServerChange}
        style={{
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Server URL:
            </label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                width: '300px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Connect
          </button>
        </div>
      </form>

      {error && (
        <div style={{ padding: '1rem', color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {isConnected && (
        <>
          {/* Tenant and Database Selection */}
          <form 
            onSubmit={(e) => { e.preventDefault(); loadCollections(); }}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Tenant:
                </label>
                <input
                  type="text"
                  value={tenant}
                  onChange={(e) => setTenant(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    width: '200px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Database:
                </label>
                <input
                  type="text"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    width: '200px'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Load Collections
              </button>
            </div>
          </form>

          {/* Collections Display */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem'
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                    {collection.name}
                  </div>
                  <pre style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {JSON.stringify(collection.metadata, null, 2)}
                  </pre>
                </div>
              ))}
              {collections.length === 0 && !loading && (
                <div style={{ color: '#6b7280' }}>
                  No collections found in this tenant/database combination.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};