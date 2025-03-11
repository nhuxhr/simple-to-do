import { ConsolaInstance } from 'consola';

declare global {
  interface Console extends console, ConsolaInstance {}
}
