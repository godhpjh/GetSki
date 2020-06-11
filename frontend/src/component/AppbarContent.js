import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

import { deleteUser, getMyLectureList, getMyLectureInfoList } from '../util/APIUtils';
import { ADMIN, INSTRUCTOR, USER} from '../constants/index';
import Updateform from '../user/update/Updateform';

import { Button, Menu, } from 'semantic-ui-react';
import { Dropdown, Icon, List } from 'antd';
import { Menu as Antdmenu, Drawer, Divider, Col, Row, notification } from 'antd';


const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
  };

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Antdmenu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Antdmenu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Antdmenu.Item>
      <Antdmenu.Divider />
      <Antdmenu.Item key="profile" className="dropdown-item">
        Profile
      </Antdmenu.Item>
      <Antdmenu.Item key="logout" className="dropdown-item">
        Logout
      </Antdmenu.Item>
    </Antdmenu>
  );

  return (
      <Dropdown 
        overlay={dropdownMenu} 
        trigger={['click']}
        getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
        <a href="foo" className="ant-dropdown-link">
            <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
        </a>
      </Dropdown>
    );
  }


class AppbarContent extends Component {
  constructor(props) {
    super(props);   
    this.state = {
      role : this.props.role,
      visible:false,
      childrenDrawer:false,
      user : {
        id:'',
        name:'',
        username: '',
        email:'',
        phonenumber:'',
        birthdate:'',
        checked:null,
      },
      checkedString:'',
      mylecvisible: false,
      mylecture: [],
      mylectureinfo: [],
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  myLectureHistory = ({ index }) => (
    // this.state.mylectureinfo[index].lectureDate + " / " +this.state.mylectureinfo[index].lectureTime,
    <List
      dataSource={[
        {
          name: this.state.mylecture[index].lectureName,
          date: this.state.mylectureinfo[index].lectureDate + "   " + this.state.mylectureinfo[index].lectureTime,
          lectureid: this.state.mylecture[index].lectureId,
        },
        ]}
      bordered
      style={{'marginBottom':'10px'}}
      renderItem={item => (
        <Link to={`/lectures/${item.lectureid}`} onClick={this.closeMyLectureHistory}>
        <List.Item>
          <List.Item.Meta
            title={item.name}
            description={item.date}
          />
          <div><Icon type="double-right"></Icon></div>
        </List.Item>
        </Link>
      )}
      />
    );
      
  showMyLectureHistory = () => {
    //if(this.state.mylecture.length === 0) { // 처음 한번만 가져온다.
    // 사용자 강습목록 리스트 가져오기
    getMyLectureList(localStorage.getItem('userid'))
    .then( res => {
      this.setState({
        mylecture: res
      })
    })
    .catch( err => {
      console.log("Error! getMyLectureHistory", err);
    });
  
    // 사용자 강습목록 정보리스트 가져오기(+날짜)
      getMyLectureInfoList(localStorage.getItem('userid'))
    .then( res => {
      this.setState({
        mylectureinfo: res
      })
    })
    .catch( err => {
      console.log("Error! getMyLectureHistoryInfo", err);
    })
  
    this.setState({
      mylecvisible: true,
    }); 
  }
    
  closeMyLectureHistory = () => {
    this.setState({
      mylecvisible: false,
    });
    this.forceUpdate();
  }
  
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
    
    
  DeleteMyAccount = (event) => {
    event.preventDefault();
    this.setState({
      user : this.props.user,
    })
      const deleteRequest = {
          id : this.state.user.id,
          name : this.state.user.name,
          username : this.state.user.username,
          email : this.state.user.email,
          phonenumber : this.state.user.phonenumber,
          password : this.state.user.password,
          birthdate : this.state.user.birthdate,
          checked : this.state.user.checked,
      };
      deleteUser(deleteRequest)
      .then(response => {
          notification.success({
              message: 'GetSki',
              description: "성공적으로 정보가 삭제 되었습니다.",
          });          
          this.props.onLogout();
          this.onChildrenDrawerClose();
          this.onClose();
      }).catch(error => {
          notification.error({
              message: 'GetSki',
              description: error.message || '다시 시도해주세요.'
          });
      });
    }
    
  handleMenuClick({ key }) {

    if(key === "logout") {
      this.props.onLogout();
    }
    else if(key === "profile"){
      this.setState({
        user : this.props.user,
      })
      
      this.onChange();
      this.showDrawer();
    }
    
    }
    
  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };
  
  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };
  
  onChange = () =>{
    if(this.state.user.checked === true){
      this.setState({
        checkedString:"false",
      });
    }
    else {
      this.setState({
        checkedString:"true",
      });
    }
  }
  
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {

    let menuItems;
      if ( this.props.role === ADMIN ) {
        menuItems = [ 
          <div flex="1"
            display='flex'
            justifyContent="flex-end"
            >
            <Link to="/addResort">
              <Button  basic color="standard">새 리조트 등록</Button>
            </Link>
            <Link
              style={{fontSize: 16,
                  color: "black",
                  marginLeft: "20px"}}
              >
              <Menu.Item key="/profile" className="profile-menu" position="right" style={{position: 'static', display: 'inline'}}>
                <ProfileDropdownMenu 
                  currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}
                  role = {this.props.role}/>
              </Menu.Item>
            </Link>
          </div>
          ]; 
        } else if ( this.props.role === USER ) {
          menuItems = [
            <div  flex="1"
              display='flex'
              justifyContent="flex-end">
              <Button onClick={this.showMyLectureHistory} basic color="standard">수강 이력</Button>
              <Link
                style={{fontSize: 16,
                color: "black",
                marginLeft: "20px"}}
                >
                <Menu.Item key="/profile" className="profile-menu" position="right" style={{position: 'static', display: 'inline'}}>
                <ProfileDropdownMenu 
                 currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}
                  role = {this.props.role}/>
                </Menu.Item>
              </Link>
              </div>
            ];
          } else if (this.props.role === INSTRUCTOR ) {
            menuItems = [
              <div  
                flex="1"
                display='flex'
                justifyContent="flex-end">
                <Link to={`/lectureWrite/${localStorage.getItem('userid')}`}>
                  <Button  basic color="grey">새 강의 등록</Button>
                </Link>
                <Link
                  style={{fontSize: 16,
                  color: "black",
                  marginLeft: "20px"}}>
                  <Menu.Item key="/profile" className="profile-menu" position="right" style={{position: 'static', display: 'inline'}}>
                    <ProfileDropdownMenu 
                      currentUser={this.props.currentUser} 
                      handleMenuClick={this.handleMenuClick}
                      role = {this.props.role}/>
                  </Menu.Item>
                </Link>
                </div>

              ];
          } else {
            menuItems = [
              <div  
                flex="1"
                display='flex'
                justifyContent="flex-end">
                <Link to="/login"
                  style={{fontSize: 16,
                  color: "black",
                  marginLeft: "10px"}}>
                  Sign In
                </Link>
                <Link
                  style={{fontSize: 16,
                  color: "red",
                  marginLeft: "20px"}}
                  to="/signup">
                  Sign Up
                </Link>
              </div>
            ];
          }
    return (
      <div>
        {menuItems}
        <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={this.state.visible}
      >
        <p style={{ ...pStyle, marginBottom: 50 }}>User Profile</p>
        <p></p>
        <Divider />
        <Row>
          <Col span={24}>
            <p/>
          </Col>
        </Row>
        <Row>
          <p/>
          <Col span={12}>
            <DescriptionItem title="Full Name" content={this.state.user.name}/>
          </Col>
        </Row>
        <p></p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="ID" content={this.state.user.username} />
          </Col>
        </Row>  
        <p></p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="E-mail" content={this.state.user.email} />
          </Col>
        </Row>
        <p></p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Birthday" content={this.state.user.birthdate} />
          </Col>
        </Row>
        <p></p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Tutee" content={this.state.checkedString} />
          </Col>
        </Row>
        <p></p>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Phone Number" content = {this.state.user.phonenumber}/>
          </Col>
        </Row>
        <p></p>
        <Row>
          <Col span={24}>
            <p></p>
          </Col>
        </Row>
        <Divider />
        <Button onClick={this.onClose} style={{ marginRight: 8 }}>Cancel</Button>
        <Button onClick={this.showChildrenDrawer} color='teal' type="primary" style={{marginRight:8}}>Update User Info</Button>
        <Button onClick={this.DeleteMyAccount} color='red' type="danger" >Delete My Account</Button>
        <Drawer
          width={400}
          closable={false}
          onClose={this.onChildrenDrawerClose}
          visible={this.state.childrenDrawer}
        >
          <Updateform user={this.state.user} ></Updateform>
        </Drawer>
        </Drawer>
        {/* 내 수강 이력 리스트 Drawer */}
        <Drawer
          width={400}
          closable={false}
          onClose={this.closeMyLectureHistory}
          visible={this.state.mylecvisible}
          style={{marginTop: "70px"}}
        >
          <div>
            강습 구매 이력 리스트
          </div>
          <hr/>
          {this.state.mylecture.length > 0 && 
            this.state.mylectureinfo.length > 0 && 
            <FixedSizeList height={600} itemSize={20} itemCount={this.state.mylecture.length} >
            {this.myLectureHistory}
            </FixedSizeList>}
        </Drawer>
      </div>
      );
    }
  }
    
  export default withRouter(AppbarContent);