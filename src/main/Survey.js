import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { createElement, useEffect, useState, useContext } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { firestore } from "../firebase";
import {
  Delete,
  Add,
  Download,
  House,
  ArrowRight,
  ArrowLeftSharp,
  ArrowLeftOutlined,
  ArrowBackIosNewOutlined,
  ArrowOutward,
  ArrowDownward,
  Person,
} from "@mui/icons-material";
import { SurveyContext, WorkorderContext } from "./AuthCOntext";
import Grid from "@mui/material/Grid2";

import { Send } from "@mui/icons-material";

function Survey() {
  const { workorder } = useContext(WorkorderContext);
  const [surveyList, setsurveyList] = useState();
  const navigate = useNavigate();
  const { survey, setSurvey } = useContext(SurveyContext);

  let params = useParams();
  console.log(JSON.stringify(params));
  useEffect(() => {
    getAllSurveys();
  }, []);
  const getAllSurveys = async () => {
    const q = query(
      collection(firestore, "Survey Record"), // ✅ Collection reference
      where("work_order", "==", `${workorder?.id}`) // ✅ Field condition
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    const newData = querySnapshot?.docs?.map((doc) => ({ ...doc.data(), id: doc.id }));
    setsurveyList(newData);
  };
  const sendSurveys = (work) => {
    setSurvey(work);
    navigate(`/main/survey/single-survey/${work.id}`, { state: { order: 0 } });
  };
  const hadleExport = () => {
    let filteredSurveyList = surveyList.map((survey) => {
      delete survey["id"];
      return survey;
    });
    var ws = XLSX.utils.json_to_sheet(filteredSurveyList);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, workorder.work_name);

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ maxWidth: "1080px", margin: "0 auto", height: "100%" }}>
      <Box component="section" sx={{ p: 1, display: "flex", alignItems: "center" }}>
        <ArrowBackIosNewOutlined onClick={() => navigate("/main/workorder")} />
        {/* <Typography variant="h6" component="h6" onClick={() => navigate("/main/workorder")}></Typography>{" "} */}
        <Typography variant="h6" component="h6" onClick={() => navigate("/main/workorder")}>
          {workorder.work_ordername}
        </Typography>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ marginLeft: "auto", marginRight: "0.5rem" }}
          endIcon={<ArrowDownward />}
          variant="outlined"
        >
          Options
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem component={Link} to={{ pathname: "/main/survey/create-survey" }} state={{ order: surveyList?.length + 1 }}>
            Create Survey
          </MenuItem>
          <MenuItem
            onClick={() => {
              hadleExport();
            }}
          >
            Export
          </MenuItem>
        </Menu>
      </Box>
      <Box container sx={{ padding: "0.5rem", overflow: "auto", height: "calc(100% - 8rem)" }}>
        {surveyList?.map((work) => {
          return (
            <Grid
              key={work.id}
              size={{ xs: 2, sm: 4, md: 4 }}
              item
              sx={{
                marginBottom: "0.8rem",
                backgroundColor: "#57637526",
                borderRadius: "5px",
                border: "1px solid #30374180",
                cursor: "pointer",
                zIndex: "0",
              }}
              padding="1rem"
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <House sx={{ height: "35px", width: "35px" }} />
                <Typography variant="h6" component="h6" color="#b6bec9" marginLeft="5px">
                  {work.order}
                </Typography>
                <Typography variant="h6" component="h6" color="#b6bec9" marginLeft="5px">
                  {work.occupier_name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <Person sx={{ height: "20px", width: "20px" }} />
                <Typography variant="p" component="p" color="#b6bec9" marginLeft="5px">
                  {work.created_user.fullname}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => {
                    deleteSurvey(work.id);
                  }}
                >
                  Delete
                </Button>
                <Button sx={{ marginLeft: "0.5rem" }} size="small" variant="contained" startIcon={<Send />} onClick={(e) => sendSurveys(work)}>
                  Details
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}

export default Survey;
