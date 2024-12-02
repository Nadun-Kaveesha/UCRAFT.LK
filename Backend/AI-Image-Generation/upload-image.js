import AWS from "aws-sdk";
import fs from "fs";
import getSecrets from "./awsSecrets.js";

// Get the AWS secrets from the Secrets Manager
const secrets = await getSecrets("ucraft-secrets");
const accessKeyId = secrets.AWS_ACCESS_KEY;
const secretAccessKey = secrets.AWS_SECRET_ACCESS_KEY;
const region = secrets.AWS_REGION;
const bucketName = secrets.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
});


async function uploadImageToS3(filePath, uniqueIdentifier) {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    ACL: "public-read",
    Bucket: bucketName,
    Key: uniqueIdentifier,
    Body: fileContent,
    ContentType: "image/png", // Adjust as needed
  };
  try {
    await s3.upload(params).promise();
    console.log(
      `Image uploaded to S3 at: https://${bucketName}.s3.amazonaws.com/${uniqueIdentifier}`
    );
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
  const s3Link = `https://${bucketName}.s3.us-east-1.amazonaws.com/${uniqueIdentifier}`;
  return s3Link;
}

export default uploadImageToS3;
