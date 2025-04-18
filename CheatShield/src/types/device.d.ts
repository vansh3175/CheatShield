declare module 'device' {
  interface DeviceInfo {
    type: string;
    model: string;
    vendor: string;
  }
  function device(userAgent: string): DeviceInfo;
  export = device;
} 