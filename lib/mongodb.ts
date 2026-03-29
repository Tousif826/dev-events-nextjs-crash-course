import mongoose, { Connection } from 'mongoose';

/**
 * MongoDB connection URI.
 *
 * This must be defined in your environment (e.g. `.env.local`) as:
 *   MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/db-name"
 */
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env.local file');
}

/**
 * Shape of the cached connection object stored on the global scope.
 *
 * - `conn` holds the active Mongoose connection once established.
 * - `promise` holds the in‑flight connection promise during the initial
 *   connection attempt so that concurrent calls reuse the same promise
 *   instead of opening multiple connections.
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

/**
 * Augment the Node.js global type with our MongoDB cache so TypeScript knows
 * this property can exist on `globalThis`.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

// Initialize the global cache if it does not exist yet.
const cached: MongooseCache = globalThis._mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalThis._mongoose) {
  globalThis._mongoose = cached;
}

/**
 * Get a cached Mongoose connection.
 *
 * This function ensures that during development (where modules can be
 * hot‑reloaded) we do not create a new database connection on every request.
 * Instead, we reuse the same connection or the same in‑flight promise.
 */
export async function connectToDatabase(): Promise<Connection> {
  // If we already have an active connection, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no existing promise, create one and store it in the cache.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  // Await the shared promise, cache the resolved connection and return it.
  cached.conn = await cached.promise;

  return cached.conn;
}
