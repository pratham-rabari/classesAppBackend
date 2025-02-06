"use strict";

import StudentModel from "../services/studentModel";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class StudentController {
  student: StudentModel;

  constructor() {
    this.AddStudent = this.AddStudent.bind(this);
    this.GetStudentData = this.GetStudentData.bind(this);
    this.UpdateStudent = this.UpdateStudent.bind(this);
    this.GetStudents = this.GetStudents.bind(this);
    this.DeactivateStudent = this.DeactivateStudent.bind(this)
    this.ReactivateStudent = this.ReactivateStudent.bind(this)
    this.GetStudentsByStandard = this.GetStudentsByStandard.bind(this)
    this.GetStudentAttendanceData = this.GetStudentAttendanceData.bind(this)

    this.student = new StudentModel();
  }

  AddStudent(req, res) {
    req.body.decoded = req.decoded
    this.student.AddStudent(req.body,req.file,(error, result) => {
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


  GetStudentData(req, res) {
    this.student.GetStudentData(req.params, (error, result) => {
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

  UpdateStudent(req, res) {
    req.body.decoded = req.decoded
    this.student.UpdateStudent(req.body,req.file, (error, result) => {
      console.log(req.body,"u")
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

  // GetStudents(req, res) {
  //   console.log("rrrrrrrrrrrrrrrrrrrrr")
  //   this.student.GetStudents(req.query, (error, result) => {
  //     if (error) {
  //       res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
  //     } else {
  //       if (result && result.status === "customError") {
  //         res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
  //       } else {
  //         res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalStudents: result.count, currentPage:result.currentPage });
  //       }
  //     }
  //   })
  // }

  GetStudents(req, res) {
    this.student.GetStudents(req.query, (error, result) => {
        if (error) {
            res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        } else {
          if (result && result.status === "customError") {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          }  else {
            res.status(HttpCodes['OK']).json({message: result.msg, code: result.code,data: result.data,totalStudents: result.count,currentPage: result.currentPage})}
        }
    });
}


  DeactivateStudent(req, res) {
    this.student.DeactivateStudent(req.body, req.params, (error, result) => {
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

  ReactivateStudent(req, res) {
    this.student.ReactivateStudent(req.body, req.params, (error, result) => {
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

  GetStudentsByStandard(req, res) {
    this.student.GetStudentsByStandard(req.params, (error, result) => {
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

  GetStudentAttendanceData(req, res) {
    this.student.GetStudentAttendanceData(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data,currentPage:result.currentPage, count:result.count });
        }
      }
    })
  }

}

