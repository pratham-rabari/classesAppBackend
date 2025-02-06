"use strict";

import classScheduleModel from "./../services/classScheduleModel";
import { HttpCodes } from "./../helpers/httpCodes";
import httpMessages from "./../helpers/httpMessages";

export default class classScheduleController {
  classSchedule: classScheduleModel;
  constructor() {
    this.AddClass = this.AddClass.bind(this);
    this.GetClasses = this.GetClasses.bind(this)
    this.DeleteClass = this.DeleteClass.bind(this)
    this.GetClass = this.GetClass.bind(this)
    this.UpdateClass = this.UpdateClass.bind(this)
    this.GetTeacherClasses = this.GetTeacherClasses.bind(this)
    this.UpdateClassStatus = this.UpdateClassStatus.bind(this)
    this.GetClassBySearch = this.GetClassBySearch.bind(this)
    this.GetClassBySearchForTeacher = this.GetClassBySearchForTeacher.bind(this)
    this.GetClassesForCalendar = this.GetClassesForCalendar.bind(this)
    this.GetTeacherClassesForCalendar =this.GetTeacherClassesForCalendar.bind(this)
    this.GetClassRules =  this.GetClassRules.bind(this)
    this.GetClassRulesById = this.GetClassRulesById.bind(this)
    this.UpdateClassRule = this.UpdateClassRule.bind(this)
    this.classSchedule = new classScheduleModel();
  }

  AddClass(req, res) {
    this.classSchedule.AddClass(req.body, (error, result) => {
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

  GetClasses(req, res) {
    this.classSchedule.GetClasses(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data,totalClasses: result.totalClasses,currentPage: result.currentPage});
        }
      }
    })
  }

  GetClassesForCalendar(req, res) {
    this.classSchedule.GetClassesForCalendar(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  GetClassBySearch(req, res) {
    this.classSchedule.GetClassBySearch(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data,totalClasses: result.totalClasses,currentPage: result.currentPage});
        }
      }
    })
  }

  GetClassBySearchForTeacher(req, res) {
    this.classSchedule.GetClassBySearchForTeacher(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data,totalClasses: result.totalClasses,currentPage: result.currentPage});
        }
      }
    })
  }

  GetClass(req, res) {
    this.classSchedule.GetClass(req.body,req.params, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  UpdateClass(req, res) {
    this.classSchedule.UpdateClass(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  GetTeacherClasses(req, res) {
    this.classSchedule.GetTeacherClasses(req.query,req.params, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data,totalClasses: result.totalClasses,currentPage: result.currentPage});
        }
      }
    })
  }

  GetTeacherClassesForCalendar(req, res) {
    this.classSchedule.GetTeacherClassesForCalendar(req.query,(error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code});
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  DeleteClass(req, res) {
    this.classSchedule.DeleteClass(req.body,req.params, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  UpdateClassStatus(req, res) {
    this.classSchedule.UpdateClassStatus(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  GetClassRules(req, res) {
    this.classSchedule.GetClassRules(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data,totalRules: result.totalRules,currentPage: result.currentPage});
        }
      }
    })
  }

  GetClassRulesById(req, res) {
    this.classSchedule.GetClassRulesById(req.query, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }

  UpdateClassRule(req, res) {
    this.classSchedule.UpdateClassRule(req.body, (error, result) => {
      if (error) {
        res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
      } else {
        if (result && result.status === "customError") {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
        } else {
          res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code,data:result.data});
        }
      }
    })
  }
}