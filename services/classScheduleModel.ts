"use strict";


const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
import { RRule, Weekday } from 'rrule'
import { Op, where } from "sequelize";
import { Where } from "sequelize/types/utils";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { type } from "os";
const { AddActivityLog } = new common();
const moment = require('moment-timezone');
const cron = require('node-cron');


export default class StudentModel {
  constructor() {
    this.AddClass = this.AddClass.bind(this)
    this.GetClasses = this.GetClasses.bind(this)
    this.DeleteClass = this.DeleteClass.bind(this)
    this.GetClass = this.GetClass.bind(this)
    this.UpdateClass = this.UpdateClass.bind(this)
    this.GetTeacherClasses = this.GetTeacherClasses.bind(this)
    this.UpdateClassStatus = this.UpdateClassStatus.bind(this)
    this.GetClassBySearch = this.GetClassBySearch.bind(this)
    this.GetClassBySearchForTeacher = this.GetClassBySearchForTeacher.bind(this)
    this.GetTeacherClassesForCalendar = this.GetTeacherClassesForCalendar.bind(this)
    this.GetClassesForCalendar = this.GetClassesForCalendar.bind(this)
    this.GetClassRules = this.GetClassRules.bind(this)
    this.GetClassRulesById = this.GetClassRulesById.bind(this)
    this.UpdateClassRule = this.UpdateClassRule.bind(this)
  }

  async AddClass(data: any, callback?: (err: any, result: any) => void) {
    try {
      const { freq, startDateTime, endDateTime, byweekday, duration, teacher, standard, subject, startTime, endTime } = data;
      // freq:error pending
      // note: added timezone in models/index.ts
      const weekday = byweekday?.length === 1 ? [+byweekday[0]] : byweekday.map((item: string | number) => +item);
      const startdateString = startDateTime;
      const endDateString = endDateTime
      const localstartDate = moment.utc(startdateString).toDate();
      const localendDate = moment.utc(endDateString).toDate();
      const CUID = data.CUID || data.decoded?.userId; // Use data.CUID if provided, otherwise fallback to the decoded user ID

      console.log(localstartDate, localendDate)
      const rule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: localstartDate,
        until: localendDate,
        byweekday: weekday
      })

      console.log("after", rule)

      const dates = rule.all()

      let classtimeId;

      function calculateEndTime(date, duration) {
        const durationParts = duration.match(/(\d+)\s*hours\s*(\d*)\s*minutes*/);
        const hours = parseInt(durationParts[1] || 0);
        const minutes = parseInt(durationParts[2] || 0);

        const endClassTime = new Date(date);
        endClassTime.setHours(endClassTime.getHours() + hours);
        endClassTime.setMinutes(endClassTime.getMinutes() + minutes);
        return endClassTime;
      }

      for (const date of dates) {
        const endClass = calculateEndTime(date, data.duration)

        const overlappingClasses = await models.ClassSchedule.findOne({
          where: {
            teacherId: teacher,
            [Sequelize.Op.or]: [
              {
                startDateTime: {
                  [Sequelize.Op.between]: [date, endClass]
                }
              },
              {
                endClassTime: {
                  [Sequelize.Op.between]: [date, endClass]
                }
              },
              {
                [Sequelize.Op.and]: [
                  {
                    startDateTime: {
                      [Sequelize.Op.lt]: date
                    }
                  },
                  {
                    endClassTime: {
                      [Sequelize.Op.gt]: endClass
                    }
                  }
                ]
              }
            ]
          }
        });

        if (overlappingClasses) {
          return callback(null, { status: 'customError', msg: httpMessages.CLASSSCHEDULE.CLASS_OVERLAP, code: HttpCodes['BAD_REQUEST'] })
        }


        const overlappingClassInStandard = await models.ClassSchedule.findOne({
          where: {
            standardId: standard,
            [Sequelize.Op.or]: [
              {
                startDateTime: {
                  [Sequelize.Op.between]: [date, endClass]
                }
              },
              {
                endClassTime: {
                  [Sequelize.Op.between]: [date, endClass]
                }
              },
              {
                [Sequelize.Op.and]: [
                  {
                    startDateTime: {
                      [Sequelize.Op.lt]: date
                    }
                  },
                  {
                    endClassTime: {
                      [Sequelize.Op.gt]: endClass
                    }
                  }
                ]
              }
            ]
          }
        });

        if (overlappingClassInStandard) {
          return callback(null, { status: 'customError', msg: httpMessages.CLASSSCHEDULE.CLASS_OVERLAP_STANDARD, code: HttpCodes['BAD_REQUEST'] })
        }
      }

      const startdate = data.startDateTime.slice(0, 10)

      const newRule = await models.ClassRules.build({
        recurrenceTime: `${startdate} to ${data.endDateTime.slice(0, 10)}`,
        startDate: startdate,
        endDate: data.endDateTime.slice(0, 10),
        classTime: `${data.startTime} to ${data.endTime}`,
        duration: data.duration,
        weekDays: data.byweekday.join(','),
        teacherId: data.teacher,
        standardId: data.standard,
        subjectId: data.subject,
        CUID: CUID,
        CDT: Date.now()
      })
      await newRule.save()

      const classRuleId = newRule.classRuleId;

      for (const date of dates) {
        const endClass = calculateEndTime(date, data.duration)
        const startdate = data.startDateTime.slice(0, 10)
        let classtime = await models.ClassSchedule.build({
          startDateTime: date,
          standardId: data.standard,
          recurrenceTime: `${startdate} to ${data.endDateTime}`,
          endClassTime: endClass,
          duration: data.duration,
          weekDays: data.byweekday.join(','),
          teacherId: data.teacher,
          subjectId: data.subject,
          classRuleId: classRuleId,
          CUID: CUID,
          CDT: Date.now()
        });
        let save = await classtime.save()

        const creteAttendanceEntryForTeacher = await models.teacherAttendance.build({
            classId:save?.classId,
            teacherId:save?.teacherId
        })

        let attendance = await creteAttendanceEntryForTeacher.save()

        classtimeId = save
      }


      AddActivityLog({
        module: 'ClassSchedule',
        userId: CUID,
        description: `class ${data.firstName + data.lastName} with id = ${classtimeId?.classId} is created.`
      })

      const success = { status: "success", msg: httpMessages.CLASSSCHEDULE.CLASS_CREATED, code: HttpCodes["OK"] };
      return callback ? callback(null, success) : Promise.resolve(success);
    } catch (error) {
      console.log(error);
      const failure = { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] };
      return callback ? callback(null, failure) : Promise.reject(failure);
    }
  }

  async GetClasses(query: any, callback: any) {
    try {

      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const filter = query.filter || '';
      const sort = query.sort || '';
      const sortOrder = query.sortOrder || '';


      let dateFilter = {};

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
        };
      } else if (filter === 'Day') {
        const startOfDay = moment().tz('Asia/Kolkata').startOf('day').toDate();
        const endOfDay = moment().tz('Asia/Kolkata').endOf('day').toDate();
        dateFilter = {
          startDateTime: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay
          }
        };
      }
       console.log(dateFilter)
      console.log(query)
      let orderArray = [];

      // Conditionally add sorting based on the provided sort field
      if (sort && sort === 'Standard') {
        orderArray.push([models.Standard, 'standardIndex', sortOrder]);
      } else if (sort && sort === 'Teacher') {
        orderArray.push([{ model: models.User, as: 'teacher' }, 'userName', sortOrder]);
      } else if (sort && sort === 'Subject') {
        orderArray.push([models.Subject, 'name', sortOrder]);
      } else if (sort && sort === 'Date') {
        orderArray.push(['startDateTime', sortOrder]);
      }

      // Fallback ordering logic if no specific sort field is provided
      if (orderArray.length === 0) {
        orderArray = [
          ['startDateTime', 'DESC']
        ];
      }

      console.log(orderArray)
      console.log(sortOrder)

      let { count, rows } = await models.ClassSchedule.findAndCountAll({
        include: [
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        where: dateFilter ? dateFilter : "",
        order: orderArray,
        attributes: [
          'classId',
          'startDateTime',
          'duration',
          'weekDays',
          'status',
          'teacherId',
          'standardId',
          'subjectId',
          'endClassTime'
        ],
        limit: limit,
        offset: offset
      })
      const classes = rows.map(classSchedule => ({
        classId: classSchedule.classId,
        startDateTime: classSchedule.startDateTime,
        duration: classSchedule.duration,
        weekDays: classSchedule.weekDays,
        status: classSchedule.status,
        endClassTime: classSchedule.endClassTime,
        standardName: classSchedule.Standard.name,
        subjectName: classSchedule.Subject.name,
        teacherName: classSchedule.teacher.userName
      }));

      console.log(classes,"cs")
      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_FETCHED, code: HttpCodes['OK'], data: classes, totalClasses: count, currentPage: page });

    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetClassesForCalendar(query: any, callback: any) {
    try {

      let classes = await models.ClassSchedule.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('startDateTime')), query.year), // Filter by year
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('startDateTime')), query.month) // Filter by month
          ],
        },
        include: [
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        attributes: [
          'classId',
          'startDateTime',
          'duration',
          'weekDays',
          'status',
          'teacherId',
          'standardId',
          'subjectId',
          'endClassTime'
        ],
      })

      let formattedClasses = classes.map(classItem => ({
        classId: classItem.classId,
        startDateTime: classItem.startDateTime,
        duration: classItem.duration,
        weekDays: classItem.weekDays,
        status: classItem.status,
        endClassTime: classItem.endClassTime,
        standardName: classItem.Standard?.name,
        subjectName: classItem.Subject?.name,
        teacherName: classItem.teacher?.userName

      }));
      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_FETCHED, code: HttpCodes['OK'], data: formattedClasses });

    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetClass(data: any, params: any, callback: any) {
    try {
      let GetClass = await models.ClassSchedule.findOne({
        where: { classId: params.classId }
      })

      const standard = await models.Standard.findOne({ where: { standardId: GetClass.standardId } });
      const subject = await models.Subject.findOne({ where: { subjectId: GetClass.subjectId } });
      const teacher = await models.User.findOne({ where: { userId: GetClass.teacherId } });

      const GetClassWithName = {
        startDateTime: GetClass.startDateTime,
        duration: GetClass.duration,
        endTime: GetClass.endClassTime,
        standardName: standard?.name,
        subjectName: subject?.name,
        teacherName: teacher?.userName,
      }

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.GET_CLASS, data: GetClassWithName, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }


  async GetClassBySearch(query: any, callback: any) {
    try {

      const searchTerm = query.search || '';
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const filter = query.filter || '';

      let dateFilter = {};

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
        };
      } else if (filter === 'Day') {
        const startOfDay = moment().tz('Asia/Kolkata').startOf('day').toDate();
        const endOfDay = moment().tz('Asia/Kolkata').endOf('day').toDate();
        dateFilter = {
          startDateTime: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay
          }
        };
      }

      let whereCondition: any = {
        [Op.or]: [
          { '$teacher.userName$': { [Op.like]: `%${searchTerm}%` } },
          { '$Standard.name$': { [Op.like]: `%${searchTerm}%` } },
          { '$Subject.name$': { [Op.like]: `%${searchTerm}%` } },
        ],
        ...dateFilter
      }

      let include: any = [
        { model: models.Standard, attributes: ['name'] },
        { model: models.Subject, attributes: ['name'] },
        { model: models.User, as: 'teacher', attributes: ['userName'] }
      ]
      let { count, rows } = await models.ClassSchedule.findAndCountAll({
        where: whereCondition,
        include: include,
        limit: limit,
        offset: offset
      });

      const classesWithNames = rows?.map(classSchedule => ({
        classId: classSchedule.classId,
        startDateTime: classSchedule.startDateTime,
        weekDays: classSchedule.weekDays,
        status: classSchedule.status,
        endClassTime: classSchedule.endClassTime,
        standardName: classSchedule.Standard ? classSchedule.Standard.name : null,
        subjectName: classSchedule.Subject ? classSchedule.Subject.name : null,
        teacherName: classSchedule.teacher ? classSchedule.teacher.userName : null
      }));

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.GET_CLASS, data: classesWithNames, totalClasses: count, currentPage: page, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetClassBySearchForTeacher(query: any, callback: any) {
    try {

      const searchTerm = query.search || '';
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const filter = query.filter;
      const teacherId = query.teacherId ? query.teacherId : ''

      let whereCondition: any = {
        teacherId: teacherId,
        [Op.or]: [
          { '$teacher.userName$': { [Op.like]: `%${searchTerm}%` } },
          { '$Standard.name$': { [Op.like]: `%${searchTerm}%` } },
          { '$Subject.name$': { [Op.like]: `%${searchTerm}%` } },
        ],
      }

      let include: any = [
        { model: models.Standard, attributes: ['name'] },
        { model: models.Subject, attributes: ['name'] },
        { model: models.User, as: 'teacher', attributes: ['userName'] }
      ]

      let { count, rows } = await models.ClassSchedule.findAndCountAll({
        where: whereCondition,
        include: include,
        limit: limit,
        offset: offset
      });

      const classesWithNames = rows?.map(classSchedule => ({
        classId: classSchedule.classId,
        startDateTime: classSchedule.startDateTime,
        weekDays: classSchedule.weekDays,
        status: classSchedule.status,
        endClassTime: classSchedule.endClassTime,
        standardName: classSchedule.Standard ? classSchedule.Standard.name : null,
        subjectName: classSchedule.Subject ? classSchedule.Subject.name : null,
        teacherName: classSchedule.teacher ? classSchedule.teacher.userName : null
      }));

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.GET_CLASS, data: classesWithNames, totalClasses: count, currentPage: page, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateClass(data: any, callback: any) {
    try {

      const existingClass = await models.ClassSchedule.findOne({
        where: { classId: data.classId }
      });


      const UpdateClass = {
        startDateTime: moment.utc(data.startDateTime).tz('Asia/Kolkata').format(),
        duration: data.duration,
        standardId: data.standardId !== undefined ? data.standardId : existingClass.standardId,
        subjectId: data.subjectId !== undefined ? data.subjectId : existingClass.subjectId,
        teacherId: data.teacherId,
        endClassTime: moment.utc(data.endClassTime).tz('Asia/Kolkata').format(),
        MUID: data.decoded.userId,
        MDT: Date.now()
      }
      console.log("up", UpdateClass)

      const overlappingClasses = await models.ClassSchedule.findOne({
        where: {
          teacherId: data.teacherId,
          classId: {
            [Sequelize.Op.not]: data.classId
          },
          [Sequelize.Op.or]: [
            {
              startDateTime: {
                [Sequelize.Op.between]: [UpdateClass.startDateTime, UpdateClass.endClassTime]
              }
            },
            {
              endClassTime: {
                [Sequelize.Op.between]: [UpdateClass.startDateTime, UpdateClass.endClassTime]
              }
            },
            {
              [Sequelize.Op.and]: [
                {
                  startDateTime: {
                    [Sequelize.Op.lt]: UpdateClass.startDateTime
                  }
                },
                {
                  endClassTime: {
                    [Sequelize.Op.gt]: UpdateClass.endClassTime
                  }
                }
              ]
            }
          ]
        }
      });

      if (overlappingClasses) {
        return callback(null, { status: 'customError', msg: httpMessages.CLASSSCHEDULE.CLASS_OVERLAP, code: HttpCodes['BAD_REQUEST'] })
      }

      const overlappingClassesInStandard = await models.ClassSchedule.findOne({
        where: {
          standardId: data.standardId !== undefined ? data.standardId : existingClass.standardId,
          classId: {
            [Sequelize.Op.not]: data.classId
          },
          [Sequelize.Op.or]: [
            {
              startDateTime: {
                [Sequelize.Op.between]: [UpdateClass.startDateTime, UpdateClass.endClassTime]
              }
            },
            {
              endClassTime: {
                [Sequelize.Op.between]: [UpdateClass.startDateTime, UpdateClass.endClassTime]
              }
            },
            {
              [Sequelize.Op.and]: [
                {
                  startDateTime: {
                    [Sequelize.Op.lt]: UpdateClass.startDateTime
                  }
                },
                {
                  endClassTime: {
                    [Sequelize.Op.gt]: UpdateClass.endClassTime
                  }
                }
              ]
            }
          ]
        }
      });

      if (overlappingClassesInStandard) {
        console.log("yyyyy", overlappingClassesInStandard)
        return callback(null, { status: 'customError', msg: httpMessages.CLASSSCHEDULE.CLASS_OVERLAP_STANDARD, code: HttpCodes['BAD_REQUEST'] })
      }

      let a = await models.ClassSchedule.update(UpdateClass, { where: { classId: data.classId } })
      console.log(a)

      AddActivityLog({
        module: 'ClassSchedule',
        userId: data.decoded?.userId,
        description: `class ${data.firstName + data.lastName} with id = ${data.classId} is updated.`
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_UPDATED, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetTeacherClasses(query: any, params: any, callback: any) {
    console.log("heollo ttt")
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const filter = query.filter || '';
      const date = query.date || ''
      const sort = query.sort || ''
      const sortOrder = query.sortOrder || ''

      // Initialize the whereConditions with no specific date filter
      let dateFilter = {};

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
        };
      } else if (filter === 'Day') {
        dateFilter = {
          startDateTime: {
            [Op.gte]: moment().startOf('day').toDate(),
            [Op.lt]: moment().endOf('day').toDate()
          }
        };
      } else if (date) {
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        dateFilter = {
          startDateTime: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay
          }
        };
      }


      let condition = {
        teacherId: params.teacherId,
        ...dateFilter
      }

      let orderArray = [];

      // Conditionally add sorting based on the provided sort field
      if (sort && sort === 'Standard') {
        orderArray.push([models.Standard, 'name', sortOrder]);
      } else if (sort && sort === 'Teacher') {
        orderArray.push([{ model: models.User, as: 'teacher' }, 'userName', sortOrder]);
      } else if (sort && sort === 'Subject') {
        orderArray.push([models.Subject, 'name', sortOrder]);
      } else if (sort && sort === 'Date') {
        orderArray.push(['startDateTime', sortOrder]);
      }

      // Fallback ordering logic if no specific sort field is provided
      if (orderArray.length === 0) {
        orderArray = [
          [Sequelize.literal(`CASE 
      WHEN startDateTime = CURDATE() THEN 0 
      WHEN startDateTime > CURDATE() THEN 1 
      ELSE 2 
    END`), 'ASC'],
          [Sequelize.literal(`ABS(DATEDIFF(CURDATE(), startDateTime ))`), 'ASC']
        ];
      }

      let { count, rows } = await models.ClassSchedule.findAndCountAll({
        include: [
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        order: orderArray,
        where: condition,
        attributes: [
          'classId',
          'startDateTime',
          'duration',
          'weekDays',
          'status',
          'teacherId',
          'standardId',
          'subjectId',
          'endClassTime'
        ],
        limit: limit,
        offset: offset
      })

      const classesWithNames = rows.map(classSchedule => ({
        classId: classSchedule.classId,
        startDateTime: classSchedule.startDateTime,
        duration: classSchedule.duration,
        weekDays: classSchedule.weekDays,
        status: classSchedule.status,
        endClassTime: classSchedule.endClassTime,
        standardName: classSchedule.Standard.name,
        subjectName: classSchedule.Subject.name,
        teacherName: classSchedule.teacher.userName
      }));
      console.log(query?.page,"page")

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_FETCHED, data: classesWithNames, totalClasses: count, currentPage: page, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetTeacherClassesForCalendar(query: any, callback: any) {
    try {

      let classesForTeacher = await models.ClassSchedule.findAll({
        where: {
          teacherId: query.teacherId,
          [Op.and]: [
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('startDateTime')), query.year), // Filter by year
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('startDateTime')), query.month) // Filter by month
          ],
        },
        include: [
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        attributes: [
          'classId',
          'startDateTime',
          'duration',
          'weekDays',
          'status',
          'teacherId',
          'standardId',
          'subjectId',
          'endClassTime'
        ],
      })

      let formattedClasses = classesForTeacher.map(classItem => ({
        classId: classItem.classId,
        startDateTime: classItem.startDateTime,
        duration: classItem.duration,
        weekDays: classItem.weekDays,
        status: classItem.status,
        endClassTime: classItem.endClassTime,
        standardName: classItem.Standard?.name,
        subjectName: classItem.Subject?.name,
        teacherName: classItem.teacher?.userName
      }));

      console.log(formattedClasses)
      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_FETCHED, data: formattedClasses, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async DeleteClass(data: any, params: any, callback: any) {
    try {
      let DeletedClass = await models.ClassSchedule.destroy(
        {
          where: { classId: params.classId }
        }
      )

      AddActivityLog({
        module: 'ClassSchedule',
        userId: data.decoded?.userId,
        description: `class ${data.firstName + data.lastName} with id = ${DeletedClass.classId} is deleted.`
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_DELETED, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateClassStatus(data: any, callback: any) {
    try {

      let UpdateClassStatus = {
        status: data.status
      }

      await models.ClassSchedule.update(UpdateClassStatus, { where: { classId: data.classId } })

      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_STATUS_UPDATED, code: HttpCodes['OK'] });
    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetClassRules(query: any, callback: any) {
    try {

      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      let filter = { where: whereClause };
      const { sortBy = 'startDate', sortOrder = 'desc', searchKey = '' } = query;
      
      let orderCriteria = [];
           
      if (sortBy === 'standard') {
        orderCriteria.push([
          Sequelize.literal('CAST(`Standard`.`standardIndex` AS UNSIGNED)'), // Cast as numeric for sorting
          sortOrder.toUpperCase()
        ]);
      } else if (sortBy === 'subject') {
        orderCriteria.push([{ model: models.Subject, as: 'Subject' }, 'name', sortOrder.toUpperCase()]);
      } else if (sortBy === 'teacher') {
        orderCriteria.push([{ model: models.User, as: 'teacher' }, 'userName', sortOrder.toUpperCase()]);
      } else {
        // Default sorting by fields in the main table
        orderCriteria.push([sortBy, sortOrder.toUpperCase()]);
      }
      
      filter['order'] = orderCriteria;
      
      console.log(searchKey)
    
      if (searchKey) {                 
       filter['where'] = {
          ...whereClause,
          [Sequelize.Op.or] : [
            { '$Standard.name$': { [Sequelize.Op.like]: `%${searchKey}%` } }, // Search by Standard name
            { '$Subject.name$': { [Sequelize.Op.like]: `%${searchKey}%` } },   // Search by Subject name
            { '$teacher.userName$': { [Sequelize.Op.like]: `%${searchKey}%` } } // Search by Teacher username
          ],
        };

      }

     

      let { count, rows } = await models.ClassRules.findAndCountAll({
        ...filter,
        include: [
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        attributes: [
          'classRuleId',
          'startDate',
          'endDate',
          'weekDays',
          'classTime',
          'weekDays',
          'teacherId',
          'standardId',
          'subjectId',
        ],
        limit: limit,
        offset: offset
      })

      let formattedClassRules = rows.map(classrule => ({
        classRuleId: classrule.classRuleId,
        startDate: classrule.startDate,
        endDate: classrule.endDate,
        weekDays: classrule.weekDays,
        classTime: classrule.classTime,
        standardName: classrule.Standard?.name,
        subjectName: classrule.Subject?.name,
        teacherName: classrule.teacher?.userName
      }));


      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_FETCHED, data: formattedClassRules, totalRules: count,currentPage: page, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetClassRulesById(query: any, callback: any) {
    try {

      let classRuleById = await models.ClassRules.findOne({
        where: { classRuleId: query.classRuleId },
        include: [
          { model: models.Standard, attributes: ['name'] },
          { model: models.Subject, attributes: ['name'] },
          { model: models.User, as: 'teacher', attributes: ['userName'] }
        ],
        attributes: [
          'classRuleId',
          'startDate',
          'endDate',
          'weekDays',
          'classTime',
          'weekDays',
          'teacherId',
          'standardId',
          'subjectId',
        ],
      })

      let formattedClassRules = {
        classRuleId: classRuleById.classRuleId,
        startDate: classRuleById.startDate,
        endDate: classRuleById.endDate,
        weekDays: classRuleById.weekDays,
        classTime: classRuleById.classTime,
        standardName: classRuleById.Standard?.name,
        subjectName: classRuleById.Subject?.name,
        teacherName: classRuleById.teacher?.userName
      };


      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_FETCHED, data: formattedClassRules, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async UpdateClassRule(data: any, callback: any) {

    try {
      let classesWithClassRuleId = await models.ClassSchedule.findAll({
        where: { classRuleId: data.classRuleId }
      })

      let ClassRule = await models.ClassRules.findOne({
        where: { classRuleId: data.classRuleId }
      })
      console.log(ClassRule)

      let previousEndDate = ClassRule.endDate
      const startDate = data.startDateTime.slice(0, 10)
      const endDate = data.endDateTime.slice(0, 10)
      const currentDate = moment().format('YYYY-MM-DD');
      console.log("date", currentDate);

      const classData = {
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        byweekday: data.byweekday,
        duration: data.duration,
        teacher: data.teacherId,
        standard: data.standardId,
        subject: data.subjectId,
        startTime: data.startTime,
        endTime: data.endTime,
        CUID: data.decoded?.userId,
        classRuleId: data.classRuleId
      }

      const result = await this.AddClassForClassRule(classData);

      if (result.status === 'error') {
        return callback(null, {
          status: 'customError',
          msg: result.message || httpMessages.SOMETHING_WENT_WRONG,
          code: HttpCodes['BAD_REQUEST'],
        });
      }


      const deletedclass = await models.ClassSchedule.destroy({
        where: {
          classRuleId: data.classRuleId,
          [Op.and]: [
            Sequelize.where(Sequelize.fn('DATE', Sequelize.col('startDateTime')), {
              [Op.between]: [currentDate, previousEndDate]
            })
          ]
        }
      });
      console.log(deletedclass)

      // Step 3: Remove extra classes if the end date has changed (ignoring time)
      if (endDate && endDate !== previousEndDate) {
        const extendedclass = await models.ClassSchedule.destroy({
          where: {
            classRuleId: data.classRuleId,
            [Op.and]: [
              Sequelize.where(Sequelize.fn('DATE', Sequelize.col('startDateTime')), {
                [Op.gt]: endDate
              })
            ]
          }
        });
        console.log("ex", extendedclass)
      }

      const remainingClasses = await models.ClassSchedule.update(
        { classRuleId: null }, // Set classRuleId to null
        { where: { classRuleId: data.classRuleId } } // Specify the condition
      );


      // delete previous rule and make new rule
      const deleteRule = await models.ClassRules.destroy({
        where: { classRuleId: data.classRuleId }
      })


      return callback(null, { 'status': 'success', 'msg': httpMessages.CLASSSCHEDULE.CLASS_RULE_UPDATED, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error)
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async AddClassForClassRule(data: any) {
    try {
      const { freq, startDateTime, endDateTime, byweekday, duration, teacher, standard, subject, startTime, endTime } = data;

      const weekday = byweekday?.length === 1 ? [+byweekday[0]] : byweekday.map((item: string | number) => +item);
      const startdateString = startDateTime;
      const endDateString = endDateTime;
      const localstartDate = moment.utc(startdateString).toDate();
      const localendDate = moment.utc(endDateString).toDate();
      const CUID = data.CUID || data.decoded?.userId;

      const rule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: localstartDate,
        until: localendDate,
        byweekday: weekday,
      });

      const dates = rule.all();

      function calculateEndTime(date: Date, duration: string) {
        const durationParts = duration.match(/(\d+)\s*hours\s*(\d*)\s*minutes*/);
        const hours = parseInt(durationParts[1] || '0');
        const minutes = parseInt(durationParts[2] || '0');

        const endClassTime = new Date(date);
        endClassTime.setHours(endClassTime.getHours() + hours);
        endClassTime.setMinutes(endClassTime.getMinutes() + minutes);
        return endClassTime;
      }

      for (const date of dates) {
        const endClass = calculateEndTime(date, data.duration);

        const overlappingClasses = await models.ClassSchedule.findOne({
          where: {
            teacherId: teacher,
            classRuleId: {
              [Sequelize.Op.not]: data.classRuleId, // Exclude rows with the given ClassRuleId
            },
            [Sequelize.Op.or]: [
              {
                startDateTime: {
                  [Sequelize.Op.between]: [date, endClass],
                },
              },
              {
                endClassTime: {
                  [Sequelize.Op.between]: [date, endClass],
                },
              },
              {
                [Sequelize.Op.and]: [
                  {
                    startDateTime: {
                      [Sequelize.Op.lt]: date,
                    },
                  },
                  {
                    endClassTime: {
                      [Sequelize.Op.gt]: endClass,
                    },
                  },
                ],
              },
            ],
          },
        });

        if (overlappingClasses) {
          return { status: 'error', message: httpMessages.CLASSSCHEDULE.CLASS_OVERLAP };
        }

        const overlappingClassInStandard = await models.ClassSchedule.findOne({
          where: {
            standardId: standard,
            classRuleId: {
              [Sequelize.Op.not]: data.classRuleId, // Exclude rows with the given ClassRuleId
            },
            [Sequelize.Op.or]: [
              {
                startDateTime: {
                  [Sequelize.Op.between]: [date, endClass],
                },
              },
              {
                endClassTime: {
                  [Sequelize.Op.between]: [date, endClass],
                },
              },
              {
                [Sequelize.Op.and]: [
                  {
                    startDateTime: {
                      [Sequelize.Op.lt]: date,
                    },
                  },
                  {
                    endClassTime: {
                      [Sequelize.Op.gt]: endClass,
                    },
                  },
                ],
              },
            ],
          },
        });

        if (overlappingClassInStandard) {
          return { status: 'error', message: httpMessages.CLASSSCHEDULE.CLASS_OVERLAP_STANDARD };
        }
      }

      const newRule = await models.ClassRules.build({
        recurrenceTime: `${data.startDateTime.slice(0, 10)} to ${data.endDateTime.slice(0, 10)}`,
        startDate: data.startDateTime.slice(0, 10),
        endDate: data.endDateTime.slice(0, 10),
        classTime: `${data.startTime} to ${data.endTime}`,
        duration: data.duration,
        weekDays: data.byweekday.join(','),
        teacherId: data.teacher,
        standardId: data.standard,
        subjectId: data.subject,
        CUID: CUID,
        CDT: Date.now(),
      });
      await newRule.save();

      const classRuleId = newRule.classRuleId;

      for (const date of dates) {
        const endClass = calculateEndTime(date, data.duration);
        const startdate = data.startDateTime.slice(0, 10);
        let classtime = await models.ClassSchedule.build({
          startDateTime: date,
          standardId: data.standard,
          recurrenceTime: `${startdate} to ${data.endDateTime}`,
          endClassTime: endClass,
          duration: data.duration,
          weekDays: data.byweekday.join(','),
          teacherId: data.teacher,
          subjectId: data.subject,
          classRuleId: classRuleId,
          CUID: CUID,
          CDT: Date.now(),
        });
        await classtime.save();
      }

      return { status: 'success', message: httpMessages.CLASSSCHEDULE.CLASS_CREATED };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: httpMessages.SOMETHING_WENT_WRONG };
    }
  }

  // changeClassStatus() {
  //   cron.schedule('*/5 * * * *', async () => {
  //     try {
  //       const now = new Date();

  //       // Create a new Date object and add 5 hours and 30 minutes
  //       const nowPlus5Hours30Minutes = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);

  //       // Format the date and time
  //       const day = nowPlus5Hours30Minutes.getDate().toString().padStart(2, '0');
  //       const month = (nowPlus5Hours30Minutes.getMonth() + 1).toString().padStart(2, '0');
  //       const year = nowPlus5Hours30Minutes.getFullYear();

  //       const hours = nowPlus5Hours30Minutes.getHours().toString().padStart(2, '0');
  //       const minutes = nowPlus5Hours30Minutes.getMinutes().toString().padStart(2, '0');
  //       const seconds = nowPlus5Hours30Minutes.getSeconds().toString().padStart(2, '0');
  //       const milliseconds = nowPlus5Hours30Minutes.getMilliseconds().toString().padStart(3, '0');

  //       const formattedDate = `${year}-${month}-${day}`;
  //       const formattedTime = `${hours}:${minutes}:${seconds}`;
  //       const currentDateTime = `${formattedDate} ${formattedTime}`;

  //       console.log(currentDateTime); // Output: 2024-09-21 20:38:57.000
  //       // Update class statuses based on startDateTime and endClassTime
  //       let completed = await models.ClassSchedule.update(
  //         { status: 'Completed' },
  //         {
  //           where: {
  //             endClassTime: {
  //               [Sequelize.Op.lt]: currentDateTime
  //             },
  //             status: 'Continue' //remove
  //           }
  //         }
  //       );

  //       console.log("com", completed)

  //       let current = await models.ClassSchedule.update(
  //         { status: 'Continue' },
  //         {
  //           where: {
  //             startDateTime: {
  //               [Sequelize.Op.lt]: currentDateTime, // Mark as Continue if startDateTime has passed
  //             },
  //             endClassTime: {
  //               [Sequelize.Op.gt]: currentDateTime // and endClassTime has not passed
  //             },
  //             status: 'Pending' // Only update Pending classes
  //           }
  //         }
  //       );
  //       let leftBehind = await models.ClassSchedule.update(
  //         { status: 'Completed' },
  //         {
  //           where: {
  //             startDateTime: {
  //               [Sequelize.Op.lt]: currentDateTime, // Mark as Continue if startDateTime has passed
  //             },
  //             endClassTime: {
  //               [Sequelize.Op.lt]: currentDateTime // and endClassTime has not passed
  //             },
  //             status: 'Pending' // Only update Pending classes
  //           }
  //         }
  //       );    
  //      console.log("con", current)
  //      console.log("lb",leftBehind)
  //       console.log('Class statuses updated successfully.');
  //     } catch (error) {
  //       console.error('Error updating class statuses:', error);
  //     }
  //   });
  // }
}
