"use server";

import MongoDBSingleton from "@/lib/mongodb";

export async function testDatabaseConnection() {
  let isConnected = false;
  try {
    const mongoDb = await MongoDBSingleton.getDbInstance();

    await mongoDb.command({ ping: 1 });

    return !isConnected;
  }
  catch (e) {
    console.error(e);
    return isConnected;
  }
}
