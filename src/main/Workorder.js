import { collection, deleteDoc, doc, getDocs, query, setDoc } from "firebase/firestore";
import { listAll } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { Add, Delete, Send } from "@mui/icons-material";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import Grid from "@mui/material/Grid2";
import { v4 } from "uuid";
import { AuthContext, NotificationContext, WorkorderContext } from "./AuthCOntext";

import { useCollection, useCollectionData } from "react-firebase-hooks/firestore";
import BallotRoundedIcon from "@mui/icons-material/BallotRounded";

function Workorder() {
  const [workorderList, setworkorderList] = useState();
  const [open_workorder_model, setOpen_workorder_model] = useState(false);
  const auth = useContext(AuthContext);
  const { workorder, setWorkorder } = useContext(WorkorderContext);
  const { setNotification } = useContext(NotificationContext);

  const navigate = useNavigate();
  const mobileMatches = useMediaQuery("(max-width: 600px)");
  // const messagesRef = collection(firestore, "Work Order");

  // const qu = query(messagesRef);
  // const [messages] = useCollection(qu, { idField: "id" });

  // console.log(messages);
  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    await getDocs(collection(firestore, "Work Order")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(newData);
      setworkorderList(newData);
    });
  };

  const sendSurveys = (work) => {
    setWorkorder(work);
    navigate(`/main/survey/${work.id}`);
  };

  const deleteWorkorder = async (id) => {
    console.log(id);
    try {
      await deleteDoc(doc(firestore, "Work Order", id));
      console.log("Entire Document has been deleted successfully.");
      getAllData();
    } catch (ex) {
      console.log(ex);
    }

    console.log("delete");
  };
  const commonStyles = {
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff", // Default border
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff", // Focused border
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff", // Hover border
    },
    input: {
      color: "#fff", // TextField input color
    },
    label: { color: "#fff" },
    ".MuiSelect-select": {
      color: "#fff", // Select text color
    },
    ".MuiSvgIcon-root": {
      color: "#fff", // Select arrow icon color
    },
  };

  return (
    <Box sx={{ margin: "0 auto", maxWidth: "1080px", height: "100%" }}>
      <Box component="section" sx={{ p: 1, display: "flex", alignItems: "center" }}>
        <Typography variant="h5" component="h5">
          Work Orders
        </Typography>
        <Button size="small" variant="outlined" startIcon={<Add />} sx={{ marginLeft: "1rem" }} onClick={() => setOpen_workorder_model(true)}>
          Create Workorder
        </Button>
      </Box>
      <Dialog
        fullScreen={true}
        open={open_workorder_model}
        onClose={() => setOpen_workorder_model(false)}
        PaperProps={{
          style: { backgroundColor: "#14171c", color: "#fff" },
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const workorder = formJson.workorder;
            console.log(workorder);
            console.log(auth);
            setDoc(doc(firestore, "Work Order", v4()), {
              created_user: auth,
              work_ordername: workorder,
              createdAt: Date.parse(new Date()),
            });
            setNotification("Created Work Order successfully.");
            setOpen_workorder_model(false);
            getAllData();
          },
        }}
      >
        <DialogTitle>Create Work Order</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#fff" }}>
            Create work order to continue to add multiple survey details in the same work order.
          </DialogContentText>
          <TextField
            sx={commonStyles}
            autoFocus
            required
            margin="dense"
            id="workorder"
            name="workorder"
            label="Workorder Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <DialogActions>
            <Button onClick={() => setOpen_workorder_model(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Box container sx={{ padding: "0.5rem", overflow: "auto", height: "calc(100% - 8rem)" }}>
        {workorderList?.map((work) => {
          return (
            <Box
              key={work.id}
              sx={{
                marginBottom: "0.8rem",
                backgroundColor: "#262626",
                borderRadius: "4px",
                border: "1px solid #505050",
                cursor: "pointer",
                zIndex: "0",
                justifyContent: "space-between",
                alignItems: "center",
                ":hover": { backgroundColor: "#424242" },
                transition: "background-color 0.3s ease",
              }}
              padding="1rem"
            >
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <BallotRoundedIcon sx={{ height: "35px", width: "35px" }} />
                <Typography variant="h6" component="h6" color="#b6bec9" marginLeft="5px">
                  {work.work_ordername}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    deleteWorkorder(work.id);
                  }}
                >
                  Delete
                </Button>
                <Button sx={{ marginLeft: "0.5rem" }} size="small" variant="contained" startIcon={<Send />} onClick={(e) => sendSurveys(work)}>
                  Details
                </Button>
              </Box>
              {/* <Delete></Delete> */}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Workorder;
