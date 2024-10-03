import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const connectToDatabase = async () => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const uri = process.env.URI || "";
    await mongoose.connect(uri, {
      dbName: "rexteria",
    });
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB:", error);
  }
};

export default connectToDatabase;
