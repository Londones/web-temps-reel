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
        this.socket.on("quiz-question", (data) => {
            this.quizQuestionCallback && this.quizQuestionCallback(data);
        });
        this.socket.on("quiz-question-response", (data) => {  
            this.quizQuestionResponseCallback && this.quizQuestionResponseCallback(data);
         });
    }
    createRoomSession(sessionId, callback) {
        this.socket.emit("session-created", sessionId);
        this.socket.on("response-session-created", (data) => {
            callback(data);
        });
    }
    joinRoom(sessionId, callback) {
        this.socket.emit("join-room", sessionId);
        this.socket.on("response-join", (data) => {
            callback(data);
        });
    }
    listQuestion(sessionId, quizId, usedQuestions) {
        this.socket.emit("list-question", { sessionId, quizId, usedQuestions });
    }
    anwserQuestion(sessionId, quizId, questionId, answers) {
        this.socket.emit("answer-question", { sessionId, quizId, questionId, answers });
    }
    registerQuizQuestion(callback) {
        this.quizQuestionCallback = callback;
    }
    registerQuizQuestionResponse(callback) {
        this.quizQuestionResponseCallback = callback;
    
    }
    getCurrentSessionId() {
        return this.sessionId;
    }
    getSocket() {
        return this.socket;
    }

}
  
export const SocketProvider = new SocketInstance();