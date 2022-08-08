
class Response {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
  jsonResponse(res) {
    res.status(this.statusCode)
      .json({
        isSuccess: true,
        message: this.message,
        data: this.data
      });

  };
}

module.exports = Response;