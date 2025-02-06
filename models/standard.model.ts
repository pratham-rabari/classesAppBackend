// Define the User model
module.exports = function(sequelize, DataTypes) {
  let Standard = sequelize.define('Standard',
    {
      standardId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      standardIndex:{
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
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
      tableName: 'Standards', // Change 'Users' to your actual table name
      timestamps: false, // Set to true if you have createdAt and updatedAt columns
    }
  );
  Standard.associate = function (models: any) {
    console.log("hello standard")
    this.hasMany(models.Subject, { foreignKey: 'standardId'});
    this.hasMany(models.Exams, { foreignKey: 'standardId'});
    this.hasMany(models.Student, { foreignKey: 'standardId'});
    this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
    this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
  }
  
  return Standard;
};
