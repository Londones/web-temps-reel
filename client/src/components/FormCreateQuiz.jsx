import { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import CardQuiz from "./CardQuiz";

const FormCreateQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quiz, setQuiz] = useState({ title: '', description: '' });
    const [newQuiz, setNewQuiz] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setQuizzes([...quizzes, quiz]);
        setQuiz({ title: '', description: '' });
        
    }

    const handleChange = (e, field) => {
        const val = (e.target && e.target.value) || '';
        let _quiz = { ...quiz };
        _quiz[`${field}`] = val;
        console.log(_quiz);
        setQuiz(_quiz);
    }

    useEffect(() => {
        if (quizzes.length > 0) {
            setNewQuiz(quizzes[quizzes.length - 1]);
        }
    }, [quizzes]);

    return (
        <>
            <Typography variant="h4" component="h2">Create Quiz</Typography>
            <Container component="main" maxWidth="xs">
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        variant="outlined"
                        value={quiz.title}
                        onChange={(e) => handleChange(e, 'title')}

                    />
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        fullWidth
                        maxRows={4}
                        value={quiz.description}
                        onChange={(e) => handleChange(e, 'description')}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                    Create quiz
                    </Button>
                </Box>
            </Container>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {newQuiz && <CardQuiz quiz={newQuiz} />}
            </div>
        </>
    );
}

export default FormCreateQuiz;