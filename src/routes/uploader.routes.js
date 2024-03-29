import { Router } from "express";
import {
  exceluploader,
  getAllExcelJSONData,
  getExcelJSONDataById,
  updatArtistById
  // logoutUser,
  // registerUser, 
  // refreshAccessToken,  
  // getCurrentUser, 
  // updateUserAvatar, 
  // updateUserCoverImage, 
  // getUserChannelProfile, 
  // getWatchHistory, 
  // updateAccountDetails
} from "../controllers/uploader.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     registerUser
//     )

router.route("/upload-file").post(upload.single("uploadfile"), exceluploader);
router.route("/data").get(getAllExcelJSONData)
router.route("/get-all-excel-data").get(getAllExcelJSONData)
router.route("/:id").get(getExcelJSONDataById).patch(updatArtistById).patch(updatArtistById);

// router.route("/data").get(getAllExcelJSONData);

//secured routes
// router.route("/logout").post(verifyJWT,  logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJWT, changeCurrentPassword)
// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)

// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)

export default router
