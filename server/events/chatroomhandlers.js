let roomUsers = {};

const handleJoinRoom = (socket, io) => (sessionId, username) => {
  socket.join(sessionId);
  if (!roomUsers[sessionId]) {
    roomUsers[sessionId] = [];
  }
  roomUsers[sessionId].push(username);
  io.to(sessionId).emit("room-users", roomUsers[sessionId]);
};

const handleMessage =
  (socket, io) =>
  ({ message, sessionId, username }) => {
    socket.to(sessionId).emit("message", { message, user: username });
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
