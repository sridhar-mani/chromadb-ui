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


import React from 'react';
import { ChromaDBProvider } from '../context/ChromaDBContext';
import { ConnectionPanel } from './ConnectionPanel';
import { CollectionsPanel } from './CollectionsPannel';
import { Rnd } from 'react-rnd'; 'react-rnd'

export const ChromaDBUI: React.FC = () => {
  return (
    <ChromaDBProvider>
      
      <div className="p-6 max-w-screen mx-auto max-h-screen bg-white rounded-lg shadow wrapper">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">ChromaDB Explorer</h1>
        <ConnectionPanel />
        <CollectionsPanel />
      </div>
    </ChromaDBProvider>
  );
};

export default ChromaDBUI;