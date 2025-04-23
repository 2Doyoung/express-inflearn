const express = require('express');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    console.log('모든 코드1에서 실행');
    next();
}, (req, res, next) => {
    console.log('모든 코드2에서 실행');
    next();
}, (req, res, next) => {
    console.log('모든 코드3에서 실행');
    next();
})
// }, (req, res, next) => {
//     throw new Error('Error');
// })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    res.send('한 라우터에 응답(res)을 두 번 이상 보내려고 할 때');
    res.json({ hello : 'LEE' })
});

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