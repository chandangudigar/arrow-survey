import { useEffect, useState } from "react";
import "./App.css";
import Main from "./main/Main";
import Signin from "./signin/Signin";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";

import Workorder from "./main/Workorder";
import Create_Survey from "./main/Create_Survey";
import Create_Workorder from "./main/Create_Workorder";
import Survey from "./main/Survey";
import { PrivateRoute } from "./main/PrivateRoute";
import { Box, Typography } from "@mui/material";
import { Headset } from "@mui/icons-material";
import { auth, firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext, WorkorderContext, SurveyContext } from "./main/AuthCOntext";

function App() {
  const [user, setuser] = useState({});
  const [workorder, setWorkorder] = useState({});
  const [survey, setSurvey] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged(async (userdata) => {
      console.log(userdata);
      if (userdata) {
        const docRef = doc(firestore, "Users", userdata?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setuser(docSnap.data());
        }
      }
    });
  }, []);
  return (
    <Box className="App">
      <AuthContext.Provider value={user}>
        <WorkorderContext.Provider value={{ workorder, setWorkorder }}>
          <SurveyContext.Provider value={{ survey, setSurvey }}>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/signin" element={<Signin />} />

                <Route path="/main" element={<Main />}>
                  <Route path="workorder" element={<Workorder />}>
                    <Route path="create-workorder" element={<Create_Workorder />}></Route>
                  </Route>
                  <Route path="survey" element={<Outlet />}>
                    <Route path=":id" element={<Survey />}></Route>
                    <Route path="single-survey/:survey_id" element={<Create_Survey />}></Route>
                    <Route path="create-survey" element={<Create_Survey />}></Route>
                  </Route>
                </Route>
              </Route>
            </Routes>
          </SurveyContext.Provider>
        </WorkorderContext.Provider>
      </AuthContext.Provider>
    </Box>
  );
}

export default App;
