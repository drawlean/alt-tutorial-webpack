var React = require('react');
var AltContainer = require('alt-container');
var LocationStore = require('../stores/LocationStore');
var FavoritesStore = require('../stores/FavoritesStore');
var LocationActions = require('../actions/LocationActions');
var FavoriteActions = require('../actions/FavoriteActions');
import BaseLayout from "./BaseLayout.jsx";
import { Link } from 'react-router'
//import style from "./Locations.css";
import "./Locations.scss";

var Favorites = React.createClass({
  render() {
    return (
        <ul className="locations__table--content">

          <li className="title">
            <span className="num">编号</span>
            <span className="name">地名</span>
            <span className="favorite">简介</span>
          </li>
          {this.props.favLocations.map((location, i) => {
            return (
                <li key={location.id}>
                  <span className="num">{location.id}</span>
                  <span className="name" >{location.name}</span>
                </li>
            );
          })}
        </ul>
    );
  }
});

var AllLocations = React.createClass({
  addFave(ev) {
    var location = LocationStore.getLocation(
        Number(ev.target.getAttribute('data-id'))
    );
    FavoriteActions.addFavoriteLocation(location);
    LocationActions.markFavorites(location);
  },

  render() {
    if (this.props.errorMessage) {
      return (
          <div>{this.props.errorMessage}</div>
      );
    }

    if (LocationStore.isLoading()) {
      return (
          <div>
            <img src="ajax-loader.gif" />
          </div>
      )
    }

    return (
        <ul className="locations__table--content">

          <li className="title">
            <span className="num">编号</span>
            <span className="name">地名</span>
            <span className="favorite">收藏</span>
          </li>

          {
            this.props.locations.map((location, i) => {

                  var faveButton = (
                      <button onClick={this.addFave} data-id={location.id}>
                        Favorite
                      </button>
                  );

                  return(
                      <li key={location.id}>
                        <span className="num">{location.id}</span>
                        <span className="name" >{location.name}</span>
                        <span className="favorite">{location.has_favorite ? '√' : faveButton}</span>
                      </li>

                  )
                }
            )
          }

        </ul>

    );
  }
});

var Locations = React.createClass({
  componentDidMount() {
    LocationStore.fetchLocations();
  },

  render() {
    return (
        <BaseLayout title="Locations" style={{"backgroundColor":"#967e53"}}>
            <div>
              <h1 className="locations__table--head">Locations</h1>
              <AltContainer store={LocationStore}>
                <AllLocations />
              </AltContainer>

              <h1 className="locations__table--head">Favorites</h1>
              <AltContainer store={FavoritesStore}>
                <Favorites />
              </AltContainer>
            </div>
        </BaseLayout>
    );
  }
});

module.exports = Locations;
