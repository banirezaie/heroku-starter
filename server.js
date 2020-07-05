const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
let messages = require("./messages.json");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Note: messages will be lost when Glitch restarts our server.

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  console.log("is this work?");
  res.json(messages);
});

app.get("/messages/search", (req, res) => {
  const { text } = req.query;
  if (text) {
    const toFind = messages.filter((query) => {
      return (
        query.text.toLowerCase().includes(text.toLowerCase()) ||
        query.from.toLowerCase().includes(text.toLowerCase())
      );
    });

    if (toFind) {
      res.send(toFind);
    } else {
      res.send("this word is not exist");
    }
  } else {
    res.status(400).send("please search using a valid 'text' query parameter");
  }
});

app.get("/messages/latest", (req, res) => {
  const latestMessages = messages.slice(messages.length - 5, messages.length);
  res.send(latestMessages);
});

app.get("/messages/:id", (req, res) => {
  const { id } = req.params;
  const message = messages.find((m) => m.id === Number(id));
  if (message) {
    res.send(message);
  } else {
    res.status(404).send(`message with id: ${id} doesn't exist`);
  }
});

app.post("/messages", (req, res) => {
  if (req.body.text && req.body.from) {
    const idGenerator = (req.body.id = new Date().getTime());
    const newMessage = messages.push(req.body);
    res.send({ success: true });
  } else {
    res.status(400).send("please fill the form and submit again!");
  }
});

app.delete("/messages/:id", (req, res) => {
  const { id } = req.params;
  const messagesFilter = messages.filter((m) => m.id !== Number(id));
  if (messagesFilter.length !== messages.length) {
    messages = messagesFilter;
    res.send(`your message with id: ${id} is successfully deleted`);
  } else {
    res.status(404).send(`message with id: ${id} doesn't exist`);
  }
});

app.put("/messages/:id", (req, res) => {
  const { id } = req.params;
  const idGenerator = (req.body.id = new Date().getTime());
  const message = messages.find((m) => m.id === Number(id));
  if (message) {
    // const messagesFilter = messages.filter(m => m.id !== Number(id))
    // messages = messagesFilter;
    message.text = req.body.text;
    message.from = req.body.from;
    // const newMessage = messages.push(req.body);
    res.send(`this id: ${id} is going to be edited`);
  } else {
    res.status(404).send(`message with this id: ${id} doesn't exist `);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(port);
});
