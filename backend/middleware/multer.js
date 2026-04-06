const multer = require('multer');

const storage = multer.diskStorage({}); // Memory ya disk storage
const upload = multer({ storage });

module.exports = upload;