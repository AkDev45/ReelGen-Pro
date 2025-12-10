// Reference to vite/client removed as the type definition was not found
// /// <reference types="vite/client" />

// Augment NodeJS.ProcessEnv to include API_KEY. 
// We rely on the existing global definition of process (e.g. from @types/node) 
// to avoid "Cannot redeclare block-scoped variable" errors.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
}
