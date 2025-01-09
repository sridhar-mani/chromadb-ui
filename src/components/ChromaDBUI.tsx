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
      <div className="p-0  bg-white rounded-lg shadow wrapper" style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'start'}}>
        <h1 className="text-2xl text-center font-bold mb-6 text-gray-900" style={{width:'100%', backgroundColor:'#05192D',color:'white',padding:3,textAlign:'center'}}>ChromaDB Explorer</h1>
        <div className='flex' style={{width:'100%'}}>
        <div className='flex' style={{width:'15%',height:'100%',display:'flex',flexDirection:'column'}}>
        <ConnectionPanel />
        <CollectionsPanel />
        </div>
        <div style={{width:'85%'}}>
          fkldjhf
        </div>
        </div>
      </div>
    </ChromaDBProvider>
  );
};

export default ChromaDBUI;