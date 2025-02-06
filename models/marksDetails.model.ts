module.exports = function (sequelize, DataTypes) {
    let MarksDetails = sequelize.define('MarksDetails',
      {
        marksDetailid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false
          },
          examId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Exams', 
              key: 'examId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Student', // Table name
                key: 'studentId',  // Column name in referenced table
              },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          totalMarks: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          scoredMarks: {
            type: DataTypes.DECIMAL(5,1),
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
        tableName: 'MarksDetails',
        timestamps: false
      }
    );
    MarksDetails.associate = function (models: any) {
    console.log("hello it md")
    this.belongsTo(models.Student, { foreignKey: "studentId" }); // A MarkDetail belongs to a Student
    this.belongsTo(models.Exams, { foreignKey: "examId" });
    this.belongsTo(models.User, { foreignKey: 'CUID', as: 'createdBy' });
    this.belongsTo(models.User, { foreignKey: 'MUID', as: 'modifiedBy' }); 
    }
    return MarksDetails;
  }; 
  