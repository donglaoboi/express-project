function errorHandle(err, req, res, next) {
  let error = { ...err };
  error.message = err.message || "wrong something";
  error.status = err.status || 500;
  return res.status(error.status).json({
    isSuccess: false,
    errorCode: error.message,
  });
}

module.exports = errorHandle;
