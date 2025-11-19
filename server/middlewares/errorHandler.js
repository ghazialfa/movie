const errHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  switch (err.name) {
    case "SequelizeValidationError":
      status = 400;
      message = err.errors[0].message;
      break;

    case "SequelizeUniqueConstraintError":
      status = 400;
      message = err.errors[0].message;
      break;

    case "InvalidToken":
      status = 401;
      message = "Invalid token";
      break;

    case "Unaunthenticated":
      status = 401;
      message = "You need to be authenticated first";
      break;
  }

  res.status(status).json({ message });
};

module.exports = errHandler;
