import { body, check } from 'express-validator';

export let login = [
  check('email').exists().trim().isLength({ min: 1 }).withMessage('EMAIL_REQUIRED'),
  check('email').if(body('email').exists()).isEmail().withMessage('INVALID_EMAIL'),
  check('password').exists().trim().isLength({ min: 1 }).withMessage('PASSWORD_REQUIRED')
];

export let forgotPassword = [
  check('email').exists().trim().isLength({ min: 1 }).withMessage('EMAIL_REQUIRED'),
  check('email').if(body('email').exists()).isEmail().withMessage('INVALID_EMAIL'),
];

export let resetPassword = [
  check('oldPassword').exists().trim().isLength({ min: 1 }).withMessage('PASSWORD_REQUIRED'),
  check('newPassword').exists().trim().isLength({ min: 1 }).withMessage('NEW_PASSWORD_REQUIRED'),
  check('newPassword').exists().trim().isLength({ min: 8 }).withMessage('PASSWORD_MIN_LENGTH'),
  check('newPassword').exists().trim().isLength({ max: 15 }).withMessage('PASSWORD_MAX_LENGTH'),
  check('confPassword').exists().trim().isLength({ min: 1 }).withMessage('CONFIRM_PASSWORD_REQUIRED'),
  check('confPassword').custom((value, { req }) => {
    return new Promise <void> ((resolve, reject) => {
      if (value === req.body.newPassword) {
        return resolve();
      } else {
        return reject();
      }
    });
  }).withMessage('PASSWORD_NOT_MATCHED')
];

module.exports = {
  login,
  forgotPassword,
  resetPassword
}