const cloudinary = require("cloudinary").v2;

exports.cloudinaryMediaUploadHandler = async (file, folder) => {
  let uploadPayload = [];
  let response = null;
  if (Array.isArray(file)) {
    uploadPayload = [...file];
  } else {
    uploadPayload.push(file);
  }

  const uploadPayloadPromises = uploadPayload.map((file) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: folder },
        (error, result) => {
          if (error) {
            console.error(
              "Error occured while uploading file to cloudinary 🥲....."
            );
            reject(error);
          } else {
            console.log("File uploaded to cloudinary successfully 😉.....");
            resolve(result);
          }
        }
      );
      uploadStream.end(file.data);
    });
  });
  try {
    response = await Promise.all(uploadPayloadPromises);
    return response;
  } catch (error) {
    console.error(
      "Something went wrong while uploading file to cloudinary 🥲....."
    );
    return error.message;
  }
};
