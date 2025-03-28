import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

class MongoDBSingleton {
  private static client: MongoClient | null = null;
  private static db: Db | null = null;

  public static async getDb(): Promise<Db> {
    try {
      if (!MongoDBSingleton.client) {
        MongoDBSingleton.client = new MongoClient(uri, options);

        await MongoDBSingleton.client.connect();
      }

      if (!MongoDBSingleton.db) {
        MongoDBSingleton.db = MongoDBSingleton.client.db('sample_mflix');

        try {
          await MongoDBSingleton.db.command({ ping: 1 });
        }
        catch (error) {
          throw new Error('Failed to connect to the database: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      }

      return MongoDBSingleton.db;
    }
    catch (error: any) {
      throw new Error('MongoDB connection error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  public static async closeConnection(): Promise<void> {
    try {
      if (MongoDBSingleton.client) {
        await MongoDBSingleton.client.close();
        MongoDBSingleton.client = null;
        MongoDBSingleton.db = null;
      }
    }
    catch (error: any) {
      throw new Error('Failed to close MongoDB connection: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}

export default MongoDBSingleton;
