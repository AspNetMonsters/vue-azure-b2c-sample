module.exports = {
  "devServer": {
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        logLevel: 'debug',
        ignorePath: false,
        ws: true
      }
    },
  },
  "transpileDependencies": [
    "vuetify"
  ]
}