import { body, check, validationResult } from 'express-validator';
const models = require('./../../../models/index');
import httpMessages from "../../httpMessages";



export const AddSubjectValidation = [
  check('name').exists().trim().isLength({ min: 1 }).withMessage(httpMessages.SUBJECT.NAME_REQUIRED),
  check('name').exists().trim().isLength({ max: 30 }).withMessage(httpMessages.SUBJECT.NAME_LENGTH),
  check('name').custom(async (value, { req }) => {
    try {
      const existingSubject = await models.Subject.findOne({ where: { name: value } });
      if (existingSubject) {
        throw new Error(httpMessages.SUBJECT.SUBJECT_EXIST);
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }),
];

export const UpdateSubjectValidation = [
  check('name')
  .exists().trim().withMessage(httpMessages.SUBJECT.NAME_REQUIRED)
  .optional()
  .isLength({ min: 1 }).withMessage(httpMessages.SUBJECT.NAME_REQUIRED)
  .isLength({ max: 30 }).withMessage(httpMessages.SUBJECT.NAME_LENGTH),

check('name').custom((value, { req }) => {
  return new Promise<void>((resolve, reject) => {
    return models.Subject.findOne({ where: { name: value, id: { [models.Sequelize.Op.ne]: req.body.subjectId } }, attributes: ['name'] })
      .then((subject: any) => {
        if (subject) {
          return reject();
        } else {
          return resolve();
        }
      })
      .catch((err: any) => {
        return reject();
      });
  });
}).withMessage(httpMessages.SUBJECT.SUBJECT_EXIST),
];


export const validateSubjectMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};



module.exports = {
  AddSubjectValidation,
  UpdateSubjectValidation,
  validateSubjectMiddleware
}

