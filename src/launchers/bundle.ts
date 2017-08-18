import * as webpack from 'webpack';
import { devServer } from '../config/target.config';
import webpackConfig from '../config/webpack.config';

async function bundle() {
  await new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      console.info(stats.toString(devServer.stats));
      return resolve();
    });
  });
}

export default bundle;
