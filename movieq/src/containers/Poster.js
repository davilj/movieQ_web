import React, { Component } from 'react';
import {
  ProgressBar,Button, ButtonGroup, Modal, Panel, Well, Alert, Badge, Thumbnail, Glyphicon
} from 'react-bootstrap';
import { invokeApig } from '../libs/awsLib';
import PosterContainer from './PosterContainer';
import './Poster.css';

class Poster extends Component {
  constructor(props) {
    super(props);
    if (props.movieQuest==null) {
      this.state = {
        movieYear: null,
      };
    } else {
      const year = this.extractYear(props.movieQuest)

      this.state = {
        movieYear: year,
      };
    }
  };

  async componentDidMount() {
    try {
      console.log("componentDidMount");
      const results = await this.getPosters(this.state.movieYear);
      console.log(JSON.stringify(results));
      const movieId = this.extractMovieId(results.posters, results.index);
      this.state.posters=results.posters,
      this.loadPoster(this.state.movieYear, movieId, results.index);
    } catch(e) {
      console.log("Error!!!")
      console.log(e)
      alert(e);
    }
  }

  getPosters(year) {
    const url = '/posters/' + year;
    console.log("Invoking api[getPosters]:" + url);
    return invokeApig({ path: url }, this.props.userToken);
  }

  getPoster(id) {
    const url = '/poster/' + id;
    console.log("Invoking api[getPoster]:" + id);
    return invokeApig({ path: url }, this.props.userToken);
  }

  async loadPoster(year, movieId, index) {
    console.log("Loading poster[" + year + "],[" + movieId + "]" );
    let poster = await this.getPoster(movieId);
    const options = poster.options;
    options.push(poster.name);
    poster.movieId = movieId;
    poster.year = year;

    this.setState({
      poster: poster,
      index : index
    });
  }

  updateStateWithMovieId = () => {
    let { posters, index } = this.state;
    index++;
    const movieId = this.extractMovieId(posters, index);
    const poster = this.loadPoster(this.state.movieYear, movieId, index);
  }

  extractMovieId(dictionary, index) {
    var tmpIndex=0;
    for (var key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        if (tmpIndex==index) {
          return key;
        }
        tmpIndex++;
      }
    }
  }

  extractYear(url) {
    if (url==null) {
      return "2017";
    } else {
      //movieQuest:"/poster?year=2017"
      var parts = url.split("=");
      return parts[1];
    }
  }

  render() {
    if (this.state.poster==null) {
      return null;
    }
    return (
      <div className="Home">
        <PosterContainer poster={this.state.poster} userToken={this.props.userToken} callback={this.updateStateWithMovieId}/>
      </div>
    );
  }
}

export default Poster;
