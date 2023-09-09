import express from 'express';
import cors from 'cors';

import { decoratorParams } from '@/server/middlewares';
import { isAliveHandler, isReadyHandler } from './handlers/livenessHandlers';
import {
  driftsmeldingerHandler,
  searchHandler,
  menuHandler,
  varslerHandler,
} from './handlers/serviceHandlers';
import { dataHandlers, inspectData } from './handlers/dataHandlers';
import {
  mockAuthHandler,
  mockLoginHandler,
  mockLogoutHandler,
  mockSessionHandler,
  refreshMockSessionHandler,
} from '@/server/handlers/mockHandlers';
import {
  footerHandler,
  headerHandler,
  indexHandler,
} from './handlers/domHandlers';

try {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;
  const app = express();

  // Setup middleware
  app.use(cors());
  app.use(express.static(isProd ? 'dist' : 'public'));
  app.use(decoratorParams);

  // Liveness and mock handlers
  app.use('/api/isReady', isReadyHandler);
  app.use('/api/isAlive', isAliveHandler);
  app.use('/api/auth', mockAuthHandler);
  app.get('/api/oauth2/session', mockSessionHandler);
  app.get('/api/oauth2/session/refresh', refreshMockSessionHandler);

  app.get('/oauth2/login', mockLoginHandler);
  app.get('/oauth2/logout', mockLogoutHandler);

  // Service handlers
  app.use('/api/sok', searchHandler);
  app.use('/api/menu', menuHandler);
  app.use('/api/varsler', varslerHandler);
  app.use('/api/driftsmeldinger', driftsmeldingerHandler);

  // Data handlers
  app.use('/data/inspect-data', inspectData);
  app.get('/data/:key', dataHandlers);

  // DOM handlers
  app.use('/footer', footerHandler);
  app.use('/header', headerHandler);
  app.use('/', indexHandler);

  app.listen(8089, function () {
    console.log(`Listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
