import React, { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

const Question = () => {
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({ quiz_id: 1, question: '', options: [], answer: []});
    const [options, setOptions] = useState(Array(4).fill(''));

    const handleOptionChange = (index) => (event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
        setQuestion({ ...question, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setQuestions([...questions, question]);
        setQuestion({ quiz_id: 1, question: '', options: [], answer: [] });
        setOptions(Array(4).fill(''));
    }

    const handleCorrectAnswerChange = (event, index) => {
        if (event.target.checked) {
            setQuestion({ ...question, answer: [...question.answer, options[index]] });
        } else {
            setQuestion({ ...question, answer: question.answer.filter(answer => answer !== options[index]) });
        }
    };

    useEffect(() => {
        if (questions.length > 0) {
            console.log(questions[questions.length - 1]);
        }
    }, [questions]);

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography variant="h5" component="h2">Question</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    id="question"
                    label="Question"
                    name="question"
                    variant="outlined"
                    value={question.question}
                    onChange={(e) => setQuestion({ ...question, question: e.target.value })}
                />
                <Typography variant="h5" component="h2">Options</Typography>
                {options.map((option, i) => (
                    <React.Fragment key={i}>
                        <TextField
                        
                        margin="normal"
                        fullWidth
                        id={`option${i}`}
                        label={`Option ${i + 1}`}
                        name={`option${i}`}
                        variant="outlined"
                        value={option}
                        onChange={handleOptionChange(i)}
                    />
                    <FormControlLabel control={<Checkbox
                        checked={question.answer.includes(option)}
                        onChange={(e) => handleCorrectAnswerChange(e, i)}
                        value={option}
                    />}
                    label={`Correct answer ${i + 1}`} />
                    </React.Fragment>
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Create question
                </Button>
            </Box>
        </>
    )
}

export default Question;