module.exports = function (sequelize, DataTypes) {
    let Exams = sequelize.define('Exams',
      {
        examId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          standardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Standard', // Table name for standards
              key: 'standardId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Subject', // Table name for subjects
              key: 'subjectId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          totalMarks: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          passingMarks: {
            type: DataTypes.DECIMAL(5,1),
            allowNull: false,
          },
          examDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          chapterDetails: {
            type: DataTypes.STRING(100),
            allowNull: true,
          },
          remarks: {
            type: DataTypes.STRING(200),
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
        tableName: 'Exams',
        timestamps: false
      }
    );
    Exams.associate = function (models: any) {
    this.belongsTo(models.Standard, { foreignKey: "standardId" });
    this.belongsTo(models.Subject, { foreignKey: "subjectId" });
    this.belongsTo(models.MarksDetails, { foreignKey: "examId" });
    this.belongsTo(models.User, { foreignKey: 'CUID', as: 'createdBy' });
    this.belongsTo(models.User, { foreignKey: 'MUID', as: 'modifiedBy' }); 
    }
    return Exams;
  }; 
  