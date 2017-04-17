/* jshint esversion: 6 */
import { Router } from 'express';
import WebhookController from '../controllers/WebhookController';


const router = Router();
const webhookController = new WebhookController();

router.route( '/' )
	.get( webhookController.index );

router.route( '/' )
	.post( webhookController.indexpost );

export default router;
