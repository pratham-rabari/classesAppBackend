// Define the Students model
module.exports = function (sequelize, DataTypes) {
  let Student = sequelize.define('Student',
    {
      studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      standardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Standard',
          key: 'standardId'
        },
      },
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      phoneNo: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
      },
      // recheck ////////
      addmissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // ........
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      paymentType:{
        type: DataTypes.ENUM('OneTime', 'Installments'),
        allowNull: false,
      },
      totalFees:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      feesDueDate:{
        type: DataTypes.DATE,
        allowNull: true,
      },
      motherName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fatherName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      parentContactNo: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      emergencyContactNo: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      intallmentCount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CUID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
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
          key: 'userId',
        },
      },
      MDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'Students',
    }
  );
  Student.associate = function (models: any) {
    console.log("hello Students")
    this.belongsTo(models.Standard, { foreignKey: "standardId" });
    this.hasMany(models.MarksDetails, { foreignKey: "studentId" }); // A Student has many MarksDetails
    this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
    this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
    this.hasMany(models.FeesDetails, { foreignKey: 'studentId' });
    // this.hasMany(models.FeesDetails, { foreignKey: 'studentId', as: 'Students' }); // Alias as 'Students'
  }
  return Student;
};
