
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
  const { connect, disconnect, loading, error, connected, currentConfig,alert } = useChromaDB();
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

        if(config.database==="") config.database='default_database'
        if(config.tenant==="") config.tenant='default_tenant'
        await connect(config);

      }
    } catch (err) {
      alert('error','please fill all the details')
      console.error('Connection error:', err);
    }
  };

  const handleChange = (key: keyof ChromaDBConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
    style={{
      height: '35%',
      backgroundColor: 'white',
      borderRadius: '4px',
      padding:5,
      WebkitBorderRadius:25,
      width:'90%'
    }}
  >
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '95%',
        gap: '10px',
        color:'black',
        width:'95%',
      }}
      onSubmit={handleSubmit}
    >
      <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Connection Settings</h2>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{display:'flex',alignItems:'center'}}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem',width:'40%' }}>
            Server URL:
          </label>
          <input
            type="text"
            style={{
              width: '60%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
            value={config.serverUrl}
            onChange={(e) => handleChange('serverUrl', e.target.value)}
          />
        </div>
        <div style={{display:'flex',alignItems:'center'}}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem',width:'40%' }}>
            Tenant:
          </label>
          <input
            type="text"
            style={{
              width: '60%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
            value={config.tenant}
            onChange={(e) => handleChange('tenant', e.target.value)}
          />
        </div>
        <div style={{display:'flex',alignItems:'center'}}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem',width:'40%' }}>
            Database:
          </label>
          <input
            type="text"
            style={{
              width: '60%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
            value={config.database}
            onChange={(e) => handleChange('database', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          padding: '8px',
          backgroundColor: '#05192D',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width:'70%',
          alignSelf:'center'
        }}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </form>
  </div>
  );
};