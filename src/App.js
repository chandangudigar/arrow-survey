import { useEffect, useState } from "react";
import "./App.css";
import Main from "./main/Main";
import Signin from "./signin/Signin";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Workorder from "./main/Workorder";
import Create_Survey from "./main/Create_Survey";
import { auth, firestore } from "./firebase";
import Create_Workorder from "./main/Create_Workorder";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      // setUser(user);
      if (user) {
        const docRef = doc(firestore, "Users", user?.uid);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          // console.log(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
      }
    });
  }, []);

  return (
    <div className="App">
      <header>Arrow Survey</header>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/main/workorder" /> : <Navigate to="signin" />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/main" element={<Main />}>
            <Route path="workorder" element={<Workorder />}></Route>
            <Route path="create-survey" element={<Create_Survey />}></Route>
            <Route path="create-workorder" element={<Create_Workorder />}></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
