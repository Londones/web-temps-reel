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
const UserScoreRoutes = require("./routes/UserScoreRoutes");

const {
  getAllQuiz,
  getQuestionForQuiz,
  checkAnswerForQuestion,
} = require("./controllers/QuizController");

const {
  handleStartQuiz,
  handleEndQuiz,
  handleEndSession,
  handleQuestionFeedback,
} = require("./events/scorehandlers");

app.use("/auth", AuthRoutes);
app.use("/refresh", RefreshRoutes);
app.use("/quiz", QuizRoutes);
app.use("/question", QuestionRoutes);
app.use("/score", UserScoreRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const sessions = [];
const sessionQuiz = {};
const TIMER_DURATION = 30;

let timerInterval;
let timerValue = TIMER_DURATION;

const { handleJoinRoom, handleMessage, handleDisconnect } = require("./events/chatroomhandlers");

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  /**
   * Create a new session
   */
  socket.on("session-created", async (sessionId) => {
    if (sessions.includes(sessionId)) {
      console.log("Session already exists");
      socket.emit("error", { error: "SessionExisted!", sessionId: sessionId });
      return;
    }
    sessions.push(sessionId);
    const quizzes = await getAllQuiz();
    socket.emit("response-session-created", { sessionId: sessionId, quizzes });
  });

  /**
   * Add a quiz to a session
   */
  socket.on("add-quiz-session", async ({ sessionId, quiz, username }) => {
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: "SessionNotFound!", sessionId: sessionId });
      return;
    }
    console.log("Add quiz to session", sessionId, quiz);
    sessionQuiz[sessionId] = sessionQuiz[sessionId] || [];
    sessionQuiz[sessionId].push(quiz);
    handleStartQuiz(sessionId, username, quiz.id);
    socket.emit("response-add-quiz", { sessionId, quiz });
    socket.to(sessionId).emit("start-quiz-session", { sessionId, quizId: quiz.id });
  });

  /**
   * Join a session
   */
  socket.on("join-room", async (sessionId) => {
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
      sessionId: sessionId,
      message: `Bienvenue dans la session ${sessionId} !`,
    });
  });

  socket.on("quit-room", (sessionId) => {
    if (socket.rooms.has(sessionId)) {
      socket.leave(sessionId);
    }
    console.log(`Socket ${socket.id} left session ${sessionId}`);
  });

  socket.on("join-chat", ({ sessionId, username }) => {
    handleJoinRoom(io)(sessionId, username);
  });

  socket.on("chat-message", ({ message, sessionId, username }) => {
    handleMessage(io)({ message, sessionId, username });
  });

  /**
   * list question for a quiz
   */
  socket.on("list-question", async ({ sessionId, quizId, usedQuestions }) => {
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: "SessionNotFound!", sessionId: sessionId });
      return;
    }
    const question = await getQuestionForQuiz(quizId, usedQuestions);

    io.to(sessionId).emit("quiz-question", { question, quizId });
    if (question != null) {
      startQuestionTimer(sessionId);
    }
  });

  /**
   * Answer a question
   */
  socket.on("answer-question", async ({ sessionId, quizId, questionId, answers, username }) => {
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", {
        error: "SessionNotFound!",
        sessionId: sessionId,
      });
      return;
    }
    const hasCorrect = await checkAnswerForQuestion(quizId, questionId, answers);
    handleQuestionFeedback(
      io,
      socket,
      timerValue
    )({ sessionId, username, isCorrect: hasCorrect, quizId });
    io.to(sessionId).emit("quiz-question-response", {
      hasCorrect,
      quizId,
      questionId,
    });
  });

  /**
   * Disconnect
   */
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    handleDisconnect(socket, io);
  });

  /**
   * Error
   */
  socket.on("connect_error", (err) => {
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
  });
});

function startQuestionTimer(sessionId) {
  clearInterval(timerInterval);
  timerValue = TIMER_DURATION;
  timerInterval = setInterval(() => {
    if (timerValue > 0) {
      console.log("timerValue", timerValue);
      timerValue--;
      io.to(sessionId).emit("timer-dec", timerValue);
    } else {
      console.log("Time's up!");
      io.to(sessionId).emit("times-up");
      clearInterval(timerInterval);
    }
  }, 1000);
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
