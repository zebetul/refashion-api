import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";

const uploadImageToAWS = async (image, bucket, key) => {
  // Create an Amazon S3 service client object with credentials configuration
  // for now, are set to the default configuration file on local machine
  // on deploy set configuration to env variables
  const REGION = "eu-north-1";
  const s3Client = new S3Client({
    region: REGION,
    credentials: fromIni(),
  });

  const params = {
    Bucket: bucket,
    Key: key, // itemID_imageName
    Body: image.data,
    ContentDisposition: "inline",
    ContentType: "image/jpeg",
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

const handleNewItem = async function (req, res, dataBase) {
  const { title, brand, category, size, price, description, userid } = req.body;
  const { image } = req.files;

  // Insert new item into items table in the database
  const item = {
    userid,
    title,
    price,
    description,
    brand,
    category,
    size,
  };
  const newItem = await dataBase("items").insert(item).returning("*");

  // Create unique imageKey = 'userid-itemid-imageName'
  const imageKey = `${userid}-${newItem[0].itemid}-${image.name}`;

  // Upload image to AWS S3 rfsimages bucket and get the URL
  const imageURL = await uploadImageToAWS(image, "rfsimages", imageKey);

  // Insert image URL into images table
  const newImage = {
    itemid: newItem[0].itemid,
    url: imageURL,
  };
  const response = await dataBase("images").insert(newImage);

  res.json(newItem);
};
export default handleNewItem;
