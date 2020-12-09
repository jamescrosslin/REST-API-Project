const { UserFacingError } = require("./baseErrorHandlers");

class BadRequestError extends UserFacingError {
  // Using an options object, I can attach relevant information to the error instance
  // (e.g.. the username, route info, query parameters, etc)
  constructor(message, options = {}) {
    super(message);
    //Here I can add any additional information I want included with the error

    for (const [key, value] of Object.entries(options)) {
      this[key] = value; 
    }
  }

  get statusCode() {
    return 400;
  }
}

class NotFoundError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }
  get statusCode() {
    return 404;
  }
}

module.exports = {
  BadRequestError,
  NotFoundError
};
