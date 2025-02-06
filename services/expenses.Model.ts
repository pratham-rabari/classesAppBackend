"use strict";


const models = require("./../models/index");
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";
const Sequelize = require('sequelize');
import common from '../helpers/common';
import { where } from "sequelize";
import { off } from "process";
const { AddActivityLog } = new common();

export default class ExpensesModel {


  constructor() {
    this.AddExpenses = this.AddExpenses.bind(this)
    this.EditExpenses = this.EditExpenses.bind(this)
    this.GetExpenseDetails = this.GetExpenseDetails.bind(this)
    this.GetExpenses = this.GetExpenses.bind(this)
  }

  async AddExpenses(data: any, callback: any) {
    try {
      const AddExpenses = await models.Expenses.build({
        expenseAmount: data.expenseAmount,
        expenseDate: data.expenseDate,
        expenserId: data.expenserId,
        expenseType: data.expenseType,
        CUID: data.decoded.userId,
        CDT: Date.now()
      })

      let expense = await AddExpenses.save()

      AddActivityLog({
        module: 'Expenses',
        userId: data.decoded.userId,
        description: `Expenses  is Added By id ${data.decoded.userId}.`
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.EXPENSES.ADD_EXPENSES, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async EditExpenses(data: any, callback: any) {
    try {
      const AddExpenses = await models.Expenses.update(
        {
          expenseAmount: data.expenseAmount,
          expenseDate: data.expenseDate,
          expenserId: data.expenserId,
          expenseType: data.expenseType,
          MUID: data.decoded.userId,
          MDT: Date.now()
        },
        {
          where: { expenseId: data.expenseId },
        },
      )

      AddActivityLog({
        module: 'Expenses',
        userId: data.decoded.userId,
        description: `Expenses ${AddExpenses.expenseId} is Edited By user id ${data.decoded.userId}.`
      })

      return callback(null, { 'status': 'success', 'msg': httpMessages.EXPENSES.ADD_EXPENSES, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetExpenses(query: any, callback: any) {
    try {

      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await models.Expenses.findAndCountAll({
        include: [
          { model: models.User, as: 'user', attributes: ['firstName', 'lastName'] },
        ],
        attributes: ['expenseId', 'expenseAmount', 'expenseDate', 'expenserId', 'expenseType'],
        limit: limit,
        offset: offset
      })

      const expenseData = rows?.map(item => {
        console.log(item, "i")
        return {
          expenseId: item?.expenseId,
          expenseAmount: item?.expenseAmount,
          expenseDate: item?.expenseDate,
          expenseType: item?.expenseType,
          expenserName: item?.user?.firstName + ' ' + item?.user?.lastName,
        }
      });

      return callback(null, { 'status': 'success', 'msg': httpMessages.EXPENSES.GET_EXPENSES, data: expenseData, count: count, currentPage: page, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

  async GetExpenseDetails(query: any, callback: any) {
    try {
      console.log(query.expenseId)
      const GetExpense = await models.Expenses.findOne(
        {
          where: { expenseId: query.expenseId }
        },
        {
          attributes: ['expenseId', 'expenseAmount', 'expenseDate', 'expenserId', 'expenseAmount']
        })
      console.log(GetExpense, "g")
      return callback(null, { 'status': 'success', 'msg': httpMessages.EXPENSES.GET_EXPENSES, data: GetExpense, code: HttpCodes['OK'] });

    } catch (error) {
      console.log(error);
      return callback(null, { 'status': 'customError', 'msg': httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
    }
  }

}