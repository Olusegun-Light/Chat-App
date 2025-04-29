const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const handleUpload = async (file) => {
//   const res = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });
//   return res;
// };

// module.exports.uploadController = async (req, res) => {
//   try {
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//     const cldRes = await handleUpload(dataURI);
//     res.json(cldRes);
//   } catch (error) {
//     console.log(error);
//     res.send({ message: error.message });
//   }
// };

const handleUpload = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports.uploadController = async (req, res) => {
  try {
    const cldRes = await handleUpload(req.file.buffer, req.file.mimetype);
    res.json(cldRes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};