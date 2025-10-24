import React from "react";
import ColumnForm from "./ColumnForm";

export default function ColumnCreate({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;
    return <ColumnForm onClose={onClose} onSave={onSave} />;
}
