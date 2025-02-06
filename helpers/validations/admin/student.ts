import { body, check, validationResult } from 'express-validator';
const models = require('./../../../models/index');
import httpMessages from "../../httpMessages";




// pending not working
export const AddStudentValidation = [
  check('userName')
    .exists().withMessage(httpMessages.STUDENT.NAME_REQUIRED)
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage(httpMessages.STUDENT.NAME_LENGTH),
  check('lastName').exists().trim().isLength({ min: 1 }).withMessage(httpMessages.STUDENT.LAST_NAME_REQUIRED),
  check("lastName").exists().trim().isLength({ max: 30 }).withMessage(httpMessages.STUDENT.LAST_NAME_LENGTH),
  check('firstName').exists().trim().isLength({ min: 1 }).withMessage(httpMessages.STUDENT.FIRST_NAME_REQUIRED),
  check("firstName").exists().trim().isLength({ max: 30 }).withMessage(httpMessages.STUDENT.FIRST_NAME_LENGTH),
  check("fatherName").optional().trim().isLength({ max: 30 }).withMessage(httpMessages.STUDENT.FATHER_NAME_LENGTH),
  check("motherName").optional().trim().isLength({ max: 30 }).withMessage(httpMessages.STUDENT.MOTHER_NAME_LENGTH),
  check("address").optional().trim().isLength({ max: 60 }).withMessage(httpMessages.STUDENT.ADDRESS_NAME_LENGTH),
  check('parentContactNo')
    .exists().withMessage(httpMessages.STUDENT.STUDENT_CONTACT_NO_REQUIRED)
    .optional()
    .trim()
    .isLength({ min: 10, max: 10 }).withMessage(httpMessages.STUDENT.VALID_PARENT_CONTACT_NO),
  check('emergencyContactNo')
    .exists().withMessage(httpMessages.STUDENT.STUDENT_EMERGENCY_CONTACT_NO_REQUIRED)
    .optional()
    .trim()
    .isLength({ min: 10, max: 10 }).withMessage(httpMessages.STUDENT.VALID_EMERGENCY_CONTACT_NO),
    check('phoneNo') .optional({ checkFalsy: true }) .trim().isLength({ min: 10, max: 10 }).withMessage(httpMessages.STUDENT.VALID_PHONE_NUMBER),
  ];


export const validateStudentMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  AddStudentValidation,
  validateStudentMiddleware
}
