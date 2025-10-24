import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import "./AddColumnIndicator.css";

function AddColumnIndicator({ onClick }) {
  return (
    <div className="add-col-container" onClick={onClick}>
      <span className="col-line"></span>
      <CiCirclePlus className="add-col" size={30} />
      <span className="col-line"></span>
    </div>
  );
}

export default AddColumnIndicator;
