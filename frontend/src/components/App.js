import { useEffect, useState } from 'react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import api from '../utils/Api';
import auth from '../utils/Auth';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [cardForDelete, setCardForDelete] = useState({})
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const history = useHistory();

  const [tooltipStatus, setTooltipStatus] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);

  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isLoadingSetUserInfo, setIsLoadingSetUserInfo] = useState(false);
  const [isLoadingAddPlaceSubmit, setIsLoadingAddPlaceSubmit] = useState(false);
  const [isLoadingAvatarUpdate, setIsLoadingAvatarUpdate] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token)
        .then((data) => {
          if (data) {
            setCurrentUser(data)
            setLoggedIn(true);
            history.push('/');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    checkToken();
    setIsLoadingSetUserInfo(true);
    setIsLoadingInitialData(true);
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData)
        setCards(cardsData)
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsLoadingSetUserInfo(false);
        setIsLoadingInitialData(false);
      })
  }, []);

  const handleRegister = ({ email, password }) => {
    return auth.register(email, password)
      .then((res) => {
        if (res) {
          setTooltipStatus(true);
          setIsInfoToolTipOpen(true);
          setTimeout(() => {
            setIsInfoToolTipOpen(false);
            handleLogin(email, password);
          }, 1000)
        }
      })
      .catch((err) => {
        console.log(err);
        setTooltipStatus(false);
        setIsInfoToolTipOpen(true);
      });
  }

  const handleLogin = ({ email, password }) => {
    return auth.authorize(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        checkToken();
        window.location.reload();
        setUserEmail(email);
        setLoggedIn(true);
        history.push('/');
      })
      .catch(err => {
        console.log(err); 
      });
  }

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUserEmail('');
    history.push('/sign-in');
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(newCards);
      })
      .catch(err => {
        console.error(err)
      });
  }

  function handleCardDelete(e) {
    e.preventDefault();
    api.deleteCard(cardForDelete._id)
      .then(() => {
        setCards((state) => state.filter(c => c._id !== cardForDelete._id))
        closeAllPopups()
      })
      .catch((err) => {      
        console.error(err);
      })
  }

  const handleUpdateUser = (data) => {
    setIsLoadingSetUserInfo(true);
    api.patchUserData(data)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingSetUserInfo(false)
      })
  }

  const handleUpdateAvatar = (data) => {
    setIsLoadingAvatarUpdate(true);
    api.patchUserAvatar(data)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingAvatarUpdate(false);
      })
  }

  const handleAddPlaceSubmit = (newCard) => {
    setIsLoadingAddPlaceSubmit(true);
    api.postCard(newCard)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups()
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsLoadingAddPlaceSubmit(false);
      })
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function handleCardDeleteRequest(card) {
    setCardForDelete(card);
    setIsConfirmPopupOpen(true);
  }

  const closePopupByClickOutside = (e) => {
    if(e.target.classList.contains('popup_is-opened')) {
      closeAllPopups();
    }
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
    setIsInfoToolTipOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header userEmail={userEmail} handleLogout={handleLogout} />

        <Switch>
          <ProtectedRoute exact path="/"
            loggedIn={loggedIn}
            component={Main}
            onCardClick={handleCardClick}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardDeleteRequest={handleCardDeleteRequest}
            onCardLike={handleCardLike}
            isLoadingInitialData={isLoadingInitialData}
            cards={cards} />

          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>

          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/">
            {loggedIn ?
              <Redirect to="/main" /> :
              <Redirect to="./sign-up" />}
          </Route>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onUpdateUser={handleUpdateUser}
          isLoadingData={isLoadingSetUserInfo}
          isLoadingInitialData={isLoadingInitialData}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onAddPlace={handleAddPlaceSubmit}
          isLoadingData={isLoadingAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onUpdateAvatar={handleUpdateAvatar}
          isLoadingData={isLoadingAvatarUpdate}
        />

        <ConfirmationPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          onSubmit={handleCardDelete}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
        />

        <InfoTooltip
          name="tooltip"
          authStatus={tooltipStatus}
          onClose={closeAllPopups}
          closePopupByClickOutside={closePopupByClickOutside}
          isOpen={isInfoToolTipOpen}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;