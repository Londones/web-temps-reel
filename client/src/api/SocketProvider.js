import io from "socket.io-client";

let instance;

class SocketInstance {
  constructor() {
    if (instance) {
      throw new Error("Instance already created!");
    }
    instance = this;

    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("connected to server");
    });
    this.socket.on("error", (data) => {
      console.log("error", data);
    });
    this.socket.on("start-quiz-session", (data) => {
      this.quizSessionStartedCallback && this.quizSessionStartedCallback(data);
    });
    this.socket.on("quiz-question", (data) => {
      this.quizQuestionCallback && this.quizQuestionCallback(data);
    });
    this.socket.on("quiz-question-response", (data) => {
      this.quizQuestionResponseCallback && this.quizQuestionResponseCallback(data);
    });

    this.socket.on("ref-user-choices", (data) => {
      this.refUserChoicesCallback && this.refUserChoicesCallback(data);
    });
  }

  createTimer(callback) {
    this.socket.on("times-up", (data) => {
      console.log("fini cette question");
      var button = document.getElementById("button-send-answer");
      button.click();
    });

    this.socket.on("timer-dec", (data) => {
      // console.log("timer", data);
      callback(data);
    });
  }

  listNotifs(callback) {
    this.socket.on("notif", (data) => {
      console.log("notif", data);
      callback(data);
    });
  }

  listNotifTimer(callback) {
    this.socket.on("notif-timer", (data) => {
      console.log("notif-timer", data);
      callback(data);
    });
  }

  createRoomSession(sessionId, callback) {
    this.socket.emit("session-created", sessionId);
    this.socket.on("response-session-created", (data) => {
      callback(data);
    });
  }

  addQuizToSession(sessionId, quiz, callback, username) {
    this.socket.emit("add-quiz-session", { sessionId, quiz, username });
    this.socket.on("response-add-quiz", (data) => {
      callback(data);
    });
  }
  joinRoom(sessionId, callback) {
    this.socket.emit("join-room", sessionId);
    this.socket.on("response-join", (data) => {
      callback(data);
    });
  }
  quitRoom(sessionId) {
    this.socket.emit("quit-room", sessionId);
  }

  listQuestion(userId, sessionId, quizId, usedQuestions) {
    this.socket.emit("list-question", { userId, sessionId, quizId, usedQuestions });
  }

  anwserQuestion(userId, sessionId, quizId, questionId, answers, callback, username) {
    this.socket.emit("answer-question", {
      userId,
      sessionId,
      quizId,
      questionId,
      answers,
      callback,
      username,
    });
  }

  registerQuizSessionStarted(callback) {
    this.quizSessionStartedCallback = callback;
  }
  registerQuizQuestion(callback) {
    this.quizQuestionCallback = callback;
  }
  registerQuizQuestionResponse(callback) {
    this.quizQuestionResponseCallback = callback;
  }
  registerRefUserChoices(callback) {
    this.refUserChoicesCallback = callback;
  }

  joinChat(sessionId, username) {
    this.socket.emit("join-chat", { sessionId, username });
  }
  sendMessage(message, sessionId, username) {
    this.socket.emit("chat-message", { message, sessionId, username });
  }
  registerChatReceived(callback) {
    this.socket.on("chat-received", (data) => {
      callback(data);
    });
  }
  registerRoomUsers(callback) {
    this.socket.on("room-users", (data) => {
      callback(data);
    });
  }
  registerChatHistory(sessionId) {
    this.socket.on("chat-history", sessionId);
  }
  listenToQuizQuestions(callback) {
    this.socket.on("quiz-question", callback);
  }
  listenToCheatingAttempt(callback) {
    this.socket.on("cheating-detected", callback);
  }
  declareLastQuestion() {
    this.socket.emit("last-question");
  }
  registerQuestionScore(callback) {
    this.socket.on("question-score", callback);
  }
  registerPersonalRanking(callback) {
    this.socket.on("final-personal-ranking", callback);
  }
  registerGlobalRanking(callback) {
    this.socket.on("final-scores", callback);
  }
  getCurrentSessionId() {
    return this.sessionId;
  }
  getSocket() {
    return this.socket;
  }
}

export const SocketProvider = new SocketInstance();
