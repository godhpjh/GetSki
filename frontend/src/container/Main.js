import React, { Component } from 'react';
import './Main.css';
import { Link } from "react-router-dom";
import { Card, Row, Col } from 'antd';
import Map from './Map';
import { getLectureList, getAllReview, getResortByLectureId } from '../util/APIUtils';
import "react-multi-carousel/lib/styles.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slidestyle from './Slider.css';

import RecommandLocal from './RecommandLocal';
import RecommandReview from './RecommandReview';
import {
  Button,
  Grid,
  Segment,
} from 'semantic-ui-react';

import "fullpage.js/vendors/scrolloverflow";
import ReactFullpage from "@fullpage/react-fullpage";


const anchors = ["firstPage", "secondPage", "thirdPage", "forthPage"];

class MySection extends React.Component {
  render() {
    return (
      <div className="section">
        {this.props.content}

      </div>
    )}
  }


class Main extends Component {
    constructor(){
        super();
    this.state = {
        lecturelist : [],       // 강의 리스트
        reviewlist : [],        // 리뷰 리스트
        isFlipped: false
    };
    this.handleOn = this.handleOn.bind(this);
}

       
    handleOn(e) {
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
      }


    componentDidMount() {
        window.scrollTo(0, 0);
        // 1. 강의 목록 가져오기       
        getLectureList()
        .then( response => {
            this.setState({
                lecturelist: response
            });
        })
        .catch( error => {
            console.log("Error in getLectureList", error);
        })
        

        // 2. 리뷰 목록 가져오기
        getAllReview()
        .then( response => {
            this.setState({
                reviewlist: response
            });
        })
        .catch( error => {
            console.log("Error in getAllReview", error);
        })

    }

    render() {
        const { Meta } = Card;
        
        // 1. 추천 강의리스트 출력
        const recommandLecture = this.state.lecturelist.map( (item, idx)=> {
         
            return (
                <div>
            <Col className="cardStyle" span={26}>
              <Link to={`/lectures/${item.lectureId}`}>
                <Card
                  cover={
                  <img
                      alt="강의"
                      src={item.lectureImage.length > 0 && item.lectureImage[0].fileUri}
                      width="100%"
                      height="200"
                      margin=""
                  />
                  }
                >
                    <Meta
                      title={item.lectureName}
                      description={"￦ "+item.lecturePrice }
                      />
                  </Card>
              </Link>
            </Col>
          </div>
          )

        });


        function NextArrow(props) {
            const { className, onClick } = props;
            return (
              <div
                className={className}
                style={{ ...slidestyle, display: "block"}}
                onClick={onClick}
              />
            );
          }

        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            autoplay: true,
            autoplaySpeed: 4000,
            initialSlide: 0,
            prevArrow: <NextArrow/>,
            nextArrow: <NextArrow/>,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  initialSlide: 1
                }
              },
            ]
          };
        
        return (
                <div className='container' >
                    <ReactFullpage

                        anchors={anchors}
                        navigation
                        navigationTolltips={anchors}
                        onLeave={(origin, destination, direction) => {
                        //   console.log("onLeave event", { origin, destination, direction });
                        }}
                        render={({ state, fullpageApi }) => {
                        //   console.log("render prop chage", state, fullpageApi);
              
                          return (
                              <div>
                                  <MySection content={<Map />}/>
                                  <MySection content={
                                      <div >
                                      <Segment style={{ padding: '0em 0em', height: "100%" }} vertical>
                                          <Grid container stackable verticalAlign='middle'>
                                          <Grid.Row>
                                              <Grid.Column>
                                              <div className="submenu">
                                                  추천강습
                                              </div>
                                              <div style={{ fontSize: '1.33em' }}>
                                              <Row gutter={8}>           
                                              <Slider {...settings}>
                                                 
                                                  {recommandLecture}
                                                  
                                              </Slider>
                                              </Row>
                                              </div>
                                              
                                              </Grid.Column>
                                  
                                          </Grid.Row>
                                          <Grid.Row>
                                              <Grid.Column textAlign='center'>
                                              <Link to="/lectures">
                                              <Button size='huge'>강습 더보기</Button>
                                              </Link>
                                              </Grid.Column>
                                          </Grid.Row>
                                          </Grid>
                                      </Segment>
                                      </div>
                                  }/>
                                  <MySection content={
                                      <div style={{margin: "5em 0"}}>
                        
                                      <Segment style={{ padding: '0em 0em', height: "100%" }} vertical>
                                          {/* <div style={{margin: "5em 0em"}}> */}
                                          <Grid container stackable verticalAlign='middle'>
                                              <Grid.Row>
                                              <Grid.Column>
                                                <div className="submenu">
                                                지역별 강습
                                                </div>
                                            
                                                  <div style={{ fontSize: '1.33em' }}>
                                                  
                                                  <RecommandLocal/>
                  
                                                  </div>
                  
                                                  <div style={{ fontSize: '1.33em' }}>
                                                   지역별 강습을 확인하세요.
                                                  </div>
                                              </Grid.Column>
                  
                                              </Grid.Row>
                                              <Grid.Row>
                                              <Grid.Column textAlign='center'>
                                                  <Link to="/lectures/byRegion">
                                                  <Button size='huge'>전체보기</Button>
                                                  </Link>
                                              </Grid.Column>
                                              </Grid.Row>
                                          </Grid>

                                          </Segment> 
                                      </div>
                                  }/>
                                  <MySection content={
                                      <div >
                                      <Segment style={{ padding: '0em 0em', height: "100%" }} vertical>
                                          {/* <div style={{margin: "5em 0em"}}> */}
                                          <Grid container stackable verticalAlign='middle'>
                                              <Grid.Row>
                                              <Grid.Column>
                                                  <div className="submenu">
                                                  후기
                                                  </div>
                                                  <p style={{ fontSize: '1.33em' }}>
                                                  <RecommandReview reviewlist={this.state.reviewlist}/>
                                                  </p>
                                              </Grid.Column>
                  
                                              </Grid.Row>
                                              
                                          </Grid>
                                          </Segment>
                                      </div>
                                  }/>
                                  
                                  </div>
                                  );
                                  }}
                                  />
                            </div>



        );
    }
}

export default Main;