import mongoose from "mongoose";

const connectToDatabase = async () => {
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
