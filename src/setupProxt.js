const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://asia.api.riotgames.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                // API 키를 요청 헤더에 추가
                proxyReq.setHeader('X-Riot-Token', 'RGAPI-3a68b21b-6dc6-4f0c-a271-8e382bbe18f8');
            }
        })
    );
};