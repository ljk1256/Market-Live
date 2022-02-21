const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/user', {
            target: 'https://i6c110.p.ssafy.io:8110',
            changeOrigin: true
        })
    )
    app.use(
        createProxyMiddleware('/auth', {
            target: 'https://i6c110.p.ssafy.io:8110',
            changeOrigin: true
        })
    )
    app.use(
        createProxyMiddleware('/dm', {
            target: 'https://i6c110.p.ssafy.io:8111',
            changeOrigin: true
        })
    )
    app.use(
        createProxyMiddleware('/broad', {
            target: 'https://i6c110.p.ssafy.io:8113',
            changeOrigin: true
        })
    )
    app.use(
        createProxyMiddleware('/room', {
            target: 'https://i6c110.p.ssafy.io:8113',
            changeOrigin: true
        })
    )
    app.use(
        createProxyMiddleware('/viewer', {
            target: 'https://i6c110.p.ssafy.io:8113',
            changeOrigin: true
        })
    )
    // app.use(
    //     createProxyMiddleware('/broad', {
    //         target: 'https://i6c110.p.ssafy.io:8113',
    //         changeOrigin: true
    //     })
    // )
};
