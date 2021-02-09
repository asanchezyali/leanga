const csv = require("csvtojson");
const MongoClient = require("mongodb").MongoClient;
const mongoQuery = require("mongo-queryfilter");

const { perimeter } = require("../helpers/perimeter");

async function connectToMongodb() {
    const uriMongodb = "mongodb+srv://admin:pwd@leangacluster.lsfpg.mongodb.net/realestate?retryWrites=true&w=majority";
    const configMongodb = { useNewUrlParser: true, useUnifiedTopology: true };
    const client = await MongoClient.connect(
        uriMongodb,
        configMongodb
    ).catch((error) => console.log(error));

    if (!client) {
        throw new Error("MongoDB is not connected ...");
    }

    return client;
}

async function saveToMongodb(data, databaseName, collectionName) {
    try {
        const client = await connectToMongodb();
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);
        response = await collection.insertMany(data);
        console.log("Number of documents inserted: " + response.insertedCount);
    } catch (error) {
        console.log(error);
    } finally {
        console.log("The operation is finished ...");
    }
}

async function saveCVSToMongodb(url) {
    const readCVSToJSON = csv({
        colParser: {
            Precio: "float",
            Habitaciones: "int",
        },
        checkType: true,
    });

    try {
        const data = await readCVSToJSON.fromFile(url);
        const databaseName = "realestate";
        const collectionName = "houses";
        await saveToMongodb(data, databaseName, collectionName);
    } catch (error) {
        console.log("Error saving in MongoDB:", error);
    } finally {
        console.log("The operation is finished ...");
    }
}

async function checkInMongodb(stringquery, databaseName, collectionName) {
    let output = null;

    try {
        const client = await connectToMongodb();
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);
        query = mongoQuery.filter(stringquery);
        output = await collection.find(query).toArray();
    } catch (error) {
        console.log(error);
    } finally {
        console.log("The operation is finished ...");
        return output;
    }
}

async function lookingHousesOnThePerimeter(center, radio) {
    const data = await checkInMongodb({}, "realestate", "houses");
    const houses_on_the_perimeter = data.filter(
        (house) => perimeter(house, center) <= radio
    );
    return houses_on_the_perimeter;
}

async function dropCollection(databaseName, collectionName) {
    const client = await connectToMongodb();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    collection.drop(function (error, delOK) {
        if (error) throw error;
        if (delOK) console.log("Collection deleted");
    });
}

module.exports = {
    connectToMongodb,
    saveToMongodb,
    saveCVSToMongodb,
    checkInMongodb,
    lookingHousesOnThePerimeter,
    dropCollection,
};

