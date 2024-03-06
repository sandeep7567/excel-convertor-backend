import fs from "fs";
import { MongoClient } from "mongodb";
import excelToJson from "convert-excel-to-json";
import connectDB from "../db/index.js";
import xlsxtojson from "xlsx-to-json";
import xlstojson from "xls-to-json";
import { Artist } from "../models/artist.model.js";

const exceluploader = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;

    const excel2json = req.file.originalname.endsWith('xlsx') ? xlsxtojson : xlstojson;

    const artistArray = await new Promise((resolve, reject) => {
      excel2json({
        input: file.path,
        output: "output/" + Date.now() + ".json",
        lowerCaseHeaders: true
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const artist = await Artist.insertMany(artistArray);

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });

    res.json({
      msg: "File Uploaded",
      file: req.file?.filename,
      artist,
    });

  } catch (err) {
    console.log("Error uploading file:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// async function importExcelData2MongoDB(filePath) {
//   try {
//     console.log({ filePath });

//     const filePathAddress = "./public/temp/" + filePath.filename;

//     const excelData = excelToJson({
//       sourceFile: filePathAddress,
//       sheets: [
//         {
//           name: filePath.filename.split(".")[0],
//           header: {
//             rows: 1,
//           },
//           columnToKey: {
//             A: "speciality",
//             B: "about",
//             C: "name",
//             D: "email",
//           },
//         },
//       ],
//     });

//     console.log({ excelData });

//     const sheetName = filePath.filename.split(".")[0];

//     if (!excelData[sheetName] || excelData[sheetName].length === 0) {
//       throw new Error(`No data found in the '${sheetName}' sheet.`);
//     }

//     const client = await MongoClient.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");

//     const db = client.db("exceltojson");
//     const collection = db.collection("artists");

//     const result = await collection.insertMany(excelData[sheetName]);
//     console.log("Number of documents inserted:", result.insertedCount);

//     client.close();
//     fs.unlinkSync(filePath.path);
//   } catch (err) {
//     console.log("Error importing data to MongoDB:", err);
//     throw err;
//   }
// }


export { exceluploader };