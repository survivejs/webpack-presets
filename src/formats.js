export default (paths) => ({
  png: (format='png') => ({
    resolve: {
      extensions: ['.' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loader: 'url?limit=100000&mimetype=image/png',
          include: paths.png
        }
      ]
    }
  }),
  jpg: (format='jpg') => ({
    resolve: {
      extensions: ['.' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loader: 'file',
          include: paths.jpg
        }
      ]
    }
  }),
  json: (format='json') => ({
    resolve: {
      extensions: ['.' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loader: 'json',
          include: paths.json
        }
      ]
    }
  }),
  babel: (format='js') => ({
    resolve: {
      extensions: ['.' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loader: 'babel?cacheDirectory',
          include: paths.babel
        }
      ]
    }
  }),
  css: (format='css') => ({
    resolve: {
      extensions: ['' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loaders: ['style', 'css'],
          include: paths.css
        }
      ]
    }
  })
});
