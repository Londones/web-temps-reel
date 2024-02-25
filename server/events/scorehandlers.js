let userScores = {};
let userReachedEnd = {};

const BASE_TIMER_DURATION = 30;
const BASE_SCORE = 300;

const scoreCalculator = (timerValue) => {
  return (timerValue / BASE_TIMER_DURATION) * BASE_SCORE;
};

const initQuizScores = (sessionId, username, quizId) => {
  if (!userScores[sessionId]) {
    userScores[sessionId] = {};
    userReachedEnd[sessionId] = {};
  }
  if (!userScores[sessionId][quizId]) {
    userScores[sessionId][quizId] = {};
    userReachedEnd[sessionId][quizId] = 0;
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
      userReachedEnd[sessionId][quizId]++;
      if (userReachedEnd[sessionId][quizId] === Object.keys(userScores[sessionId][quizId]).length) {
        io.to(sessionId).emit("final-scores", userScores[sessionId][quizId]);
        const ranking = createQuizRanking(userScores[sessionId][quizId]);
        const userRanking = ranking.find(([user, score]) => user === username);
        const personalRanking = { score: userRanking[1], rank: ranking.indexOf(userRanking) + 1 };
        io.to(socket.id).emit("final-personal-ranking", personalRanking);
        return;
      }
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
  initQuizScores,
  handleQuestionFeedback,
  handleEndQuiz,
  handleEndSession,
};
