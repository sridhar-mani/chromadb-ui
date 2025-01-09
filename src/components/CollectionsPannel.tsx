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

  const handleCreateCollection = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  if (!connected || !client) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Database className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Connection</h3>
          <p className="mt-1 text-sm text-gray-500">Connect to ChromaDB server to manage collections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">Collections</h2>
              <p className="mt-2 text-sm text-gray-700">
                Manage your ChromaDB collections
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateCollection} className="mt-4">
            <div className="flex gap-x-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter collection name"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !newCollectionName.trim()}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-2">Create</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Collection Name
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {collections.length > 0 ? (
                        collections.map((name) => (
                          <tr key={name}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {name}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleGetRecords(name)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View Records
                              </button>
                              <button
                                onClick={() => handleDeleteCollection(name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4 inline-block" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center py-4 text-sm text-gray-500">
                            {loading ? 'Loading collections...' : 'No collections found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default CollectionsPanel;