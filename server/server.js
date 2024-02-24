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

const { getAllQuiz, getQuestionForQuiz, checkAnswerForQuestion } = require("./controllers/QuizController");

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
const sessionQuiz = {};
const TIMER_DURATION = 30;

let timerInterval;
let timerValue = TIMER_DURATION;

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  /**
   * Create a new session
   */
  socket.on("session-created", async (sessionId) => {
    if (sessions.includes(sessionId)) {
      console.log("Session already exists");
      socket.emit("error", { error: 'SessionExisted!', sessionId: sessionId });
      return;
    }
    sessions.push(sessionId);
    const quizzes = await getAllQuiz();
    socket.emit("response-session-created", { sessionId: sessionId, quizzes });
  });

  /**
   * Add a quiz to a session
   */
  socket.on("add-quiz-session", async ({ sessionId, quiz }) => {
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: 'SessionNotFound!', sessionId: sessionId });
      return;
    }
    console.log("Add quiz to session", sessionId, quiz);
    sessionQuiz[sessionId] = sessionQuiz[sessionId] || [];
    sessionQuiz[sessionId].push(quiz);
    socket.emit("response-add-quiz", { sessionId, quiz });
  });


  /**
   * Join a session
   */
  socket.on("join-room", async (sessionId) => {
    console.log("Join room with ID:", sessionId);
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: 'SessionNotFound!', sessionId: sessionId });
      return;
    } else if (socket.rooms.has(sessionId)) {
      console.log("Socket already joined session");
      socket.emit("error", { error: 'AlreadyJoined!', sessionId: sessionId });
      return;
    }
    socket.join(sessionId);
    const quizzes = sessionQuiz[sessionId] || [];
    //console.log("quizzes", quizzes);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
    io.to(sessionId).emit("response-join", { quizzes, message: `Bienvenue dans la session ${sessionId} !` });
  });


  /**
   * list question for a quiz
   */
  socket.on("list-question", async ({ sessionId, quizId, usedQuestions }) => {
    startQuestionTimer(); // Démarre le timer de la question
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: 'SessionNotFound!', sessionId: sessionId });
      return;
    }
    const question = await getQuestionForQuiz(quizId, usedQuestions);
    io.to(sessionId).emit("quiz-question", { question, quizId });
  });
  


  /**
   * Answer a question
   */
  socket.on("answer-question", async ({ sessionId, quizId, questionId, answers }) => {
    if (!sessions.includes(sessionId)) {
      console.log("Session does not exist");
      socket.emit("error", { error: 'SessionNotFound!', sessionId: sessionId });
      return;
    }
    const hasCorrect = await checkAnswerForQuestion(quizId, questionId, answers);
    io.to(sessionId).emit("quiz-question-response", { hasCorrect, quizId, questionId });
  });


  /**  
   * Disconnect
   */
  socket.on("disconnect", () => {
    console.log("Client disconnected");
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

function startQuestionTimer() {
  clearInterval(timerInterval); 
  timerValue = TIMER_DURATION;
  timerInterval = setInterval(() => {
    if (timerValue > 0) {
      timerValue--;
      io.emit('timer-dec', timerValue); 
    } else {
      stopQuestionTimer();
    }
  }, 1000);
}

function stopQuestionTimer() {
  clearInterval(timerInterval); 
  io.emit('question-timeout');
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
