import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { auth, firestore } from "../firebase";

import { doc, getDoc } from "firebase/firestore";

function Main() {
  const [user, setUser] = useState();
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/signin";
      console.log("User logged out successfully");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      {/* {userDetails ? ( */}
      <div>
        {" "}
        {/* <img src={userDetails.photo} />
          <p>username: {userDetails.email}</p>
          <p>Full name: {userDetails.fullname}</p> */}
        <Outlet />
      </div>
      {/* ) : ( */}
      {/* <p>Loading</p> */}
      {/* )} */}
      <button onClick={handleLogout}>Logout</button>{" "}
    </>
  );
}

export default Main;
