import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {
  context,
  getProjectAbsPath,
  isInferno,
  isTS,
  tmpTypescryptConfigDir,
  tmpTypescryptConfigPath,
  typescript,
} from './prepare.build-tools.config';

export default () => {
  if (isTS) {
    const { configPath, showConfigForIDE, config: { compilerOptions, compileOnSave } } = typescript;
    const { dependencies: { typescript: version } } = require(path.resolve(__dirname, '../../package.json'));
    const config = {
      version,
      compilerOptions: Object.assign({
        target: 'es6',
        module: 'es6',
        lib: [
          'es6',
          'es7',
          'dom',
        ],
        allowJs: false,
        sourceMap: true,
        rootDir: './',
        removeComments: true,
        importHelpers: true,
        downlevelIteration: false,
        isolatedModules: false,

        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        alwaysStrict: true,
        noUnusedLocals: true,
        noImplicitReturns: true,

        moduleResolution: 'node',
        baseUrl: context,
        paths: {},
        rootDirs: [],
        typeRoots: ['node_modules/@types'],

        ...isInferno ? {
          types: [
            'node',
            'inferno',
          ],
          jsx: 'preserve',
        } : {
          jsx: 'react',
        },
        allowSyntheticDefaultImports: true,
        preserveConstEnums: true,

      }, compilerOptions),
      include: [
        `${context}/**/*`,
      ],
      exclude: [
        'node_modules',
      ],
      compileOnSave,
    };

    if (showConfigForIDE) {
      fs.writeFileSync(getProjectAbsPath(configPath), JSON.stringify(config, null, 2));
    } else {
      fs.unlinkSync(getProjectAbsPath(configPath));
    }
    mkdirp.sync(tmpTypescryptConfigDir);
    fs.writeFileSync(tmpTypescryptConfigPath, JSON.stringify(config, null, 2));
  }
};