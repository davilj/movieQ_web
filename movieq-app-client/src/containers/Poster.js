import React, { Component } from 'react';
import {
  ProgressBar,Button, ButtonGroup, Modal, Panel, Well, Alert, Badge, Thumbnail, Glyphicon
} from 'react-bootstrap';

import './Poster.css';

class Poster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      index : 0,
      movie : null,
      points : 100,
      win : false,
      lost : false,
    };
  };


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



    var posterImg = this.props.movie.posters[index];

    return (
          <Thumbnail ref='posterDiv' src={posterImg} >
            <Button bsSize="large" onClick={this.handleReadySelect.bind(this, index)}>Let me quess<Glyphicon glyph="hand-up" /></Button>
          </Thumbnail>
    );
  };

  handleMovieSelection = (name) => {
    var actual = this.props.movie.name;
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
    var options = this.props.movie.names
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
    if (this.props.movie==null) {
      window.location = '/';
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
