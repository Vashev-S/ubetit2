const FootBall = 'https://1xqrkh.host/us/live/Football/';
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const clientScripts = require('./clientScripts');

module.exports = {
  getGame: function() {
    let that = this;
    nightmare
      .goto('https://1xyqek.host/us/live/Football/')
      .wait('div[data-name="dashboard-champ-content"]')
      .evaluate((testData) => {
        //TODO: if i want to pass object to browser i need stringufy it
        let clientScripts = {
          getListOfGames: function() {
            let that = this,
                footballGames = [],
                gamesTable = $('#games_content').find('div[data-name="dashboard-champ-content"]');

            gamesTable.each(function() {
              let league = that.getLeague(this);
              let games = that.getGames(this);
              footballGames.push({league: league, games: games})
            })
            return footballGames;
          },

          /**
           * @param {JQuery{Object}} game
           */
          getLeague: function(game) {
            let league = $(game).find('.c-events__item_head')
                  .find('.c-events__name')
                  .children('a');
            let leagueName = league.text();
            let linkToLeague = league.attr('href');
            return {
              name: leagueName,
              url: linkToLeague
            }
          },

          /**
           * Return games of league
           */
          getGames: function(league) {
            let games = [];
            $(league)
              .find('.c-events__item_col')
              .each(function() {
                  let gameLink = $(this).find('a.c-events__name').attr('href');
                  let gameName = $(this).find('span.c-events__teams').attr('title');
                  let time = $(this).find('.c-events__time > span:first').text().replace(/:/g, '');
                  games.push({name: gameName, url: gameLink, time: time})
                })
            return games;
          }
        }
        return clientScripts.getListOfGames();
      }, 'testData')
      .end(result => {
        console.log(`We've got game list!`);
        return result;
      })
      .then(result => {
        //console.log(`OMFG = ${result}`);
        clientScripts.iterateOverMathces(result);
      })
      .catch(error => {
        console.error(`Getting gamelist failed: ${error}`);
      })
  }
}

