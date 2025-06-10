import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { firestore, storage } from "../firebase";
import { v4 } from "uuid";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { ArrowBackIosNewOutlined, GpsFixed } from "@mui/icons-material";
import { AuthContext, NotificationContext, SurveyContext, WorkorderContext } from "./AuthCOntext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import CloseIcon from "@mui/icons-material/Close";

import SaveIcon from "@mui/icons-material/Save";
// import GpsFixedIcon from "@mui/icons-material/GpsFixedIcon";
import File from "@mui/icons-material/FileCopy";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Create_Survey() {
  const [img, setImg] = useState(null);
  const [imgURL, setimgURL] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyMessage, setsurveyMessage] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const { survey, setSurvey } = useContext(SurveyContext);
  const user = useContext(AuthContext);
  const { workorder } = useContext(WorkorderContext);
  const { setNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const vertical = "top";
  const horizontal = "center";
  console.log("auth", user);
  const location = useLocation();
  console.log(location);
  const { order } = location?.state;

  useEffect(() => {
    if (survey?.id) {
      setSurveyData({ ...survey });
    } else {
      setSurveyData({ work_name: workorder.work_ordername, order: order });
    }
  }, []);

  const handleChange = (e) => {
    console.log("e", e.target.name, e.target.value);
    let newData = { ...surveyData, [e.target.name]: e.target.value };

    setSurveyData(newData);
  };

  const uploadFile = async (e) => {
    setSurveyLoading(true);
    // if(surveyData?.)
    let imageUrl = null;
    if (img) {
      const imageRef = ref(storage, `files/`);
      const metadata = {
        contentType: img.mimeType,
      };
      const snapshot = await uploadBytesResumable(imageRef, img, metadata);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    const data = { created_user: user?.id, work_order: workorder?.id, ...surveyData };
    console.log("data", data);
    if (surveyData?.id) {
      await updateDoc(doc(firestore, "Survey Record", surveyData.id), {
        ...data,
        image_url: imageUrl ? imageUrl : surveyData.image_url,
      });
      setsurveyMessage("Updated survey successfully.");
    } else {
      await setDoc(doc(firestore, "Survey Record", v4()), {
        created_user: user,
        work_order: workorder?.id,
        floor_type: `G-${surveyData.floor_type}`,
        ...surveyData,
        order: order ? order : surveyData.order,
        image_url: imageUrl,
      });
      setNotification("Created survey successfully.");

      sendBack();
    }
    setSurveyLoading(false);
  };
  const sendBack = () => {
    setSurvey({});
    navigate(`/main/survey/${workorder.id}`);
  };

  useMemo(() => {
    console.log(img);
    if (img) {
      const url = URL.createObjectURL(img);
      setimgURL(url);
    }
  }, [img]);

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
    "&.Mui-disabled": {
      backgroundColor: "rgba(255, 255, 255, 0.1)", // light transparent background
      color: "#fff",

      ".MuiOutlinedInput-notchedOutline": {
        borderColor: "#fff", // muted border
      },
      ".MuiSelect-select": {
        color: "#fff",
      },
      ".MuiSvgIcon-root": {
        color: "#fff",
      },
      label: {
        color: "#fff",
      },
      input: {
        color: "#fff",
      },
    },
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`;
          // Assuming handleChange updates the state correctly
          handleChange({ target: { name: "location", value: locationString } });
          setIsFetchingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(`Could not get location: ${error.message}`);
          setIsFetchingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setsurveyMessage(null)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{ maxWidth: "1080px", margin: "0 auto", height: "90%" }}>
      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={surveyLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        key={vertical + horizontal}
        anchorOrigin={{ vertical, horizontal }}
        open={surveyMessage}
        autoHideDuration={5000}
        onClose={() => setsurveyMessage(null)}
        message={surveyMessage}
        action={action}
      />
      <Box component="section" sx={{ p: 1, display: "flex", alignItems: "center", maxWidth: "1080px" }}>
        <ArrowBackIosNewOutlined onClick={() => sendBack()} />
        {/* <Typography variant="h6" component="h6" onClick={() => sendBack()}>
          Survey /
        </Typography>{" "} */}
        <Typography variant="h6" component="h6" onClick={() => sendBack()}>
          {survey?.id ? survey?.work_name : "Create Survey"}
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{ width: "100%", marginBottom: "1rem", maxWidth: "1080px", padding: "10px", overflow: "auto", height: "calc(100% - 1.3rem)" }}
      >
        <TextField
          type="text"
          id="work_name"
          sx={commonStyles}
          margin="dense"
          name="work_name"
          label="Name of Work"
          fullWidth
          variant="outlined"
          value={surveyData?.work_name || ""}
        />
        <TextField
          type="text"
          id="order"
          sx={commonStyles}
          margin="dense"
          name="order"
          label="Survey Id"
          fullWidth
          onChange={handleChange}
          variant="outlined"
          value={surveyData?.order || ""}
        />
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="occupier_type_label" sx={{ color: "#fff" }}>
            Occupier Type
          </InputLabel>
          <Select
            id="occupier_type"
            name="occupier_type"
            labelId="occupier_type_label"
            sx={commonStyles}
            required
            label="Occupier Type"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={surveyData?.occupier_type || ""}
          >
            <MenuItem value={"Owner"}>Owner</MenuItem>
            <MenuItem value={"Tenant"}>Tenant</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="text"
          id="occupier_name"
          sx={commonStyles}
          required
          margin="dense"
          name="occupier_name"
          label={`Name of ${surveyData?.occupier_type ? surveyData?.occupier_type : "Occupier"}`}
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.occupier_name || ""}
        />
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="residential_type_label" sx={{ color: "#fff" }}>
            Residential Type
          </InputLabel>
          <Select
            id="residential_type"
            name="residential_type"
            labelId="residential_type_label"
            sx={commonStyles}
            required
            label="Residential Type"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={surveyData?.residential_type || ""}
          >
            <MenuItem value={"Commercial"}>Commercial</MenuItem>
            <MenuItem value={"Semi Commercial"}>Semi Commercial</MenuItem>
            <MenuItem value={"Residential"}>Residential</MenuItem>
            <MenuItem value={"Religious"}>Religious</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="text"
          id="floor_type"
          sx={commonStyles}
          required
          margin="dense"
          name="floor_type"
          label="Floor Type"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.floor_type || ""}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "#fff" }}>
                  G +{" "}
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="strong_type_label" sx={{ color: "#fff" }}>
            Strong Type
          </InputLabel>
          <Select
            id="strong_type"
            name="strong_type"
            labelId="strong_type_label"
            sx={commonStyles}
            required
            label="Strong Type"
            fullWidth
            onChange={handleChange}
            value={surveyData?.strong_type || ""}
          >
            <MenuItem sx={{ backgroundColor: "" }} value={"Cement Sheet"}>
              Metal Sheet
            </MenuItem>
            <MenuItem value={"Load Boring"}>Load Baring</MenuItem>
            <MenuItem value={"RCC"}>RCC</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="text"
          id="width"
          sx={commonStyles}
          required
          margin="dense"
          name="width"
          label="Width (In Meters)"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.width || ""}
        />
        <TextField
          type="text"
          id="length"
          sx={commonStyles}
          required
          margin="dense"
          name="length"
          label="Length (In Meters)"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.length || ""}
        />
        <TextField
          type="text"
          id="height"
          sx={commonStyles}
          required
          margin="dense"
          name="height"
          label="Height (In Meters)"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.height || ""}
        />
        <TextField
          type="text"
          id="elec_bill_number"
          sx={commonStyles}
          required
          margin="dense"
          name="elec_bill_number"
          label="Electric Bill Number"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.elec_bill_number || ""}
        />
        <FormControl sx={{ width: "100%" }}>
          <Button
            variant="outlined" // Or 'contained'
            startIcon={<GpsFixed sx={{ fill: "#1976d2" }} />}
            onClick={handleGetLocation}
            sx={{ ...commonStyles, marginBottom: "8px" }} // Add some margin top to separate from TextField
          >
            {isFetchingLocation ? "Fetching..." : "Get GPS Location"}
          </Button>
          <TextField
            type="text"
            id="location"
            sx={commonStyles}
            required
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            variant="outlined"
            value={surveyData?.location || ""}
          />
        </FormControl>
        <TextField
          type="text"
          id="remarks"
          sx={commonStyles}
          required
          margin="dense"
          name="remarks"
          label="Remarks"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.remarks || ""}
        />
        <TextField
          type="text"
          id="other_details"
          sx={commonStyles}
          margin="dense"
          name="other_details"
          label="Other Details"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={surveyData?.other_details || ""}
        />
        {surveyData?.image_url ? (
          <>
            <Typography variant="p" component="p" width={"100%"}>
              <File />{" "}
              <Link target="_blank" href={surveyData.image_url}>
                {surveyData.image_url}
              </Link>
            </Typography>
          </>
        ) : null}
        {imgURL && img ? (
          <>
            <Typography variant="p" component="p" width={"100%"}>
              <File />{" "}
              <Link href={imgURL} target="_blank">
                {img.name}
              </Link>
            </Typography>
          </>
        ) : null}
        {/* <input type="file" id="cap" name="personalPhoto" accept="image/*" capture="camera" onChange={(e) => setImg(e.target.files[0])} /> */}
        <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
          Upload files
          <VisuallyHiddenInput
            accept="image/*"
            capture="camera"
            type="file"
            onChange={(e) => setImg(e.target.files[0])}
            // multiple
          />
        </Button>
        <Button
          loadingPosition="start"
          sx={{ width: "100%" }}
          type="submit"
          variant="contained"
          color="primary"
          onClick={uploadFile}
          startIcon={<SaveIcon />}
        >
          Submit
        </Button>
      </Grid>
    </Box>
  );
}

export default Create_Survey;
