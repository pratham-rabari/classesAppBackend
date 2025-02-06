"use strict";

import AttendenceModel from ".././services/attendanceModel";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class AttendanceController {
  attendance: AttendenceModel;

  constructor() {
    this.AddAttendance = this.AddAttendance.bind(this);
    this.GetAttendance = this.GetAttendance.bind(this)
    this.UpdateAttendance = this.UpdateAttendance.bind(this)
    
    this.attendance = new AttendenceModel();
  }

  AddAttendance(req, res) {
    this.attendance.AddAttendance(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });

        }
      }
    });
  }

  GetAttendance(req, res) {
    this.attendance.GetAttendance(req.params, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data:result.data?result.data:""});

        }
      }
    });
  }

  UpdateAttendance(req, res) {
    this.attendance.UpdateAttendance(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });

        }
      }
    });
  }  

}