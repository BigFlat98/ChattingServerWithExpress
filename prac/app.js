const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
dotenv.config();
const webSocket = require('./socket.js');
const indexRouter = require('./routes/router_index.js');
const app = express();

nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use('/', indexRouter);



// 404 처리 미들웨어
app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어
app.use((err,req,res,next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server); // 웹소켓 서버 연결
