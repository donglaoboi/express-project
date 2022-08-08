const userRouter = require("./UserRouter");
const asyncHandle = require("../middleware/AsyncHandle");
function Router(app) {
  app.use("/api/v1/users", asyncHandle(userRouter));
}

module.exports = Router;
