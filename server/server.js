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

const {
  getAllQuiz,
  getQuestionForQuiz,
  checkAnswerForQuestion,
} = require("./controllers/QuizController");

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
const sessions = [];

const {
  handleJoinRoom,
  handleMessage,
  handleDisconnect,
} = require("./events/chatroomhandlers");

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("session-created", async (sessionId) => {
    if (sessions.includes(sessionId)) {
      console.log("Session already exists");
      socket.emit("error", { error: "SessionExisted!", sessionId: sessionId });
      return;
    }
    const quizzes = await getAllQuiz();
    //console.log("quizzes", quizzes);
    sessions.push(sessionId);
    socket.emit("response-session-created", {
      sessionId: sessionId,
      quizzes: quizzes,
    });
  });

  socket.on("join-room", async ({ sessionId, quizId }) => {
    console.log("Join room with ID:", sessionId);
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: "SessionNotFound!", sessionId: sessionId });
      return;
    } else if (socket.rooms.has(sessionId)) {
      console.log("Socket already joined session");
      socket.emit("error", { error: "AlreadyJoined!", sessionId: sessionId });
      return;
    }
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
    io.to(sessionId).emit("response-join", {
      message: `Bienvenue dans la session du quiz ${quizId} !`,
    });
  });

  socket.on("list-question", async ({ sessionId, quizId, usedQuestions }) => {
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: "SessionNotFound!", sessionId: sessionId });
      return;
    }
    const question = await getQuestionForQuiz(quizId, usedQuestions);
    io.to(sessionId).emit("quiz-question", { question, quizId });
  });

  socket.on(
    "answer-question",
    async ({ sessionId, quizId, questionId, answers }) => {
      if (!sessions.includes(sessionId)) {
        console.log("Session does not exist");
        socket.emit("error", {
          error: "SessionNotFound!",
          sessionId: sessionId,
        });
        return;
      }
      const hasCorrect = await checkAnswerForQuestion(
        quizId,
        questionId,
        answers
      );
      io.to(sessionId).emit("quiz-question-response", {
        hasCorrect,
        quizId,
        questionId,
      });
    }
  );

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
