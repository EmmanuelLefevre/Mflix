import { Db } from "mongodb";

/**
 * Function that checks if a specific collection exists in the MongoDB database.
 * @param db - Instance of the MongoDB database.
 * @param collectionName - Name of the collection to check.
 * @returns A promise that resolves to `true` if the collection exists, otherwise `false`.
 */
export async function checkCollectionExists(db: Db, collectionName: string): Promise<boolean> {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);

  return collectionNames.includes(collectionName);
}
