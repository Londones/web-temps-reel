import { useRef, useState, useEffect, forwardRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useAuth from "../hooks/useAuth";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignInForm() {
  const { setAuth } = useAuth();
  const navigateTo = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userRef = useRef();
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway" || reason === "timeout") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/signIn",
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const userId = response?.data?.id;
      const nom = response?.data?.nom;
      const prenom = response?.data?.prenom;
      setAuth({ userId, nom, prenom, email, password, accessToken });
      setEmail("");
      setPassword("");
      navigateTo(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Erreur réseau");
      } else if (error.response?.status === 400) {
        setErrMsg("Email ou mot de passe incorrect");
      } else if (error.response?.status === 401) {
        setErrMsg("Accès non autorisé");
      } else {
        setErrMsg("Connexion impossible");
      }
      handleClick();
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://popmenucloud.com/cdn-cgi/image/width%3D1200%2Cheight%3D1200%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/apcyogdl/8a98f66c-2e92-4b30-a218-14794aa97ebb.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Se connecter
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              ref={userRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se connecter
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Pas encore inscrit ? S'inscrire"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
