import { Card, CardContent, Typography, FormControlLabel, Checkbox, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { SocketProvider } from "../api/SocketProvider";

const DisplayQuestion = ({ question, sendAnswer, hasCorrect }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { socket } = SocketProvider;

    const handleOptionChange = (e, option) => {
        if (e.target.checked) {
            setSelectedOptions([...selectedOptions, option]);
        } else {
            setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option));
        }
    }

    const handleAnswer = () => {
        sendAnswer(selectedOptions);
        setSelectedOptions([]);
    }

    useEffect(() => {
        console.log("question", question);
        SocketProvider.startTimer()
    }, []);

    return (
        <div class="display-question-card">
            <Card sx={{ width: '100%', margin: '0 1rem 1rem' }} style={{ "boxShadow": "rgba(149, 157, 165, 0.2) 0px 8px 24px", "padding": "6rem 2rem", "borderRadius": "10px" }}>
                { hasCorrect === true && <Alert severity="success">Correct!</Alert> }
                { hasCorrect === false && <Alert severity="error">Incorrect!</Alert> }
                <CardContent>
                    {question &&
                        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                            {question.question}
                        </Typography>
                    }
                    <div className='question-options'>
                        {question.options.map((option, i) => (
                            <FormControlLabel
                                key={i}
                                control={<Checkbox
                                    checked={selectedOptions.includes(option)}
                                    onChange={(e) => handleOptionChange(e, option)}
                                    name={option}
                                    color="primary"
                                />}
                                label={option}
                            />
                        ))}
                    </div>
                </CardContent>
                <Button color="secondary" variant="outlined" size="small" onClick={handleAnswer}>Send</Button>
            </Card>
        </div>
    )
}

export default DisplayQuestion;