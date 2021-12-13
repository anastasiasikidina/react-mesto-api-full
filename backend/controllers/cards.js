const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => {
      res
        .status(200)
        .send(cards);
    })
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
}

function deleteCard(req, res, next) {
  const { cardId: _id } = req.params;
  return Card.findById({ _id })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        card.remove();
        res.status(200).send({ message: 'Карточка удалена' });
      } else {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет карточки по заданному id'));
      }
      next(err);
    });
}

function likeCard(req, res, next) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  return Card.findByIdAndUpdate({ _id }, { $addToSet: { likes: ownId } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
      next(err);
    });
}

function disLikeCard(req, res, next) {
  const { cardId: _id } = req.params;
  const ownId = req.user._id;
  return Card.findByIdAndUpdate({ _id }, { $pull: { likes: ownId } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
      }
      next(err);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};
