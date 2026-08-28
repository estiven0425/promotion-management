import Promotion from './Promotion.js';
import PromotionTarget from './PromotionTarget.js';

Promotion.hasMany(PromotionTarget, {
  foreignKey: 'promotionId',
  as: 'targets',
  onDelete: 'CASCADE',
});

PromotionTarget.belongsTo(Promotion, {
  foreignKey: 'promotionId',
  as: 'promotion',
});

export {
  Promotion,
  PromotionTarget,
};