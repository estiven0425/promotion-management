import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class PromotionTarget extends Model {}

PromotionTarget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    promotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'promotion_id',
    },

    targetType: {
      type: DataTypes.ENUM('PRODUCT', 'CATEGORY'),
      allowNull: false,
      field: 'target_type',
    },

    targetValue: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'target_value',
      validate: {
        notEmpty: {
          msg: 'Target value is required',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'PromotionTarget',
    tableName: 'promotion_targets',
    underscored: true,
    timestamps: true,
  }
);

export default PromotionTarget;