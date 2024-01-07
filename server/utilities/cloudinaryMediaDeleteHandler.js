const cloudinary = require("cloudinary").v2;

exports.cloudinaryMediaDeleteHandler = async (deletePayload) => {
  let finalDeletePayload = [];
  if (Array.isArray(deletePayload)) {
    finalDeletePayload = [...deletePayload];
  } else {
    finalDeletePayload.push(deletePayload);
  }

  const deletePayloadPromises = finalDeletePayload.map((publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
          console.error(
            "Error occurred while deleting files from cloudinary 🥲....."
          );
        } else {
          if (result.result === "ok") {
            resolve(`File with public ID ${publicId} deleted successfully.`);
          } else {
            reject(`Failed to delete file with public ID ${publicId}.`);
          }
        }
      });
    });
  });

  try {
    const response = await Promise.all(deletePayloadPromises);
    console.log("File deleted successfully from cloudinary 😉.....");
    res.status(200).send({
      success: true,
      message: "File deleted successfully from cloudinary 😉.....",
      data: response,
    });
  } catch (error) {
    console.error(
      "Error occurred while deleting files from cloudinary 🥲....."
    );
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting files from cloudinary 🥲.....",
      error: err,
    });
  }
};
