
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

import React, { useState, useEffect } from 'react';
import { useChromaDB } from '../context/ChromaDBContext';
import type { Collection } from '../types/index';

export const CollectionsPanel: React.FC = () => {
  const { 
    client,
    collections, 
    loading,
    connected,
    embeddingFunction,
    createCollection, 
    deleteCollection,
    refreshCollections 
  } = useChromaDB();

  console.log(collections)
  
  const [newCollectionName, setNewCollectionName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initial load and refresh of collections
  useEffect(() => {
    if (connected && client) {
      refreshCollections();
    }
  }, [connected, client, refreshCollections]);

  // Periodic refresh
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

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      setError(null);
      await createCollection({
        name: newCollectionName.trim(),
        embeddingFunction: embeddingFunction || undefined
      });
      setNewCollectionName('');
      // Immediately refresh collections after creation
      await refreshCollections();
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(`Failed to create collection "${newCollectionName}": ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteCollection = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete collection "${name}"?`)) {
      return;
    }

    try {
      setError(null);
      await deleteCollection(name);
      // Immediately refresh collections after deletion
      await refreshCollections();
    } catch (err) {
      console.error('Error deleting collection:', err);
      setError(`Failed to delete collection "${name}": ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (!connected || !client) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        Connect to ChromaDB server to manage collections
      </div>
    );
  }

  return (
    <div className="mt-8 right-block">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Collections</h2>

      {/* Create Collection Form */}
      <form onSubmit={handleCreateCollection} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              New Collection Name:
            </label>
            <div className='flex w-full gap-2'>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter collection name"
              disabled={loading}
            />
                   <button
            type="submit"
            disabled={loading || !newCollectionName.trim()}
            className="px-4 text-white bg-green-500  rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors " 
          >
            {loading ? 'Creating...' : 'Create Collection'}
          </button>
          </div>
          </div>
   
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Collections List */}
      <div className="space-y-4 ">
      {collections && collections.length > 0 ? (
          collections.map((collectionName) => (
            <div 
              key={`collection-${collectionName}`}
              className="p-4 bg-white border border-gray-200 rounded-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{collectionName}</h3>
              </div>
              <button
                onClick={() => handleDeleteCollection(collectionName)}
                disabled={loading}
                className="ml-4 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            {loading ? 'Loading collections...' : 'No collections found'}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg">
          Loading...
        </div>
      )}
    </div>
  );
};