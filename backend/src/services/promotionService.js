import { Promotion, PromotionTarget } from '../models/index.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export const getAllPromotions = async () => {
  return await Promotion.findAll({
    include: [
      {
        model: PromotionTarget,
        as: 'targets',
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

export const createPromotion = async (promotionData) => {
  const {
    name,
    discountType,
    discountValue,
    startDate,
    endDate,
    targetType,
    targetValue,
  } = promotionData;

  if (!name || !discountType || !discountValue || !startDate || !endDate || !targetType || !targetValue) {
    const error = new Error('All fields are required, including target type and value.');
    error.statusCode = 400;
    throw error;
  }

  if (new Date(endDate) <= new Date(startDate)) {
    const error = new Error('End date must be strictly after the start date.');
    error.statusCode = 400;
    throw error;
  }

  if (discountType === 'PERCENTAGE') {
    const numericDiscount = Number(discountValue);
    if (isNaN(numericDiscount) || numericDiscount < 1 || numericDiscount > 100) {
      const error = new Error('Percentage discount value must be between 1 and 100.');
      error.statusCode = 400;
      throw error;
    }
  }

  const transaction = await sequelize.transaction();

  try {
    const newPromotion = await Promotion.create(
      {
        name,
        discountType,
        discountValue,
        startDate,
        endDate,
        status: 'SCHEDULED',
      },
      { transaction }
    );

    await PromotionTarget.create(
      {
        promotionId: newPromotion.id,
        targetType,
        targetValue,
      },
      { transaction }
    );

    await transaction.commit();

    return await Promotion.findByPk(newPromotion.id, {
      include: [{ model: PromotionTarget, as: 'targets' }],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updatePromotionStatus = async (id, newStatus) => {
  const allowedStatuses = ['SCHEDULED', 'ACTIVE', 'FINISHED'];

  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error('Invalid status value.');
    error.statusCode = 400;
    throw error;
  }

  const promotion = await Promotion.findByPk(id);

  if (!promotion) {
    const error = new Error('Promotion not found.');
    error.statusCode = 404;
    throw error;
  }

  if (promotion.status === 'FINISHED') {
    const error = new Error('Cannot update status of a finished promotion.');
    error.statusCode = 422;
    throw error;
  }

  promotion.status = newStatus;
  await promotion.save();

  return promotion;
};

export const deletePromotion = async (id) => {
  const promotion = await Promotion.findByPk(id);

  if (!promotion) {
    const error = new Error('Promotion not found.');
    error.statusCode = 404;
    throw error;
  }

  if (promotion.status !== 'SCHEDULED') {
    const error = new Error('Only promotions in SCHEDULED status can be deleted.');
    error.statusCode = 422;
    throw error;
  }

  await promotion.destroy();
  return { message: 'Promotion successfully deleted.' };
};

export const getPromotionsSummary = async () => {
  const today = new Date();

  const scheduledCount = await Promotion.count({ where: { status: 'SCHEDULED' } });
  const activeCount = await Promotion.count({ where: { status: 'ACTIVE' } });
  const finishedCount = await Promotion.count({ where: { status: 'FINISHED' } });

  const activeTodayCount = await Promotion.count({
    where: {
      status: 'ACTIVE',
      startDate: { [Op.lte]: today },
      endDate: { [Op.gte]: today },
    },
  });

  return {
    scheduled: scheduledCount,
    active: activeCount,
    finished: finishedCount,
    activeToday: activeTodayCount,
  };
};