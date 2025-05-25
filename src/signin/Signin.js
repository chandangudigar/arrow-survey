import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Box, Button, Typography } from "@mui/material";
import "./signin.css";

import { ReactComponent as TickSvg } from "../assets/Tick.svg";
import { Google } from "@mui/icons-material";

export default function Signin() {
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      if (result.user) {
        await setDoc(doc(firestore, "Users", result.user.uid), {
          id: result.user.uid,
          email: result.user.email,
          fullname: result.user.displayName,
          photo: result.user.photoURL,
        });
        window.location.href = "/main/workorder";
      }
    });
  }
  return (
    <>
      <Box
        textAlign="center"
        component="section"
        sx={{ p: 2, backgroundColor: "006bd6", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            height: "200px",
            backgroundColor: "#1976d269",
            width: "450px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <TickSvg className="signin-logo" />
            <Typography variant="h4" component="h4">
              Arrow Survey
            </Typography>
          </Box>
          <Button variant="contained" onClick={googleLogin}>
            <Google sx={{ marginRight: "1rem " }} />
            Signin with Google
          </Button>
        </Box>
      </Box>
    </>
  );
}
