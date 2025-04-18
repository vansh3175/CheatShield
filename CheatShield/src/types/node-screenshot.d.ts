declare module 'node-screenshot' {
  function screenshot(path: string): Promise<void>;
  export = screenshot;
} 