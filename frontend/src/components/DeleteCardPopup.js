import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteCardPopup({ isOpen, onClose, onDeleteCard, card }) {
    function handleSubmit(e) {
        e.preventDefault();
        onDeleteCard(card);
    }
    return (
        <PopupWithForm name="delete" title="Вы уверены?" btnCaption="Да" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
    );
}

export default DeleteCardPopup;