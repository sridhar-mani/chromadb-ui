# ChromaDB UI

A React UI library for ChromaDB that provides a complete interface for managing ChromaDB collections, including connection management, collection operations, and data visualization.

## Features

- Connection management with ChromaDB server
- Collection creation and deletion
- Collection listing and management
- Support for custom embedding functions
- Built with Tailwind CSS for modern, responsive design
- TypeScript support
- Zero-config setup with default embedding function

## Installation

```bash
npm install chromadb-ui
# or
yarn add chromadb-ui
```

## Requirements

### 1. Required Peer Dependencies

The following packages are required as peer dependencies:

```bash
npm install chromadb @xenova/transformers chromadb-default-embed
```

### 2. Tailwind CSS Configuration

This library uses Tailwind CSS utility classes. Your project must have Tailwind CSS installed and configured:

1. Install Tailwind in your project if you haven't already:
```bash
npm install -D tailwindcss
npx tailwindcss init
```

2. Configure your tailwind.config.js to include the chromadb-ui components:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/chromadb-ui/**/*.{js,jsx,ts,tsx}" // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. Import Tailwind CSS in your main CSS file:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Usage

### Basic Usage

```tsx
import { ChromaDBUI } from 'chromadb-ui';

function App() {
  return (
    <div>
      <ChromaDBUI />
    </div>
  );
}
```

### With Custom Configuration

```tsx
import { ChromaDBUI } from 'chromadb-ui';

function App() {
  return (
    <div>
      <ChromaDBUI
        defaultConfig={{
          serverUrl: 'http://localhost:8000',
          tenant: 'default_tenant',
          database: 'default_database'
        }}
      />
    </div>
  );
}
```

### Individual Components Usage

You can also use individual components from the library:

```tsx
import { 
  ChromaDBProvider, 
  ConnectionPanel, 
  CollectionsPanel 
} from 'chromadb-ui';

function App() {
  return (
    <ChromaDBProvider>
      <div className="p-6">
        <ConnectionPanel />
        <CollectionsPanel />
      </div>
    </ChromaDBProvider>
  );
}
```

## API Reference

### ChromaDBUI Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| defaultConfig | ChromaDBConfig | Initial configuration for ChromaDB connection | undefined |

### ChromaDBConfig Interface

```typescript
interface ChromaDBConfig {
  serverUrl: string;
  tenant?: string;
  database?: string;
}
```

### ChromaDBProvider Context

The ChromaDBProvider context provides the following values:

```typescript
interface ChromaDBContextType {
  client: ChromaClient | null;
  collections: string[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  currentConfig: ConnectionConfig | null;
  embeddingFunction: any;
  connect: (config: ConnectionConfig) => Promise<void>;
  disconnect: () => void;
  createCollection: (params: CreateCollectionParams) => Promise<void>;
  deleteCollection: (name: string) => Promise<void>;
  refreshCollections: () => Promise<void>;
}
```

## Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/chromadb-ui.git
cd chromadb-ui
```

2. Install dependencies
```bash
npm install
```

3. Build
```bash
npm run build
```

### Local Testing

To test the library locally:

1. Link the package:
```bash
npm link
```

2. In your test project:
```bash
npm link chromadb-ui
```

3. Make changes to the library
4. Rebuild the library:
```bash
npm run build
```

Changes will be reflected in your test project automatically.

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Ensure ChromaDB server is running and accessible
   - Check the server URL in your configuration
   - Verify network connectivity
   - Also ensure to set cors for the url of chromadb
   - If you still get issues then use this command (**chroma run test.yaml**) after copying content below:


########################
# HTTP server settings #
########################
open_telemetry:
  service_name: "chroma"
  endpoint: "http://otel-collector:4317"
port: 6789
listen_address: "0.0.0.0"
max_payload_size_bytes: 41943040
cors_allow_origins:
  - "http://localhost:5173"  # Or any other domain you need


####################
# General settings #
####################
persist_path: "./chroma"
allow_reset: false # defaults to false
sqlitedb:
  hash_type: "md5" # or "sha256"
  migration_mode: "apply" # or "validate"
sysdb:
  sqlite:
    log_topic_namespace: "default"
    log_tenant: "default"

2. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check if the content array in tailwind.config.js includes the chromadb-ui path

3. **Build Issues**
   - Ensure all peer dependencies are installed
   - Check TypeScript version compatibility

## License

GNU GENERAL PUBLIC LICENSE

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Support

For support, please:
1. Check the [GitHub Issues](https://github.com/sridhar-mani/chromadb-ui/issues)
2. Create a new issue if your problem hasn't been addressed

## Future Development

- Add support for custom embedding functions
- Add collection querying interface
- Add data visualization components
- Add batch operations support
- Add more configuration options