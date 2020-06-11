import React,{Component} from 'react';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';
import { ACCESS_TOKEN } from './constants';
import Login from './user/login/Login';
import './App.css';
import { notification } from 'antd';
import { getCurrentUser, getUserProfile } from './util/APIUtils';
import Main from './container/Main';
import Signup from './user/signup/Signup';
import Lecture from './lecture/Lecture';
import Resorts from './resorts/Resorts';
import ResortDetail from './resorts/ResortDetail';
import LectureWrite from './lecture/LectureWrite';
import LectureUpdate from './lecture/LectureUpdate';
import LecturesByRegion from './lecture/LecturesByRegion';
import LectureByRegion from './lecture/LectureByRegion';
import Lectures from './lecture/Lectures';
import NewResort from './resorts/NewResort';
import AppAppbar from './component/AppAppbar';
import NotFound from './component/NotFound';



class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        username:'',
        user: null,
        user: '',
        
      }
      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.loadCurrentUser = this.loadCurrentUser.bind(this);

      notification.config({
          placement: 'topRight',
          top: 70,
          duration: 3,
      });    
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        role : response.authorities[0].authority,
        currentUser: response,
        isAuthenticated: true,
        isLoading: false,
        username : response.username,
        userId: response.id,

      });
      
      localStorage.setItem('userid', this.state.currentUser.id);
      localStorage.setItem('username', this.state.currentUser.username);

      getUserProfile(this.state.username)
        .then(async(response) =>{
          this.setState({
            user : response,
          })
      })
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  handleLogout(redirectTo="/", notificationType="success", description="로그아웃 되었습니다.") {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem('userid');
    localStorage.removeItem('username');

    this.setState({
      currentUser: null,
      isAuthenticated: false,
      role:null,
      username: null
    });
    this.props.history.push(redirectTo);
    notification[notificationType]({
      message: 'Getski',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Getski',
      description: "로그인 되었습니다.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }


  render(){

    return (
      <div className="app-container">

        <AppAppbar isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          user = {this.state.user}
          onLogout={this.handleLogout} role={this.state.role}/>

        <div className="app-content">
          <Route exact path ="/" component={Main} />
          <div  style={{marginTop: "70px"}}>
           <Switch>
              
              <Route path="/login" 
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
              <Route path="/signup" component={Signup}/>
              <Route path="/resortsByRegion/:region" component={Resorts} exact></Route>
              <Route path="/resorts/:resortid" component={ResortDetail}></Route>
              <Route path="/lectures" component={Lectures} exact/>
              <Route path="/lectures/byRegion" component={LecturesByRegion} exact/>
              <Route path="/lectures/byRegion/:region" component={LectureByRegion} exact/>
              <Route path="/lectures/:lectureid" render={(props) => <Lecture userRole={this.state.role} userId={this.state.userId} {...props} />}></Route>
              <Route path="/lectureWrite/:userid" component={LectureWrite}/>
              <Route path="/lectureUpdate/:lectureid" component={LectureUpdate}/>
              <Route path="/addresort" component={NewResort}/>
              <Route component={NotFound}/>
              
            </Switch>
            </div>
          {/* </div> */}
        </div>

      </div>
    );
  }
}

export default withRouter(App);
