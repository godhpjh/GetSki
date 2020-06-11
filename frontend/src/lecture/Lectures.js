import React, { Component } from 'react';
import { getLectureList } from '../util/APIUtils';
import { Link } from 'react-router-dom';
import { Card, Col, Row  } from 'antd';

import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';


class Lectures extends Component {
    state = {
        lectures: [],
      }
      componentDidMount() {
        window.scrollTo(0, 0);
        getLectureList()
          .then(res => {
            
            this.setState({
              lectures: res
            })
          });
      }
    
    render() {
      
    const { lectures } = this.state;

    const lectureCards = lectures.map((lecture, idx) => {
      return (      
        <Col className="cardStyle" span={6}>
          <Link to={`/lectures/${lecture.lectureId}`}>
            <Card cover={
              <img
                alt={lecture.lecturetName}
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
          <Typography color="textPrimary" style={{display: "flex"}}>
            전체강좌
          </Typography>
        </Breadcrumbs>
        </div>
        <div className="submenu">
            강습 목록
        </div>

        <Row gutter={20}>
          {lectureCards}
        </Row>  
        </div>

        );
    
    }
}

export default Lectures;
