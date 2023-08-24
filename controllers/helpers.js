import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { OAuth2Client } from "google-auth-library";

// AWS S3 configuration
const REGION = "eu-north-1";
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Create an Amazon S3 service client object with credentials configuration. Then upload file to specified bucket.
 * @param {Object} image file object
 * @param {String} bucket AWS S3 bucket
 * @param {String} key unique key for image needed for AWS upload
 * @param {Object} metadata data about the image(userID or itemID)
 * @returns {String} image URL
 * @author Cristi Sebeni
 */
export const uploadImageToAWS = async function (images, bucket, keyPrefix) {
  // If images is not an array, make it an array
  if (!Array.isArray(images)) {
    images = [images];
  }

  try {
    const uploadPromises = images.map(async (image, index) => {
      const params = {
        Bucket: bucket,
        Key: `${keyPrefix}/${index}.jpeg`,
        Body: image,
        ContentDisposition: "inline",
        ContentType: "image/jpeg",
      };

      await s3Client.send(new PutObjectCommand(params));

      // Generate the image URL based on the bucket and object key
      return `https://${params.Bucket}.s3.${REGION}.amazonaws.com/${params.Key}`;
    });

    const imageURLs = await Promise.all(uploadPromises);

    return imageURLs;
  } catch (err) {
    console.log(err);
    return err;
  }
};

/**
 * Delete all provided Objects from AWS S3 bucket. All users have separate folders with userID as folder name. All items have separate folders, with itemID as folder name, within the user's folder, which contain images.
 * @param {Array} Objects array of objects to be deleted from AWS S3 bucket
 * @param {String} bucket AWS S3 bucket
 * @returns {String} success message or error message if the deletion fails
 * @author Cristi Sebeni
 */
export const deleteImagesFromAWS = async function (Objects, bucket) {
  const input = {
    Bucket: bucket,
    Delete: { Objects },
  };

  try {
    const response = await s3Client.send(new DeleteObjectsCommand(input));

    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getConversations = async function (userID, dataBase) {
  // ----------> RETREIVE MESSAGES AND ARRANGE THEM IN CONVERSATIONS <----------
  // Query for all messages sent or received by user
  const messages = await dataBase("messages")
    .select("*")
    .where("messages.sender_id", "=", userID)
    .orWhere("messages.receiver_id", "=", userID)
    .orderBy("messages.timestamp", "asc");

  // Arrange messages in an array of conversation objects: [{interlocutorID, interlocutorName, interlocutorImg, messages: []}, last message]
  const conversations = messages.reduce((acc, message) => {
    let interlocutorID;
    let interlocutorName;

    if (message.sender_id === userID) {
      interlocutorID = message.receiver_id;
      interlocutorName = message.receiver_name;
    } else {
      interlocutorID = message.sender_id;
      interlocutorName = message.sender_name;
    }

    // Check if the interlocutor is already in the array, if so, push the message to the messages array, if not, create a new object with the interlocutor and the messages array
    const conversation = acc.find(
      (conversation) => conversation.interlocutorID === interlocutorID
    );
    if (conversation) {
      conversation.messages.push(message);
    } else {
      acc.push({ interlocutorID, interlocutorName, messages: [message] });
    }
    return acc;
  }, []);

  // select all exchange offers that have the user as sender or receiver
  const exchanges = await dataBase("item_exchange")
    .select("*")
    .where("sender_id", "=", userID)
    .orWhere("receiver_id", "=", userID);

  // add exchangeOffer object, {sender_items, receiver_items, proposer_id} to each conversation
  for (const conversation of conversations) {
    const exchangeOffer = exchanges.find(
      (exchange) =>
        exchange.sender_id === conversation.interlocutorID ||
        exchange.receiver_id === conversation.interlocutorID
    );

    if (exchangeOffer?.sender_id === userID) {
      conversation.exchangeOffer = {
        senderItems: exchangeOffer.sender_items,
        receiverItems: exchangeOffer.receiver_items,
        proposerID: exchangeOffer.proposer_id,
        status: exchangeOffer.status,
        exchangeTimestamp: exchangeOffer.exchange_timestamp,
      };
    }

    if (exchangeOffer?.receiver_id === userID) {
      conversation.exchangeOffer = {
        receiverItems: exchangeOffer.sender_items,
        senderItems: exchangeOffer.receiver_items,
        proposerID: exchangeOffer.proposer_id,
        status: exchangeOffer.status,
        exchangeTimestamp: exchangeOffer.exchange_timestamp,
      };
    }
  }

  // add interlocutorImg to each conversation object
  for (const conversation of conversations) {
    const interlocutor = await dataBase("users")
      .select("image")
      .where("userid", "=", conversation.interlocutorID);
    conversation.interlocutorImg = interlocutor[0]?.image;
  }

  // Every conversations last message is the last message in the messages array. Sort conversation array by last message timestamp
  conversations.sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    return lastMessageB.timestamp - lastMessageA.timestamp;
  });

  return conversations;
};

export const getOrders = async function (userid, dataBase) {
  // Retreive user's orders from database and create orders array which will include every order that has user involved as buyer or seller, as an object with order's details, with the item as it's property(containing item's details and image) and with the other user as it's property(containing user's details and image)
  const orders = await dataBase("orders")
    .select("*")
    .where("buyer_id", "=", userid)
    .orWhere("seller_id", "=", userid)
    .orderBy("timestamp", "desc");

  for (const order of orders) {
    // Retreive every item's details involved in the order and add it as array to the order object
    const items = await dataBase("items")
      .select("*")
      .whereIn("itemid", order.items_id);

    order.items = items;

    // Retreive item's image for every item involved in the order and add it to the item object
    for (const item of order.items) {
      const image = await dataBase("images")
        .select("url")
        .where("itemid", "=", item.itemid);

      item.image = image[0].url;
    }

    // Retreive other user's name and image
    const otherUser = await dataBase("users")
      .select("name", "image")
      .where(
        "userid",
        "=",
        order.buyer_id === userid ? order.seller_id : order.buyer_id
      );

    order.otherUser = otherUser[0];
  }

  return orders;
};

/**
 * Retreive user's details from database and create response object with user's details, conversations, favorites, unread messages, orders and pending orders numbers
 * @param {Number} userid user's id
 * @param {Object} dataBase database object
 * @returns {Object} response object with user's details, conversations, favorites, unread messages, orders and pending orders numbers
 * @author Cristi Sebeni
 **/
export const getUserFromDB = async function (userid, dataBase) {
  // Retrieve the user based on the login information
  const user = await dataBase("users").select("*").where("userid", "=", userid);

  // Retreive user's conversations
  const conversations = await getConversations(userid, dataBase);

  // check how much unread messages the user has
  const unreadMessages = conversations.reduce((acc, conversation) => {
    const unreadMessages = conversation.messages.filter(
      (message) =>
        message.receiver_id === userid &&
        message.read === false &&
        message.sender_id !== userid
    );

    return acc + unreadMessages.length;
  }, 0);

  // Retreive favorites, the result will be an array of itemid's
  const favList = await dataBase("favorites")
    .select("itemid")
    .where("userid", "=", userid);
  const favorites = favList.map((item) => item.itemid);

  const orders = await getOrders(userid, dataBase);

  const receivedPendingOrdersNr = orders.reduce(
    (acc, order) =>
      order.seller_id === userid &&
      (order.status === "Comandă plasată." ||
        order.status === "În curs de procesare.")
        ? acc + 1
        : acc,
    0
  );

  const sentPendingOrdersNr = orders.reduce(
    (acc, order) =>
      order.buyer_id === userid && order.status === "Expediată."
        ? acc + 1
        : acc,
    0
  );

  // Create response object
  const response = {
    ...user[0],
    conversations,
    favorites,
    unreadMessages,
    orders,
    sentPendingOrdersNr,
    receivedPendingOrdersNr,
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
};

export const newSession = async function (userID, dataBase) {
  // Generate sessionID
  const sessionID = `${userID}_${Math.floor(Math.random() * 1000000000)}`;

  // store sessionID in database
  const session = await dataBase("sessions")
    .insert({
      session_id: sessionID,
      user_id: userID,
    })
    .returning("*");

  return session[0];
};

/**
 * Process images with sharp library. Resize to 600x800 pixels and convert to jpeg with 80% quality.
 * @param {Array} images array of image objects: {data: imageBuffer, name: imageName}
 * @returns {Array} array of image buffers
 */
export const processImages = async function (images) {
  // If images is not an array, make it an array
  if (!Array.isArray(images)) {
    images = [images];
  }

  // Process each image in the 'images' array with sharp library
  const processedImages = [];

  for (const image of images) {
    // Resize image to 600x800 pixels
    const resizedImage = await sharp(image.data)
      .rotate()
      .resize(600, 800)
      .jpeg({ quality: 80 })
      .toBuffer();

    processedImages.push(resizedImage);
  }

  return processedImages;
};
