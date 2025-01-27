const express = require('express');
const tourController = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoutes');
const authController = require('../controllers/authController');
const router = express.Router();

router.use('/:id/reviews', reviewRouter);
router.param('id', (req, res, next, val) => {
  next();
});
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.addTour
  );
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/tours-within/:distance/center/:latlang/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/distances/:latlang/unit/:unit').get(tourController.getDistances);

module.exports = router;
