const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, waitTimeout: 15000 });
const parseData = require('../dataParse/soccer');

module.exports = {
  gamesData: {},
  currentLeague: 0,
  currentGame: 0,
  /**
   * Get leagues and its link
   * @return {Array}
   */
  /*getListOfGames: function() {
    let that = this,
        footballGames = [],
        gamesTable = $('#games_content').find('div[data-name="dashboard-champ-content"]');

    gamesTable.each(function() {
      let league = that.getLeague(this);
      let games = that.getGames(this);
      footballGames.push({league: league, games: games})
    })
    return footballGames;
  },*/

  /**
   * @param {JQuery{Object}} game
   */
  /*getLeague: function(game) {
    let league = $(game).find('.c-events__item_head')
          .find('.c-events__name')
          .children('a');
    let leagueName = league.text();
    let linkToLeague = league.attr('href');
    return {
      name: leagueName,
      link: linkToLeague
    }
  },*/

  /**
   * Return games of league
   */
  /*getGames: function(league) {
    let games = [];
    $(league).find('.c-events__item_col').each(function() {
      let gameLink = $(this).find('a.c-events__name').attr('href');
      let gameName = $(this).find('span.c-events__teams').attr('title');
      let time = $('.db-sport__timer.timer')
                        .text()
                        .replace(/:/g, '');     //Convert to navy time (15:00 -> 1500)
      games.push({name: gameName, link: gameLink, time: parseInt(time)})
    })
    return games;
  },*/

  /**
   * Iterate over matches and grab stat
   * @param {Array} gamesData - array of objects {league: {name, url}, games: [{name, url, time}, ...]}
   * @return {Array} _gamesData - same array as parametr but with statisctic about every match
   */
  iterateOverMathces: function(gamesData) {
    this.gamesData = gamesData;
    this.currentLeague = 0;
    this.currentGame = 0;
    let game = this.gamesData[this.currentLeague].games[this.currentGame];
    if (!game) {
      return `gamesData - corrupted`;
    }
    //inititate getting statistics
    this.nextMatch(game);
    return `Next match inititated.`;
  },

  /**
   * Putting stat in data object
   * @param {Object} game - gamesData.game[i]
   */
  nextMatch: function(game) {
    console.log(`Call nextMatch with  ${game.name}`);
    let that = this;
    let nextIterate = () => {console.log(`that's it all ya game statistic here : {JSON.stringify(that.gamesData)}`)};
    let nextGame = that.gamesData[that.currentLeague].games[++that.currentGame];  //next game in same league
    let nextLeague = that.gamesData[that.currentLeague + 1];                      //first game in next league

    if (nextGame) {
      nextIterate = that.nextMatch.bind(that, nextGame);
      console.log(`Next game set to ${nextGame.name}`);
    } else if (nextLeague) {
      that.currentLeague++;           //goto next league only if it is exist
      that.currentGame = 0;           //first game of the new league
      nextIterate = that.nextMatch.bind(that, nextLeague.games[that.currentGame]);
      console.log(`Next league set to ${nextLeague.league.name} and next game set to ${nextLeague.games[that.currentGame].name}`);
    } else {
      setTimeout(function() {parseData.getGoodGame(that.gamesData)}, 10000);
      console.log(`All statistic have been got.`);
    }
    //Lets get statistic
    //game.statistic = that.getMatchStatistic(game.url, nextIterate);
    that
      .getMatchStatistic(game.url, nextIterate)
      .then((statistic) => {
        game.statistic = statistic;
      });
  },

  /**
   * @param {String} url - relative path to a game
   * @return {Object} gameStatistic
   */
  getMatchStatistic: function(url, callBack) {
    var gameStatistic = {};
    return nightmare
      .goto('https://1xyqek.host/us/' + url)
      .wait('.db__stats')
      .evaluate((testData) => {
        let statsTable = $('.db__stats');
        let stats = statsTable.find('.db-stats-table__group');
        let statistic = {};
        stats.each(function() {
          //Name of stat (exmpl: corners)
          let name = $(this)
                        .find('.db-stats-table__description')
                        .text()
                        .toLowerCase()
                        .replace(/ /g, '');   //remove whitespaces
          let countFirstTeam = $($(this).find('.db-stats-table__count')[0]).text();     //Count of stats type for 1st team
          let countSecondTeam = $($(this).find('.db-stats-table__count')[1]).text();    //Count of stats type for 2nd team
          statistic[name] = {first: parseInt(countFirstTeam), second: parseInt(countSecondTeam)};
        });
        return statistic;
      }, 'testData')
     /* .end((result) => {
        console.log(`${url} __ We've got game statistic!`);
        return result;
      })*/
      .then(statistic => {
        console.log(`${url} __ We've got game statistic!`);
        //console.log(`OMFG = ${JSON.stringify(result)}`);
        callBack();
        gameStatistic = statistic;
        //console.log(statistic);
        return statistic;
      })
      .catch(error => {
        callBack();
        console.error(`Get Match failed: ${error} ${url}`);
      })
  },


  callBackHell: function() {
    let that = this;
    let _gamesData = gamesData;
    for (let element of _gamesData) {
      for(let game of element.games) {
        (game.url)
      }
    }
    return _gamesData;
  }
}
