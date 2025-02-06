"use strict";

import TeacherModel from "../services/teacherModel";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class TeacherController {
  teacher: TeacherModel;

  constructor() {
    this.AddTeacher = this.AddTeacher.bind(this)
    this.GetTeacherData = this.GetTeacherData.bind(this)
    this.UpdateTeacher = this.UpdateTeacher.bind(this)
    this.GetTeachers = this.GetTeachers.bind(this)
    this.DeactivateTeacher = this.DeactivateTeacher.bind(this)
    this.ReactivateTeacher = this.ReactivateTeacher.bind(this)
    this.GetTeacherAttendanceData = this.GetTeacherAttendanceData.bind(this)
    this.AddTeacherAttendance =this.AddTeacherAttendance.bind(this)
    this.teacher = new TeacherModel();
  }

  AddTeacher(req, res) {
    req.body.decoded = req.decoded
    this.teacher.AddTeacher(req.body,req.file, (error, result) => {
      console.log(req.decoded,"t")
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: req.body });

        }
      }
    });
  }

  GetTeacherData(req, res) {
    this.teacher.GetTeacherData(req.params, (error, result) => {
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

  UpdateTeacher(req, res) {
    req.body.decoded = req.decoded
    this.teacher.UpdateTeacher(req.body,req.file, (error, result) => {
      console.log(req.body,"t")
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        }
      }
    })
  }

  GetTeachers(req, res) {
    this.teacher.GetTeachers(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalTeachers: result.totalTeachers, currentPage: result.currentPage});
        }
      }
    })
  }

  GetTeacherAttendanceData(req, res) {
    this.teacher.GetTeacherAttendance(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalClasses: result.count, currentPage: result.currentPage});
        }
      }
    })
  }

  

  DeactivateTeacher(req, res) {
    this.teacher.DeactivateTeacher(req.body, req.params, (error, result) => {
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

  ReactivateTeacher(req, res) {
    this.teacher.ReactivateTeacher(req.body, req.params, (error, result) => {
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

    AddTeacherAttendance(req, res) {
      this.teacher.AddTeacherAttendance(req.body, (error, result) => {
        if (error) {
          res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        } else {
          if (result && result.status === "customError") {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          } else {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          }
        }
      })
    }

}
