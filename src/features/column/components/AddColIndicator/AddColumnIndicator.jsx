import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import "./AddColumnIndicator.css";

function AddColumnIndicator({ onClick }) {
  return (
    <div className="add-col-container" onClick={onClick}>
      <span className="col-line"></span>
      <button
        className="plus-icon add-col"
        data-tooltip="Adicionar coluna"
      >
        <CiCirclePlus size={30} />
      </button>
      <span className="col-line"></span>
    </div>
  );
}

export default AddColumnIndicator;
