import { Router } from 'express';
import controllers from './word.controller';

const router = Router();

// /sensors/new
router.route('/').post(controllers.createOne).get(controllers.getOne);
router
  .route('/:id')
  .put(controllers.updateOne)
  .delete(controllers.removeOne)
  .get(controllers.getOne);

export default router;
