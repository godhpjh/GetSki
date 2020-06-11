import React, { Component } from 'react';
import { getLectureByRegion } from '../util/APIUtils';
import { Link } from 'react-router-dom';
import { Card, Col, Row  } from 'antd';

// material-ui

import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';

class LectureByRegion extends Component {
    state = {
        region: '',
        lectures: [],
    };


    componentDidMount() {
        window.scrollTo(0, 0);
        const regionId = this.props.match.params.region

        if (regionId === '20'){
            this.setState({
                region: '강원도'
            });
        } else if (regionId === '41'){
                this.setState({
                region: '경기도'
            });
        } else if (regionId === '56'){
            this.setState({
                region: '전라북도'
            });
        } else if (regionId === '62'){
            this.setState({
                region: '경상남도'
            });
        };

        getLectureByRegion(regionId)
          .then(res => {
            console.log("$$$$$$$ res $$$$$", res);
            this.setState({
              lectures: res,
            })
            
          });

      };


    render() {
        const { lectures } = this.state;

        const lectureCard = lectures.map((lecture) => {
            return (      
              <Col className="cardStyle" span={6}>
                <Link to={`/lectures/${lecture.lectureId}`}>
                  <Card cover={
                    <img
                      alt={lecture.lectureName}
                      src={lecture.lectureImage.length > 0 && lecture.lectureImage[0].fileUri}
                      width="250"
                      height="250"     
                    />
                    }
                  >
                  <Card.Meta
                    title={lecture.lectureName}
                    description={`강습비: ${lecture.lecturePrice}원`}
                  />
                  </Card>
                </Link>
              </Col>  
            )
        });


    
    
    return (
    <div className='container' >
        <div style={{margin: "20px 0"}}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{color: "inherit"}}>

            <HomeIcon style={{marginRight: '0.5', width: "20", height: "20"}} />
            Home
          </Link>
          <Link to="/lectures" style={{color: "inherit"}}>
            전체 강좌
          </Link>
          <Link to="/lectures/byRegion" style={{color: "inherit"}}>
            지역별 강좌
          </Link>
          <Typography color="textPrimary" style={{display: "flex"}}>
            {this.state.region}
          </Typography>
        </Breadcrumbs>
        </div>
        <div className="submenu">
            강습 목록
        </div>

        <div>
        <Row gutter={20}>
          {lectureCard}
        </Row>  
        </div>

    </div>
    );
  }
}

export default LectureByRegion;