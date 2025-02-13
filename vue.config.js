const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { JSDOM } = require('jsdom');

module.exports = {
  // ✅ 빌드 폴더 명확히 설정
  outputDir: path.resolve(__dirname, 'dist'),

  // ✅ Vue Router `history` 모드 사용 시 필요한 설정
  publicPath: '/',
  productionSourceMap: false,

  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') return;

    config.plugins.push(
      // ✅ Prerendering (SSR 없이 SEO 최적화)
      new PrerenderSPAPlugin({
        staticDir: path.resolve(__dirname, 'dist'),
        routes: ['/'], // 미리 렌더링할 페이지 추가
        renderAfterDocumentEvent: 'render-event',
        
        // ✅ 비동기 데이터 로딩 처리
        beforeRender: async (page) => {
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
          return page;
        },

        // ✅ HTML 후처리 (script defer 및 meta 태그 조정)
        postProcess (context) {
          const dom = new JSDOM(context.html);
          const document = dom.window.document;

          // script 태그를 defer로 변경
          document.querySelectorAll('script').forEach(script => {
            script.setAttribute('defer', 'defer');
          });

          context.html = dom.serialize();
          return context;
        }
      }),

      // ✅ Gzip 압축 적용 (HTML, JS, CSS 최적화)
      new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    );
  },

  // ✅ 웹팩 최적화
  chainWebpack: config => {
    // 이미지 최적화
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true, disable: true });

    // CSS 압축 최적화
    config.optimization.minimize(true);
  },

  // ✅ 개발 서버 설정 (로컬 개발 시 편의성 추가)
  devServer: {
    historyApiFallback: true,
    compress: true,
    port: 8080
  }
};
