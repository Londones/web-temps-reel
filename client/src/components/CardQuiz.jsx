import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CardQuiz = ({ quiz }) => {
  return (
    <Card
      sx={{ width: "30%" }}
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        padding: "6rem 0rem",
        borderRadius: "10px",
      }}
      class="center"
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {quiz.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {quiz.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Link to={`/admin/quiz/${quiz.id}/questions`}>
            <Button size="small" variant="contained">
              Edit quiz
            </Button>
          </Link>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CardQuiz;
