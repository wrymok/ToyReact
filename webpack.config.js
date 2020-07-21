module.exports = {
    entry: {
        main: "./main.js",
    },
    module: {
        rules: [
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
                plugins: [
                [
                    "@babel/plugin-transform-react-jsx", // 解释JSX语法，转为调用方法的原始形式
                    { pragma: "ToyReact.createElement" }, // 更改调用方法名
                ],
                ],
            },
            },
        },
        ],
    },
    mode: "development",
    optimization: { minimize: false },
};