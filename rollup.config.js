import { uglify } from 'rollup-plugin-uglify'
import es3 from 'rollup-plugin-es3'
// import serve from 'rollup-plugin-serve'
// import livereload from 'rollup-plugin-livereload'
// import babel from '@rollup/plugin-babel'
// import { nodeResolve } from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import ts from '@rollup/plugin-typescript'
// import typescript from 'typescript'
// import visualizer from 'rollup-plugin-visualizer'
import path from 'path'
// import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import cssbundle from 'rollup-plugin-css-bundle'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
// import replace from '@rollup/plugin-replace'
// import postcssPlugin from 'rollup-plugin-postcss'
// import stringHash from 'string-hash'
import progress from 'rollup-plugin-progress'
import filesize from 'rollup-plugin-filesize'
// import buble from '@rollup/plugin-buble'
// import pkg from './package.json'
import multi from '@rollup/plugin-multi-entry'
// import json from '@rollup/plugin-json'
// import { writeStaticFileAsync } from './scripts/write_static_file_async'
// import nodePolyfills from 'rollup-plugin-polyfill-node'

// const gitSHA1 = process.env.GIT_SHA1 || 'No process.env.GIT_SHA1'
// const buildInfoFilePath = path.join(__dirname, 'front/static/js/common/constants/build-info.js')
// writeStaticFileAsync(buildInfoFilePath, `const gitSHA1 = '${gitSHA1}';`)

// TODO: https://github.com/jlengstorf/learn-rollup/blob/master/rollup.config.js

/* NOTE: DANGER ZONE!
  1. Правила сборки, расположения исходников и их билдов одни для всех SPA
  2. See also:
  https://t.me/javascript_ninja/194559
  https://github.com/module-federation/rollup-federation
  3. Также можно пробовать юзать продвинутые инструменты, настроенные из коробки:
  - https://create-react-app.dev/
  - https://vitejs.dev/
  - https://parceljs.org/
*/

// const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
// const isSPAOpened = process.env.OPEN_SPA === '1'

const pluginsForLegacyJS = []
// if (isProd) pluginsForLegacyJS.push(buble({ transforms: { forOf: false, asyncAwait: false } }))
if (isProd) pluginsForLegacyJS.push(es3())
if (isProd) pluginsForLegacyJS.push(uglify())
// pluginsForLegacyJS.push(filesize({ showGzippedSize: false }))

export default [
  // NOTE: Common legacy styles build
  {
    input: 'src/css-build-tool.js',
    // В input файле должны быть импортированы все стили, подключаемые в шаблонах
    // На выходе - один бандл легаси-стилей (js билд не нужен)  
    output: {
      file: 'dist.viselitsa-2023/main.bundle.js',
      format: 'iife',
    },
    plugins: [
      progress(),
      cssbundle({
        transform: code => postcss([autoprefixer]).process(code.replace(/(\r\n|\n|\r)/gm, ''), { from: undefined }),
        output: path.join(__dirname, 'dist.viselitsa-2023/css/main.bundle.css')
      }),
      filesize({ showGzippedSize: false }),
    ]
  },

  // NOTE: Utils pack
  /*
  {
    input: [
      'src/js/utils/dom-tools/proto-upgrade.js',
      'src/js/utils/dom-tools/has-any-attrs.js',
      'src/js/utils/dom-tools/iterateChilds.js',
    ],
    output: {
      file: 'dist.viselitsa-2023/js/utils.0.bundle.js',
      format: 'cjs',
      // sourcemap: true,
    },
    treeshake: false,
    plugins: [multi(), ...pluginsForLegacyJS],
  },
  */

  // NOTE: Other legacy js
  {
    input: [
      'src/js/utils/DeepProxy.js',
      'src/js/utils/takeFromLS.js',
      'src/js/utils/possibleFinishImgSrcs.js',
      'src/js/utils/httpClient/1-fetchRetry.js',
      'src/js/utils/httpClient/2-httpClient.js',
      'src/js/utils/playRandomAudio.js',
      'src/js/utils/getNormalizedItems.js',
    ],
    output: {
      file: 'dist.viselitsa-2023/js/utils.1.bundle.js',
      format: 'cjs',
      // sourcemap: true,
    },
    treeshake: false,
    plugins: [multi(), ...pluginsForLegacyJS],
  },
  // {
  //   input: 'src/js/utils/sweetalert2@11.6.16.all.min.js',
  //   output: {
  //     file: 'dist/js/sweetalert2@11.6.16.all.min.js',
  //     format: 'cjs'
  //   },
  //   treeshake: false,
  //   plugins: [],
  // },
  {
    input: [
      'src/js/main.js',
    ],
    output: {
      file: 'dist.viselitsa-2023/js/main.bundle.js',
      format: 'cjs',
      sourcemap: true,
    },
    treeshake: false,
    plugins: [multi(), ...pluginsForLegacyJS],
  },
]
