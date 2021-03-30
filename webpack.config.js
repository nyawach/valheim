// node_modulesをバンドル対象から外すために必要
const nodeExternals = require('webpack-node-externals');
module.exports = {
   mode: "production",
   target: "node",
   externals: [nodeExternals()],
   devtool: "hidden-source-map",
   resolve: {
       modules: ["node_modules"],
       extensions: ['.ts', '.js']
   },
   module: {
       rules: [
           {
               test: /\.ts$/,
               loader: 'ts-loader'
           }
       ]
   },
   output: {
       path: __dirname + "/dist",
       filename: "index.js",
       libraryTarget: "commonjs"
   }
}
