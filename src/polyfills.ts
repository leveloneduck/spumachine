/* Global polyfills for browser to satisfy some Node-oriented libs (Umi/Solana)
   Keep minimal, avoid heavy shims. */
import { Buffer } from 'buffer';

// Map global -> globalThis for libraries expecting Node's global
if (!(globalThis as any).global) {
  (globalThis as any).global = globalThis;
}

// Provide Buffer
if (!(globalThis as any).Buffer) {
  (globalThis as any).Buffer = Buffer;
}

// Provide a very small process.env shim if needed by libs
if (!(globalThis as any).process) {
  (globalThis as any).process = { env: {} } as any;
}
