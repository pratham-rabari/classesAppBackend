module.exports = function (sequelize, DataTypes) {
    let FeesDetails = sequelize.define('FeesDetails',
      {
        feeDetailId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
          },
          studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Student', // Table name
              key: 'studentId',  // Column name in referenced table
            },
          },
          paymentDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
          },
          paymentType: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          installmentAmount:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
          },
          paidInstallmentAmount:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
          },
          pendingInstallmentAmount:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
          },
          installmentDate:{
            type: DataTypes.STRING(20),
            allowNull: true,
          },
          chequeNumber:{
            type: DataTypes.STRING(30),
            defaultValue: null,
            allowNull: true,
          },
          bankName:{
            type: DataTypes.STRING(40),
            defaultValue: null,
            allowNull: true,
          },
          onlinePaymentService:{
            type: DataTypes.ENUM("Upi","NetBanking"),
            defaultValue: null,
            allowNull: true,
          },
          status:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
          },
          CUID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Users', // Name of the referenced table (Users table)
              key: 'userId', // Name of the referenced column (userId)
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
              model: 'Users', // Name of the referenced table (Users table)
              key: 'userId', // Name of the referenced column (userId)
            },
          },
          MDT: {
            type: DataTypes.DATE,
            allowNull: true,
          },
      },
      {
        tableName: 'FeesDetails',
        timestamps: false
      }
    );
    FeesDetails.associate = function (models: any) {
      console.log("hello feedetails")
      this.belongsTo(models.Student, { foreignKey: 'studentId'});
      // this.belongsTo(models.Students, { foreignKey: 'studentId', as: 'Students' }); // Use the same alias
      this.belongsTo(models.User, { foreignKey: 'CUID', as: 'createdBy' });
      this.belongsTo(models.User, { foreignKey: 'MUID', as: 'modifiedBy' }); 
    }
    return FeesDetails;
  }; 
  