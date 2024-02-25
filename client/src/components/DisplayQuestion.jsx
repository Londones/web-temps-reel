import { Card, CardContent, Typography, FormControlLabel, Checkbox, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { SocketProvider } from "../api/SocketProvider";
import ListNotifs from "../components/ListNotif";

const DisplayQuestion = ({ question, sendAnswer, hasCorrect }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { socket } = SocketProvider;
    const [timer, setTimer] = useState(0);
    const [displayAnswer, setDisplayAnswer] = useState(true);

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
        setDisplayAnswer(true);
    }

    useEffect(() => {
        console.log("question", question);
        SocketProvider.createTimer((data) => { setTimer(data) });

        if (displayAnswer) {
            setTimeout(() => {
                setDisplayAnswer(false);
            }, 2000);
        }
    }, [displayAnswer]);

    return (
        <div>
            <div class='center'>
                <Card class="display-question-card">
                    {displayAnswer === true && hasCorrect === true && <Alert severity="success">Correct!</Alert>}
                    {displayAnswer === true && hasCorrect === false && <Alert severity="error">Incorrect!</Alert>}
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
                    <Button id="button-send-answer" color="secondary" variant="outlined" size="small" onClick={handleAnswer}>Send</Button>
                    {timer > 0 && <p>Temps restant: {timer} secondes</p>}
              </Card>
            </div>
        </div>
    )
}

export default DisplayQuestion;