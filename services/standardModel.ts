"use strict";

const models = require("./../models/index");
import { HttpCodes } from "./../helpers/httpCodes";
import httpMessages from "./../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from './../helpers/common';
import { where } from "sequelize";
const { AddActivityLog } = new common();

export default class StandardModel {
  constructor() {
    this.GetStandards = this.GetStandards.bind(this);
    this.AddStandard = this.AddStandard.bind(this);
    this.UpdateStandard = this.UpdateStandard.bind(this);
    this.GetStandardData = this.GetStandardData.bind(this);
    this.DeleteStandard = this.DeleteStandard.bind(this);
  }

  async GetStandards(query: any, callback: any) {
    try {
      let filter:any = { where: { [Sequelize.Op.or]: {} } };
      // Pagination options
      const { sortBy = 'standardId', sortOrder = 'asc', searchKey = '' } = query;

      // Sorting options
      filter['order'] = [[sortBy, sortOrder.toUpperCase()]];

      if (searchKey) {
        let searchFields = [];
        searchFields.push(
          {
            name: {
              [Sequelize.Op.like]: `%${query.searchKey}%`
            }
          }
        )
        filter['where'][Sequelize.Op.or] = searchFields;
      } else {
        delete filter["where"][Sequelize.Op.or]
      }

      filter['where'].status = 1;

      let limitOption = 10;
      let offsetOption = 0;
      if (query.page && query.page != -1) {
       let page = parseInt(query.page)
        offsetOption = (page - 1) * 10
        filter['offset'] = offsetOption
        filter['limit'] = limitOption
      }

      filter['include'] = [{
        model: models.Subject,
        attributes: ['subjectId','name'] 
      },
    ]

    console.log(models.Standards)
      let standards = await models.Standard.findAndCountAll(filter);

      const standardsData = standards.rows.map(standard => {
        return {
          id: standard.standardId,
          name: standard.name,
          standardIndex:standard.standardIndex,
          subjects: standard.Subjects.map(subject => ({
            subjectId: subject.subjectId,
            name: subject.name
          }))};
      });
      return callback(null, { 'status': 'success', 'msg': httpMessages.STANDARD.STANDARDS_FETCHED, code: HttpCodes['OK'], data: standardsData, totalCount: standards?.rows.length,currentPage:query.page });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async AddStandard(data: any, callback: any) {
    try {
      let standard = models.Standard.build({
        name: data.name,
        stndardaIndex : data.standardIndex,
        CUID: data.decoded.userId,
        CDT: Date.now()
      });
      let standardObj = await standard.save();
      AddActivityLog({
        module: 'Standard',
        userId: data.decoded.userId,
        description: `Standard ${data.name} with id = ${standardObj.standardId} is created.`
      })
      return callback(null, { status: "success", msg: httpMessages.STANDARD.STANDARD_ADDED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateStandard(data: any, callback: any) {
    try {
      let standardObj = {
        name: data.name,
        stndardaIndex : data.standardIndex,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Standard.update(standardObj, { where: { standardId: data.standardId } });
      AddActivityLog({
        module: 'Standard',
        userId: data.decoded.userId,
        description: `Standard ${data.name} with id = ${data.standardId} is updated.`
      })
      return callback(null, { status: "success", msg: httpMessages.STANDARD.STANDARD_UPDATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetStandardData(params: any, callback) {
    try {
      const standard = await models.Standard.findByPk(params.standardId, {
        include: [{
          model: models.Subject,
          attributes: ['name']
        }]
      });

      if (standard) {
        return callback(null, { status: "success", msg: httpMessages.STANDARD.STANDARD_DATA_FETCHED, code: HttpCodes["OK"], data: standard });
      } else {
        return callback(null, { status: "customError", msg: httpMessages.STANDARD.STANDARD_DATA_NOT_FETCHED, code: HttpCodes["BAD_REQUEST"] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async DeleteStandard(data: any, params: any, callback: any) {
    try {
      let standardObj = {
        status: 0,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Standard.update(standardObj, { where: { standardId: params.standardId } });
      AddActivityLog({
        module: 'Standard',
        userId: data.decoded.userId,
        description: `Standard ${data.name} with id = ${params.standardId} is deactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.STANDARD.STANDARD_DELETED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }
}