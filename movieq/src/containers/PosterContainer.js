import React, { Component } from 'react';
import {
  ProgressBar,Button, ButtonGroup, Modal, Panel, Well, Alert, Badge, Thumbnail, Glyphicon
} from 'react-bootstrap';
import { invokeApig } from '../libs/awsLib';
import './PosterContainer.css';

class PosterContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      guessIndex : 0,
      points : 100,
      win : false,
      lost : false

    };
  };

  getPosterImg(year, id) {
    return 	'http://s3.amazonaws.com/movieq/posters/' + year + '/' + id + ".jpg"
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
    const posterImg = this.getPosterImg(this.props.poster.year, this.props.poster.movieId);
    var blurClass = 'blur' + (6-index);
    var divStyle = {
      zIndex: '100',
    };

    return (
          <div>
            <Thumbnail ref='posterDiv' className={blurClass} src={posterImg} ></Thumbnail>
            <Button bsSize="large" style={divStyle} onClick={this.handleReadySelect.bind(this, index)}>Let me quess<Glyphicon glyph="hand-up" /></Button>
          </div>
    );
  };

  handleGuess = (name) => {
    const actual = this.props.poster.name;
    if (name===actual) {
      this.setState({
        showModal: false,
        win: true,
      });
    } else {
      let index = this.state.guessIndex;
      let points = this.state.points;
      points = points - 20;
      index = index + 1;

      const poster = this.refs['posterDiv']
      if (points>0) {
        poster.hidden=false;
        this.setState({
          guessIndex : index,
          points : points,
          showModal: false,
        });
      } else {
        poster.hidden=true;
        this.setState({
          guessIndex : index,
          points : points,
          showModal: false,
          lost: true,
        });
      }
    }
  }

  renderOptions(name) {
    return (
      <Button bsSize="xsmall" onClick={() => this.handleGuess(name)}>{name}</Button>
    );
  };

  renderMovieSelection() {
    const options = this.props.poster.options;
    this.shuffle(options);

    const tmp=[];
    const numberOfOptions = options.length;
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


  renderPoints() {
    var score = this.state.points;
    var divStyle = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      fontSize: '500px',
      fontWeight: 'bolder',
      zIndex: '-10',
      opacity: '0.1'
    };
    return (
      <h1 style={divStyle}>{score}</h1>
    )
  };

  completed() {
    this.state.win=false;
    this.state.lost=false;
    this.state.showModal=false,
    this.state.guessIndex=0,
    this.state.points=100,

    this.props.callback(this.state.points)
  }

  renderFeedback(callback) {
    var points = this.state.points;
    var win = this.state.win;
    var lost = this.state.lost;


    if (win) {
      return (
        <Alert bsStyle="success" onDismiss={() => this.completed()}>
          <h4>You did it...., you scored {points} points <Glyphicon glyph="thumbs-up" /></h4>
          <Button onClick={() => this.completed()}>Next challenge</Button>
        </Alert>
      )
    }

    if (lost) {
      return (
        <Alert bsStyle="danger" onDismiss={() => this.completed()}>
          <h4>Nope, you will never know <Glyphicon glyph="thumbs-down" /></h4>
          <Button onClick={() => this.completed()}>Try something different</Button>
        </Alert>
      )
    }
  };

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  render() {
    const index = this.state.guessIndex;
    const points = this.state.points;

    const pStyles = ['success','success','warning','warning','danger','danger']

    return (
      <div class="poster">
        <Panel header='Poster Quest'>
          <ProgressBar bsStyle={pStyles[index]} now={points} />
          {this.renderPosterButton(index)}
        </Panel>

        <div id='selectMovie' >
          <Modal show={this.state.showModal}>
            <Modal.Header>
              <Modal.Title>Poster for which movie?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderMovieSelection()}
            </Modal.Body>
          </Modal>
        </div>

        <div id='feedBack'>
          {this.renderFeedback()}
        </div>

        <div id='currentScore'>
          {this.renderPoints()}
        </div>
      </div>
    );
  }
}

export default PosterContainer;
