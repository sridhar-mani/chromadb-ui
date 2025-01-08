
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
import type { ChromaDBConfig } from '../types';

export const ConnectionPanel: React.FC = () => {
  const { connect, disconnect, loading, error, connected, currentConfig } = useChromaDB();
  const [config, setConfig] = useState<ChromaDBConfig>({
    serverUrl: 'http://localhost:6789',
    tenant: '',
    database: ''
  });


  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (connected) {
        disconnect();
      } else {
        await connect(config);

      }
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  return (
    <div className="mb-8 left-block">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Connection Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Server URL:
          </label>
          <input
            type="text"
            value={config.serverUrl}
            onChange={(e) => setConfig(prev => ({ ...prev, serverUrl: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="http://localhost:6789"
            disabled={connected || loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Tenant (Optional):
          </label>
          <input
            type="text"
            value={config.tenant}
            onChange={(e) => setConfig(prev => ({ ...prev, tenant: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter tenant name"
            disabled={connected || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Database (Optional):
          </label>
          <input
            type="text"
            value={config.database}
            onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter database name"
            disabled={connected || loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!connected && !config.serverUrl)}
          className={`w-full px-4 py-2 text-white rounded-md disabled:opacity-90 disabled:cursor-not-allowed transition-colors ${
            connected 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading 
            ? 'Processing...' 
            : connected 
              ? 'Disconnect' 
              : 'Connect'
          }
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {connected && !error && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          Connected to ChromaDB server {config.serverUrl}
          {config.tenant && ` (Tenant: ${config.tenant})`}
          {config.database && ` (Database: ${config.database})`}
        </div>
      )}
    </div>
  );
};