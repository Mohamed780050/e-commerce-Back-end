import mongoDB from "mongodb";
async function getInfo(connectionURL, DatabaseName, CollectionName) {
  let connection = await mongoDB.MongoClient.connect(connectionURL);
  let connectToDb = connection.db(DatabaseName).collection(CollectionName);
  return connectToDb;
}
export default getInfo;
