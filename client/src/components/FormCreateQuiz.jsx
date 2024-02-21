import { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";

const FormCreateQuiz = () => {
    // const [quiz, setQuiz] = useState({});
    // const [title, setTitle] = useState('');
    // const [question, setQuestion] = useState(''); 
    const [options, setOptions] = useState(Array(4).fill(''));

    const handleOptionChange = (index) => (event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
        console.log(options)
    };



    return (
        <div>
            <Typography variant="h4" component="h2">Create Quiz</Typography>
            <Container component="main" maxWidth="xs">
                <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    variant="outlined"
                />
                <Typography variant="h5" component="h2">Question</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    id="question"
                    label="Question"
                    name="question"
                    variant="outlined"
                />
                <Typography variant="h5" component="h2">Options</Typography>
                {options.map((option, i) => (
                <TextField
                    key={i}
                    margin="normal"
                    fullWidth
                    id={`option${i}`}
                    label={`Option ${i + 1}`}
                    name={`option${i}`}
                    variant="outlined"
                    value={option}
                    onChange={handleOptionChange(i)}
                />
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Create
                </Button>
                </Box>
            </Container>
        </div>
    );
}

export default FormCreateQuiz;