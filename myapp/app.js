const express = require('express');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    console.log('모든 코드에서 실행');
    next();
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

app.listen(app.get('port'), () => {
    console.log('Express Server Start');
})