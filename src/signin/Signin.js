import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

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
  return <button onClick={googleLogin}>Signin with Google</button>;
}
