const clientScripts = require('../getData/clientScripts');

module.exports = {
  gamesData: {},
  /**
   * Find needed game
   */
  getGoodGame: function(gamesData) {
    //console.log(`omfg dat shit ${JSON.stringify(gamesData)}`);
    this.gamesData = gamesData;
    for (let element of gamesData) {
      for(let game of element.games) {
        //if statistic exist check it
        if (game.statistic && this.checkGame(game)) {
          console.log(`Good one in league ${element.league.name} ---- ${game.name}`);
        }
      }
    }
  },

  /**
   * i was drunk be care
   * @return {Boolean} true if game is good
   */
  checkGame: function(game) {
    try {
      let _game = game,
          dangerousattacksFirst = 1,
          dangerousattacksSecond = 1,
          ratio = 0;
      if (_game.statistic.constructor === Object && Object.keys(_game.statistic).length === 0) {
        return false;
      }
      dangerousattacksFirst = _game.statistic.dangerousattacks.first || 1;
      dangerousattacksSecond = _game.statistic.dangerousattacks.second || 1;
      if (_game.time < 1200 || _game.time > 3000) {
        return false;
      }
      //Count atttacks
      if (dangerousattacksFirst > dangerousattacksSecond) {
        ratio = dangerousattacksFirst/dangerousattacksSecond;
      } else {
        ratio = dangerousattacksSecond/dangerousattacksFirst;
      }
      if (ratio > 1.5) {
        return true;
      } else {
        return false;
      }

    }
    catch (e) {
      console.log(`eRORRDKFSDKF ${e}`)
    }
    }

}
