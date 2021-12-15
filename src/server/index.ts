import genv from '../lib/genv';
import { server } from './app';
import './ws';

server.listen(Number(genv('PORT')), () => console.log('Server running'));
