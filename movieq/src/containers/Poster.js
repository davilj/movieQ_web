import React, { Component } from 'react';
import {
  ProgressBar,Button, ButtonGroup, Modal, Panel, Well, Alert, Badge, Thumbnail, Glyphicon
} from 'react-bootstrap';
import { invokeApig } from '../libs/awsLib';
import './Poster.css';

class Poster extends Component {
  constructor(props) {
    super(props);
    var year = this.extractYear(props)

    this.state = {
      showModal: false,
      index : 0,
      movie : null,
      movieYear : year,
      points : 100,
      win : false,
      lost : false,
    };
  };

  async componentDidMount() {
    try {
      console.log("Loading data");
      console.log("user scoreboard");
      const results = await this.getPosters(this.state.movieYear);
      console.log(JSON.stringify(results))

      console.log("next poster");
      const index = results.index;
      const movieId = this.extractPosterId(results.posters, index);
      var poster = await this.getPoster(movieId);
      poster['img']=this.getPosterImg(movieId);

      this.setState({
        posters: results.posters,
        poster: poster
      });
    }
    catch(e) {
      console.log("Error!!!")
      console.log(e)
      alert(e);
    }
  }

  extractYear(url) {
    //movieQuest:"/poster?year=2017"
    return "2017"
  }

  getPosterImg(id) {
    return 	'http://s3.amazonaws.com/movieq/posters/2016/p21022.jpg'
  }

  extractPosterId(posterArr, index) {
    var n=0;
    for (var key in posterArr) {
      if (posterArr.hasOwnProperty(key)) {
          if (n==index) {
            return key
          }
          n++;
      }
    }
  }

  getPosters(year) {
    var url = '/posters/' + year;
    console.log("Invoking api:" + url);
    return invokeApig({ path: url }, this.props.userToken);
  }

  getPoster(id) {
    var url = '/poster/' + id;
    console.log("Invoking api:" + id);
    return invokeApig({ path: url }, this.props.userToken);
  }


  handleReadySelect(i)   {
    var poster = this.refs['posterDiv']
    poster.hidden=true;
    this.setState({
      showModal: true,
      index : i
    });
  }

  renderPosterButton = (index) => {
    //win, lost == false game still on

    if (this.state.win || this.state.lost) {
        return;
    }
    var posterImg = this.state.poster.img
    var blurClass = 'blur' + (6-index);


    return (
          <div>
            <Thumbnail ref='posterDiv' className={blurClass} src={posterImg} ></Thumbnail>
            <Button bsSize="large" onClick={this.handleReadySelect.bind(this, index)}>Let me quess<Glyphicon glyph="hand-up" /></Button>
          </div>
    );
  };

  handleMovieSelection = (name) => {
    var actual = this.state.poster.name;
    if (name===actual) {
      this.setState({
        showModal: false,
        win: true,
      });
    } else {
      var index = this.state.index;
      var points = this.state.points;
      points = points - 20;
      index = index + 1;

      var poster = this.refs['posterDiv']
      if (points>0) {
        poster.hidden=false;
        this.setState({
          index : index,
          points : points,
          showModal: false,
        });
      } else {
        poster.hidden=true;
        this.setState({
          index : index,
          points : points,
          showModal: false,
          lost: true,
        });
      }
    }
  }

  renderOptions(name) {
    return (
      <Button bsSize="xsmall" onClick={this.handleMovieSelection.bind(this, name)}>{name}</Button>
    );
  };

  renderMovieSelection() {
    var options = this.state.poster.options
    var tmp=[];

    var numberOfOptions = options.length;
    if (numberOfOptions>0) {
      for (var index = 0; index<numberOfOptions; index++) {
        tmp.push(this.renderOptions(options[index]))
      }
    }
    return (
      <ButtonGroup vertical>
        {tmp}
      </ButtonGroup>
    );
  };

  handleEnd() {
    //todo update server
    window.location = '/';
  };

  renderFeedback() {
    var points = this.state.points;
    var win = this.state.win;
    var lost = this.state.lost;

    if (win) {
      return (
        <Alert bsStyle="success" onDismiss={this.handleEnd}>
          <h4>You did it...., you scored {points} points <Glyphicon glyph="thumbs-up" /></h4>
          <Button onClick={this.handleEnd}>Next one</Button>
        </Alert>
      )
    }

    if (lost) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleEnd}>
          <h4>Nope, you will never know <Glyphicon glyph="thumbs-down" /></h4>
          <Button onClick={this.handleEnd}>Next one</Button>
        </Alert>
      )
    }
  }

  render() {
    var points = this.state.points;
    var index = this.state.index;
    if (this.state.poster==null) {
      //window.location = '/';
      return null;
    }

    var pStyles = ['success','success','warning','warning','danger','danger']

    return (
      <div className="Home">
        <Panel header='Poster Quest'>
          <ProgressBar bsStyle={pStyles[index]} now={points} />
          {this.renderPosterButton(this.state.index)}
        </Panel>

        <div id='selectMovie'>
          <Modal show={this.state.showModal}>
            <Modal.Header>
              <Modal.Title>Poster for which movie?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderMovieSelection()}
            </Modal.Body>
          </Modal>
        </div>

        <div id='selectMovieWin'>
          {this.renderFeedback()}
        </div>
      </div>
    );
  }
}

export default Poster;
