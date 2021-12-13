import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `photo__like ${
    isLiked && "photo__like photo__like_active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="photo">
        <div className="photo__image-container">
    <img
        onClick={handleClick}
        className="photo__image photo__image_open"
        src={card.link}
        alt={card.name}
      />
      {isOwn && (
        <button
          onClick={handleDeleteClick}
          type="button"
          className="photo__trash"
          aria-label="Удалить карточку"
        ></button>
      )}
        </div>
      <div className="photo__like-container">
        <h2 className="photo__title">{card.name}</h2>
        <div className="photo__like-button-container">
          <button
            onClick={handleLikeClick}
            type="button"
            className={cardLikeButtonClassName}
            aria-label="Нравится"
          ></button>
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
