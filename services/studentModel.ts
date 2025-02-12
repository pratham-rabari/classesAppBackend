"use strict";


const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
import { stat } from "fs";
import { where } from "sequelize";
const { AddActivityLog } = new common();
const env = process.env.NODE_ENV || 'development';
const { Op } = require('sequelize');
const moment = require('moment-timezone');


export default class StudentModel {
  constructor() {
    this.AddStudent = this.AddStudent.bind(this)
    this.GetStudentData = this.GetStudentData.bind(this)
    this.GetStudents = this.GetStudents.bind(this)
    this.UpdateStudent = this.UpdateStudent.bind(this)
    this.DeactivateStudent = this.DeactivateStudent.bind(this)
    this.ReactivateStudent = this.ReactivateStudent.bind(this)
    this.GetStudentsByStandard = this.GetStudentsByStandard.bind(this)
    this.GetStudentAttendanceData = this.GetStudentAttendanceData.bind(this)
  }

  async AddStudent(data: any, file: any, callback: any) {
    try {
      let student = models.Student.build({
        standardId: data.standardId,
        firstName: data.firstName,
        lastName: data.lastName,
        image: file?.filename ? file?.filename : null,
        email: data.email ? data.email : null,
        phoneNo: data.phoneNo ? data.phoneNo : null,
        dob: data.dob ? data.dob : null,
        gender: data.gender ? data.gender : null,
        addmissionDate: data.addmissionDate ? data.addmissionDate : null,
        address: data.address ? data.address : null,
        fatherName: data.fatherName ? data.fatherName : null,
        motherName: data.motherName ? data.motherName : null,
        parentContactNo: data?.parentContactNo,
        emergencyContactNo: data?.emergencyContactNo,
        paymentType: data.paymentType?data.paymentType:null,
        totalFees: data.totalFees?data.totalFees:null,
        // installMentCount: data.installMentCount ? data.installMentCount : null,
        CUID: data.decoded.userId,
        CDT: Date.now()
      });

      console.log(data, "xx")
      console.log(student, "s")
      console.log(student.totalFees)
      let studentObj = await student.save();


      // if (data.paymentType == "OneTime") {

      //   if (data.feeStatus == 0) {
      //     const feeDetails = await models.FeesDetails.build({
      //       studentId: studentObj.studentId,
      //       installmentDate: data?.dueDate,
      //       installmentAmount: data?.totalFees,
      //       status: 0,
      //       CUID: data.decoded.userId,
      //       CDT: Date.now()
      //     }).save()
      //   } else {
      //     const feeDetails = await models.FeesDetails.build({
      //       studentId: studentObj.studentId,
      //       paymentDate: data?.paymentDate,
      //       paymentType: data?.feePaymentType,
      //       status: 1,
      //       CUID: data.decoded.userId,
      //       CDT: Date.now()
      //     }).save()
      //   }

      // } else {
      //   const installmentsDate = JSON.parse(data?.installmentsDate);

      //   const installmentAmounts = JSON.parse(data?.installmentAmounts);
      //   console.log(data.installmentAmounts)

      //   const feesDetails = installmentsDate?.map((date, index) => ({
      //     studentId: studentObj.studentId,
      //     installmentAmount: parseFloat(installmentAmounts[index]).toFixed(2),
      //     installmentDate: date,
      //     CUID: data.decoded.userId,
      //     CDT: Date.now()
      //   }));
      //   console.log(feesDetails, "fees")
      //   const AddFeesDetails = await models.FeesDetails.bulkCreate(feesDetails);
      // }

      console.log("hell")
      AddActivityLog({
        module: 'Students',
        userId: data.decoded.userId,
        description: `Student ${data.firstName + data.lastName} with id ${studentObj.studentId} is created.`
      })

      return callback(null, { status: "success", msg: httpMessages.STUDENT.STUDENT_ADDED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error);
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  // to get a particuler student data
  async GetStudentData(params: any, callback) {
    try {
      let student = await models.Student.findOne({
        where: { studentId: params.studentId }, attributes: [
          'studentId',
          'firstName',
          'lastName',
          'phoneNo',
          'image',
          'email',
          'motherName',
          'fatherName',
          'status',
          'address',
          'dob',
          'gender',
          'parentContactNo',
          'emergencyContactNo',
          'standardId',
          'addmissionDate',
          'paymentType',
          'totalFees',
          'feesDueDate'
        ],
      })

      // console.log(student,"s2")
      let students = student.dataValues
      const studentsData = {
        studentId: students.studentId,
        standardId: students.standardId,
        firstName: students.firstName,
        lastName: students.lastName,
        phoneNo: students.phoneNo,
        image: students.image ? process.env.ImageBaseUrl + students.image : '',
        email: students.email,
        motherName: students.motherName,
        fatherName: students.fatherName,
        status: students.status,
        address: students.address,
        dob: students.dob,
        gender: students.gender,
        parentContactNo: students.parentContactNo,
        emergencyContactNo: students.emergencyContactNo,
        addmissionDate: students.addmissionDate,
        paymentType: students.paymentType,
        totalFees: students.totalFees,
        feesDueDate: students.feesDueDate
        // standardName: student.Standard ? student.Standard.name : null 
      };

      console.log(students)

      if (student) {
        return callback(null, { status: "success", msg: httpMessages.STUDENT.STUDENT_DATA_FETCHED, code: HttpCodes["OK"], data: studentsData });
      } else {
        return callback(null, { status: "customError", msg: httpMessages.STUDENT.STUDENT_DATA_NOT_FETCHED, code: HttpCodes["BAD_REQUEST"] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateStudent(data: any, file: any, callback: any) {
    try {

      const studentRecord = await models.Student.findOne({ where: { studentId: data.studentId } });
      console.log(data, "d")
      let studentsObj = {
        firstName: data.firstName ? data.firstName : null,
        lastName: data.lastName ? data.lastName : null,
        image: file ? file.filename : studentRecord.image,
        email: data.email ? data.email : null,
        phoneNo: data.phoneNo ? data.phoneNo : null,
        dob: data.dob ? data.dob : null,
        gender: data.gender,
        addmissionDate: data.addmissionDate ? data.addmissionDate : null,
        address: data.address ? data.address : null,
        fatherName: data.fatherName ? data.fatherName : null,
        motherName: data.motherName ? data.motherName : null,
        parentContactNo: data.parentContactNo,
        emergencyContactNo: data.emergencyContactNo,
        paymentType: data?.paymentType,
        totalFees: data.totalFees,
        feesDueDate: data?.feesDueDate,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      console.log(studentsObj.totalFees, "s2")
      await models.Student.update(studentsObj, { where: { studentId: data.studentId } });

      const fstudent = await models.Student.findOne({
        where: { studentId: data.studentId },
        attributes: [
          'paymentType',
          'totalFees'
        ]
      },

      )
      console.log("fff", fstudent)
      AddActivityLog({
        module: 'Students',
        userId: data.decoded.userId,
        description: `Student ${data.firstName + data.lastName} with id = ${data.studentId} is updated.`
      })
      return callback(null, { status: "success", msg: httpMessages.STUDENT.STUDENT_UPDATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  // get all students
  async GetStudents(query: any, callback: any) {
    try {
      const { status } = query;
      console.log(query)

      const whereClause: any = {};
      console.log("query", query.standardId)

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
          {
            email: {
              [Sequelize.Op.like]: `%${query.searchKey}%`
            }
          }
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
        include: [{ model: models.Standard, attributes: ['name'] }],
        attributes: [
          'studentId',
          'standardId',
          'firstName',
          'lastName',
          'phoneNo',
          'image',
          'email',
          'motherName',
          'fatherName',
          'paymentType',
          'totalFees',
          'feesDueDate',
          'status',
          'address',
          'dob',
          'gender',
          'parentContactNo',
          'emergencyContactNo',
        ],
      });


      const students = rows.map(student => {
        const studentData = student.dataValues;
  
        return {
          studentId: studentData.studentId,
          standardId: studentData.standardId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          phoneNo: studentData.phoneNo,
          image: studentData.image ? process.env.ImageBaseUrl + studentData.image : '',
          email: studentData.email,
          motherName: studentData.motherName,
          fatherName: studentData.fatherName,
          paymentType: studentData.paymentType || null, // Ensure paymentType is mapped
          totalFees: studentData.totalFees,// Convert totalFees to float and fix formatting
          feesDueDate: studentData.feesDueDate || null, // Map feesDueDate
          status: studentData.status,
          address: studentData.address,
          dob: studentData.dob,
          gender: studentData.gender,
          parentContactNo: studentData.parentContactNo,
          emergencyContactNo: studentData.emergencyContactNo,
          standardName: student.Standard.name
        };
      });

      // let tmp = {}
      //   const students = rows.map(student => {
      //     const plainStudent = student.toJSON();
      //     tmp = {studentId: plainStudent.studentId,
      //     standardId: plainStudent.standardId,
      //     firstName: plainStudent.firstName,
      //     lastName: plainStudent.lastName,
      //     phoneNo: plainStudent.phoneNo,
      //     image: process.env.ImageBaseUrl+plainStudent.image,
      //     email: plainStudent.email,
      //     motherName: plainStudent.motherName,
      //     fatherName: plainStudent.fatherName,
      //     paymentType:plainStudent.paymentType,
      //     totalFees:plainStudent.totalFees ? plainStudent.totalFees : 0.00,
      //     feesDueDate:plainStudent.feesDueDate,
      //     status: plainStudent.status,
      //     address: plainStudent.address,
      //     dob: plainStudent.dob,
      //     gender: plainStudent.gender,
      //     parentContactNo: plainStudent.parentContactNo,
      //     emergencyContactNo: plainStudent.emergencyContactNo}
      // });

      return callback(null, { 'status': 'success', 'msg': httpMessages.STUDENT.STUDENT_FETCHED, code: HttpCodes['OK'], data: students, currentPage: query.page, count: count });
    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }


  async DeactivateStudent(data: any, params: any, callback: any) {
    try {
      console.log(data, params)
      let student = {
        status: 0,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Student.update(student, { where: { studentId: params.studentId } });
      AddActivityLog({
        module: 'Student',
        userId: data.decoded.userId,
        description: `Student with id = ${params.studentId} is deactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.STUDENT.STUDENT_DELETED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async ReactivateStudent(data: any, params: any, callback: any) {
    try {
      let student = {
        status: 1,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.Student.update(student, { where: { studentId: params.studentId } });
      AddActivityLog({
        module: 'Student',
        userId: data.decoded.userId,
        description: `Student with id = ${params.studentId} is reactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.STUDENT.STUDENT_REACTIVATE, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetStudentsByStandard(params: any, callback: any) {
    try {

      const standard = await models.Standard.findOne({ where: { name: params.standardName } });

      const students = await models.Student.findAll({
        where: { standardId: standard.standardId, status: 1 },
        attributes: [
          'studentId',
          'firstName',
          'lastName',
          'image',
          'status',
        ]
      })

      return callback(null, { status: "success", msg: httpMessages.STUDENT.STUDENT_DATA_FETCHED, code: HttpCodes["OK"], data: students });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetStudentAttendanceData(query: any, callback) {
    try {

      let standardId = query?.standardId

      const page = parseInt(query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const filter = query.filter || ""
      const subjectId = query.subjectId || ""

      console.log(query,"qqx")

      let dateFilter: any = {};

      if (filter === 'Month') {
        dateFilter = {
          startDateTime: {
            [Op.gte]: moment().startOf('month').toDate(),
            [Op.lt]: moment().endOf('month').toDate()
          }
        };
      } else if (filter === 'Week') {
        dateFilter = {
          startDateTime: {
            [Op.gte]: moment().startOf('week').toDate(),
            [Op.lt]: moment().endOf('week').toDate()
          }
        }
      }

      let mainFilter = { ...dateFilter };

      if (query.subjectId) {
        mainFilter.subjectId = query.subjectId;
      }

      if (query.standardId) {
        mainFilter.standardId = query.standardId;
      }

      let findClassByStandard = await models.ClassSchedule.findAll({
        include: [
          { model: models.Subject, attributes: ['name'] },
        ],
        where: mainFilter,
        attributes: ['classId', 'subjectId', 'startDateTime', 'endClassTime']
      })

      const classIds = findClassByStandard.map((classSchedule) => classSchedule.classId);

      if (classIds?.length == 0) {
        return callback(null, {
          status: "success",
          msg: httpMessages.STUDENT.NO_ATTENDANCE_DATA_FOR_STANDARD,
          code: HttpCodes["OK"],
          data: [],
        });
      }

      const { count, rows: classAttendance } = await models.attendance.findAndCountAll({
        include: [
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        where: {
          classId: {
            [Op.in]: classIds, // Matches any classId in the array
          },
        },
        attributes: ['classId', 'attendanceDetail', 'teacherId'],
        limit,
        offset
      })

      if (classAttendance?.length === 0) {
        return callback(null, {
          status: "success",
          msg: httpMessages.STUDENT.NO_ATTENDANCE_DATA_FOR_STANDARD,
          code: HttpCodes["OK"],
          data: [],
        });
      }

      const attendanceData = classAttendance?.map((attendance) => {

        const classInfo = findClassByStandard?.find(
          (cls) => cls.get().classId == attendance.classId
        );

        console.log(classInfo, "c")
        console.log(attendance, "i")
        const attendanceDetail = attendance?.attendanceDetail || [];
        const parsedAttendanceDetail = Array.isArray(attendanceDetail)
          ? attendanceDetail
          : JSON.parse(attendanceDetail);

        // Filter attendanceDetail by studentId
        const studentAttendance = parsedAttendanceDetail?.filter(
          (detail) => detail.studentId == query.studentId
        );

        return {
          startDateTime: classInfo?.startDateTime || null,
          subjectName: classInfo?.Subject?.name || null,
          classStartTime: classInfo?.startDateTime,
          classEndTime: classInfo?.endClassTime,
          teacher: attendance?.teacher?.userName,
          isPresent: studentAttendance[0]?.isPresent,
        };
      })

      const attendanceDataArray = attendanceData?.length > 0 ? attendanceData : []

      return callback(null, { status: "success", msg: httpMessages.STUDENT.ATTENDANCE_DATA_FETCHED_FOR_STUDENT, code: HttpCodes["OK"], data: attendanceDataArray, currentPage: page, count: count });

    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }
}
