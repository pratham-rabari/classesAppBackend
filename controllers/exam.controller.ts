"use strict";

import ExamsModel from "../services/exam.Model";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class ExamController {
  Exams: ExamsModel;

  constructor() {
    this.AddExam = this.AddExam.bind(this)
    this.UpdateExam = this.UpdateExam.bind(this)
    this.GetExamDetails = this.GetExamDetails.bind(this)
    this.GetOneExamData = this.GetOneExamData.bind(this)
    this.GetStudentForMarks = this.GetStudentForMarks.bind(this)
    this.AddStudentsMarks = this.AddStudentsMarks.bind(this)
    this.GetStudentExamMarks = this.GetStudentExamMarks.bind(this)
    this.Exams = new ExamsModel();
  }

  GetExamDetails(req, res) {
    this.Exams.GetExamsDetails(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalExams: result.count, currentPage: result.currentPage });
        }
      }
    })
  }

  GetOneExamData(req, res) {
    this.Exams.GetOneExamData(req.query, (error, result) => {
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

  GetStudentForMarks(req, res) {
    this.Exams.GetStudentsForMarks(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data,currentPage:result.currentPage, count:result.count  });
        }
      }
    })
  }

  GetStudentExamMarks(req, res) {
    this.Exams.GetStudentExamMarks(req.query, (error, result) => {
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

  AddExam(req, res) {
    this.Exams.AddExam(req.body, (error, result) => {
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

  AddStudentsMarks(req, res) {
    this.Exams.AddStudentsMarks(req.body, (error, result) => {
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


  UpdateExam(req, res) {
    this.Exams.UpdateExam(req.body, (error, result) => {
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