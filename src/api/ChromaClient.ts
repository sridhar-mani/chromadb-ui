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


import { 
  ChromaClient as BaseChromaClient, 
  IEmbeddingFunction,
  IncludeEnum,
  QueryRecordsParams as ChromaQueryParams,
  Embeddings
} from 'chromadb';
import { DefaultEmbeddingFunction } from 'chromadb';
import type { ChromaDBConfig } from '../types';

export interface ExtendedQueryParams {
  queryTexts?: string[];
  queryEmbeddings?: number[][];
  nResults?: number;
  where?: Record<string, any>;
  whereDocument?: Record<string, any>;
  include?: Array<keyof typeof IncludeEnum>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export class ChromaService {
  private client: BaseChromaClient;
  private embeddingFunction: IEmbeddingFunction;

  constructor(config: ChromaDBConfig) {
    this.client = new BaseChromaClient({ 
      path: config.serverUrl,
      tenant: config.tenant,
      database: config.database
    });
    this.embeddingFunction = new DefaultEmbeddingFunction();
  }

  async listCollections(params?: PaginationParams): Promise<string[]> {
    try {
      return await this.client.listCollections({
        limit: params?.limit,
        offset: params?.offset
      });
    } catch (error) {
      console.error('Error listing collections:', error);
      throw error;
    }
  }

  async createCollection(name: string, metadata?: Record<string, any>) {
    try {
      return await this.client.createCollection({
        name,
        metadata,
        embeddingFunction: this.embeddingFunction
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async deleteCollection(name: string) {
    try {
      await this.client.deleteCollection({ name });
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  }

  async getCollection(name: string) {
    try {
      return await this.client.getCollection({
        name,
        embeddingFunction: this.embeddingFunction
      });
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  }

  async queryCollection(collectionName: string, params: ExtendedQueryParams) {
    try {
      const collection = await this.getCollection(collectionName);
      
      if (params.queryTexts) {
        const queryParams: ChromaQueryParams = {
          queryTexts: params.queryTexts,
          nResults: params.nResults,
          where: params.where,
          whereDocument: params.whereDocument
        };
        
        if (params.include) {
          queryParams.include = params.include.map(key => IncludeEnum[key as keyof typeof IncludeEnum]);
        }
        
        return await collection.query(queryParams);
      }
      
      if (params.queryEmbeddings) {
        // Construct params for embedding query
        const queryParams: ChromaQueryParams = {
          queryEmbeddings: params.queryEmbeddings as Embeddings,
          nResults: params.nResults,
          where: params.where,
          whereDocument: params.whereDocument
        };
        
        if (params.include) {
          // Map our string includes to IncludeEnum values
          queryParams.include = params.include.map(key => IncludeEnum[key as keyof typeof IncludeEnum]);
        }
        
        return await collection.query(queryParams);
      }
      
      throw new Error('Either queryTexts or queryEmbeddings must be provided');
    } catch (error) {
      console.error('Error querying collection:', error);
      throw error;
    }
  }

  async countCollection(collectionName: string) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.count();
    } catch (error) {
      console.error('Error counting collection:', error);
      throw error;
    }
  }

  async peekCollection(collectionName: string, limit?: number) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.peek({ limit });
    } catch (error) {
      console.error('Error peeking collection:', error);
      throw error;
    }
  }
}