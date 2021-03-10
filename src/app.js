const express = require('express');
const userRouter = require('./router/user_router');

const app = express();
// app级别中间件，一定在最上面
function log_middleware(req, res, next) {
    console.log('请求进来了')
    next();
}

app.use(log_middleware);

// 加载一个 static 的中间件
// 内置中间件（Built-in middleware）：static json urlencoded 就三个
// 第三方中间件（Third-party middleware）：cookie-parser
app.use(express.static('static', {
    extensions: ['html', 'htm']
}))

// 路由
app.use('/user',userRouter);

/**
 * 中间件完整结构
 * 1. 是一个函数
 * 2. err,req,res,next -- function
 */
function demo_middleware(err, req, res, next) {
    // 1. 异常
    // 2. 处理义务功能，然后转交控制权--next
    // 3. 相应请求--结束相应--当作路由的处理函数
}

// /test?name=123
function valid_name_middleware(req, res, next) {
    let { name } = req.query;
    if (!name || name.length) {
        res.json({
            message: '缺少name参数'
        })
    } else {
        next();
    }
}


// 中间件里面异常怎么处理
function demo_middleware(req, res, next) {
    try {
        // mysql 操作
    } catch (error) {
        next(error) // 通过catch的next抛出
    }

    // Promise.then().catch(next) Pormise直接在catch里面写next就可以了
}

// 异常处理中间件
function error_handler_middleware(err, req, res, next) {
    if (err) {
        let { message } = err;
        res.status(500)
        .json({
            message: `${message || '服务器异常'}`
        })
    } else {

    }
}

// 404异常处理
function not_found_handler(req, res, next) {
    res.json({
        message: 'api不存在'
    })
}

/**
 * 所有的请求都会走这个中间件
 */
// app.all('*', valid_name_middleware)


/**
 * test路径走到这里
 */
app.get('/test', (req, res) => {
    res.json({
        message: 'test'
    })
})

// 模拟异常
app.get('/error', (req, res) => {
    throw new Error('测试异常功能')
})

// 一定要放在地下，当所有的路由都处理不了的时候用这个
app.use(not_found_handler)


// 异常处理我们要放在所有路由最后面
// 因为路由是链式调用、当抛异常的时候一步一步的到最底部
app.use(error_handler_middleware)


app.listen('3000', () => {
    console.log('启动成功')
})
