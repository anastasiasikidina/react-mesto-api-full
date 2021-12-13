import React from "react";
import headerLogo from "../images/logo.svg";
import { Link, Route } from "react-router-dom";

function Header({ email, onSignOut }) {
  return (
    <header className="header">
      <img className="logo header__logo" src={headerLogo} alt="Логотип Mesto" />
      <div className="header__container">
        <Route exact path="/">
          <p className="header__email">{email}</p>
          <Link to="/sign-in" className="header__link" onClick={onSignOut}>
            Выйти
          </Link>
        </Route>
        <Route exact path="/sign-in">
          <Link to="/sign-up" className="header__link_active">
            Регистрация
          </Link>
        </Route>
        <Route exact path="/sign-up">
          <Link to="/sign-in" className="header__link_active">
            Войти
          </Link>
        </Route>
      </div>
    </header>
  );
}

export default Header;
