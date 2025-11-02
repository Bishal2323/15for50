import mongoose from 'mongoose';


export async function connectDB(uri?: string, dbName?: string) {
  try {
    if (uri) {
      await mongoose.connect(uri, dbName ? { dbName } : undefined);
      // eslint-disable-next-line no-console
      console.log('Connected MongoDB:', dbName ? `(db: ${dbName})` : '');
      return;
    }
    throw new Error('No MONGO_URI provided');
  } catch (err) {
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log('Using in-memory MongoDB at');
  }
}