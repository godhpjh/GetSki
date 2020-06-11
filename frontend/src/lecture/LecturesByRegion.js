import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getLectureListByAllRegion } from '../util/APIUtils';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slidestyle from '../container/Slider.css';


// import { API_BASE_URL } from '../constants';

// sementic-ui
import {
  Button,
  // Card,
  // Image,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react';

import { Card, Row, Col } from 'antd';

import cardstyle from './Card.css'

// material-ui
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';



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


class LecturesByRegion extends Component {
  state = {
    lectures: [],
    region20: [], // 강원도
    region41: [], // 경기
    region56: [], // 전라북도
    region62: [],  // 경상남도
  }

  // make the GET request to fetch data from the URL then using promise function to handle response.
  componentDidMount() {
    window.scrollTo(0, 0);
    // TODO : 함수 바꾸기
    getLectureListByAllRegion()
      .then(res => {
        this.setState({
          lectures: res,  // 전체 데이터 셋팅
          region20: res.KW,
          region41: res.KK,
          region56: res.JB,
          region62: res.KN,
        });

      });

  }

  render() {
    const { Meta } = Card;
    
    // 1. 강원도(20) 관련 강의들
    const group20 = this.state.region20.map((lecture) => {
      return (
        <div>
          <Col style={{marginBottom: '60px'}} span={26}>
          <Link to={`/lectures/${lecture.lectureId}`}>
                <Card
                    cover={
                    <img
                        alt="강의"
                        src={lecture.lectureImage.length > 0 && lecture.lectureImage[0].fileUri}
                        width="100%"
                        height="200"
                        margin=""
                    />
                    }
                >
                    <Meta
                    title={lecture.lectureName}
                    description={"￦ "+lecture.lecturePrice }
                    />
                </Card>
                </Link>
          </Col>
        </div>
          // <Card.Group>
          // <Card style={{ ...cardstyle}}>
          //   <Card.Content style={{padding: "0 0"}}>
          //     <Image width="290" height="290" src={lecture.lectureImage.length > 0 && lecture.lectureImage[0].fileUri} />
          //   </Card.Content>
          //   <Card.Content>
          //     <Card.Header>{lecture.lectureName}</Card.Header>
          //     <Card.Meta>강습비: {lecture.lecturePrice} 원</Card.Meta>
          //     <Card.Description>
               
          //     </Card.Description>
          //   </Card.Content>
          //   {/* <Card.Content extra>
          //     <div className="ui two buttons">
          //       <Link to={`/lectures/${lecture.lectureId}`}>
          //       <Button size="mini" basic color="green">
          //         강습 상세보기
          //       </Button>
          //       </Link>
          //       <Button size="mini"basic color="red">
          //         리조트 보기
          //       </Button>
          //     </div>
          //   </Card.Content> */}
          // </Card>
          // </Card.Group>
      );
    })

    // 2. 경기도(41) 관련 강의들
    const group41 = this.state.region41.map((lecture) => {
      return (
        <div>
          <Col style={{marginBottom: '60px'}} span={26}>
          <Link to={`/lectures/${lecture.lectureId}`}>
                <Card
                    cover={
                    <img
                        alt="강의"
                        src={lecture.lectureImage.length > 0 && lecture.lectureImage[0].fileUri}
                        width="100%"
                        height="200"
                        margin=""
                    />
                    }
                >
                    <Meta
                    title={lecture.lectureName}
                    description={"￦ "+lecture.lecturePrice }
                    />
                </Card>
                </Link>
          </Col>
        </div>
      );
    })

    // 3. 전라북도(56) 관련 강의들
    const group56 = this.state.region56.map((lecture, indx) => {
      return (
        <div>
          <Col style={{marginBottom: '60px'}} span={26}>
          <Link to={`/lectures/${lecture.lectureId}`}>
                <Card
                    cover={
                    <img
                        alt="강의"
                        src={lecture.lectureImage.length > 0 && lecture.lectureImage[0].fileUri}
                        width="100%"
                        height="200"
                        margin=""
                    />
                    }
                >
                    <Meta
                    title={lecture.lectureName}
                    description={"￦ "+lecture.lecturePrice }
                    />
                </Card>
                </Link>
          </Col>
        </div>
      );
    })

    // 4. 경상남도(62) 관련 강의들
    const group62 = this.state.region62.map((lecture, indx) => {
      return (
        <div>
          <Col style={{marginBottom: '60px'}} span={26}>
          <Link to={`/lectures/${lecture.lectureId}`}>
                <Card
                    cover={
                    <img
                        alt="강의"
                        src={lecture.lectureImage.length > 0 && lecture.lectureImage[0].fileUri}
                        width="100%"
                        height="200"
                        margin=""
                    />
                    }
                >
                    <Meta
                    title={lecture.lectureName}
                    description={"￦ "+lecture.lecturePrice }
                    />
                </Card>
                </Link>
          </Col>
        </div>
      );
    })



    return (
      <div className='container'>
        <div style={{margin: "20px 0"}}>
        {/* <Header as='h3' style={{ fontSize: '2em'}}>
          전체 강좌 목록
        </Header> */}
        </div>

        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{color: "inherit"}}>

            <HomeIcon style={{marginRight: '0.5', width: "20", height: "20"}} />
            Home
          </Link>
          <Link to="/lectures" style={{color: "inherit"}}>
            전체 강좌
          </Link>
          <Typography color="textPrimary" style={{display: "flex"}}>
            지역별 강좌
          </Typography>
        </Breadcrumbs>

        <div>
        <Segment style={{ padding: '2em 0em'}} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
          <Header as='h3' style={{ fontSize: '2em' }}>
            강원도
          </Header>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>

              <Row gutter={8}>
              <Slider {...settings}>
              
              {group20}
              
              </Slider>
              </Row>

              </Grid.Column>
  
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Link to="/lectures/byRegion/20">
              <Button size='huge'>See More</Button>
              </Link>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>

        <Segment style={{ padding: '2em 0em'}} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
          <Header as='h3' style={{ fontSize: '2em' }}>
            경기도
          </Header>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>

              <Row gutter={8}>
              <Slider {...settings}>
              {group41}
              </Slider>
              </Row>
              </Grid.Column>
              
  
          </Grid.Row>
          <Grid.Row>
              <Grid.Column textAlign='center'>
              <Link to="/lectures/byRegion/41">
              <Button size='huge'>See More</Button>
              </Link>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>

        <Segment style={{ padding: '2em 0em'}} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
          <Header as='h3' style={{ fontSize: '2em' }}>
            경상남도
          </Header>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>

              <Row gutter={8}>
              <Slider {...settings}>
              {group62}
              </Slider>
              </Row>
              
              </Grid.Column>
  
          </Grid.Row>
          <Grid.Row>
              <Grid.Column textAlign='center'>
              <Link to="/lectures/byRegion/62">
              <Button size='huge'>See More</Button>
              </Link>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>

        <Segment style={{ padding: '2em 0em' }} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
          <Header as='h3' style={{ fontSize: '2em' }}>
            전라북도
          </Header>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>

              <Row gutter={8}>
              <Slider {...settings}>
              
              {group56}

              </Slider>
              </Row>

              </Grid.Column>
  
          </Grid.Row>
          <Grid.Row>
              <Grid.Column textAlign='center'>
              <Link to="/lectures/byRegion/56">
              <Button size='huge'>See More</Button>
              </Link>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>

        </div>
      </div>
    )
  };

}

export default LecturesByRegion;
