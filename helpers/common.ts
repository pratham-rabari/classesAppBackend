import jwt ,{ Secret } from "jsonwebtoken";
import fs from 'fs';
import * as path from 'path';
import { HttpCodes } from "./../helpers/httpCodes";
const models = require("./../models/index");

export default class CommonTaskController {

  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
    this.generateJWT = this.generateJWT.bind(this);
    this.AddActivityLog = this.AddActivityLog.bind(this);
    this.GeneratePass = this.GeneratePass.bind(this);
  }

  // Verify password token
  verifyToken(req: any, res: any, next: any) {
    let token = req.get("Authorization") || req.query.token;
    console.log(req.get("Authorization"),"r2222222222222222")
    try {
      if (token) {
        console.log(token,"tk")
        let decoded = jwt.verify(token, process.env.JWTSECRET, {
          ignoreExpiration: true,
        });
        req.body.decoded = decoded
        req.decoded = decoded                          // for teacher and student function
        if (decoded) {
          if (Date.now() >= decoded["exp"] * 1000) {
            return res
              .status(HttpCodes['OK'])
              .json({
                message: "Token has been expired. Please login again",
                code: HttpCodes["UNAUTHORIZED"],
              });
          }
          return next();
        } else {
          return res
            .status(HttpCodes['OK'])
            .json({
              message: "Unauthorized user request",
              code: HttpCodes["UNAUTHORIZED"],
            });
        }
      } else {
        return res
          .status(HttpCodes['OK'])
          .json({ message: "Token not found", code: HttpCodes["UNAUTHORIZED"] });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HttpCodes['OK'])
        .json({
          message: "Something went wrong",
          code: HttpCodes["UNAUTHORIZED"],
        });
    }
  }

  // To generate JWT token
  generateJWT(tokenObj: any, expiry?: string) {
    if(!tokenObj){
      return;
    }
    let obj = { ...tokenObj }
    let token: any;
    if (expiry) {
      token = jwt.sign(
        { ...tokenObj },
        process.env.JWTSECRET,
        { expiresIn: expiry }
      );
    } else {
      token = jwt.sign({ ...tokenObj }, process.env.JWTSECRET);
    }
    return token;
  }

   

  async AddActivityLog(data) {
    try {
      let activityLog = models.ActivityLog.build({
        module: data.module,
        userId: data.userId,
        description: data.description ? data.description : null,
        CDT: Date.now()
      })
      await activityLog.save();
    } catch (error) {
      console.log('error while adding activity log: ', error);
    }
  }

  // To generate temporary password when forgot password
  async GeneratePass() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';
  
    for (let i = 1; i <= 10; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char)
    }
    return pass;
  }
}
