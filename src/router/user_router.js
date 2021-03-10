const express = require('express');

const router = express.Router(); // 路由对象

// 路由级别中间件
router.use(function (req, res, next) {
    console.log('log from router');
    next();
})

// 正常需要body转换
// 127.0.0.1:3000/user/login?name=123&password=12
function vlaid_login_params(req, res, next) {
    let { name, password } = req.query;
    if (!name || !password) {
        res.json({
            message: '参数校验失败'
        })
    } else {
        req.formdata = {
            name,
            password
        }
        next();
    }
}

// 登录验证路由通过中间件处理
router.get('/login', [vlaid_login_params/** middleware */], (req, res) => {
    const { formdata } = req;
    res.json({
        formdata,
        message: '校验通过'
    })
})

// 通过第二个参数（一系列中间件）处理函数，得到结果
router.get('/demo', [/** middleware */],(req, res) => {
    res.json({
        message: 'from router demo'
    })
})


module.exports = router;