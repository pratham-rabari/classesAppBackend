module.exports = function (sequelize, DataTypes) {
    let teacherAttendance = sequelize.define('teacherAttendance',
      {
          attendanceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          classId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'ClassSchedule', // Table name for standards
              key: 'classId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          teacherId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'users', // Table name for subjects
              key: 'userId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          attendanceStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          CUID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'users', // Table name for users
              key: 'userId',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          CDT: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          MUID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'users', // Table name for users
              key: 'userId',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          MDT: {
            type: DataTypes.DATE,
            allowNull: true,
          },
      },
      {
        tableName: 'teacherAttendance',
        timestamps: false
      }
    );
    teacherAttendance.associate = function (models: any) {
    this.belongsTo(models.ClassSchedule, { foreignKey: "classId" });
    this.belongsTo(models.User, { foreignKey: "userId" });
    this.belongsTo(models.User, { foreignKey: 'CUID', as: 'createdBy' });
    this.belongsTo(models.User, { foreignKey: 'MUID', as: 'modifiedBy' }); 
    }
    return teacherAttendance;
  }; 
  