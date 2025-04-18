declare module 'geoip-lite' {
  interface GeoIP {
    range: [number, number];
    country: string;
    region: string;
    city: string;
    ll: [number, number];
    metro: number;
    area: number;
  }

  function lookup(ip: string): GeoIP | null;
  export default { lookup };
} 