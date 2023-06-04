import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";

/**
 * Create an Amazon S3 service client object with credentials configuration. Then upload file to specified bucket. For now, the configuration is set to the default configuration file on local machine. On deploy set configuration to environmental variables.
 * @param {Object} image file object
 * @param {String} bucket AWS S3 bucket
 * @param {String} key unique key for image needed for AWS upload
 * @param {Object} metadata data about the image(userID or itemID)
 * @returns {String} image URL
 * @author Cristi Sebeni
 */
export const uploadImageToAWS = async function (image, bucket, key, metadata) {
  const REGION = "eu-north-1";
  const s3Client = new S3Client({
    region: REGION,
    credentials: fromIni(),
  });

  const params = {
    Bucket: bucket,
    Key: key,
    Body: image.data,
    ContentDisposition: "inline",
    ContentType: "image/jpeg",
    Metadata: metadata,
  };

  try {
    const response = await s3Client.send(new PutObjectCommand(params));

    // Generate the image URL based on the bucket and object key
    const imageURL = `https://${params.Bucket}.s3.${REGION}.amazonaws.com/${params.Key}`;

    return imageURL;
  } catch (err) {
    return err;
  }
};
