"use strict";

import FeesDetailsModel from "../services/feesDetailsModel";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class StudentController {
  FeesDetails: FeesDetailsModel;

  constructor() {
    this.GetFeesDetails = this.GetFeesDetails.bind(this)
    this.GetFeesDetailsForStudent = this.GetFeesDetailsForStudent.bind(this)
    this.AddFeesDetailsForStudent = this.AddFeesDetailsForStudent.bind(this)
    this. EditFeesDetailsForStudent = this. EditFeesDetailsForStudent.bind(this)
    this.FeesDetails = new FeesDetailsModel();
  }

  GetFeesDetails(req, res) {
    this.FeesDetails.GetFeesDetails(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalStudents: result.count, currentPage: result.currentPage });
        }
      }
    })
  }

  GetFeesDetailsForStudent(req, res) {
    this.FeesDetails.GetFeesDetailsForStudent(req.query, (error, result) => {
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

  AddFeesDetailsForStudent(req, res) {
    this.FeesDetails.AddFeesDetailsForStudent(req.body, (error, result) => {
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

  EditFeesDetailsForStudent(req, res) {
    this.FeesDetails.EditFeesDetailsForStudent(req.body, (error, result) => {
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