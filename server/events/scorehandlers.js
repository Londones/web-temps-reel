let userScores = {};

const BASE_TIMER_DURATION = 30;
const BASE_SCORE = 300;

const scoreCalculator = (timerValue) => {
  return (timerValue / BASE_TIMER_DURATION) * BASE_SCORE;
};

const handleStartQuiz = (sessionId, username, quizId) => {
  if (!userScores[sessionId][quizId]) {
    userScores[sessionId][quizId] = {};
  }
  userScores[sessionId][quizId][username] = 0;
};

const handleQuestionFeedback =
  (io, socket, timer) =>
  async ({ sessionId, username, quizId, isCorrect }) => {
    const score = scoreCalculator(timer);
    if (isCorrect) {
      userScores[sessionId][quizId][username] += score;
    }
    socket.on("last-question", () => {
      io.to(sessionId).emit("final-scores", userScores[sessionId][quizId]);
      const ranking = createQuizRanking(userScores[sessionId][quizId]);
      const personalRanking = { score: ranking[username], rank: ranking.indexOf(username) + 1 };
      io.to(socket.id).emit("final-personal-ranking", personalRanking);
      return;
    });
    io.to(socket.id).emit("question-score", score);
  };

const handleEndQuiz = (sessionId, quizId) => {
  delete userScores[sessionId][quizId];
};

const handleEndSession = (sessionId) => {
  delete userScores[sessionId];
};

const createQuizRanking = (quizScores) => {
  const ranking = Object.entries(quizScores).sort((a, b) => b[1] - a[1]);
  return ranking;
};

module.exports = {
  handleStartQuiz,
  handleQuestionFeedback,
  handleEndQuiz,
  handleEndSession,
};
