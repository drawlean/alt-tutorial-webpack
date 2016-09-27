var alt = require('../alt');
var FavoriteActions = require('../actions/FavoriteActions');

class FavoritesStore {
  constructor() {
    this.favLocations = [];

    this.bindActions(FavoriteActions);

  }

  onAddFavoriteLocation(location) {
    this.favLocations.push(location);
  }
}

module.exports = alt.createStore(FavoritesStore, 'FavoritesStore');
