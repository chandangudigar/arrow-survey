import { Box, Button, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { createElement, useEffect, useState, useContext } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { firestore } from "../firebase";
import { Delete, Add, Download, House, ArrowRight, ArrowLeftSharp, ArrowLeftOutlined, ArrowBackIosNewOutlined } from "@mui/icons-material";
import { WorkorderContext } from "./AuthCOntext";
import Grid from "@mui/material/Grid2";

import BallotRoundedIcon from "@mui/icons-material/BallotRounded";

function Workorder_Survey() {
  const { workorder } = useContext(WorkorderContext);
  const [surveyList, setsurveyList] = useState();
  const navigate = useNavigate();
  let params = useParams();
  console.log(params);
  useEffect(() => {
    getAllSurveys();
  }, []);
  const getAllSurveys = async () => {
    await getDocs(collection(firestore, "Survey Record")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(newData);

      setsurveyList(newData);
    });
  };
  const hadleExport = () => {
    var ws = XLSX.utils.json_to_sheet(surveyList);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/ynd.openxmlformats-officedocument.spreadsheet.sheet",
    });

    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);

    link.href = url;

    link.download = "excel1.xlsx";

    link.click();

    URL.revokeObjectURL(link.href);
    // writeFileXLSX(wb, "Excel1.xlsx");
  };
  const deleteSurvey = async (id) => {
    await deleteDoc(doc(firestore, "Survey Record", id));
    console.log("delete");
    getAllSurveys();
  };
  return (
    <Box>
      <Box sx={{ width: "1080px", margin: "0 auto" }}>
        <Box component="section" sx={{ p: 1, display: "flex", alignItems: "center" }}>
          <ArrowBackIosNewOutlined onClick={() => navigate("/main/workorder")} />
          <Typography variant="h5" component="h5">
            {workorder.work_ordername}
          </Typography>
          <Link to={`/main/survey/create-survey`}>
            <Button size="small" variant="outlined" startIcon={<Add />} sx={{ marginLeft: "1rem" }}>
              Create Survey
            </Button>
          </Link>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download />}
            sx={{ marginLeft: "1rem" }}
            onClick={() => {
              hadleExport();
            }}
          >
            Export
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ width: "100%" }}>
          {surveyList?.map((work) => {
            return (
              <Grid
                key={work.id}
                size={{ xs: 2, sm: 4, md: 4 }}
                item
                sx={{
                  backgroundColor: "#57637526",
                  borderRadius: "5px",
                  border: "1px solid #30374180",
                  cursor: "pointer",
                  zIndex: "0",
                }}
                padding="1rem"
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <House sx={{ height: "50px", width: "50px" }} />
                  <Typography variant="p" component="p" color="#b6bec9" marginLeft="5px">
                    {work.work_order}
                  </Typography>
                </Box>

                <Delete
                  onClick={() => {
                    deleteSurvey(work.id);
                  }}
                ></Delete>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default Workorder_Survey;
