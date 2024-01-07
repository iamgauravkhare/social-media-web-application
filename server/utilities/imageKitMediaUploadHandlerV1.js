const fs = require("fs").promises;
const { imageKitHandler } = require("../configuration/imageKit");

let tempData = [];

const unlinkPromises = tempData.map(async (file) => {
  await fs.unlink(file.tempFilePath);
});

const deleteTempData = async () => {
  try {
    await Promise.all(unlinkPromises);
    console.log("Temporary data deleted successfully 😉.....");
  } catch (error) {
    console.log("Error occured while deleting temporary data 🥲.....");
    console.error(error);
  }
};

exports.imageKitMediaUploadHandler = async (file, folder) => {
  let uploadPayload = [];
  let updatedData = {};
  let response = null;
  if (Array.isArray(file)) {
    const filePromises = file.map(async (file) => {
      const data = await fs.readFile(file.tempFilePath);
      updatedData = { ...file, data: data };
      return updatedData;
    });
    try {
      uploadPayload = await Promise.all(filePromises);
      console.log("Upload payload is created 😉.....");
    } catch (error) {
      console.error(error);
      console.log("Error occured while creating upload payload 🥲.....");
    }
  } else {
    const data = await fs.readFile(file.tempFilePath);
    updatedData = { ...file, data: data };
    uploadPayload.push(updatedData);
  }

  tempData = [...uploadPayload];

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
    deleteTempData();
    return response;
  } catch (error) {
    console.error(
      "Something went wrong while uploading file to imagekit 🥲....."
    );
    return error.message;
  }
};
