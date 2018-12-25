const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const football = require('./getData/footbal');
const botFoot = require('./bots/football');

process.title = 'ubetit';

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/wow', (req, res) => {
      //horse.getGame();
  })
  .listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
    football.getGame();
    //botFoot.botStart();
  })
