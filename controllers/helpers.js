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
export const uploadImageToAWS = async function (images, bucket, keyPrefix) {
  const REGION = "eu-north-1";
  const s3Client = new S3Client({
    region: REGION,
    credentials: fromIni(),
  });

  try {
    const uploadPromises = images.map(async (image, index) => {
      const params = {
        Bucket: bucket,
        Key: `${keyPrefix}/${index}.jpeg`,
        Body: image.data,
        ContentDisposition: "inline",
        ContentType: "image/jpeg",
      };
      await s3Client.send(new PutObjectCommand(params));

      return `https://${params.Bucket}.s3.${REGION}.amazonaws.com/${params.Key}`;
    });

    const imageURLs = await Promise.all(uploadPromises);
    console.log("All images uploaded successfully");

    // Generate the image URL based on the bucket and object key

    return imageURLs;
  } catch (err) {
    return err;
  }
};
