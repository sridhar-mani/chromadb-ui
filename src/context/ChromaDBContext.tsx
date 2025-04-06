/*
 * This file is part of ChromaDBUI.
 *
 * ChromaDBUI is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ChromaDBUI is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ChromaDBUI.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChromaClient, GetResponse, IEmbeddingFunction } from 'chromadb';
import { DefaultEmbeddingFunction } from 'chromadb';
import type { ConnectionConfig, Collection, CreateCollectionParams, ChromaDBContextType, ChromaDBState, CollectionData, SelectedRecord } from '../types/index';
import FloatingAlert from '../components/min-components/alert';
import { ChromaService } from '../api/ChromaClient';



const ChromaDBContext = createContext<ChromaDBContextType | undefined>(undefined);

const initialState: ChromaDBState = {
  client: null,
  collections: [],
  loading: false,
  error: null,
  connected: false,
  currentConfig: null,
  embeddingFunction: undefined,
  tenantName: null,
  databaseName: null,
  collectionData: null,
  curCollectionName:'',
  records: [],
  alert: (type: "info" | "success" | "warning" | "error", message: string)=> console.log()
};
export const ChromaDBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChromaDBState>(initialState);

    const [alert, setAlert] = useState<{
      message: string;
      type: "info" | "success" | "warning" | "error";
    } | null>(null);
  
  
    const showAlert = (type: "info" | "success" | "warning" | "error", message: string) => {
      setAlert({ type, message });
      setTimeout(() => setAlert(null), 3000); 
    };
  

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const refreshCollections = useCallback(async () => {
    if (!state.client) return;

    try {
      const collections = await state.client.listCollections();
      setState(prev => ({ 
        ...prev, 
        collections, 
        error: null,
        loading: false
      }));
    } catch (err) {
      console.error('Error fetching collections:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch collections',
        loading: false
      }));
    }
  }, [state.client]);

  const connect = useCallback(async (config: ConnectionConfig) => {
    setLoading(true);
    setError(null);
    

    try {
      const newClient = new ChromaClient({
        path: config.serverUrl
      });

      const newEmbeddingFunction = new DefaultEmbeddingFunction();

      await newClient.listCollections();

      setState(prev => ({
        ...prev,
        client: newClient,
        connected: true,
        currentConfig: config,
        embeddingFunction: newEmbeddingFunction,
        error: null,
        loading: false,
        tenantName:config.tenant || null,
        databaseName:config.database || null,
        alert:showAlert
      }));

      await refreshCollections();
    } catch (err) {
      console.error('Connection error:', err);
      setState(prev => ({
        ...prev,
        client: null,
        collections: [],
        loading: false,
        error: null,
        connected: false,
        currentConfig: null,
        embeddingFunction: undefined,
        tenantName: null,
        databaseName: null,
        collectionData: null,
        curCollectionName:'',
        records: []
      }));
    }
  }, [refreshCollections]);

  const createCollection = useCallback(async (params: CreateCollectionParams) => {
    if (!state.client) throw new Error('No active connection');

    setLoading(true);
    try {
      await state.client.createCollection({
        name: params.name,
        metadata: params.metadata,
        embeddingFunction: params.embeddingFunction || state.embeddingFunction
      });
      
      await refreshCollections();
    } catch (err) {
      console.error('Error creating collection:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.client, state.embeddingFunction, refreshCollections]);


  const getRecords = useCallback(async (name: string) => {
    if (!state.client) throw new Error('No active connections');
    setLoading(true);

    try {
      const collection = await state.client.getCollection({
        name: name,
        embeddingFunction: new DefaultEmbeddingFunction()
      });

      const response = await collection.get();
      
      // Handle potential null values and ensure the correct types
      const collectionData: CollectionData = {
        ids: response.ids || [],
        embeddings: (response.embeddings || []).map(emb => Array.isArray(emb) ? emb : []),
        metadatas: (response.metadatas || []).map(meta => meta || {}),
        documents: (response.documents || []).map(doc => doc || ''),
        included: response.included || []
      };

      setState(prev => ({
        ...prev,
        curCollectionName:name,
        collectionData:collectionData
      }));
      
      return response;
    } catch (err) {
      console.error("Error getting records from collection:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.client, setLoading]);

  const deleteCollection = useCallback(async (name: string) => {
    if (!state.client) throw new Error('No active connection');

    setLoading(true);
    try {
      await state.client.deleteCollection( {name:name} );
      
      // Refresh collections after deletion
      await refreshCollections();
    } catch (err) {
      console.error('Error deleting collection:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.client, refreshCollections]);

  const disconnect = useCallback(() => {
    setState(initialState);
  }, []);

  const addToCollection = useCallback(async (collectionName:string,record:SelectedRecord)=>{
    if (!state.client) throw new Error('No active connection');
    
    setLoading(true);
    try {
      const collection = await state.client.getCollection({name:collectionName,embeddingFunction:new DefaultEmbeddingFunction()});
      return await collection.add({
        ids:record.id,
        documents:record.document,
        embeddings:record.embedding,
        metadatas:record.metadata
    
      });
    } catch (err) {
      console.error('Error deleting collection:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  },[])


  const value = {
    ...state,
    connect,
    disconnect,
    createCollection,
    deleteCollection,
    refreshCollections,
    getRecords,
    showAlert,
    addToCollection
  };


  return (
    <ChromaDBContext.Provider value={value}>
        {alert && (
        <FloatingAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {children}
    </ChromaDBContext.Provider>
  );
};

export const useChromaDB = () => {
  const context = useContext(ChromaDBContext);
  if (context === undefined) {
    throw new Error('useChromaDB must be used within a ChromaDBProvider');
  }
  return context;
};