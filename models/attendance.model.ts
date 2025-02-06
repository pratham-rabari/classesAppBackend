module.exports = function (sequelize, DataTypes) {
    let attendance = sequelize.define('attendance',
      {
        attendanceId:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        classId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        teacherId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Name of the referenced table (Users table)
                key: 'userId', // Name of the referenced column (userId)
              },
        },
        attendanceDetail:{
          type: DataTypes.JSON,  // JSON data type
          allowNull: false,
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
        tableName: 'attendance',
        timestamps: false
      }
    );
    attendance.associate = function (models: any) {
      this.belongsTo(models.Student, { foreignKey: "studentId" });
      this.belongsTo(models.ClassSchedule, { foreignKey: "classId" });
      this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
      this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
      this.belongsTo(models.User, { as: 'teacher', foreignKey: "teacherId" });
    }
    return attendance;
  };