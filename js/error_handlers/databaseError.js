const { DatabaseError } = require("./baseErrorHandlers");

class PostError extends DatabaseError {
  constructor(message, options = {}) {
    super(message);

    for (let [key, value] in Object.entries(options)) {
      this[key] = value;
    }
  }
  get statusCode() { 
    return 502;
  }
}

module.exports = { PostError };
