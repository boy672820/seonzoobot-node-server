/* jshint esversion: 6 */
import { Router } from 'express';
import ChattingController from '../controllers/chatting';

const chattingController = new ChattingController();

const router = Router();

router.route( '/' )
	.get( chattingController.index );

router.route( '/send-message' )
	.post( chattingController.sendMessage );

export default router;
