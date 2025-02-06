module.exports = function (sequelize, DataTypes) {
    let ClassRules = sequelize.define('ClassRules',
      {
        classRuleId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        recurrenceTime: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate : {
          type: DataTypes.DATE,
          allowNull: false,
        },
        classTime : {
            type: DataTypes.STRING(100),
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
        tableName: 'ClassRules',
        timestamps: false
      }
    );
    ClassRules.associate = function (models: any) {
      this.belongsTo(models.Standard, { foreignKey: "standardId" });
      this.belongsTo(models.Subject, { foreignKey: "subjectId" });
      this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
      this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
      this.belongsTo(models.User, { as: 'teacher', foreignKey: "teacherId" });
    }
    return ClassRules;
  };