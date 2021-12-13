import PopupWithForm from "./PopupWithForm";
import React, { useEffect, useState } from "react";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);
  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleLinkChange(e) {
    setLink(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: name,
      link: link,
    });
  }
  return (
    <PopupWithForm
      name="photo"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Название"
          className="popup__input popup__input_type_title"
          id="popup__input_type_title"
          required
          minLength="1"
          maxLength="30"
        />

        <span id="popup__input_type_title-error" className="popup__error"></span>

        <input
          type="url"
          name="link"
          value={link}
          onChange={handleLinkChange}
          placeholder="Ссылка на картинку"
          className="popup__input popup__input_type_image"
          id="popup__input_type_image"
          required
        />
        <span id="popup__input_type_image-error" className="popup__error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
