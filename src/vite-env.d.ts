/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_SERVER_API_KEY: string;
  }
  
  interface ImportMeta {
    env: ImportMetaEnv;
  }
  