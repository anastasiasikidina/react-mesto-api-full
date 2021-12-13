import failRegister from "../images/FailRegister.svg";
import succesfulRegister from "../images/SuccesfulRegister.svg";
 
export default function InfoToolTip({ onClose, isOpen, isRegSucces, name }) {
  return (
    <div className={isOpen ? `popup_opened popup` : `popup`}>
      <button
        onClick={onClose}
        type="button"
        className={`button-close popup__cross popup__cross_btn_close-${name}`}
        aria-label="Закрыть попап"
      ></button>
      <div className="popup__content">
      
        <img
          src={isRegSucces ? succesfulRegister : failRegister}
          className="popup__info-icon"
          alt="успех регистрации"
        />
        <h3 className="popup__title-info">
          {isRegSucces
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так!\n Попробуйте еще раз."}
        </h3>
        
      </div>
    </div>
  );
}
