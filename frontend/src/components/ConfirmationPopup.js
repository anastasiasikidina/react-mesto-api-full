import React from 'react';
import PopupWithForm from './PopupWithForm';

function ConfirmationPopup(props) {
  return (
    <PopupWithForm name="delete" title="Вы уверены?" buttonText="Да" isOpen={props.isOpen} onClose={props.onClose} closePopupByClickOutside={props.closePopupByClickOutside} onSubmit={props.onSubmit} />
  )
}

export default ConfirmationPopup;