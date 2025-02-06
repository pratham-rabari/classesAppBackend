import { body, check, validationResult } from 'express-validator';
const models = require('./../../../models/index');
import httpMessages from "../../httpMessages";



export const AddTeacherValidation = [
  check('userName')
    .exists().trim().withMessage(httpMessages.TEACHER.NAME_REQUIRED)
    .optional()
    .isLength({ min: 1, max: 30 }).withMessage(httpMessages.TEACHER.NAME_LENGTH)
    .custom(async (value, { req }) => {
      try {
        const existingTeacher = await models.User.findOne({ where: { userName: value } });
        if (existingTeacher) {
          throw new Error(httpMessages.TEACHER.TEACHER_EXIST);
        }
        return true;
      } catch (error) {
        throw new Error(error);
        console.log(error)
      }
    }),
    check('email')
    .exists().trim()
    .optional()
    .custom(async (value, { req }) => {
      try {
        const existingTeacher = await models.User.findOne({ where: { email: value } });
        if (existingTeacher) {
          throw new Error(httpMessages.TEACHER.TAECHER_WITH_SAME_EMAIL);
        }
        return true;
      } catch (error) {
        throw new Error(error);
      }
    }),
  check('firstName').optional().trim().isLength({ max: 30 }).withMessage(httpMessages.TEACHER.FIRST_NAME_LENGTH),
  check('lastName').optional().trim().isLength({ max: 30 }).withMessage(httpMessages.TEACHER.LAST_NAME_LENGTH),
  check('address').optional().trim().isLength({ max: 100 }).withMessage(httpMessages.TEACHER.ADDRESS_NAME_LENGTH),
  check('phoneNo').optional().trim().isLength({ min: 10, max: 10 }).withMessage(httpMessages.TEACHER.VALID_NUMBER),
];

export const UpdateTeacherValidation = [
  check('userName')
    .exists().trim().withMessage(httpMessages.TEACHER.NAME_REQUIRED)
    .optional()
    .isLength({ min: 1 }).withMessage(httpMessages.TEACHER.NAME_REQUIRED)
    .isLength({ max: 30 }).withMessage(httpMessages.TEACHER.NAME_LENGTH),

  check('userName').custom((value, { req }) => {
    return new Promise<void>((resolve, reject) => {
      return models.User.findOne({ where: { userName: value, userId: { [models.Sequelize.Op.ne]: req.body.userId } }, attributes: ['userName'] })
        .then((user: any) => {
          if (user) {
            return reject();
          } else {
            return resolve();
          }
        })
        .catch((err: any) => {
          return reject();
        });
    });
  }).withMessage(httpMessages.TEACHER.TEACHER_EXIST),
  check('firstName').optional().trim().isLength({ max: 30 }).withMessage(httpMessages.TEACHER.FIRST_NAME_LENGTH),
  check('lastName').optional().trim().isLength({ max: 30 }).withMessage(httpMessages.TEACHER.LAST_NAME_LENGTH),
  check('address').optional().trim().isLength({ max: 100 }).withMessage(httpMessages.TEACHER.ADDRESS_NAME_LENGTH),
  check('phoneNo') .optional({ checkFalsy: true }) .trim().isLength({ min: 10, max: 10 }).withMessage(httpMessages.STUDENT.VALID_PHONE_NUMBER),
]

export const validateTeacherMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};



module.exports = {
  AddTeacherValidation,
  UpdateTeacherValidation,
  validateTeacherMiddleware
}

