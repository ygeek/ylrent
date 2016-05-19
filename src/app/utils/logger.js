/**
 * Created by meng on 16/5/19.
 */

'use strict';

import log4js from 'log4js';

log4js.configure({
  appenders: [
    { type: 'console' }
  ],
  replaceConsole: true
});

const logger = log4js.getLogger('normal');
logger.setLevel('INFO');

export function setupAppLogger(app) {
  app.use(log4js.connectLogger(logger, {
      level: 'auto',
      format: ':method :url :status'
    }
  ));
}

export default logger;
