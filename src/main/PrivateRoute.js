import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { useEffect, useState } from "react";

export const PrivateRoute = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      // setUser(user);
      // window.location.href = "/main/workorder";
      if (user) {
        const docRef = doc(firestore, "Users", user?.uid);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);
        if (docSnap.exists()) {
          userHasAuthenticated(true);
          navigate("/main/workorder");
          // window.location.href = "/main/workorder";
          console.log(docSnap.data());
        } else {
          userHasAuthenticated(false);
          navigate("/signin");
          console.log("User is not logged in");
        }
      } else {
        navigate("/signin");
      }
    });
  }, []);
  //   let auth = { token: true };
  return <Outlet />;
};
