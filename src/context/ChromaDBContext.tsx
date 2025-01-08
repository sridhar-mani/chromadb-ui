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
import { ChromaClient, IEmbeddingFunction } from 'chromadb';
import { DefaultEmbeddingFunction } from 'chromadb';
import type { ConnectionConfig, Collection, CreateCollectionParams, ChromaDBContextType, ChromaDBState } from '../types/index';



const ChromaDBContext = createContext<ChromaDBContextType | undefined>(undefined);

const initialState: ChromaDBState = {
  client: null,
  collections: [],
  loading: false,
  error: null,
  connected: false,
  currentConfig: null,
  embeddingFunction: null
};

export const ChromaDBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChromaDBState>(initialState);

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

      const res= await newClient.listCollections();

      setState(prev => ({
        ...prev,
        client: newClient,
        connected: true,
        currentConfig: config,
        embeddingFunction: newEmbeddingFunction,
        error: null,
        loading: false
      }));

      await refreshCollections();
    } catch (err) {
      console.error('Connection error:', err);
      setState(prev => ({
        ...prev,
        client: null,
        collections: [],
        connected: false,
        currentConfig: null,
        embeddingFunction: null,
        error: 'Failed to connect to ChromaDB server',
        loading: false
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
      
      // Refresh collections after creation
      await refreshCollections();
    } catch (err) {
      console.error('Error creating collection:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.client, state.embeddingFunction, refreshCollections]);

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

  const value = {
    ...state,
    connect,
    disconnect,
    createCollection,
    deleteCollection,
    refreshCollections,
  };

  return (
    <ChromaDBContext.Provider value={value}>
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