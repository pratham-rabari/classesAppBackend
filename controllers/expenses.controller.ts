"use strict";

import ExpensesModel from "../services/expenses.Model";
import { HttpCodes } from "../helpers/httpCodes";
import httpMessages from "../helpers/httpMessages";


export default class StudentController {
  Expenses: ExpensesModel;

  constructor() {
    this.AddExpenses = this.AddExpenses.bind(this)
    this.EditExpenses = this.EditExpenses.bind(this)
    this.GetExpenseDetails = this.GetExpenseDetails.bind(this)
    this.GetExpenses = this.GetExpenses.bind(this)
    this.Expenses = new ExpensesModel();
  }

  AddExpenses(req, res) {
      this.Expenses.AddExpenses(req.body, (error, result) => {
        if (error) {
          res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        } else {
          if (result && result.status === "customError") {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          } else {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          }
        }
      })
    }

    EditExpenses(req, res) {
      this.Expenses.EditExpenses(req.body, (error, result) => {
        if (error) {
          res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
        } else {
          if (result && result.status === "customError") {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          } else {
            res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
          }
        }
      })
    }

    GetExpenses(req, res) {
        this.Expenses.GetExpenses(req.query, (error, result) => {
          if (error) {
            res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
          } else {
            if (result && result.status === "customError") {
              res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
            } else {
              res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data, totalExpenses: result.count, currentPage: result.currentPage });
            }
          }
        })
      }

      GetExpenseDetails(req, res) {
          this.Expenses.GetExpenseDetails(req.query, (error, result) => {
            if (error) {
              res.status(HttpCodes['OK']).json({ message: httpMessages.SOMETHING_WENT_WRONG, code: HttpCodes['BAD_REQUEST'] });
            } else {
              if (result && result.status === "customError") {
                res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code });
              } else {
                res.status(HttpCodes['OK']).json({ message: result.msg, code: result.code, data: result.data});
              }
            }
          })
        }

}