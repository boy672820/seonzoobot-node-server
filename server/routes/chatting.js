/* jshint esversion: 6 */
import { Router } from 'express';
import ChattingController from '../controllers/ChattingController';

const router = Router();
const chattingController = new ChattingController();

router.route( '/' )
	.get( chattingController.index );

router.route( '/send-message' )
	.post( chattingController.sendMessage );

export default router;
