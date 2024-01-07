const ImageKit = require("imagekit");

exports.imageKitHandler = () => {
  const imageKitInstance = new ImageKit({
    publicKey: process.env.PUBLIC_KEY_IMAGEKIT,
    privateKey: process.env.PRIVATE_KEY_IMAGEKIT,
    urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT,
  });
  return imageKitInstance;
};
