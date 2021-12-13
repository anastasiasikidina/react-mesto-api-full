import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ name, isOpen, onClose, onUpdateAvatar }) {
  const urlRef = React.useRef();
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar(urlRef.current.value);
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        type="url"
        ref={urlRef}
        name="link"
        placeholder="ссылка на аватар"
        className="popup__input popup__input_type_avatar"
        id={`"popup__input_type_${name}"`}
        required
      />
      <span
        className="popup__error"
        id={`"popup__input_type_${name}-error"`}
      ></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
