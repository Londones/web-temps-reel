let roomUsers = {};
let roomMessages = {};
const Question = require("../models/Question");

const handleJoinRoom = (io) => (sessionId, username) => {
  if (!roomUsers[sessionId]) {
    roomUsers[sessionId] = [];
  }
  if (!roomUsers[sessionId].includes(username)) {
    roomUsers[sessionId].push(username);
  }
  io.to(sessionId).emit("room-users", roomUsers[sessionId]);
  if (roomMessages[sessionId]) {
    io.to(sessionId).emit("chat-history", roomMessages[sessionId]);
  }
};

const handleMessage =
  (io) =>
  async ({ message, sessionId, username, quizId }) => {
    if (!roomMessages[sessionId]) {
      roomMessages[sessionId] = [];
    }
    if (quizId) {
      const questions = await getQuestions(quizId);
      if (answerChecker(questions, message)) {
        io.to(sessionId).emit("cheating-detected", {
          username,
          message: "tried to cheat!",
        });
        return;
      }
    }
    roomMessages[sessionId].push({ username, message });
    io.to(sessionId).emit("chat-received", { username, message });
  };

const handleDisconnect = (socket, io) => () => {
  Object.keys(roomUsers).forEach((sessionId) => {
    roomUsers[sessionId] = roomUsers[sessionId].filter(
      (user) => user !== socket.username
    );
    io.to(sessionId).emit("room-users", roomUsers[sessionId]);
  });
};

const compareArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

const answerChecker = (questions, message) => {
  const messageToLowerCase = message.toLowerCase();
  const userAnswer = messageToLowerCase.split(" ");
  const answersTolowerCase = questions.answers.map((answer) =>
    answer.toLowerCase()
  );
  return compareArrays(answersTolowerCase, userAnswer);
};

const getQuestions = async (quizId) => {
  const questions = await Question.findAll({ quiz_id: quizId });
  return questions;
};

module.exports = {
  handleJoinRoom,
  handleMessage,
  handleDisconnect,
};
