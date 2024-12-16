const mix = require('laravel-mix')
const path = require('path')
// const { GenerateSW } = require('workbox-webpack-plugin');

/**
 * By default, AdonisJS public path for static assets is on the `./public` directory.
 *
 * If you want to change Laravel Mix public path, change the AdonisJS public path config first!
 * See: https://docs.adonisjs.com/guides/static-assets#the-default-directory
 */
mix.setPublicPath('public')

mix
  .js('resources/vue/preview.js', path.resolve(__dirname, 'public/js'))

  .webpackConfig({
    context: __dirname,
    node: {
      __filename: true,
      __dirname: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'resources/vue'),
        '~': path.resolve(__dirname, 'resources/vue'),
        'l': path.resolve(__dirname, 'resources/assets/sass'),
      },
    }
  })
//   .sass('resources/assets/scss/app.scss', path.resolve(__dirname, 'public/css'))
  .copy('resources/vue/assets/images/', 'public/images/', false)
  .copy('resources/vue/assets/videos/', 'public/videos/', false)
  .options({
    processCssUrls: false,
  })
  .vue().version();
