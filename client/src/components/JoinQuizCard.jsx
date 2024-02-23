import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const JoinQuizCard = ({ quiz, isAdmin, joinQuiz, addQuiz }) => {
    const handleJoinQuiz = () => {
        joinQuiz(quiz);
    }
    const handleAddQuiz = () => {
        addQuiz(quiz);
        handleSuccess();
    }

    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    return (
        <Card sx={{ width: '30%' }} style={{ "boxShadow": "rgba(149, 157, 165, 0.2) 0px 8px 24px", "padding": "6rem 2rem", "borderRadius": "10px" }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Quiz added successfully !
            </Alert>
            </Snackbar>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {quiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {quiz.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    {isAdmin && <Button size="small" variant="contained" onClick={handleAddQuiz}>Add quiz to session</Button>}
                    {!isAdmin && <Button size="small" variant="contained" onClick={handleJoinQuiz}>Start quiz</Button>}
                </Box>
            </CardActions>
        </Card>
    );
}

export default JoinQuizCard;