const { imageKitHandler } = require("../configuration/imageKit");

exports.imageKitMediaDeleteHandler = async (deletePayload) => {
  let finalDeletePayload = [];
  if (Array.isArray(deletePayload)) {
    finalDeletePayload = [...deletePayload];
  } else {
    finalDeletePayload.push(deletePayload);
  }
  try {
    const deletionPromises = finalDeletePayload.map(async (fileId) => {
      const deletionResponse = await imageKitHandler().deleteFile(fileId);
      return deletionResponse;
    });
    const deletionResults = await Promise.all(deletionPromises);
    console.log("File deleted successfully from imagekit 😉.....");
    return deletionResults;
  } catch (error) {
    console.error("Error occurred while deleting files from imagekit 🥲.....");
    return { error: error.message };
  }
};
