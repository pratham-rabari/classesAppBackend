"use strict";


const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
import { where } from "sequelize";
const { AddActivityLog } = new common();

export default class AttendanceModel {


  constructor() {
    this.GetFeesDetails = this.GetFeesDetails.bind(this)
    this.GetFeesDetailsForStudent = this.GetFeesDetailsForStudent.bind(this)
    this.AddFeesDetailsForStudent = this.AddFeesDetailsForStudent.bind(this)
    this.EditFeesDetailsForStudent = this.EditFeesDetailsForStudent.bind(this)
  }

  async GetFeesDetails(query: any, callback: any) {
    try {
      const { status } = query;
      console.log(query, "x")

      const whereClause: any = {};

      if (status == 0 || status == 1) {
        whereClause.status = status;
      }

      if (query.standardId) {
        whereClause.standardId = query.standardId;
      }

      let filter = { where: whereClause };
      const { sortBy = 'firstName', sortOrder = 'asc', searchKey = '' } = query;

      let orderCriteria = [];
      orderCriteria.push([sortBy, sortOrder.toUpperCase()]);

      filter['order'] = orderCriteria;

      if (searchKey) {
        let searchFields = [
          {
            firstName: {
              [Sequelize.Op.like]: `%${query.searchKey}%`
            }
          },
          {
            lastName: {
              [Sequelize.Op.like]: `%${query.searchKey}%`
            }
          },
        ];
        filter['where'] = {
          ...whereClause,
          [Sequelize.Op.or]: searchFields
        };

      }

      let limitOption = 10;
      let offsetOption = 0;
      if (query.page && query.page != -1) {
        let page = parseInt(query.page)
        offsetOption = (page - 1) * 10
        filter['offset'] = offsetOption
        filter['limit'] = limitOption
      }

      let { count, rows } = await models.Student.findAndCountAll({
        ...filter,
        include: {
          model: models.FeesDetails,
          attributes: ['installmentAmount','paidInstallmentAmount','pendingInstallmentAmount', 'paymentType', 'status', 'installmentDate'],
          required: false,
        },
        attributes: [
          'studentId',
          'standardId',
          'firstName',
          'lastName',
          'paymentType',
          'totalFees',
          'feesDueDate',
          'status',
        ],
      });

      const students = rows.map(student => {
        const studentData = student.dataValues;
        const totalPaidFees = student.FeesDetails
          ? student.FeesDetails.filter(fee => fee.status === 1).reduce((sum, fee) => {
            if (studentData.paymentType === 'OneTime') {
              return studentData.totalFees || 0;
            } else {
              return sum + (parseFloat(fee.paidInstallmentAmount) || 0);
            }
          }, 0)
          : 0;


        let upcomingInstallmentDate = null;
        if (studentData.paymentType === 'Installments' && student.FeesDetails) {
          const pendingInstallments = student.FeesDetails.filter(fee => fee.status === 0);
          if (pendingInstallments.length > 0) {
            const sortedInstallments = pendingInstallments.sort((a, b) => {
              return new Date(a.installmentDate).getTime() - new Date(b.installmentDate).getTime();
            });
            upcomingInstallmentDate = sortedInstallments[0]?.installmentDate || null;
          }
        }

        if (studentData.paymentType === 'OneTime' &&  student.FeesDetails &&  student.FeesDetails.length > 0) {
          const unpaidFee = student.FeesDetails.find((fee) => fee.status === 0);
          if (unpaidFee) {
            upcomingInstallmentDate = unpaidFee.installmentDate;
          }
        }

        return {
          studentId: studentData.studentId,
          standardId: studentData.standardId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          paymentType: studentData.paymentType,
          totalFees: studentData.totalFees,
          feesDueDate: upcomingInstallmentDate,
          feeStatus:studentData.FeesDetails.status,
          studentStatus: studentData.status,
          paidFees: totalPaidFees ? totalPaidFees : 0.00,
        };
      });
      return callback(null, { 'status': 'success', 'msg': httpMessages.STUDENT.STUDENT_FETCHED, code: HttpCodes['OK'], data: students, currentPage: query.page, count: count });
    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }


  async GetFeesDetailsForStudent(query: any, callback: any) {
    try {

      const feeDetails = await models.FeesDetails.findAll({
        where: { studentId: query.studentId },
        // attributes: [
        //   'feeDetailId',
        //   'installmentAmount',
        //   'installmentDate',
        //   'status',
        //   'paymentDate',
        //   'paymentType',
        //   'chequeNumber',
        //   'bankName',
        //   'onlinePaymentService',
        //   'paidIntstallmentAmount',
        //   'pendingInstallmentAmount'
        // ]
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.STUDENT.STUDENT_FETCHED, code: HttpCodes['OK'], data: feeDetails });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }


  async AddFeesDetailsForStudent(data: any, callback: any) {
    try {
      console.log(data,"d")

      const feeDetails = await models.FeesDetails.update(
        {
          paymentDate: data.paymentDate ? data.paymentDate : null,
          paymentType: data.paymentType ? data.paymentType : null,
          chequeNumber: data.chequeNumber ? data.chequeNumber : null,
          bankName: data.bankName ? data.bankName : null,
          onlinePaymentService: data.onlinePaymentService ? data.onlinePaymentService : null,
          paidInstallmentAmount: parseInt(data?.paidInstallmentAmount),
          pendingInstallmentAmount:data?.pendingInstallmentAmount,
          status: data?.status,
          CUID: data.decoded.userId,
          CDT: Date.now()
        },
        {
          where:
            { studentId: data.studentId, installmentDate: data.selectedInstallmentDate }
        },
      )

      AddActivityLog({
        module: 'FeesDetails',
        userId: data.decoded.userId,
        description: `Fees of student ${data.studentId} is Added By id  ${data.decoded.userId} is created.`
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.FEES_DETAILS.FEES_DETAILS_ADD, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }


  async EditFeesDetailsForStudent(data: any, callback: any) {
    try {
      console.log(data, "ss")

      const feeDetails = await models.FeesDetails.update(
        {
          paymentDate: data.paymentDate ? data.paymentDate : null,
          paymentType: data.paymentType ? data.paymentType : 0,
          chequeNumber: data.chequeNumber ? data.chequeNumber : null,
          bankName: data.bankName ? data.bankName : null,
          onlinePaymentService: data.onlinePaymentService ? data.onlinePaymentService : null,
          paidInstallmentAmount: parseInt(data?.paidInstallmentAmount),
          pendingInstallmentAmount:data?.pendingInstallmentAmount,
          status: data.status,
          MUID: data.decoded.userId,
          MDT: Date.now()
        },
        {
          where:
            { feeDetailId: data.feeDetailId }
        },
      )

      AddActivityLog({
        module: 'FeesDetails',
        userId: data.decoded.userId,
        description: `Fees of student ${data.studentId} is modified By id  ${data.decoded.userId}.`
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.FEES_DETAILS.FEES_DETAILS_MODIFIED, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

}