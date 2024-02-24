import { Card, CardContent, Typography, FormControlLabel, Checkbox, Button } from '@mui/material';
import { useState, useEffect } from 'react';

const DisplayQuestion = ({ question, sendAnswer }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

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
    }, []);

    return (
        <div class="display-question-card">
            <Card sx={{ width: '100%', margin: '0 1rem 1rem', boxShadow: 'none' }}>
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