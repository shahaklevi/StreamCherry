const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const recommendationController = require('../controllers/recommendationController');
console.log('movieRoutes');
router.get('/search/:query', movieController.search);

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);
router.post('/', movieController.create);
router.put('/:id', movieController.update);
router.delete('/:id', movieController.delete);
router.get('/:id/recommend/', recommendationController.getRecommendations);
router.post('/:id/recommend/', recommendationController.addToWatchList);
router.delete('/:id/recommend', recommendationController.deleteFromWatchList);
module.exports = router;
