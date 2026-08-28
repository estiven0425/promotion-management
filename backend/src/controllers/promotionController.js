import * as promotionService from '../services/promotionService.js';

export const getPromotions = async (req, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();

    return res.status(200).json(promotions);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Error retrieving promotions',
    });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const createdPromotion = await promotionService.createPromotion(req.body);

    return res.status(201).json(createdPromotion);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Error creating promotion',
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await promotionService.updatePromotionStatus(id, status);

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Error updating promotion status',
    });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await promotionService.deletePromotion(id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Error deleting promotion',
    });
  }
};

export const getSummary = async (req, res) => {
  try {
    const summary = await promotionService.getPromotionsSummary();
    
    return res.status(200).json(summary);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Error fetching promotions summary',
    });
  }
};