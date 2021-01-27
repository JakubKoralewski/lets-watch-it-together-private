const withPWA = require('next-pwa')
/** https://arunoda.me/blog/ssr-and-server-only-modules */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})



module.exports = (_phase, { _defaultConfig }) => {
	return withBundleAnalyzer(
		withPWA({
			webpack(config) {
				config.module.rules.push({
					test: /\.(mp3)$/,
					exclude: config.exclude,
					use:
						{
							loader: 'file-loader',
							options: {
								limit: config.inlineImageLimit,
								publicPath: '/_next/static/sounds/',
								outputPath: 'static/',
								name: '[name].[ext]',
								esModule: false,
							},
						},
				});
				// https://github.com/blitz-js/blitz/issues/13
				// https://github.com/blitz-js/blitz/issues/29
				// https://github.com/blitz-js/blitz/pull/31
				return config;
			},
			pwa: {
				dest: 'public',
				disable: process.env.NODE_ENV === 'development'
			},
			reactStrictMode: true
		})
	)
}