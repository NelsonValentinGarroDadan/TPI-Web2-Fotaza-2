const multer = require('multer');
  const cloudinary = require('../config/cloudinary');
  const AppError = require('../errors/appError');

  const uploadHandler = (folder, { maxSizeMB = 5, formats = ['jpg', 'jpeg', 'png', 'webp'] } = {}) => {
      const upload = multer({
          storage: multer.memoryStorage(),
          limits: { fileSize: maxSizeMB * 1024 * 1024 },
          fileFilter: (req, file, cb) => {
              const ext = file.mimetype.split('/')[1];
              if (!formats.includes(ext)) {
                  return cb(new AppError(400, `Formato no permitido. Usá: ${formats.join(', ')}`));
              }
              cb(null, true);
          },
      });

      return (fieldName) => [
          // 1. parsea multipart y deja el archivo en req.file.buffer
          (req, res, next) => {
              upload.single(fieldName)(req, res, (err) => {
                  if (err instanceof multer.MulterError) {
                      return next(new AppError(400, `Error subiendo imagen: ${err.message}`));
                  }
                  if (err) return next(err);
                  next();
              });
          },
          // 2. sube a Cloudinary y deja la URL en req.file.path
          async (req, res, next) => {
              if (!req.file) return next();
              try {
                  const result = await new Promise((resolve, reject) => {
                      const stream = cloudinary.uploader.upload_stream(
                          { folder: `fotaza/${folder}` },
                          (err, result) => (err ? reject(err) : resolve(result))
                      );
                      stream.end(req.file.buffer);
                  });
                  req.file.path = result.secure_url;
                  req.file.filename = result.public_id;
                  next();
              } catch (err) {
                  next(new AppError(500, 'Error subiendo a Cloudinary'));
              }
          },
      ];
  };

  module.exports = uploadHandler;