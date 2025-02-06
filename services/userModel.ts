"use strict";

import bcrypt from 'bcrypt';
const models = require("./../models/index");
import { HttpCodes } from "./../helpers/httpCodes";
import common from './../helpers/common';
const { generateJWT, AddActivityLog, GeneratePass } = new common();
import httpMessages from "./../helpers/httpMessages";
import { where } from 'sequelize';

export default class UserModel {
  constructor() {
    this.Login = this.Login.bind(this);
    this.ForgotPassword = this.ForgotPassword.bind(this);
    this.ResetPassword = this.ResetPassword.bind(this);
    this.GetUsers = this.GetUsers.bind(this)
  }

  async Login(body: any, callback: any) {
    try {
      // Find user by email id
      let user = await models.User.findOne({
        where: { email: body.email.toLowerCase(), status: 1 },
        include: [
          {
            model: models.Role,
            attributes: ['role'],
          }
        ]
      });

      if (user) {
        let userObj = user.dataValues;

        let pass = await bcrypt.compare(body.password, userObj.password)

        if (pass) {
          // Generate JWT token for user Authorization
          let tokenObj = {
            userId: userObj.userId,
          }
          const token = generateJWT(tokenObj, '8h');
          let result = {
            userId: userObj.userId,
            role: userObj.Role.role,
            image: userObj.image = userObj.image ? `${process.env.PUBLICURL}/images/user/${userObj.image}` : '',
            userName: userObj.userName,
            firstName: userObj.firstName,
            lastName: userObj.lastName,
            email: userObj.email,
            token: token
          }
          AddActivityLog({
            userId: userObj.userId,
            module: 'User Login',
            description: `Admin ${userObj.firstName} ${userObj.lastName} with id = ${userObj.userId} logged in.`
          })
          return callback(null, { 'status': 'success', 'msg': httpMessages.LOGIN.SUCCESS, code: HttpCodes['OK'], data: result });
        } else {
          return callback(null, { 'status': 'customError', 'msg': httpMessages.LOGIN.INCORRECT_EMAIL_OR_PASS, code: HttpCodes['UNAUTHORIZED'] });
        }
      } else {
        return callback(null, { 'status': 'customError', 'msg': httpMessages.LOGIN.EMAIL_NOT_REGISTERED, code: HttpCodes['UNAUTHORIZED'] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async ForgotPassword(body: any, callback: any) {
    try {
      // Find user by email id
      let user = await models.User.findOne({
        where: { email: body.email.toLowerCase(), status: 1 }
      });
      if (user) {
        let newPassword = await GeneratePass();
        console.log('newPassword: ', newPassword);
        let tmpNewPassword = await bcrypt.hash(newPassword, 10);
        await models.User.update(
          { password: tmpNewPassword },
          { where: { userId: user.userId } }
        )
        //TODO: Send new password email to admin is pending.
        AddActivityLog({
          userId: user.userId,
          module: 'Forgot Password',
          description: `Admin ${user.firstName} ${user.lastName} with id = ${user.userId} reset password with Forgot Password.`
        })
        return callback(null, { 'status': 'success', 'msg': httpMessages.LOGIN.PASSWORD_CHANGED, code: HttpCodes['OK'] });
      } else {
        return callback(null, { 'status': 'customError', 'msg': httpMessages.LOGIN.EMAIL_NOT_REGISTERED, code: HttpCodes['BAD_REQUEST'] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async ResetPassword(body: any, callback: any) {
    try {
      let user = await models.User.findOne({
        where: { userId: body.decoded.userId }
      });
      if (user) {
        let pass = await bcrypt.compare(body.oldPassword, user.password);
        if (pass) {
          let newPassword = body.newPassword;
          let tmpNewPassword = await bcrypt.hash(newPassword, 10);
          await models.User.update(
            { password: tmpNewPassword },
            { where: { userId: user.userId } }
          )
          AddActivityLog({
            userId: user.userId,
            module: 'Reset Password',
            description: `Admin ${user.firstName} ${user.lastName} with id = ${user.userId} reset password.`
          })
          return callback(null, { 'status': 'success', 'msg': httpMessages.RESETPASSWORD.PASSWORD_RESET, code: HttpCodes['OK'] });
        } else {
          return callback(null, { 'status': 'customError', 'msg': httpMessages.RESETPASSWORD.OLD_PASSWORD_INCORRECT, code: HttpCodes['BAD_REQUEST'] });
        }
      } else {
        return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }


  async GetUsers(query: any, callback: any) {
    try {
      let roleId ;
      if (query.roleId) {
        roleId = query.roleId;
      } else{
        roleId = ''
      }

      const users = await models.User.findAll(
        {
          where: { roleId: roleId }
        },
        {
          attributes: ['username', 'firstName', 'lastname','userId']
        }
      )

      return callback(null, { 'status': 'success', 'msg': httpMessages.TEACHER.TEACHER_FETCHED, code: HttpCodes['OK'], data: users });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }
}