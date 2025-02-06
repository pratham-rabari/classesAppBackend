import { Weekday } from "rrule";
import { INTEGER } from "sequelize";
import { toDefaultValue } from "sequelize/types/utils";

module.exports = function (sequelize, DataTypes) {
  let ClassSchedule = sequelize.define('ClassSchedule',
    {
      classId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      recurrenceTime: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endClassTime : {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      weekDays: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      standardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Standard',
          key: 'standardId'
        },
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId'
        },
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Subject',
          key: 'subjectId'
        },
      },
      status:{
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue:"Pending"
      },
      classRuleId:{ 
        type: DataTypes.INTEGER,
        references: {
          model: 'ClassRules',
          key: 'classRuleId'
        },
      },
      CUID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId'
        },
      },
      CDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      MUID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'userId'
        },
      },
      MDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'ClassSchedule',
      timestamps: false
    }
  );
  ClassSchedule.associate = function (models: any) {
    console.log("hello")
    this.belongsTo(models.Standard, { foreignKey: "standardId" });
    this.belongsTo(models.Subject, { foreignKey: "subjectId" });
    this.belongsTo(models.ClassRules, { foreignKey: "classRuleId" });
    this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
    this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
    this.belongsTo(models.User, { as: 'teacher', foreignKey: "teacherId" });
  }
  return ClassSchedule;
};