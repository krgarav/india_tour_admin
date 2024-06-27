/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_ADDRESS: string;
    // Add other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
