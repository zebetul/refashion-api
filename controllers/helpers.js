import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { OAuth2Client } from "google-auth-library";

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

export const getUserFromDB = async function (userid, dataBase) {
  // Retrieve the user based on the login information
  const user = await dataBase("users").select("*").where("userid", "=", userid);

  const messagesSent = await dataBase("messages")
    .select("*")
    .where("sender_id", "=", userid);

  const messagesReceived = await dataBase("messages")
    .select("*")
    .where("receiver_id", "=", userid);

  // query for favorites, the result will be an array of itemid's

  const favList = await dataBase("favorites")
    .select("itemid")
    .where("userid", "=", userid);

  const favorites = favList.map((item) => item.itemid);

  const response = {
    ...user[0],
    messagesSent: messagesSent,
    messagesReceived: messagesReceived,
    favorites,
  };

  return response;
};

export const validateGoogleToken = async function (token) {
  const client = new OAuth2Client(
    "717500630558-qqnuejf6pvdiiuo9kv0vsk65icurdjjh.apps.googleusercontent.com"
  );
  const secret = "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";

  const ticket = await client.verifyIdToken({
    idToken: token,
    // Specify the CLIENT_ID of the Refashion client that accesses the backend
    audience:
      "717500630558-qqnuejf6pvdiiuo9kv0vsk65icurdjjh.apps.googleusercontent.com",
  });

  return ticket.getPayload();
  // const userid = payload.sub;
};
