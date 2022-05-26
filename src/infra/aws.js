const AWS = require("aws-sdk");
const fs = require("fs");
require('dotenv').config()

const uploadAWS = (filename) => {

  AWS.config.update({
    accessKeyId: process.env.AWS_KEY_NEW_UPDATE,
    secretAccessKey: process.env.AWS_SECRET_KEY_NEW_UPDATE,
  
    region: "sa-east-1",
  });

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const fileContent = fs.readFileSync(`./videos/${filename}`);
  
  const params = {
    Bucket: "videos-cameras-recorder",
    Key: `${filename}`,
    Body: fileContent,
    ContentType: "video/mp4"
  };  
  s3.uploadPartCopy
  
  return s3.upload(params).promise();
  
}
module.exports = { uploadAWS }