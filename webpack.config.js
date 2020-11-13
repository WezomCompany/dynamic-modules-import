const HtmlWebpackPlugin = require('html-webpack-plugin');
const fromCWD = require('from-cwd');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: fromCWD('./examples/app.ts'),
	module: {
		rules: [
			{
				test: /.ts$/,
				exclude: /node_modules/,
				use: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	externals: {
		jquery: 'jQuery'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'DMI Example',
			template: fromCWD('./examples/template.html'),
			filename: 'index.html'
		})
	],
	devServer: {
		port: 9000
	}
};
