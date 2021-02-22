const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../uploads/images`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }

    var filename = `${Date.now()}-cbt-${file.originalname}`;
    callback(null, filename);
  },
});

const uploadFiles = multer({ storage: storage }).array("multi-files", 5);
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
//export default uploadFilesMiddleware;
