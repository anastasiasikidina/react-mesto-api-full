import React from "react";


function PopupWithForm({
  name,
  title,
  btnCaption = "Сохранить",
  isOpen,
  onClose,
  children,
  onSubmit,
}) {
  return (
    <div className={`popup popup-${name} ${isOpen && "popup_opened"}`}>
      <button
        onClick={onClose}
        type="button"
        className={`button-close popup__cross popup__cross_btn_close-${name}`}
        aria-label="Закрыть попап"
      ></button>
      <form
        className={`popup__form popup__form_${name}`}
        name={`${name}-form`}
        onSubmit={onSubmit}
      >
        <h2 className="popup__title">{title}</h2>
        {children}
        <button type="submit" className="popup__button popup__save">
          {btnCaption}
        </button>
      </form>
    </div>
  );
}
export default PopupWithForm;
