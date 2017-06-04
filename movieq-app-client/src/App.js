import React, { Component } from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import {
  Nav,
  NavItem,
  Navbar,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';
import config from './config.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true,
      movieQuest: null,
    };
  }

  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if (currentUser === null) {
      this.setState({isLoadingUserToken: false});
      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);
      this.updateUserToken(userToken);
    }
    catch(e) {
      alert(e);
    }

    this.setState({isLoadingUserToken: false});
  }

  updateUserToken = (userToken) => {
    this.setState({
      userToken: userToken
    });
  }

  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession(function(err, session) {
        if (err) {
            reject(err);
            return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }

  getRandomMovie(year){
    var movie =  {
              name:'Rams',
              names:['Rams','Star wars', 'Here comes the boom', 'Grownups', 'American Pie', 'Up', 'Wally', 'Lion King', 'Tron', 'Lord of the Rings'],
              posters: ['movies/Rams_0.jpg', 'movies/Rams_1.jpg', 'movies/Rams_2.jpg', 'movies/Rams_3.jpg', 'movies/Rams_4.jpg', 'movies/Rams.jpg' ]
            };
    return movie;
  };

  handlePosterClick = (event) => {
    event.preventDefault();
    //todo: extract year
    var randomMovie = this.getRandomMovie("2017")
    this.setState({
      movie : randomMovie
    });
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    this.updateUserToken(null);
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
      movie: this.state.movie,
    };

    return ! this.state.isLoadingUserToken
    &&
    (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">MovieQ</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav>
            <NavDropdown eventKey={3} title="Posters" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1} onClick={this.handlePosterClick} href="/Poster?year=2017">2017</MenuItem>
              <MenuItem eventKey={3.2} onClick={this.handlePosterClick} href="/Poster?year=2016">2016</MenuItem>
            </NavDropdown>
          </Nav>
          <Navbar.Collapse>
            <Nav pullRight>
              { this.state.userToken
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : [ <RouteNavItem key={1} onClick={this.handleNavLink} href="/signup">Signup</RouteNavItem>,
                    <RouteNavItem key={2} onClick={this.handleNavLink} href="/login">Login</RouteNavItem> ] }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }

}

export default withRouter(App);
