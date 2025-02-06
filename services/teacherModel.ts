"use strict";


const models = require("./../models/index");
import bcrypt from 'bcrypt';
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
import { stat } from "fs";
const { AddActivityLog } = new common();
import { v2 as cloudinary } from 'cloudinary';
import { Op, where } from 'sequelize';
import { off } from 'process';
const env = process.env.NODE_ENV || 'development';


export default class TeacherModel {
  constructor() {
    this.AddTeacher = this.AddTeacher.bind(this)
    this.GetTeacherData = this.GetTeacherData.bind(this)
    this.UpdateTeacher = this.UpdateTeacher.bind(this)
    this.GetTeachers = this.GetTeachers.bind(this)
    this.DeactivateTeacher = this.DeactivateTeacher.bind(this)
    this.ReactivateTeacher = this.ReactivateTeacher.bind(this)
    this.GetTeacherAttendance = this.GetTeacherAttendance.bind(this)
    this.AddTeacherAttendance = this.AddTeacherAttendance.bind(this)
  }

  async AddTeacher(data: any, file: any, callback: any) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data?.password, salt);

      let teacher = models.User.build({
        userName: data.userName,
        firstName: data.firstName ? data.firstName : null,
        lastName: data.lastName ? data.lastName : null,
        image: file ? file.filename : null,
        salary: data?.salary,
        email: data.email ? data.email : null,
        password: hashedPassword ? hashedPassword : null,
        phoneNo: data.phoneNo ? data.phoneNo : null,
        dob: data.dob ? data.dob : null,
        hireDate: data.hireDate ? data.hireDate : null,
        address: data.address ? data.address : null,
        qualification: data.qualification,
        experience: data.experience,
        roleId: data.roleId,
        CUID: data.decoded.userId,
        CDT: Date.now()
      });

      let teacherObj = await teacher.save();

      AddActivityLog({
        module: 'User',
        userId: 1,
        description: `Teacher ${data.userName} with id = ${teacherObj.userId} is created.`
      })

      return callback(null, { status: "success", msg: httpMessages.TEACHER.TEACHER_ADDED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error);
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetTeacherData(params: any, callback) {
    try {
      let teacher = await models.User.findOne({
        where: { userId: params.userId }, attributes: [
          'userId',
          "userName",
          'firstName',
          'lastName',
          'phoneNo',
          'image',
          'email',
          'status',
          'salary',
          'address',
          'dob',
          'experience',
          'qualification',
          "hireDate",
          "roleId"
        ],
      })

      const techerData = {
        userId: teacher.userId,
        userName: teacher.userName,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        phoneNo: teacher.phoneNo,
        image: process.env.ImageBaseUrl + teacher.image,
        email: teacher.email,
        status: teacher.status,
        salary: teacher.salary,
        address: teacher.address,
        dob: teacher.dob,
        experience: teacher.experience,
        qualification: teacher.qualification,
        hireDate: teacher.hireDate,
        roleId: teacher.roleId
      }
      if (teacher) {
        return callback(null, { status: "success", msg: httpMessages.TEACHER.TEACHER_DATA_FETCHED, code: HttpCodes["OK"], data: techerData });
      } else {
        return callback(null, { status: "customError", msg: httpMessages.TEACHER.TEACHER_DATA_NOT_FETCHED, code: HttpCodes["BAD_REQUEST"] });
      }
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateTeacher(data: any, file: any, callback: any) {
    try {

      const teacherRecord = await models.User.findOne({ where: { userId: data.userId } });
      console.log(data, "up")
      let teacherObj = {
        userName: data.userName ? data.userName : null,
        firstName: data.firstName ? data.firstName : null,
        lastName: data.lastName ? data.lastName : null,
        image: file ? file.filename : teacherRecord.image,
        salary: data?.salary,
        email: data.email ? data.email : null,
        phoneNo: data.phoneNo ? data.phoneNo : null,
        dob: data.dob ? data.dob : null,
        hireDate: data.hireDate ? data.hireDate : null,
        address: data.address ? data.address : null,
        qualification: data?.qualification,
        experience: data?.experience,
        roleId: data?.roleId,
        MUID: data?.decoded.userId,
        MDT: Date.now()
      }
      await models.User.update(teacherObj, { where: { userId: data.userId } });
      AddActivityLog({
        module: 'User',
        userId: 1,
        description: `User ${data.firstName + data.lastName} with id = ${data.userId} is updated.`
      })
      return callback(null, { status: "success", msg: httpMessages.TEACHER.TEACHER_UPDATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  // get all teachers
  async GetTeachers(query: any, callback: any) {
    try {

      console.log(query)
      let filter = { where: {} };
      const { sortBy = 'firstName', sortOrder = 'asc', searchKey = '' } = query;

      // filter.where['userName'] = { [Sequelize.Op.ne]: 'Admin' };

      let orderCriteria = [];
      orderCriteria.push([sortBy, sortOrder.toUpperCase()]);

      filter['order'] = orderCriteria;

      if (searchKey) {
        let searchFields = [
          {
            userName: {
              [Sequelize.Op.like]: `%${query.searchKey}%`
            }
          },
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
        filter['where'][Sequelize.Op.or] = searchFields;
      }

      let limitOption = 10;
      let offsetOption = 0;
      if (query.page && query.page != -1) {
        let page = parseInt(query.page)
        offsetOption = (page - 1) * 10
        filter['offset'] = offsetOption
        filter['limit'] = limitOption
      }

      let { count, rows } = await models.User.findAndCountAll(filter, {
        attributes: [
          'userId',
          "userName",
          'firstName',
          'lastName',
          'phoneNo',
          'image',
          'email',
          'status',
          'address',
          'salary',
          'dob',
          'experience',
          'qualification',
          "hireDate",
          "roleId"
        ],
      })

      const techers = rows.map(teacher => ({
        userId: teacher.userId,
        userName: teacher.userName,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        phoneNo: teacher.phoneNo,
        image: process.env.ImageBaseUrl + teacher.image,
        email: teacher.email,
        status: teacher.status,
        salary: teacher.salary,
        address: teacher.address,
        dob: teacher.dob,
        experience: teacher.experience,
        qualification: teacher.qualification,
        hireDate: teacher.hireDate,
        roleId: teacher.roleId
      }))

      return callback(null, { 'status': 'success', 'msg': httpMessages.TEACHER.TEACHER_FETCHED, code: HttpCodes['OK'], data: techers, totalTeachers: count, currentPage: query.page, });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async DeactivateTeacher(data: any, params: any, callback: any) {
    try {
      let teacher = {
        status: 0,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.User.update(teacher, { where: { userId: params.userId } });
      AddActivityLog({
        module: 'user',
        userId: data.decoded.userId,
        description: `Teacher with id = ${params.userId} is deactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.TEACHER.TEACHER_DELETED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async ReactivateTeacher(data: any, params: any, callback: any) {
    try {
      let teacher = {
        status: 1,
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      await models.User.update(teacher, { where: { userId: params.userId } });
      AddActivityLog({
        module: 'User',
        userId: data.decoded.userId,
        description: `Teacher with id = ${params.studentId} is reactivated by userId ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.TEACHER.TEACHER_REACTIVATE, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async AddTeacherAttendance(data: any, callback: any) {
    try {
      const { teacherId, attendanceData } = data;

      console.log(data,"dd")
      for (const attendance of attendanceData) {
        console.log(attendance)
        const { classId, attendanceStatus } = attendance;
  
        if (classId == null || attendanceStatus == null) {
          continue; // Skip invalid entries
        }
  
        await models.teacherAttendance.update(
          { attendanceStatus }, // Fields to update
          {
            where: {
            teacherId, // Ensure teacherId matches
            classId,   // Ensure classId matches
            },
          }
        );
      }
      AddActivityLog({
        module: 'teacherAttendance',
        userId: data.decoded.userId,
        description: `Teacher with id = ${data.teacherId} attendance for class ${data?.classId} is added by ${data.decoded.userId}`
      })
      return callback(null, { status: "success", msg: httpMessages.ATTENDANCE.ATTENDENCE_CREATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetTeacherAttendance(query: any, callback: any) {
    try {

      const page = parseInt(query.page) || 1; // Current page (default: 1)
      const limit = 10; // Items per page (default: 10)
      const offset = (page - 1) * limit; // Offset for SQL query


      let getAttendance = await models.teacherAttendance.findAll({
        where: { teacherId: query?.teacherId },
        attributes: ['attendanceStatus', 'classId']
      })

      console.log(query,"qq")

      const classIds = getAttendance?.map((classes) => classes.classId);

      if (classIds?.length == 0) {
        return callback(null, {
          status: "success",
          msg: httpMessages.ATTENDANCE.ATTENDANC_DATA_NOT_FOUND_FOR_TEACHER,
          code: HttpCodes["OK"],
          data: [],
        });
      }

      const {count,rows:classDetails}  = await models.ClassSchedule.findAndCountAll({
        where: { classId: { [Op.in]: classIds, }, },
        include:[
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
        ],
        attibutes:['classId','startDateTime','endClassTime','subjectId','standardId'],
        limit:limit,
        offset:offset
      })

      console.log(classDetails)

      let teacherAttendanceData = classDetails.map(classes => {

        const attendanceInfo =  getAttendance?.find(
            (cls) => cls.get().classId == classes.classId
        );

        return {
            classId:classes?.classId,
            startDateTime:classes?.startDateTime,
            endClassTime:classes?.endClassTime,
            subjectName:classes?.Subject?.name,
            standardName:classes?.Standard?.name,
            attendanceStatus:attendanceInfo?.attendanceStatus
        }
    })

    console.log(count,"xxx")

      return callback(null, { status: "success", msg: httpMessages.ATTENDANCE.ATTENDANCE_FETCHED, code: HttpCodes["OK"], data:teacherAttendanceData,count:count,currentPage:page });
    } catch (error) {
      console.log(error)
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

}  
