"use strict"

const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
import { Op, where } from "sequelize";
const { AddActivityLog } = new common();

export default class ExamModel {
    constructor() {
        this.AddExam = this.AddExam.bind(this)
        this.UpdateExam = this.UpdateExam.bind(this)
        this.GetOneExamData = this.GetOneExamData.bind(this)
        this.GetExamsDetails = this.GetExamsDetails.bind(this)
        this.GetStudentsForMarks = this.GetStudentsForMarks.bind(this)
        this.AddStudentsMarks = this.AddStudentsMarks.bind(this)
        this.GetStudentExamMarks = this.GetStudentExamMarks.bind(this)
    }

    async AddExam(data: any, callback: any) {
        try {
            let exam = models.Exams.build({
                standardId: data?.standardId,
                subjectId: data?.subjectId,
                totalMarks: data?.totalMarks,
                passingMarks:data?.passingMarks,
                examDate: data?.examDate,
                chapterDetails: data?.chapterDetails ? data?.chapterDetails : null,
                remarks: data?.remarks ? data?.remarks : null,
                CUID: data.decoded.userId,
                CDT: Date.now()
            });

            let examSave = await exam.save();

            const students = await models.Student.findAll({
                where: { standardId: data?.standardId },
                attributes: ['studentId'],
            });

            const marksDetailsData = students.map(student => ({
                examId: examSave?.examId,
                studentId: student?.studentId,
                totalMarks: data?.totalMarks,
                CUID: data.decoded.userId,
                CDT: Date.now()
            }));
            console.log(marksDetailsData, "s0")
            console.log(models.MarksDetails, "s1")
            console.log(models.MarksDetai, "s2")

            await models.MarksDetails.bulkCreate(marksDetailsData);

            AddActivityLog({
                module: 'Exams',
                userId: data.decoded.userId,
                description: `Exam For Standard ${data.standardId} is created By ${data.decoded.userId}.`
            })

            return callback(null, { status: "success", msg: httpMessages.EXAM.ADD_EXAM, code: HttpCodes["OK"] });
        } catch (error) {
            console.log(error);
            return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }

    async UpdateExam(data: any, callback: any) {
        try {

            let examDetails = await models.Exams.findOne({ where: { examId: data.examId } })

            if (examDetails.standardId != data.standardId) {
                let deleteData = await models.MarksDetails.destroy({ where: { examId: data.examId } })

                const students = await models.Student.findAll({
                    where: { standardId: data?.standardId },
                    attributes: ['studentId'],
                });

                const marksDetailsData = students.map(student => ({
                    examId: data?.examId,
                    studentId: student?.studentId,
                    totalMarks: data?.totalMarks,
                    CUID: data.decoded.userId,
                    CDT: Date.now()
                }));


                await models.MarksDetails.bulkCreate(marksDetailsData);
            }

            let exam = models.Exams.update(
                {
                    standardId: data?.standardId,
                    subjectId: data?.subjectId,
                    totalMarks: data?.totalMarks,
                    passingMarks:data?.passingMarks,
                    examDate: data?.examDate,
                    chapterDetails: data?.chapterDetails ? data?.chapterDetails : null,
                    remarks: data?.remarks ? data?.remarks : null,
                    MUID: data.decoded.userId,
                    MDT: Date.now()
                },
                { where: { examId: data.examId } },
            );


            AddActivityLog({
                module: 'Exams',
                userId: data.decoded.userId,
                description: `Exam For Standard ${data.standardId} is updated By ${data.decoded.userId}.`
            })

            return callback(null, { status: "success", msg: httpMessages.EXAM.ADD_EXAM, code: HttpCodes["OK"] });
        } catch (error) {
            console.log(error);
            return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }

    async GetOneExamData(query: any, callback: any) {
        try {
            let exam = await models.Exams.findOne({
                where: { examId: query.examId },
                attributes: [
                    'examId',
                    'standardId',
                    'subjectId',
                    'examDate',
                    'passingMarks',
                    'totalMarks',
                    'chapterDetails',
                    'remarks'
                ],
            })

            const examData = {
                examId: exam?.examId,
                standardId: exam?.standardId,
                subjectId: exam?.subjectId,
                examDate: exam?.examDate,
                passingMarks:exam?.passingMarks,
                totalMarks: exam?.totalMarks,
                chapterDetails: exam?.chapterDetails,
                remarks: exam?.remarks
            }
            console.log(examData,"ex")

            return callback(null, { status: "success", msg: httpMessages.EXAM.GET_EXAM, code: HttpCodes["OK"], data: examData });

        } catch (error) {
            console.log(error)
            return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }



    async GetExamsDetails(query: any, callback: any) {
        console.log(query, "q")

        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        try {
            let filter = {
                where: {
                    [Sequelize.Op.or]: {
                        standardId: query.standardId
                    }
                }
            };

            let limitOption = 10;
            let offsetOption = 0;
            if (query.page && query.page != -1) {
                offsetOption = (parseInt(query.page) * limitOption);
                filter['offset'] = offsetOption
                filter['limit'] = limitOption
            }


            let { count, rows } = await models.Exams.findAndCountAll({
                ...filter,
                include: [
                    { model: models.Standard, attributes: ['name'] },
                    { model: models.Subject, attributes: ['name'] },
                ],
                attributes: [
                    'examId',
                    'standardId',
                    'subjectId',
                    'passingMarks',
                    'examDate',
                    'totalMarks',
                    'chapterDetails',
                    'remarks'
                ],
                limit: limit,
                offset: offset
            })
            console.log(rows)
            let examData = rows.map(exam => {
                return {
                    examId: exam?.examId,
                    standardName: exam?.Standard.name,
                    subjectName: exam?.Subject.name,
                    examDate: exam?.examDate,
                    totalMarks: exam?.totalMarks,
                    passingMarks:exam?.passingMarks,
                    chapterDetails: exam?.chapterDetails,
                    remarks: exam?.remarks
                }
            })
            console.log(examData[0],"ex2")

            return callback(null, { 'status': 'success', 'msg': httpMessages.SUBJECT.SUBJECT_FETCHED, code: HttpCodes['OK'], data: examData, currentPage: page, count: count });
        } catch (error) {
            console.log(error)
            return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }

    async GetStudentsForMarks(query: any, callback: any) {
        try {
            let students = await models.MarksDetails.findAll({
                include: [
                    { model: models.Student, attributes: ['firstName', 'lastName'] },
                ],
                where: { examId: query.examId },
                attributes: [
                    'marksDetailId',
                    'examId',
                    'studentId',
                    'totalMarks',
                    'scoredMarks',
                ],
            })
            console.log(query?.examId,"id")

            let studentsData = students.map(student => {
                console.log(student, "sx")
                return {
                    examId: student?.examId,
                    studentId: student?.studentId,
                    marksDetailId: student?.marksDetailId,
                    studentName: `${student.Student.firstName}  ${student.Student.lastName}`,
                    totalMarks: student?.totalMarks,
                    scoredMarks: student?.scoredMarks
                }
            })
            return callback(null, { status: "success", msg: httpMessages.EXAM.GET_EXAM, code: HttpCodes["OK"], data: studentsData });

        } catch (error) {
            console.log(error)
            return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }

    async AddStudentsMarks(data: any, callback: any) {
        try {
          
           for(let row of data){
            console.log(row)
             let AddMarks = await models.MarksDetails.update({
                scoredMarks:row.scoredMarks
             },
             {
                where:{examId:row.examId,studentId:row.studentId}
             }
            )
           }
              
           AddActivityLog({
            module: 'MarksDetails',
            userId: data.decoded.userId,
            description: `Marks For Exam ${data.examId} is added By ${data.decoded.userId}.`
        })

        return callback(null, { status: "success", msg: httpMessages.EXAM.MARKS_ADDED, code: HttpCodes["OK"] });

        } catch (error) {
            console.log(error)
            return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }

    async GetStudentExamMarks(query: any, callback: any) {
        try {

            const page = parseInt(query.page) || 1; // Current page (default: 1)
            const limit = 10; // Items per page (default: 10)
            const offset = (page - 1) * limit; // Offset for SQL query

            console.log(query,"qq")
            let studenMarks = await models.MarksDetails.findAll({
                where: { studentId: query.studentId },
                attributes: [
                    'examId',
                    'studentId',
                    'totalMarks',
                    'scoredMarks',
                ],
            })
         
        const examIds = studenMarks.map((marks) => marks.examId);
        console.log(examIds,"ax")

        if (examIds?.length == 0) {
                return callback(null, {
                  status: "success",
                  msg: httpMessages.EXAM.NO_DATA_FOUND,
                  code: HttpCodes["OK"],
                  data: [],
                });
              }

        const {count, rows:examDetails} = await models.Exams.findAndCountAll({
            include:[
                { model: models.Subject, attributes: ['name'] },
            ],
            where: {
              examId: {
                [Op.in]: examIds, 
              },
              ...(query.subjectId ? { subjectId: query.subjectId } : {}),            },
            attributes:['examId','subjectId','examDate','chapterDetails'],
            limit,
            offset
          })

          console.log(examDetails,"ex")
            let studentMarksData = examDetails.map(exam => {

                const marksInfo = studenMarks?.find(
                    (cls) => cls.get().examId == exam.examId
                );

                return {
                    subjectName:exam?.Subject?.name,
                    examDate:exam?.examDate,
                    chapterDetails:exam?.chapterDetails,
                    totalMarks: marksInfo?.totalMarks,
                    scoredMarks: marksInfo?.scoredMarks
                }
            })
            console.log(studentMarksData,"sx")

            return callback(null, { status: "success", msg: httpMessages.EXAM.GET_EXAM, code: HttpCodes["OK"], data: studentMarksData, currentPage:page, count:count});

        } catch (error) {
            console.log(error)
            return callback(null, { status: 'customError', msg: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        }
    }
}