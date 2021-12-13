const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch(next);
}

const getUserId = (req, res, next) => {
  const { userId: _id } = req.params;
  return User.findById({ _id })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для поиска пользователя.'));
      }
      next(err);
    });
};

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        id: user._id, email: user.email, name: user.name, abote: user.aboute, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      }
      next(err);
    });
}

function updateUser(req, res, next) {
  const ownId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate((ownId), { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля пользователя.'));
      }
      next(err);
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя.'));
      }
      next(err);
    });
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для поиска пользователя.'));
      }
      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(new Error('IncorrectEmail'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new BadRequestError('Указан некорректный Email или пароль.'));
          } else {
            const payload = { _id: user._id };
            res.send({
              token: jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
            });
          }
        });
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new BadRequestError('Указан некорректный Email или пароль.'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
