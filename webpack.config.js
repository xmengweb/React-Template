const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.tsx"),
  output: {
    filename: "[name].[contenthash:5].js",
    path: path.resolve(__dirname, "./build"),
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".less"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 浏览器前缀自动补全
                plugins: ["autoprefixer"],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp)$/,
        type: "asset",
        generator: {
          filename: "img/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.(eot|ttf|otf|woff2?)$/,
        type: "asset",
        generator: {
          filename: "fonts/[name].[hash:8][ext]",
        },
      },
      // {
      //   test: /\.tsx?$/,
      //   use: "ts-loader",
      //   exclude: /node_modules/,
      // },
      {
        test: /\.(jsx?|tsx?)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: "3",
                },
              ],
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:5].css"
    }),
    new HtmlWebpackPlugin({
      // HTML模板文件
      template: path.resolve(__dirname, "./src/assets/index.ejs"),
    }),
  ],
  devServer: {
    port: 3000,
    // 跨域配置
    proxy: {
      "/api": {
        // 请求转发给谁
        target: "http://localhost:3001/",
        changeOrigin: true, // 是否对告诉真实服务器真实的源，false不改变源(真实的源) true(改变源)
        pathRewrite: { "^/api": "" }, // 重写请求路径
      },
    },
  },
  stats: 'minimal'
};
