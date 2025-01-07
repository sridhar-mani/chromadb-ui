
export class ChromaClient {
    private baseUrl: string;
    private tenant: string;
    private database: string;
  
    constructor(config: { 
      serverUrl: string;
      tenant?: string;
      database?: string;
    }) {
      this.baseUrl = config.serverUrl.replace(/\/$/, '');
      this.tenant = config.tenant || 'default_tenant';
      this.database = config.database || 'default_database';
    }
  
    async checkConnection(): Promise<boolean> {
      try {
        // First try the heartbeat endpoint
        const response = await fetch(`${this.baseUrl}/api/v1/heartbeat`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          return true;
        }
  
        // If heartbeat fails, try root endpoint
        const rootResponse = await fetch(this.baseUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        return rootResponse.ok;
      } catch (error) {
        console.error('Server connection failed:', error);
        console.log('Attempted connection to:', this.baseUrl);
        return false;
      }
    }
  
    async getCollections(): Promise<any[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/v1/collections`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Chroma-Tenant': this.tenant,
            'X-Chroma-Database': this.database
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
      }
    }
  
    setTenantAndDatabase(tenant: string, database: string) {
      this.tenant = tenant;
      this.database = database;
    }
  }