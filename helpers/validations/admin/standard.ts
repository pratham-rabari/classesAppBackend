import { body, check } from 'express-validator';
const models = require('./../../../models/index');

export let AddStandardValidation = [
  check('name').exists().trim().isLength({ min: 1 }).withMessage('NAME_REQUIRED'),
  check('name').exists().trim().isLength({ max: 30 }).withMessage('NAME_LENGTH'),
  check('name').custom((value, { req }) => {
    return new Promise <void> ((resolve, reject) => {
      return models.Standard.findOne({ where: {'name': value}, attributes: ['name'] }).then((standard: any) => {
        if (standard) {
          return reject();
        } else {
          return resolve();
        }
      }).catch((err: any) => {
        return reject();
      });
    });
  }).withMessage('STANDARD_EXIST')
];

export let EditStandardValidation = [
  check('name').exists().trim().isLength({ min: 1 }).withMessage('NAME_REQUIRED'),
  check('name').exists().trim().isLength({ max: 30 }).withMessage('NAME_LENGTH'),
  check('eventTitle').custom((value, { req }) => {
    return new Promise <void> ((resolve, reject) => {
      return models.Standard.findOne({ where: {'name': value, standardId: {[models.Sequelize.Op.ne]: req.body.standardId}}, attributes: ['name'] }).then((standard: any) => {
        if (standard) {
          return reject();
        } else {
          return resolve();
        }
      }).catch((err: any) => {
        return reject();
      });
    });
  }).withMessage('STANDARD_EXIST'),
];

module.exports = {
  AddStandardValidation,
  EditStandardValidation
}