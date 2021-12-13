class Api {
    constructor(options) {
      this._url = options.baseUrl
      this._headers = options.headers
    }
  
    _checkResponse(res){
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  
    getInitialCards() {
      return fetch(`${this._url}/cards`, {
      headers: this._headers
    })
      .then(this._checkResponse);
    }  
    
    getUserInformation(){
      return fetch(`${this._url}/users/me`, {
        headers: this._headers,
        method: "GET",
      })
      .then(this._checkResponse)
    }
  
    updateUserInformation(name, about){
      return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
      })
      .then(this._checkResponse);
    }
  
    addNewCardToServer(name, link){
      return fetch(`${this._url}/cards`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          name: name,
          link: link
        })
      })  
      .then(this._checkResponse);
    }
  
    setUserAvatar(avatar){
      return fetch(`${this._url}/users/me/avatar`, {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify({
          avatar: avatar
        })
      })
      .then(this._checkResponse);
    }

    _dislikeCard(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(this._checkResponse)
    }
  
    setLike(cardId){
      return fetch(`${this._url}/cards/likes/${cardId}`,{
        method: 'PUT',
        headers: this._headers
      })
      .then(this._checkResponse);
    }

    _likeCard(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: this._headers,
        })
            .then(this._checkResponse)
    }

    changeLikeCardStatus(cardId, status) {
        return status ? this._likeCard(cardId) : this._dislikeCard(cardId);
    }
  
    removeLike(cardId){
      return fetch(`${this._url}/cards/likes/${cardId}`,{
        method: "DELETE",
        headers: this._headers
      })
      .then(this._checkResponse);
    }
  
    deleteCard(cardId){
      return fetch(`${this._url}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers
      })
      .then(this._checkResponse);
    }

    setUserInfo(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(data)
        })
            .then(this._checkResponse)
    }

    createNewCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(data)
        })
            .then(this._checkResponse)
    }
  }

  const api = new Api({
    baseUrl: "https://mesto.nomoreparties.co/v1/cohort-25",
    headers: {
      authorization: "aa278cc5-8371-4a9c-869b-e11b649efea5",
      "Content-Type": "application/json",
    },
  });

  export default api;