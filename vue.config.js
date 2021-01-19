module.exports = {
  "devServer": {
    proxy: {
      '/api': {
        target: 'http://localhost:7071', // Use 'https://localhost:5001' for the ASP.NET Core backend
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