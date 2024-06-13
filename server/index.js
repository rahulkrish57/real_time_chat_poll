const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const database = require("./db/mondoDBconnect");
const Chat = require("./models/chat");
const Poll = require("./models/poll");
app.use(cors());

app.use(express.json());
// connect to DB server
database();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://real-time-poll-chat.onrender.com",
    ],
    methids: ["GET", "POST"],
  },
});

// establish connection
io.on("connection", (socket) => {
  console.log("connection established", socket.id);

  // User join in chat
  socket.on("join", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // event for user sending a message
  socket.on("send_msg", async (data) => {
    console.log(`User with ID: ${socket.id} sent a message`);
    // store message in database for chat history
    try {
      const chatData = new Chat(data);
      await chatData.save();
      console.log(" chat stored in database");
    } catch (error) {
      console.log("storing chat in database failed");
    }

    // emit message to frontend to store in chat history
    socket.to(data.room).emit("receive_msg", data);
  });

  // event for typing loader
  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
  });

  // Event for user stop typing
  socket.on("stop_typing", (data) => {
    socket.to(data.room).emit("stop_typing", data);
  });

  // event for new poll
  socket.on("create_poll", async (data) => {
    try {
      const pollData = new Poll(data);
      await pollData.save();
      console.log(" poll stored in database");
    } catch (error) {
      console.log("storing poll in database failed", error);
    }

    // emite message tp frontend for new poll
    socket.to(data.room).emit("receive_poll", data);
  });

  // event for voting
  socket.on("vote", async (data) => {
    console.log("vote_data", data);
    try {
      console.log("storing vote in database started");
      const poll = await Poll.findOneAndUpdate(
        { poll_id: data.poll_id },
        { $push: { poll_details: data } },
        { new: true }
      );
      if (!poll) {
        console.log("Poll", poll);
        console.log("storing vote in database failed");
      } else {
        console.log("vote stored in database");
      }
    } catch (error) {
      console.log("storing vote in database failed", error);
    }
    socket.to(data.room).emit("vote", data);
  });
  // disconnection happens
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
app.use("/api/auth", require("./route/auth/auth.route"));
app.use("/api/chat", require("./route/chat/chat.route"));
app.use("/api/poll", require("./route/poll/poll.route"));
app.use("/", (req, res) =>
  res.status(404).json({ message: "API running... " })
);
app.use("*", (req, res) => res.status(404).json("Page not found"));

server.listen(4000, () => {
  console.log("::listening on PORT 4000::");
});
