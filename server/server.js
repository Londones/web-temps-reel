const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const http = require("http");
const socketIo = require("socket.io");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));

const AuthRoutes = require("./routes/AuthRoutes");
const RefreshRoutes = require("./routes/RefreshRoutes");
const QuizRoutes = require("./routes/QuizRoutes");
const QuestionRoutes = require("./routes/QuestionRoutes");

app.use("/auth", AuthRoutes);
app.use("/refresh", RefreshRoutes);
app.use("/quiz", QuizRoutes);
app.use("/question", QuestionRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const {
  handleJoinRoom,
  handleMessage,
  handleDisconnect,
} = require("./events/chatroomhandlers");

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("session-created", (sessionId) => {
    console.log("New session created with ID:", sessionId);
  });

  socket.on("join-room", (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
    io.to(sessionId).emit(
      "response-join",
      `Bienvenue dans la session du quiz ${sessionId} !`
    );
    handleJoinRoom(socket, io);
  });

  socket.on("message", handleMessage(socket, io));

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    handleDisconnect(socket, io);
  });

  socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
