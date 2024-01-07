exports.errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message,
    error: error.name,
    stack: error.stack,
  });
};
