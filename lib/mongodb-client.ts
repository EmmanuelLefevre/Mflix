import { MongoClient } from "mongodb";
import clientPromise from "./mongodb";

export async function getMongoClient(): Promise<MongoClient> {
  try {
    const client = await clientPromise;
    return client;
  }
  catch (error: any) {
    throw new Error(`Failed to connect to the database: ${error.message}`);
  }
}
