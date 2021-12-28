class FormValidator {
  constructor(objSelectors, formElement) {
    this._objSelectors = objSelectors;
    this._formElement = formElement;
  }

  enableValidation = () => {
    this._setEventListeners();
  }

  _setEventListeners = () => {
    this._inputList = Array.from(this._formElement.querySelectorAll(this._objSelectors['inputSelector']));
    this._buttonElement = this._formElement.querySelector(this._objSelectors['submitButtonSelector']);
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      })
    });
  }
  
  _checkInputValidity = (inputElement) => {
    if(!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _disableSubmitButton = () => {
    this._buttonElement.classList.add(this._objSelectors['inactiveButtonClass']);
    this._buttonElement.setAttribute('disabled', true);
  }

  _ableSubmitButton = () => {
    this._buttonElement.classList.remove(this._objSelectors['inactiveButtonClass']);
    this._buttonElement.removeAttribute('disabled', false);
  }

  _toggleButtonState = () => {
    if(this._hasInvalidInput()) {
      this._disableSubmitButton();
    } else {
      this._ableSubmitButton();
    }
  }

  _hasInvalidInput = () => {
    return this._inputList.some((input) => {
      return input.validity.valid === false;
    });
  }

  _showInputError = (inputElement, errorMessage) => {
    this._errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(this._objSelectors['inputErrorClass']);
    this._errorElement.textContent = errorMessage;
    this._errorElement.classList.add(this._objSelectors['errorClass']);
  }

  _hideInputError = (inputElement) => {
    this._errorElement = this._formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(this._objSelectors['inputErrorClass']);
    this._errorElement.textContent = '';
    this._errorElement.classList.remove(this._objSelectors['errorClass']);
  }
}

export default FormValidator;