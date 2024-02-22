import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Question from "../components/Question";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";

const Quiz = () => {
    const [showFormQuestion, setShowFormQuestion] = useState(false);
    const { id } = useParams();

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box sx={{ marginTop: '10px'}}>
                    <Button variant="contained" onClick={() => setShowFormQuestion(true)}>Add question</Button>
                    {showFormQuestion && <Question quizId={id} />}
                </Box>
            </Container>
        </>
    )
}

export default Quiz;