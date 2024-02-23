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
        <div>
            <Card sx={{ width: '25%', margin: '0 1rem 1rem' }} style={{ "boxShadow": "rgba(149, 157, 165, 0.2) 0px 8px 24px", "padding": "6rem 2rem", "borderRadius": "10px" }}>
                <CardContent>
                    { question &&
                        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                            {question.question}
                        </Typography>
                    }
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
                </CardContent>
                <Button color="secondary" variant="outlined" size="small" onClick={handleAnswer}>Send</Button>
            </Card>
        </div>
    )
}

export default DisplayQuestion;