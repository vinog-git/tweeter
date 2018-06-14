const express = require('express')
const app = express()
app.use('/', express.static('src'));
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Tweeter is listening at ' + PORT));
