import ReactDOM from 'react-dom/client';
import React from 'react';
import { ChromaDBUI } from './components/ChromaDBUI';

class ChromaDBUIElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;

  connectedCallback() {
    this.root = ReactDOM.createRoot(this);
    this.root.render(React.createElement(ChromaDBUI));
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

customElements.define('chromadb-ui', ChromaDBUIElement);