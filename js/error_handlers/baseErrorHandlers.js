"use strict";

class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

class DatabaseError extends ApplicationError {}

class UserFacingError extends ApplicationError {}

module.exports = { 
  ApplicationError,
  DatabaseError,
  UserFacingError
};
