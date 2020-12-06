const express = require("express");
const router = express.Router();
const records = require("./js/records");
const {
  NotFoundError,
  BadRequestError
} = require("./js/error_handlers/userFacingError");
const { PostError } = require("./js/error_handlers/databaseError");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

//CRUD - Create Read Update Delete

// Send a Get request to /quotes/random to Read a random quote
router.get(
  "/quotes/random",
  asyncHandler(async (req, res, next) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
  })
);

//Send a Get request to /quotes to Read a list of quotes\
router.get(
  "/quotes",
  asyncHandler(async (req, res, next) => {
    const quotes = await records.getQuotes();
    res.json(quotes);
  })
);

//Send a Get request to /quotes/:id toRead a quote
router.get(
  "/quotes/:id",
  asyncHandler(async (req, res, next) => {
    const quote = await records.getQuote(+req.params.id);
    if (!quote) {
      throw new NotFoundError("Not found", { searchParam: req.params.id });
    }
    res.json(quote);
  })
);

//Send a Post request to /quotes to Create a quote

router.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    const { author, quote } = req.body;
    if (author && quote) {
      const newQuote = await records.createQuote({ quote, author });
      if (!newQuote) {
        throw new PostError(
          "Request failed: may be an issue with database connection. Try again.",
          { params: req.body, errValue: newQuote }
        );
      }
      res.status(201).json(newQuote);
    } else {
      const missing = author ? "Quote" : "Author";
      throw new BadRequestError(
        `${missing} not included: must include both an author and a quote.`,
        { params: req.body }
      );
    }
  })
);

//Send a Put request to /quotes/:id to Update a quote
router.put(
  "/quotes/:id",
  asyncHandler(async (req, res, next) => {
    const { author, quote, year } = req.body;
    const newQuote = await records.updateQuote({
      id: req.params.id,
      author,
      quote,
      year
    });
    if (!newQuote) {
      throw new PostError(
        "Request failed: may be an issue with database connection. Try again.",
        { params: req.body, errValue: newQuote }
      );
    }
    res.status(204).end();
  })
);

//Send a Delete request to /quotes/:id to Delete a quote

router.delete(
  "/quotes/:id",
  asyncHandler(async (req, res, next) => {
    const quote = await records.getQuote({ id: req.params.id });
    if (!quote) {
      throw BadRequestError(
        "Could not locate quote for deletion. Check your numerical quote id and try again"
      );
    }
    records.deleteQuote(quote);
    res.status(204).end();
  })
);

router.use((req, res, next) => {
  const err = new Error(
    "You've used a route that does not exist or a method that does not exist on that route. Please consult the API documentation and try again."
  );
  err.status = 404;
  next(err);
});

module.exports = router;
