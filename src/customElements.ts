import  ReactDOM  from 'react-dom/client';
import React from "react";
import {ChromaDBUI} from "./components/ChromaDBUI";

class ChromaDBUIElement extends HTMLElement{
    private root: ReactDOM.Root | null = null;


    connectedCallback() {
        const config = JSON.parse(this.getAttribute('config') || '{}');
        this.root = ReactDOM.createRoot(this);
        this.root.render(React.createElement(ChromaDBUI, { config }));
      }

      disconnectedCallback(){
        if(this.root){
            this.root.unmount()
        }
      }

      static get observedAttributes(){
        return ['config']
      }

      attributeChangedCallback(name:string,oldValue:string,newValue:string){
        if(name==='config' && oldValue!== newValue && this.root){
            const config = JSON.parse(newValue || "{}")
            this.root.render(React.createElement(ChromaDBUI,{config}));
        }
      }
}

customElements.define('chromadb-ui',ChromaDBUIElement)