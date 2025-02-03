const multer = require("multer");
const multers3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const myBucket = process.env.BUCKET_NAME;
module.exports.upload = multer({
  storage: multers3({
    s3: s3,
    bucket: myBucket,
    contentType: multers3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});
module.exports.s3 = s3;
