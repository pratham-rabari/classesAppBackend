"use strict";


const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
const { AddActivityLog } = new common();

export default class TeacherModel {
  constructor() {
    this.AddSubject = this.AddSubject.bind(this)
    this.GetSubjectData = this.GetSubjectData.bind(this)
    this.UpdateSubject = this.UpdateSubject.bind(this)
    this.GetSubjects = this.GetSubjects.bind(this)
    this.DeactivateSubject = this.DeactivateSubject.bind(this)
    this.ReactivateSubject = this.ReactivateSubject.bind(this)
  }

  async AddSubject(data: any, callback: any) {
    try {
      let subject = models.Subject.build({
        name: data.name,
        standardId: data.standardId ? data.standardId : null,
        subjectCode: data.subjectCode ? data.subjectCode : null,
        CUID: data.decoded.userId,
        CDT: Date.now()
      });

      let subjectObj = await subject.save();

      AddActivityLog({
        module: 'Subject',
        userId: data.decoded.userId,
        description: `Subject ${data.name} with id = ${subjectObj.subjectId} is created.`
      })

      return callback(null, { status: "success", msg: httpMessages.SUBJECT.SUBJECT_ADDED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error);
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  // to get a particuler subject data
  async GetSubjectData(params: any, callback) {
    try {
      let subject = await models.Subject.findOne({
        where: { subjectId: params.subjectId }, attributes: [
          'subjectId',
          'name',
          'standardId',
          'subjectCode',
          'CUID',
        ],
      })
      if (subject) {
        return callback(null, { status: "success", msg: httpMessages.SUBJECT.SUBJECT_DATA_FETCHED, code: HttpCodes["OK"], data: subject });
      } else {
        return callback(null, { status: "customError", msg: httpMessages.SUBJECT.SUBJECT_DATA_NOT_FETCHED, code: HttpCodes["BAD_REQUEST"] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateSubject(data: any, callback: any) {
    try {
      let subjectObj = {
        name: data.name,
        standardId: data.standardId ? data.standardId : null,
        subjectCode: data.subjectCode ? data.subjectCode : null,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Subject.update(subjectObj, { where: { subjectId: data.subjectId } });
      AddActivityLog({
        module: 'Subject',
        userId: data.decoded.userId,
        description: `Subject ${data.name} with id = ${data.subjectId} is updated.`
      })
      return callback(null, { status: "success", msg: httpMessages.SUBJECT.SUBJECT_UPDATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetSubjects(query: any, callback: any) {
    try {
      let filter = { where: { [Sequelize.Op.or]: {} } };
      // Pagination options
      const { sortBy = 'name', sortOrder = 'asc', searchKey = '' } = query;

      // Sorting options
      filter['order'] = [[sortBy, sortOrder.toUpperCase()]];

      if (searchKey) {
        let searchFields = [];
        searchFields.push(
          {
            name: {
              [Sequelize.Op.like]: `%${query.searchKey}%`
            },
          }
        )
        filter['where'][Sequelize.Op.or] = searchFields;
      } else {
        delete filter["where"][Sequelize.Op.or]
      }
      let limitOption = 10;
      let offsetOption = 0;
      if (query.page && query.page != -1) {
        offsetOption = (parseInt(query.page) * limitOption);
        filter['offset'] = offsetOption
        filter['limit'] = limitOption
      }


      let AllSubjects = await models.Subject.findAndCountAll(filter, {
        attributes: [
          'subjectId',
          'name',
          'standardId',
          'subjectCode',
          'CUID',
        ],
      })
      return callback(null, { 'status': 'success', 'msg': httpMessages.SUBJECT.SUBJECT_FETCHED, code: HttpCodes['OK'], data: AllSubjects });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async DeactivateSubject(data: any, params: any, callback: any) {
    try {
      let subject = {
        status: 0,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Subject.update(subject, { where: { subjectId: params.subjectId } });
      AddActivityLog({
        module: 'Subject',
        userId: data.decoded.userId,
        description: `Subject ${data.name} with id = ${params.subjectId} is deactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.SUBJECT.SUBJECT_DELETED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async ReactivateSubject(data: any, params: any, callback: any) {
    try {
      let subject = {
        status: 1,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Subject.update(subject, { where: { subjectId: params.subjectId } });
      AddActivityLog({
        module: 'Subject',
        userId: data.decoded.userId,
        description: `Subject ${data.fname} with id = ${params.subjectId} is reactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.SUBJECT.SUBJECT_REACTIVATE, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

}