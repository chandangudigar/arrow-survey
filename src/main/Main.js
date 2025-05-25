import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";

import { doc, getDoc } from "firebase/firestore";
import Navbar from "./navbar/Navbar";
import { Box } from "@mui/material";

function Main() {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    // auth.onAuthStateChanged(async (user) => {
    //   // console.log(user);
    //   //   setuserDetails(user);
    //   const docRef = doc(firestore, "Users", user?.uid);
    //   const docSnap = await getDoc(docRef);
    //   // console.log(docSnap);
    //   if (docSnap.exists()) {
    //     setUser(docSnap.data());
    //     // console.log(docSnap.data());
    //   } else {
    //     console.log("User is not logged in");
    //   }
    // });
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      {/* {userDetails ? ( */}
      <>
        <Navbar />
        <Outlet />
      </>{" "}
      {/* <img src={userDetails.photo} />
          <p>username: {userDetails.email}</p>
          <p>Full name: {userDetails.fullname}</p> */}
      {/* ) : ( */}
      {/* <p>Loading</p> */}
      {/* )} */}
      {/* // <button onClick={handleLogout}>Logout</button>{" "} */}
    </>
  );
}

export default Main;
