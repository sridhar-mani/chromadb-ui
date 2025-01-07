export interface ChromaDBConfig {
    serverUrl: string;
  }
  
  export interface Collection {
    name: string;
    metadata: Record<string, any>;
  }
  
  export interface Tenant {
    name: string;
    collections: Collection[];
  }
  