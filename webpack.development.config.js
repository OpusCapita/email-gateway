const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill', path.resolve(__dirname, './src/client/index.js')],
	output: {
		path: path.resolve(__dirname, './src/server/static'),
		publicPath: '/static',
		filename: 'bundle.js'
	},

	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty'
	},

	devtool: 'eval-source-map',
	watch: true,
	watchOptions: {
		ignored: ['node_modules']
	},

	plugins: [
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|de/),
		new webpack.NoEmitOnErrorsPlugin()
	],

	module: {
		rules: [
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			},
			{
				test: /.jsx?$/,
				include: [
					path.join(__dirname, 'local'),
					path.join(__dirname, 'src')
				],
				loader: 'babel-loader',
				options: {
					compact: false,
					presets: [
						['env', { 'targets': { 'node': 8, 'uglify': true }, 'modules': false }],
						'stage-0',
						'react'
					],
					plugins: ['transform-decorators-legacy']
				}
			}
		]
	}
};
