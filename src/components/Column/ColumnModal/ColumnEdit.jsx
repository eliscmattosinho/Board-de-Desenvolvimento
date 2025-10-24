import React from "react";
import ColumnForm from "./ColumnForm";

export default function ColumnEdit({ isOpen, onClose, onSave, columnData }) {
    if (!isOpen) return null;
    return <ColumnForm onClose={onClose} onSave={onSave} columnData={columnData} />;
}
