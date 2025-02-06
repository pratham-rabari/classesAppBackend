"use strict";

import { validationResult } from 'express-validator';
import UserModel from "./../services/userModel";
import { HttpCodes } from "./../helpers/httpCodes";
import httpMessages from "./../helpers/httpMessages";

export default class UserController {
  user: UserModel;
  constructor() {
    this.Login = this.Login.bind(this);
    this.ForgotPassword = this.ForgotPassword.bind(this);
    this.ResetPassword = this.ResetPassword.bind(this);
    this.GetUsers = this.GetUsers.bind(this)
    this.user = new UserModel();
  }

  Login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ message: httpMessages.LOGIN[errors.array()[0].msg], code: HttpCodes['BAD_REQUEST'] });
    }
    console.log("ok")
    this.user.Login(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data });
        }
      }
    })
  }

  ForgotPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ message: httpMessages.LOGIN[errors.array()[0].msg], code: HttpCodes['BAD_REQUEST'] });
    }
    this.user.ForgotPassword(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data });
        }
      }
    })
  }

  ResetPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ message: httpMessages.RESETPASSWORD[errors.array()[0].msg], code: HttpCodes['BAD_REQUEST'] });
    }
    this.user.ResetPassword(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data });
        }
      }
    })
  }

GetUsers(req, res) {
    this.user.GetUsers(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data});
        }
      }
    })
  }




}