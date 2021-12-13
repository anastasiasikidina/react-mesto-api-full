import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {

  const currentUser = React.useContext(CurrentUserContext);
  
  return (
    <main>
      <section className="profile">
        <div className="profile__container">
        <div className="profile__photo-wrapper" onClick={onEditAvatar}>

          <img
            className="profile__photo"
            src={currentUser.avatar}
            alt="Аватар"
          />
        </div>

        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            onClick={onEditProfile}
            type="button"
            className="profile__btn-edit"
            aria-label="Изменить профайл"
          ></button>
          <p className="profile__about">{currentUser.about}</p>
        </div>

        <button
          onClick={onAddPlace}
          type="button"
          className="profile__btn-add"
          aria-label="Добавить профайл"
        ></button>
        </div>
      </section>

      <section className="photos">
          {cards.map((card) => (
            <Card
              card={card}
              key={card._id}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
      </section>
    </main>
  );
}

export default Main;
