module.exports = (api) => {
  return (req, res, next) => {
    req.api = api;
    return next();
  }
}