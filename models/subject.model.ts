// Define the User model
module.exports = function (sequelize, DataTypes) {
  let Subject = sequelize.define('Subject',
    {
      subjectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      standardId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Standards',
          key: 'standardId'
        },
      },
      subjectCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      CUID: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: 'Subjects',
      timestamps: false
    }
  );
  Subject.associate = function (models: any) {
    this.belongsTo(models.Standard, { foreignKey: "standardId" })
    this.hasMany(models.Exams, { foreignKey: 'subjectId'});
    this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
    this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
  }
  return Subject;
}; 
