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
import { invokeApig } from './libs/awsLib';
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

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handlePosterSelect = (event) => {
    event.preventDefault();
    var url = event.currentTarget.getAttribute('href');
    this.setState({
      movieQuest: url
    });
    this.props.history.push("/poster");
  }

  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    this.updateUserToken(null);
  }

  handlePoster = (userToken) => {
    if (userToken) {
      return (
        <NavDropdown eventKey={3} title="Posters" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1} onClick={this.handlePosterSelect} href="/poster?year=2017">2017</MenuItem>
          <MenuItem eventKey={3.2} onClick={this.handlePosterSelect} href="/poster?year=2016">2016</MenuItem>
        </NavDropdown>
      )
    }
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
      movieQuest: this.state.movieQuest,
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
            {this.handlePoster(this.state.userToken)}
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
