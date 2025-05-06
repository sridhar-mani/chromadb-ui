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


import React, { useState } from 'react';
import { ChromaDBProvider } from '../context/ChromaDBContext';
import { ConnectionPanel } from './ConnectionPanel';
import { CollectionsPanel } from './CollectionsPannel';
import { Rnd } from 'react-rnd';import FloatingAlert from './min-components/alert';
import RecordPanel from './RecordPanel';
 'react-rnd'

export const ChromaDBUI: React.FC = () => {

  return (
    <ChromaDBProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          backgroundColor: "#f9fafb",
          color: "black",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <aside
            style={{
              width: "20%",
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            <ConnectionPanel />
            <CollectionsPanel />
          </aside>
          <main
            style={{
              width: "80%",
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "#f9fafb",
            }}
          >
            <RecordPanel />
          </main>
        </div>
      </div>
    
    </ChromaDBProvider>
  );
};

export default ChromaDBUI;