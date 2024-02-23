let roomUsers = {};

const handleJoinRoom = (io) => (sessionId, username) => {
  if (!roomUsers[sessionId]) {
    roomUsers[sessionId] = [];
  }
  roomUsers[sessionId].push(username);
  io.to(sessionId).emit("room-users", roomUsers[sessionId]);
};

const handleMessage =
  (socket) =>
  ({ message, sessionId, username }) => {
    socket.to(sessionId).emit("message", { message, username: username });
  };

const handleDisconnect = (socket, io) => () => {
  Object.keys(roomUsers).forEach((sessionId) => {
    roomUsers[sessionId] = roomUsers[sessionId].filter(
      (user) => user !== socket.username
    );
    io.to(sessionId).emit("room-users", roomUsers[sessionId]);
  });
};

module.exports = {
  handleJoinRoom,
  handleMessage,
  handleDisconnect,
};
