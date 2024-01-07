const { imageKitHandler } = require("../configuration/imageKit");

exports.imageKitMediaUploadHandler = async (file, folder) => {
  let uploadPayload = [];
  let response = null;
  if (Array.isArray(file)) {
    uploadPayload = [...file];
  } else {
    uploadPayload.push(file);
  }

  const uploadPayloadPromises = uploadPayload.map((file) => {
    return new Promise((resolve, reject) => {
      imageKitHandler().upload(
        { file: file.data, fileName: file.name, folder: folder },
        (error, result) => {
          if (error) {
            console.error(
              "Error occured while uploading file to imagekit 🥲....."
            );
            reject(error);
          } else {
            console.log("File uploaded to imagekit successfully 😉.....");
            resolve(result);
          }
        }
      );
    });
  });
  try {
    response = await Promise.all(uploadPayloadPromises);
    return response;
  } catch (error) {
    console.error(
      "Something went wrong while uploading file to imagekit 🥲....."
    );
    return error.message;
  }
};
