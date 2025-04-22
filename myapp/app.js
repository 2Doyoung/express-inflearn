const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.send('Express Hello!!');
});

app.post('/', (req, res) => {
    res.send('Express Post')
})

app.listen(app.get('port'), () => {
    console.log('Express Server Start');
})