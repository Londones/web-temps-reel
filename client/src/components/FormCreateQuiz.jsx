import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axiosPrivate from "../api/axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CardQuiz from "./CardQuiz";

const FormCreateQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState({ title: "", description: "" });
  const [newQuiz, setNewQuiz] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuiz = await axiosPrivate.post("/quiz/create", quiz);
    if (newQuiz) {
      setQuizzes([...quizzes, newQuiz.data.quiz]);
      setQuiz({ title: "", description: "" });
      handleSuccess();
    }
  };

  const handleChange = (e, field) => {
    const val = (e.target && e.target.value) || "";
    let _quiz = { ...quiz };
    _quiz[`${field}`] = val;
    console.log(_quiz);
    setQuiz(_quiz);
  };

  useEffect(() => {
    if (quizzes.length > 0) {
      setNewQuiz(quizzes[quizzes.length - 1]);
    }
  }, [quizzes]);

  return (
    <>
      <div class="create-quiz-wrapper">
        <Typography variant="h4" component="h2" class="create-quizz">
          Create Quiz
        </Typography>
        <Container component="main" maxWidth="xs" class="create-quiz-card">
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Quiz created successfully !
            </Alert>
          </Snackbar>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="title"
              label="Title"
              name="title"
              variant="outlined"
              value={quiz.title}
              onChange={(e) => handleChange(e, "title")}
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              multiline
              fullWidth
              maxRows={4}
              value={quiz.description}
              onChange={(e) => handleChange(e, "description")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "#3f51b5" }}
            >
              Create quiz
            </Button>
          </Box>
        </Container>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem"}}
      >
        {newQuiz && <CardQuiz quiz={newQuiz} />}
      </div>
    </>
  );
};

export default FormCreateQuiz;
