/* jshint esversion: 6 */
import { Router } from 'express';
import chatting from './chatting';
import webhook from './webhook';

const router = Router();

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', { title: 'Express' } );
} );

/* Mount routes */
router.use( '/chatting', chatting );
router.use( '/webhook', webhook );

export default router;
