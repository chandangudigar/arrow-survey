import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { firestore, storage } from "../firebase";
import { v4 } from "uuid";

function Create_Survey() {
  const [img, setImg] = useState(null);
  const uploadFile = async (e) => {
    e.preventDefault();
    const imageRef = ref(storage, `files/1`);
    const metadata = {
      contentType: img.mimeType,
    };
    const snapshot = await uploadBytesResumable(imageRef, img, metadata);
    const uploadedURL = await getDownloadURL(snapshot.ref);
    console.log(uploadedURL);
    await setDoc(doc(firestore, "Survey Record", v4()), {
      created_user: "1",
      work_order: "id",
      owner: "",
      residential_type: "",
      floor_type: "",
      strong_type: "",
      height: "",
      width: "",
      electric_bill: "",
      location: "",
      remarks: "",
      other_details: "",
      image_url: uploadedURL,
    });
  };

  return (
    <div>
      {" "}
      <h2>Arrow Survey</h2>
      <form onSubmit={uploadFile}>
        <lable>Name of Work</lable>
        <input type="text" id="work_name" />
        <label>Name of Owner</label>
        <input type="text" id="owner_name" />
        <label>Residential Type</label>
        <select type="text" id="owner_name">
          <option>Commercial</option>
          <option>Semi Commercial</option>
          <option>Residential</option>
        </select>
        <label>Floor Type</label>
        <span>G + </span>
        <input type="text" id="owner_name" />
        <label>Strong Type</label>
        <select type="text" id="owner_name">
          <option>Cement Sheet</option>
          <option>load Boring</option>
          <option>RCC</option>
        </select>
        <label>Height</label>
        <input type="text" id="Height" />
        <label>width</label>
        <input type="text" id="owner_name" />
        <label>Electric Bill Number</label>
        <input type="text" id="owner_name" />
        <label>location</label>
        <input type="text" id="owner_name" />
        <label>remarks</label>
        <input type="text" id="owner_name" />
        <label>Other Details</label>
        <input type="text" id="owner_name" />
        <input type="file" id="cap" name="personalPhoto" accept="image/*" capture="camera" onChange={(e) => setImg(e.target.files[0])} />
        <input type="submit" name="Submit" />
      </form>
    </div>
  );
}

export default Create_Survey;
