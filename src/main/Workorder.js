import React from "react";
import { Link } from "react-router-dom";

function Workorder() {
  return (
    <div>
      <Link to={"/main/create-workorder"}>
        <button>Create WorkOrder</button>
      </Link>
      <Link to={"/main/create-survey"}>
        <button>Create Survey</button>
      </Link>
    </div>
  );
}

export default Workorder;
