import type { ChromaClient, GetResponse, IEmbeddingFunction } from 'chromadb';

export interface ChromaDBConfig {
  serverUrl: string;
  tenant?: string;
  database?: string;
}

export interface ConnectionConfig extends ChromaDBConfig {
}

export interface Collection {
  name: string;
  metadata?: Record<string, any>;
}

export interface CollectionData {
  ids: string[];
  embeddings: number[][];
  metadatas: Record<string, any>[];
  documents: string[];
  data?: any;
  included?: string[];

}

export interface CreateCollectionParams {
  name: string;
  metadata?: Record<string, any>;
  embeddingFunction?: IEmbeddingFunction;
}

export interface RecordsProps {
  data: {
    ids: string[];
    documents: string[];
    metadatas: Record<string, any>[];
    embeddings?: number[][];
  } | null;
}

export interface  SelectedRecord {
  id: string;
  document: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface GetCollectionParams {
  name: string;
  embeddingFunction?: IEmbeddingFunction;
}

export interface QueryParams {
  queryTexts?: string[];
  queryEmbeddings?: number[][];
  nResults?: number;
  where?: Record<string, any>;
  whereDocument?: Record<string, any>;
  include?: string[];
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface RecordType{
  embeddings : number[];
  metadata:object
}


export interface ChromaDBState {
  client: ChromaClient | null;
  collections: string[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  curCollectionName:string ;
  currentConfig: ConnectionConfig | null;
  embeddingFunction: IEmbeddingFunction | undefined;
  tenantName: string | null;
  databaseName: string | null;
  collectionData: CollectionData | null;
  records: RecordType[]|null;
  alert : (type: "info" | "success" | "warning" | "error", message: string)=>void
}

export interface ChromaDBContextType extends ChromaDBState {
  connect: (config: ConnectionConfig) => Promise<void>;
  disconnect: () => void;
  createCollection: (params: CreateCollectionParams) => Promise<void>;
  deleteCollection: (name: string) => Promise<void>;
  refreshCollections: () => Promise<void>;
  getRecords: (name:string)=> Promise<GetResponse | undefined>;
  addToCollection:(collectionName:string,record:SelectedRecord)=>Promise<void>;
}

export interface ExtendedQueryParams {
  queryTexts?: string[];
  queryEmbeddings?: number[][];
  nResults?: number;
  where?: Record<string, any>;
  whereDocument?: Record<string, any>;
  include?: any;
}
