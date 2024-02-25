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
      this.quizQuestionResponseCallback &&
        this.quizQuestionResponseCallback(data);
    });
    
   
  }

  createTimer(callback) {
    this.socket.on("times-up", (data) => {
      console.log("fini cette question");
      var button = document.getElementById("button-send-answer");
      button.click();
    });

    this.socket.on("timer-dec", (data) => {
      console.log("timer", data);
      callback(data); 
    });
  }


  listNotifs(callback){
    this.socket.on("notif", (data) => {
      console.log("notif", data);
      callback(data);
    });
  }

  listNotifTimer(callback){
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

  addQuizToSession(sessionId, quiz, callback) {
    this.socket.emit("add-quiz-session", { sessionId, quiz });
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

  listQuestion(sessionId, quizId, usedQuestions) {
    this.socket.emit("list-question", { sessionId, quizId, usedQuestions });
  }

  anwserQuestion(sessionId, quizId, questionId, answers) {
    this.socket.emit("answer-question", {
      sessionId,
      quizId,
      questionId,
      answers,
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
  getCurrentSessionId() {
    return this.sessionId;
  }
  getSocket() {
    return this.socket;
  }
}

export const SocketProvider = new SocketInstance();