import React, { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import api from "../utils/Api";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import Spinner from "./Spinner";
import { Route, Switch, useHistory } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import InfoTooltip from "./InfoTooltip.js";
import * as auth from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState({ name: "", about: "" });
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegSucces, setIsRegSucces] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);


  function handleCheckToken() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true);
          setEmail(res.data.email);
          history.push("/");
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Токен не передан или передан не в том формате");
          }
          console.log("401 — Переданный токен некорректен");
        });
    }
  }

  function handleRegSubmit(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        setIsInfoPopupOpen(true);
        setIsRegSucces(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("Некорректно заполнено одно из полей ");
        }
        setIsInfoPopupOpen(true);
        setIsRegSucces(false);
      });
  }
  function handleLoginSubmit(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        setEmail(email);
        history.push("/");
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей");
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден ");
        }
        return console.log("Error: 500");
      });
  }
  function handleSignout() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/sign-in");
  }
/*
  useEffect(() => {
    handleCheckToken();
    api
      .getUserInformation()
      .then((info) => {
        setCurrentUser(info);
      })
      .catch((err) => console.log(err));
    api
      .getInitialCards()
      .then((info) => {
        setCards(info);
      })
      .catch((err) => console.log(err));
  }, []);*/

  useEffect(() => {
    handleCheckToken();
    Promise.all([api.getUserInformation(), api.getInitialCards()])
      .then(([info, cardsArr]) => {
        setCurrentUser(info);
        setCards(cardsArr);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleSubmitDeleteCard(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    setCardToDelete(card);
    setDeletePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setDeletePopupOpen(false);
    setSelectedCard(null);
    setIsInfoPopupOpen(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(info) {
    api
      .setUserInfo(info)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(link) {
    api
      .setUserAvatar(link)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(card) {
    api
      .createNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header email={email} onSignOut={handleSignout} />
        {isLoading ? (
          <Spinner />
        ) : (
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              isLoggedIn={isLoggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <Route path="/sign-in">
              <Login onSubmit={handleLoginSubmit} />
            </Route>
            <Route path="/sign-up">
              <Register onSubmit={handleRegSubmit} />
            </Route>
          </Switch>
        )}

        {isLoggedIn && <Footer />}
        
        <InfoTooltip
          isOpen={isInfoPopupOpen}
          onClose={closeAllPopups}
          isRegSucces={isRegSucces}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <DeleteCardPopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleSubmitDeleteCard}
          card={cardToDelete}
        />
        <PopupWithForm name="card-delete" title="Вы уверены?">
            <button type="submit" className="popup__save">
              Да
            </button>
          </PopupWithForm>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
