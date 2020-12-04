const { response } = require("express");
const express = require("express");
const records = require("./records");
const app = express();

app.use(express.json());

//CRUD - Create Read Update Delete
//Send a Get request to /quotes to Read a list of quotes\
app.get("/quotes", async (req, res, next) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

//Send a Get request to /quotes/:id toRead a quote
app.get("/quotes/:id", async (req, res, next) => {
  try {
    const quote = await records.getQuote(+req.params.id);
    if (!quote) throw new Error("Quote not found");
    res.json(quote);
  } catch (err) {
    err.status = 404;
    return next(err);
  }
});

//Send a Post request to /quotes to Create a quote
app.post("/quotes", async (req, res, next) => {
  try {
    const { author, quote } = req.body;
    if (author && quote) {
      const newQuote = await records.createQuote({ quote, author });
      res.status(201).json(newQuote);
    } else {
      const missing = author ? "Quote" : "Author";
      throw new Error(
        `${missing} not included: must include both an author and and a quote`
      );
    }
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

//Send a Put request to /quotes/:id to Update a quote
app.put("/quotes/:id", async (req, res, nest) => {
  try {
    const { author, quote, year } = req.body;
    const newQuote = await records.updateQuote({
      id: req.params.id,
      author,
      quote,
      year
    });
    if (!newQuote) throw new Error("Quote not found");
    res.json(newQuote);
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

//Send a Delete request to /quotes/:id to Delete a quote
//Send a Get request to /quotes/random to Read a random quote
app.get("/random", (req, res, next) => {
  try {
  } catch (err) {}
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

let port = process.env.PORT ?? 3000;

app.listen(port, () => console.log(`Quote API listening on port ${port}!`));
