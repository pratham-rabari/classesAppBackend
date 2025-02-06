"use strict";

import SubjectModel from ".././services/subjectModel";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class SubjectController {
  subject: SubjectModel;

  constructor() {
    this.AddSubject = this.AddSubject.bind(this);
    this.GetSubjectData = this.GetSubjectData.bind(this)
    this.UpdateSubject = this.UpdateSubject.bind(this)
    this.GetSubjects = this.GetSubjects.bind(this)
    this.DeactivateSubject = this.DeactivateSubject.bind(this)
    this.ReactivateSubject = this.ReactivateSubject.bind(this)
    this.subject = new SubjectModel();
  }

  AddSubject(req, res) {
    this.subject.AddSubject(req.body, (error, result) => {
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

  GetSubjectData(req, res) {
    this.subject.GetSubjectData(req.params, (error, result) => {
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

  UpdateSubject(req, res) {
    this.subject.UpdateSubject(req.body, (error, result) => {
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

  GetSubjects(req, res) {
    this.subject.GetSubjects(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalCount: result.totalCount });
        }
      }
    })
  }

  DeactivateSubject(req, res) {
    this.subject.DeactivateSubject(req.body, req.params, (error, result) => {
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

  ReactivateSubject(req, res) {
    this.subject.ReactivateSubject(req.body, req.params, (error, result) => {
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

}