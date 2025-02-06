"use strict";

import StandardModel from "./../services/standardModel";
import { HttpCodes } from "./../helpers/httpCodes";
import httpMessages from "./../helpers/httpMessages";

export default class StandardController {
  standard: StandardModel;
  constructor() {
    this.GetStandards = this.GetStandards.bind(this);
    this.AddStandard = this.AddStandard.bind(this);
    this.UpdateStandard = this.UpdateStandard.bind(this);
    this.GetStandardData = this.GetStandardData.bind(this);
    this.DeleteStandard = this.DeleteStandard.bind(this);

    
    this.standard = new StandardModel();
  }

  GetStandards(req, res) {    
    this.standard.GetStandards(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalCount: result.totalCount, currentPage:result.currentPage });
        }
      }
    })
  }

  AddStandard(req, res) {
    this.standard.AddStandard(req.body, (error, result) => {
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

  UpdateStandard(req, res) {
    this.standard.UpdateStandard(req.body, (error, result) => {
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

  GetStandardData(req, res) {
    this.standard.GetStandardData(req.params, (error, result) => {
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

  DeleteStandard(req, res) {
    this.standard.DeleteStandard(req.body, req.params, (error, result) => {
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