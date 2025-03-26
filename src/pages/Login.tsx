import { Button, Container, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useUser } from "../UserContext";
// import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const {setUser } = useUser();
  // useEffect(() => {
  //   if (user) {
  //     navigate("/dashboard");
  //   }
  // }, [user, navigate]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      setUser({
        uid: response.user.uid,
        name: response.user.displayName,
        photo: response.user.photoURL,
      });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h2" sx={{ mb: "20px" }}>
        Welcome to <span style={{ color: "#A3FFD3" }}>NewsApp</span>
      </Typography>
      {/* <Typography variant='h4'>----Login---</Typography>  */}
      <Button
        sx={{ mt: "20px", backgroundColor: "#A3FFD3", boxShadow: "none" }}
        variant="contained"
        startIcon={<GoogleIcon sx={{ color: "#000" }} />}
        onClick={handleLogin}
      >
        <Typography
          sx={{
            color: "#000",
            font: "20px",
            fontFamily: "Roboto",
            fontWeight: "700",
          }}
        >
          Login with Google
        </Typography>
      </Button>
    </Container>
  );
};

export default Login;
