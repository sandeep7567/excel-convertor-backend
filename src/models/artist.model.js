import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    speciality: {
      type: String,
    },
    about: {
      type: String,
    },
    name: {
      type: String,
      // required: true,
    },
    // artist_img: {
    //   type: String,
    // },
    email: {
      type: String,
      // unique: true,
    },
  },
  { timestamps: true }
);

export const Artist = mongoose.model("Artist", ArtistSchema)