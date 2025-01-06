import React, { useRef } from "react";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 } from "uuid";

function Create_Workorder() {
  const workorder = useRef("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(firestore, "Work Order", v4()), {
      created_user: "1",
      work_ordername: workorder.current.value,
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label> WorkOrder Name</label>
        <input type="text" name="workorder_name" ref={workorder} />
        <input type="submit" name="Submit" />
      </form>
    </div>
  );
}

export default Create_Workorder;
