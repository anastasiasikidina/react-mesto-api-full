import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_full_photo ${card ? "popup_opened" : ""}`}>
      <div className="popup__figure-flex">
        <button
          onClick={onClose}
          type="button"
          className="button-close popup__close popup__close_btn_close popup__button-close"
          aria-label="Закрыть попап"
        ></button>
        <figure className="popup__container popup__container-image popup__container-image_open"> 
          <img
            className="popup__image"
            src={card ? card.link : ""}
            alt={card ? card.name : ""}
          />
          <figcaption className="popup__caption">
            {card ? card.name : ""}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;
