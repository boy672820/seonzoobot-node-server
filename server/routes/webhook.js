/* jshint esversion: 6 */
import { Router } from 'express';
import WebhookController from '../controllers/webhook';

const webhookController = new WebhookController();

const router = Router();

router.route( '/' )
	.get( webhookController.index );

router.route( '/' )
	.post( webhookController.indexpost );

export default router;
