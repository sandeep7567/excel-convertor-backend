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

    const requiredKeys = ["name", "email", "about", "speciality"];

    // validArray --> a array of objects with key are ["name", "email", "about", "speciality"];
    const validArray = artistArray.map((obj) => {
      return requiredKeys.every(key => obj.hasOwnProperty(key)) && obj;
    });

    const isValidData = validArray.every(key => key ? true : false);

    if (!isValidData) {
      return res.status(400).json({
        msg: "Select correct format file",
      });
    };

    console.log(validArray);

    await Artist.deleteMany({});

    const artist = await Artist.insertMany(validArray.map((artist) => ({
      email: artist.email,
      name: artist.name,
      about: artist.about,
      speciality: artist.speciality,
    })));

    // const bulkOperations = validArray.map((artist) => ({
    //   updateOne: {
    //     filter: { email: artist.email },
    //     update: { $set: artist },
    //     upsert: true
    //   }
    // }));

    // const artist = await Artist.bulkWrite(bulkOperations);

    // // Delete documents from the database that are not in the uploaded file
    const emailsInFile = validArray.map(artist => artist.email);

    const deleteQuery = {
      $or: [
        { email: { $nin: emailsInFile } }, // Email not in the file
        { email: { $exists: false } }, // Email is undefined
        { email: "" } // Email is an empty string
      ]
    };
    
    await Artist.deleteMany(deleteQuery);

    // const artist = await Artist.insertMany(validArray);

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });

    res.json({
      message: "File Uploaded",
      success: true,
      file: req.file?.filename,
      artist,
    });

  } catch (err) {
    console.log("Error uploading file:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const getAllExcelJSONData = async (req, res) => {

  const artist = await Artist.aggregate([{ $match: {} }]);

  res.status(200).json({
    message: "Data send success",
    success: true,
    artist,
  })
};

const getExcelJSONDataById = async (req, res) => {

  const { id } = req.params;

  if (!id) {
    throw new Error("param id not found!")
  };

  const artistById = await Artist.findOne({ _id: id }).exec();

  res.status(200).json({
    message: "Data send success",
    success: true,
    artistById,
  })
};

const updatArtistById = async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  if (!id) {
    throw new Error("param id not found!")
  };

  const data = await Artist.findById(id);

  await Artist.findByIdAndUpdate(id, { name: formData?.name || data?.name, email: formData?.email || data?.email, about: formData?.about || data?.about, speciality: formData?.speciality || data?.speciality }, { new: true })

  res.status(200).json({
    message: "Data updated success",
    success: true,
  })
}

export { exceluploader, getAllExcelJSONData, getExcelJSONDataById, updatArtistById };