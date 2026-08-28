import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Promotion extends Model {}

Promotion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Promotion name is required',
        },
      },
    },

    discountType: {
      type: DataTypes.ENUM('PERCENTAGE', 'FIXED_AMOUNT'),
      allowNull: false,
      field: 'discount_type',
    },

    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'discount_value',
      validate: {
        isDecimal: {
          msg: 'Discount value must be a valid number',
        },
        min: {
          args: [0.01],
          msg: 'Discount value must be greater than zero',
        },
      },
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date',
    },

    status: {
      type: DataTypes.ENUM('SCHEDULED', 'ACTIVE', 'FINISHED'),
      allowNull: false,
      defaultValue: 'SCHEDULED',
    },
  },
  {
    sequelize,
    modelName: 'Promotion',
    tableName: 'promotions',
    underscored: true,
    timestamps: true,
  }
);

export default Promotion;