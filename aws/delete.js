const { s3 } = require("./upload");
//deleting image
const myBucket = process.env.BUCKET_NAME;
const {
  DeleteObjectsCommand,
  S3ServiceException,
} = require("@aws-sdk/client-s3");

/**
 * Delete multiple objects from an S3 bucket.
 * @param {{ bucketName: string, keys: string[] }}
 */
module.exports.main = async ({ bucketName, keys }) => {
  const client = s3;

  try {
    const { Deleted } = await client.send(
      new DeleteObjectsCommand({
        Bucket: myBucket,
        Delete: { Objects: keys.map((key) => ({ Key: key })) },
      })
    );

    console.log(
      `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`
    );
    console.log(Deleted.map((d) => ` • ${d.Key}`).join("\n"));
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "NoSuchBucket"
    ) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}. The bucket doesn't exist.`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};
// main({ myBucket, keys });
