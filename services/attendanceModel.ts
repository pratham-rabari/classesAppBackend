"use strict";


const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
const { AddActivityLog } = new common();

export default class AttendanceModel {
  constructor() {
    this.AddAttendance = this.AddAttendance.bind(this)
    this.GetAttendance =this.GetAttendance.bind(this)
    this.UpdateAttendance = this.UpdateAttendance.bind(this)
    
  }

  async AddAttendance(data: any, callback: any) {
    try {

        const teacher = await models.User.findOne({ where: { userName: data.attendanceDetail[0].teacherName } });

        const attendance =  data.attendanceDetail.map(record => ({
              studentId: record.studentId,    
              isPresent: record.isPresent,  
         }))
        
      const addAtendance = await models.attendance.create({
        classId: data.classId,
        teacherId:teacher.userId,
        attendanceDetail:attendance,
        CUID: data.decoded.userId,
        CDT: Date.now()
      })
      
      AddActivityLog({
        module: 'attendence',
        userId: data.decoded.userId,
        description: `Attendence of scheduled class ${data.classId} with teacher = ${data.teacherId} is created.`
      })

      return callback(null, { status: "success", msg: httpMessages.ATTENDANCE.ATTENDENCE_CREATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error);
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetAttendance(params:any,callback: any) {
    try {

       const AttendanceOfClassId = await models.attendance.findOne({
        where:{classId:params.classId},
        attributes:[
          'attendanceDetail'
        ]
       })

       if(!AttendanceOfClassId){
        return callback(null, { status: "not-found", msg: httpMessages.ATTENDANCE.ATTENDANCE_NOT_FOUND_FOR_CLASSID, code: HttpCodes["NOT_FOUND"] });
       }
      
      return callback(null, { status: "success", msg: httpMessages.ATTENDANCE.ATTENDANCE_FETCHED,data:AttendanceOfClassId.attendanceDetail, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error);
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateAttendance(data:any,callback: any) {
    try {
   
      console.log(data)
      const teacher = await models.User.findOne({ where: { userName: data.attendanceDetail[0].teacherName } });

      const attendance = data.attendanceDetail.map(record => ({
        studentId: record.studentId,
        isPresent: record.isPresent,
        teacherId: teacher.userId
      }))

      const addAtendance = await models.attendance.update({
        attendanceDetail: attendance,
        MUID: data.decoded.userId,
        MDT: Date.now()
      },
        { where: { classId: data.classId } }
      )

      AddActivityLog({
        module: 'attendence',
        userId: data.decoded.userId,
        description: `Attendence of scheduled class ${data.classId} with teacher = ${data.teacherId} is updated.`
      })

      return callback(null, { status: "success", msg: httpMessages.ATTENDANCE.ATTENDANCE_UPDATED, code: HttpCodes["OK"] });
    } catch (error) {
      console.log(error);
      return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  
}