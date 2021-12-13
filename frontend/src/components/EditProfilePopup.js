import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
        <input
          type="text"
          name="profile-name"
          value={name}
          onChange={handleNameChange}
          placeholder="Введите Имя"
          className="popup__input popup__input_type_name popup__input_profile-name"
          id="popup__input_type_name"
          required
          minLength="2"
          maxLength="40"
        />
        <span id="popup__input_type_name-error" className="popup__error"></span>

        <input
          type="text"
          name="about"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="О себе"
          className="popup__input popup__input_type_about popup__input_type_activity popup__input_profile-activity"
          id="popup__input_type_about"
          required
          minLength="2"
          maxLength="200"
        />
        <span id="popup__input_type_about-error" className="popup__error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
