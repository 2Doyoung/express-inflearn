const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const multer = require('multer');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
//app.use(morgan('combined'));

// app.use('/', express.static(__dirname, 'public'));

app.use(cookieParser('LEE'));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'LEE',
    cookie: {
        httpOnly: true,
    },
    name: 'connect.sid'
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res, next) => { 
    if(req.session.id) {
        express.static(__dirname, 'public')(req, res, next)
    } else {
        next();
    }
})


app.use((req, res, next) => {
    console.log('모든 코드1에서 실행');
    next();
}, (req, res, next) => {
    console.log('모든 코드2에서 실행');
    next();
}, (req, res, next) => {
    console.log('모든 코드3에서 실행');
    next();
}, (req, res, next) => {
    try {
        // console.log(notdefined);
    } catch(error) {
        next(error);
    }

    next();
})
// }, (req, res, next) => {
//     throw new Error('Error');
// })

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));

    // req.session;

    // req.cookies;
    // req.signedCookies;
    // res.cookie('name', encodeURIComponent('LEE'), {
        
    // })

    // res.clearCookie('name', encodeURIComponent('LEE'), {

    // })
    // res.sendFile(path.join(__dirname, 'index.html'));

    // req.body.name;
    /*
    res.send('한 라우터에 응답(res)을 두 번 이상 보내려고 할 때'); 
    res.json({ hello : 'LEE' })
    */
   // next('route');
}, (req, res, next) => {
    console.log('실행안됨');
});

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
//     console.log('실행됨');
// });

app.get('/about', (req, res) => {    
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/category/javascript', (req,res) => {
    res.send('Hello Javascript');
})

app.get('/category/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`)
})

// app.get('/category/node', (req,res) => {
//     res.send('Hello Node')
// })

// app.get('/category/react', (req,res) => {
//     res.send('Hello React')
// })

// app.get('/category/java', (req,res) => {
//     res.send('Hello Java')
// })

app.post('/', (req, res) => {
    res.send('Express Post')
})

// app.get('/*', (req, res) => {
//     res.send('Hello Every')
// })

app.use((req, res, next) => {
    res.send('404 에러')
})

app.use((err, req, res, next) => {
    console.error(err);
    res.send('에러페이지');
})

app.listen(app.get('port'), () => {
    console.log('Express Server Start');
})