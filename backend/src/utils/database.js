import mongo from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const mongoClient = mongo.MongoClient;

const mongoUrl = process.env.MONGO_URL;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(mongoUrl)
    .then((client) => {
      console.log("Connected to MongoDB");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log("Error while connecting to Mongo: ", err);
    });
};

export const getDB = () => {
  if (!_db) {
    throw new Error("Mongo not connected");
  }
  return _db;
};

export default mongoConnect;

// export default getDB;
