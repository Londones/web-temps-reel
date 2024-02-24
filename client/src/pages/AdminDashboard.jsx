import FormCreateQuiz from "../components/FormCreateQuiz";
import Typography from "@mui/material/Typography";

const AdminDashboard = () => {
  return (
    <div>
      <Typography variant="h4" component="h2" className="admin-dashboard">
        Admin Dashboard
      </Typography>
      <FormCreateQuiz />
    </div>
  );
};

export default AdminDashboard;
