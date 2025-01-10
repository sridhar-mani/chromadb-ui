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
      <div  style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:0,margin:0,alignItems:'center',justifyContent:'start',color:'white',fontFamily:'sans-serif'}}>
        <h1 style={{width:'100%',height:'6%', backgroundColor:'#05192D',color:'white',padding:0,textAlign:'center',margin:0,borderBottom:'1px solid white'}}>ChromaDB Explorer</h1>
        <div style={{width:'100%',height:'94%',display:'flex',margin:0,padding:0,backgroundColor:'#05192D'}}>
          <div  style={{width:'20%',height:'100%',display:'flex',padding:0,margin:0,flexDirection:'column',borderRight:'1px solid white',justifyContent:'space-evenly',alignItems:'center'}}>
            <ConnectionPanel />
            <CollectionsPanel />
          </div>
          <div style={{width:'80%',padding:10,margin:0,height:'100%',overflow:'scroll',display:'flex',justifyContent:'center',alignItems:'flex-start'}}>
            <RecordPanel></RecordPanel>
          </div>
        </div>
      </div>
    
    </ChromaDBProvider>
  );
};

export default ChromaDBUI;