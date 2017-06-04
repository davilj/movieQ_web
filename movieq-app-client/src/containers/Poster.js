import React, { Component } from 'react';
import {
  ProgressBar,Button, ButtonGroup, Modal, Panel
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
    var posterImg = this.props.movie.posters[index];

    return (
        <div ref='posterDiv'><img alt='image of movie poster' src={posterImg}/><Button onClick={this.handleReadySelect.bind(this, index)}>Ready...</Button></div>
    );
  };

  handleMovieSelection = (name) => {
    var actual = this.props.movie.name;
    if (name===actual) {
      alert("Yippeeee");
    } else {
      var index = this.state.index;
      var points = this.state.points;
      points = points - 20;
      index = index + 1;

      var poster = this.refs['posterDiv']
      poster.hidden=false;
      this.setState({
        index : index,
        points : points,
        showModal: false,
      });
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

  render() {
    var points = this.state.points;
    var index = this.state.index;

    var pStyles = ['success','success','warning','warning','red','red']

    return (
      <div className="Home">
        <Panel className="lander">
          <h3>Poster Quest</h3>
          <ProgressBar bsStyle={pStyles[index]} now={points} />
          {this.renderPosterButton(this.state.index)}
        </Panel>

        <div id='selectMovie'>
          <Modal show={this.state.showModal}>
            <Modal.Header>
              <Modal.Title>Poster for which movie?</Modal.Title>
            </Modal.Header>
                {this.renderMovieSelection()}
            <Modal.Body>

            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }


}

export default Poster;
