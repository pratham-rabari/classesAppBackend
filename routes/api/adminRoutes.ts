"use strict";

import express from 'express';
var router = express.Router();
import common from '../../helpers/common';
const { verifyToken } = new common();


import UserController from "./../../controllers/user.controller";
import StandardController from "./../../controllers/standard.controller";
import StudentController from '../../controllers/student.controller';
import TeacherController from '../../controllers/teacher.controller'
import SubjectController from '../../controllers/subject.controller'
import ClassScheduleController from '../../controllers/classSchedule.controller'
import AttendanceController from '../../controllers/attendance.controller'
import FeesDetailsController from '../../controllers/feesDetails.controller'
import ExpensesController from '../../controllers/expenses.controller'
import ExamController from '../../controllers/exam.controller'

const { Login, ForgotPassword, ResetPassword, GetUsers} = new UserController();
const { GetStandards, AddStandard, UpdateStandard, GetStandardData, DeleteStandard } = new StandardController();
const { AddStudent, GetStudentData, UpdateStudent, GetStudents, GetStudentsByStandard, DeactivateStudent, ReactivateStudent, GetStudentAttendanceData} = new StudentController();
const { AddTeacher, GetTeacherData, UpdateTeacher, GetTeachers, DeactivateTeacher, ReactivateTeacher, GetTeacherAttendanceData, AddTeacherAttendance} = new TeacherController();
const { AddSubject, GetSubjectData, UpdateSubject, GetSubjects, DeactivateSubject, ReactivateSubject } = new SubjectController();
const { AddClass, GetClasses, DeleteClass, GetClass, UpdateClass, GetTeacherClasses, UpdateClassStatus, GetClassBySearch, GetClassBySearchForTeacher, GetClassesForCalendar, GetTeacherClassesForCalendar, GetClassRules, UpdateClassRule, GetClassRulesById } = new ClassScheduleController()
const { AddAttendance, GetAttendance, UpdateAttendance } = new AttendanceController()
const { GetFeesDetails, GetFeesDetailsForStudent, AddFeesDetailsForStudent, EditFeesDetailsForStudent } = new FeesDetailsController()
const { AddExpenses, EditExpenses, GetExpenseDetails, GetExpenses} = new ExpensesController()
const {AddExam, UpdateExam, GetExamDetails, GetOneExamData, GetStudentForMarks, AddStudentsMarks, GetStudentExamMarks} = new ExamController()

// Validation Files
import { login, forgotPassword, resetPassword } from './../../helpers/validations/admin/login';
import { AddStandardValidation, EditStandardValidation } from './../../helpers/validations/admin/standard';
import { AddStudentValidation, validateStudentMiddleware } from '../../helpers/validations/admin/student'
import { AddTeacherValidation, validateTeacherMiddleware, UpdateTeacherValidation } from '../../helpers/validations/admin/teacher'
import { AddSubjectValidation, UpdateSubjectValidation, validateSubjectMiddleware } from '../../helpers/validations/admin/subject'
import upload from '../../services/multer'

// User routes
//TODO: User crud is pending
//TODO: Company vise branch and branch vise user crud is pending


router.post('/login', login, Login);
router.post('/forgotPassword', forgotPassword, ForgotPassword);
router.post('/resetPassword', verifyToken, resetPassword, ResetPassword);
router.get('/standard', verifyToken, GetStandards);
router.post('/standard', verifyToken, AddStandardValidation, AddStandard);
router.put('/standard', verifyToken, EditStandardValidation, UpdateStandard);
router.get('/standard/:standardId', verifyToken, GetStandardData);
router.delete('/standard/:standardId', verifyToken, DeleteStandard);
router.get('/getUsers',verifyToken,GetUsers)

// Student Routes
router.post('/student', verifyToken, upload.single('image'), AddStudentValidation, validateStudentMiddleware, AddStudent);
router.get('/student/:studentId', verifyToken, GetStudentData);
router.put('/student', verifyToken, upload.single('image'), AddStudentValidation, validateStudentMiddleware, UpdateStudent);
router.get("/student", verifyToken, GetStudents)
router.put('/student-deactivate/:studentId', verifyToken, DeactivateStudent);
router.put('/student-reactivate/:studentId', verifyToken, ReactivateStudent);
router.get('/studentsBystandard/:standardName', verifyToken, GetStudentsByStandard)
router.get('/getStudentAttendanceData', verifyToken, GetStudentAttendanceData)

// Teacher Routes

// teacher password field pending to add password.................//
router.post('/teacher', verifyToken, upload.single('image'), AddTeacherValidation, validateTeacherMiddleware, AddTeacher);
router.get('/teacher/:userId', verifyToken, GetTeacherData);
router.put('/teacher', verifyToken, upload.single('image'), UpdateTeacherValidation, validateTeacherMiddleware, UpdateTeacher);
router.get("/teacher",verifyToken, GetTeachers);
router.get("/get-teacher-attendance",verifyToken,GetTeacherAttendanceData)
router.put('/add-teacher-attendance', verifyToken, AddTeacherAttendance);
router.put('/teacher-deactivate/:userId', verifyToken, DeactivateTeacher);
router.put('/teacher-reactivate/:userId', verifyToken, ReactivateTeacher);

// Subject routes
router.post('/subject', verifyToken, AddSubjectValidation, validateSubjectMiddleware, AddSubject);
router.get('/subject/:subjectId', verifyToken, GetSubjectData);
router.put('/subject', verifyToken, UpdateSubjectValidation, validateSubjectMiddleware, UpdateSubject);
router.get("/subject", verifyToken, GetSubjects);
router.put('/subject-deactivate/:subjectId', verifyToken, DeactivateSubject);
router.put('/subject-reactivate/:subjectId', verifyToken, ReactivateSubject);

// ClassSchedule routes
router.post('/classSchedule', verifyToken, AddClass)
router.get('/classes', verifyToken, GetClasses)
router.delete('/deleteclass/:classId', verifyToken, DeleteClass)
router.get('/getclass/:classId', verifyToken, GetClass)
router.put('/updateclass', verifyToken, UpdateClass)
router.get('/teacherclasses/:teacherId', verifyToken, GetTeacherClasses)
router.put('/update-class-status', verifyToken, UpdateClassStatus)
router.get('/getclass-by-search', verifyToken, GetClassBySearch)
router.get('/getclass-by-search-teacher', verifyToken, GetClassBySearchForTeacher)
router.get('/get-all-classes', verifyToken, GetClassesForCalendar)
router.get('/get-classes-teacher', verifyToken, GetTeacherClassesForCalendar)
router.get('/get-classrules', verifyToken, GetClassRules)
router.put('/update-classrules', verifyToken, UpdateClassRule)
router.get('/get-classrule-byid', verifyToken, GetClassRulesById)


// Attendance routes
router.post('/add-attendance', verifyToken, AddAttendance)
router.get('/get-attendance/:classId', verifyToken, GetAttendance)
router.put('/update-attendance', verifyToken, UpdateAttendance)

//FeesDetails routes
router.get('/fee-details', verifyToken, GetFeesDetails)
router.get('/fee-detail-for-student', verifyToken, GetFeesDetailsForStudent)
router.post('/add-fee-detail', verifyToken, AddFeesDetailsForStudent)
router.post('/edit-fee-detail', verifyToken, EditFeesDetailsForStudent)


//Expenses routes
router.post('/addExpense',verifyToken,AddExpenses)
router.post('/editExpense',verifyToken,EditExpenses)
router.get('/getExpenses',verifyToken,GetExpenses)
router.get('/getExpenseDetail',verifyToken,GetExpenseDetails)

// Exam routes
router.post('/addExam',verifyToken,AddExam)
router.post('/updateExam',verifyToken,UpdateExam)
router.get('/getExams',verifyToken,GetExamDetails)
router.post('/addStudentsMarks',verifyToken,AddStudentsMarks)
router.get('/getOneExamData',verifyToken,GetOneExamData)
router.get('/getStudentsForMarks',verifyToken,GetStudentForMarks)
router.get('/getStudentExamMarks',verifyToken,GetStudentExamMarks)



module.exports = router;