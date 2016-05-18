'use strict';

import path from 'path';
import glob from 'glob';
glob.sync(path.join(__dirname, '!(index).js')).forEach(model => {
  require(model);
});
