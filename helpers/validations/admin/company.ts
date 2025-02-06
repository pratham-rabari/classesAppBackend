import { body, check } from 'express-validator';
const models = require('./../../../models/index');

export let AddCompanyValidation = [
  check('name').exists().trim().isLength({ min: 1 }).withMessage('NAME_REQUIRED'),
  check('name').exists().trim().isLength({ max: 100 }).withMessage('NAME_LENGTH')
];

export let EditCompanyValidation = [
  check('name').exists().trim().isLength({ min: 1 }).withMessage('NAME_REQUIRED'),
  check('name').exists().trim().isLength({ max: 100 }).withMessage('NAME_LENGTH'),
];

module.exports = {
  AddCompanyValidation,
  EditCompanyValidation
}