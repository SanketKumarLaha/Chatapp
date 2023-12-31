const userRoute = require("./routes/userRoute");
const Messages = require("./models/messagesModel");
const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use("/api/user", userRoute);

//?socket connection
const map = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setUserId", (userId) => {
    map.set(userId, socket.id);
  });

  socket.on("sendingMessage", ({ message, clickedUserId, userId }) => {
    new Messages({ message, clickedUserId, userId }).save();

    io.to(map.get(clickedUserId)).emit("receivedMessage", {
      message,
      clickedUserId,
      userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    map.delete(socket.id);
  });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log("Serven listening on port", PORT);
  });
});
