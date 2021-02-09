const bodyParser = require("body-parser");
const express = require("express");
let formidable = require("express-formidable");

const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");

const expressJSDocSwagger = require("express-jsdoc-swagger");
let path = require("path");

const {
    saveCVSToMongodb,
    checkInMongodb,
    lookingHousesOnThePerimeter,
    dropCollection,
} = require("./database/mongodb");

const { options } = require("./config/swagger");
const { avarage } = require("./helpers/avarage");

const app = express();
expressJSDocSwagger(app)(options);
const PORT = 3000;

app.use(
    formidable({
        encoding: "utf-8",
        uploadDir: path.join(__dirname, "uploads"),
        multiples: true,
        keepExtensions: true,
    })
);

/**
 * A file csv
 * @typedef {object} File
 * @property {string} file - File CSV - binary
 */

/**
 * POST /uploadcsv
 * @summary Upload a csv file
 * @tags Houses
 * @param {File} request.body.required - File info - multipart/form-data
 * @return {object} 200 - File saved
 * @return {object} 400 - Bad request response
 */
app.post("/uploadcsv", async function (req, res) {
    let success = false;
    try {
        const filePath = req.files.file.path;
        await saveCVSToMongodb(filePath);
        fs.unlinkSync(filePath);
        success = true;
    } catch (error) {
        console.log(error);
    } finally {
        res.send({ success });
    }
});

/**
 * GET /checkhouses
 * @summary Check houses by price and number of rooms
 * @tags Houses
 * @param {string} Precio.query - price of houses
 * @param {string} Habitaciones.query - number of rooms in houses.
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get("/checkhouses/", async (req, res) => {
    let success = false;
    let data = null;
    try {
        data = await checkInMongodb(req.query, "realestate", "houses");
        success = true;
    } catch (error) {
        console.log(error);
    } finally {
        res.send({ success, data });
    }
});


/**
 * GET /avaragepricepersquaremeter
 * @summary Calculate the average price in a certain perimeter
 * @tags Houses
 * @param {number} Latitud.query - Latitude of the center of the perimeter
 * @param {number} Longitud.query - Longitude of the center of the perimeter
 * @param {number} Distancia.query - Radio of the perimeter
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get("/avaragepricepersquaremeter/", async (req, res) => {
    let success = false;
    let avarage_price_by_square_meter = 0;
    try {
        const center = {
            Latitud: parseInt(req.query.Latitud),
            Longitud: parseInt(req.query.Longitud),
        };
        const radio = parseInt(req.query.Distancia);
        const data = await lookingHousesOnThePerimeter(center, radio);
        avarage_price_by_square_meter = avarage(data);
        success = true;
    } catch (error) {
        console.log(error);
    } finally {
        res.send({ success, avarage_price_by_square_meter });
    }
});

/**
 * GET /report
 * @summary Create a report in a csv file with a filters using query parameters
 * @tags Houses
 * @param {number} Latitud.query
 * @param {number} Longitud.query
 * @param {number} ID.query
 * @param {string} Titulo.query
 * @param {string} Anunciante.query
 * @param {string} Descripcion.query
 * @param {boolean} Reformado.query
 * @param {number} Telefonos.query
 * @param {string} Tipo.query
 * @param {number} Precio.query
 * @param {string} Direccion.query
 * @param {string} Provincia.query
 * @param {string} Ciudad.query
 * @param {string} Habitaciones.query
 * @param {string} Baños.query
 * @param {string} Parking.query
 * @param {string} Amueblado.query
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get("/report/", async (req, res) => {
    try {
        const data = await checkInMongodb(req.query, "realestate", "houses");
        const csv = new ObjectsToCsv(data);
        console.log(csv);
        await csv.toDisk("./data/report.csv");

        res.setHeader("Content-Type", "report/csv");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="' + "download-" + Date.now() + '.csv"'
        );
        success = true;
    } catch (error) {
        console.error(error);
    } finally {
        res.sendFile(__dirname + "/data/report.csv");
    }
});

/**
 * GET /resetdb
 * @summary Clean the database
 * @tags Reset to database
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get("/resetdb/", async (req, res) => {
    let success = false;
    try {
        await dropCollection("realestate", "houses");
        success = true;
    } catch (error) {
        console.log(error);
    } finally {
        res.send({ success });
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.listen(process.env.PORT, () => console.log(`App listening at http:/localhost:${PORT}`));
