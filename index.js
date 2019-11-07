const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/foo', (req, res) => {
  res.send("FOO")
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})


PORT = 3001
console.log("Started server on port: ", PORT)
app.listen(PORT)
