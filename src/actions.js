import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default (paths) => ({
  setEnvironment: (target) => ({
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(target)
      })
    ]
  }),
  lint: (format) => ({
    preLoaders: [
      {
        test: new RegExp('\.' + format + '$'),
        loader: 'eslint',
        include: paths.babel
      }
    ]
  }),
  enableHMR: () => ({
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only'
    }
  }),
  extractCSS: (name) => ({
    plugins: [
      new ExtractTextPlugin(name + '.[chunkhash].css')
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths.css
        }
      ]
    }
  }),
  generateCommonsChunk: (name) => ({
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [name, 'manifest']
      }),
      new webpack.optimize.DedupePlugin()
    ]
  }),
  minify: () => ({
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  })
});
