import React, { Component } from 'react';
import ResortInfo from './ResortInfo';
import './Resort.css';
import { Link } from "react-router-dom";
import { Card } from 'antd';
import { Col } from 'antd';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slidestyle from '../container/Slider.css';
import { getResort, getLectureByResortId } from '../util/APIUtils';


class ResortDetail extends Component {
  state = {
    resort: '',
    lectures:[],
    resort_image:[],
    skiImages:[],
    rentalImages:[],
    liftImages:[],
    slopeImages:[],
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const resortId = this.props.match.params.resortid;
    getResort(resortId)
    .then(res => {
      this.setState({
        resort: res,
        resort_image : res.resortImage,
      },)
    })
    .then( () =>{
        this.setState({
          skiImages : this.state.resort_image.filter( (s) => s.imageType === '스키장'),
          rentalImages : this.state.resort_image.filter( (s) => s.imageType === '렌탈'),
          slopeImages : this.state.resort_image.filter( (s) => s.imageType === '슬로프'),
          liftImages : this.state.resort_image.filter( (s) => s.imageType === '리프트'),
        });
      });

    getLectureByResortId(resortId)
      .then(res => {
        this.setState({
          lectures: res,
      })
    });
  };

  
  
  
  render() {
    const { Meta } = Card;

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

    const { resort } = this.state;
    const recommandLecture = this.state.lectures.map( (item, idx)=> {
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
                    description={"₩ "+item.lecturePrice }/*+ " [1/" + item.capacity + "]"}*/
                    
                    />
                </Card>
                </Link>
            </Col>
          </div>
      )
  });

    return (
      <div className="container">
        <br/><br/><br/>
        <div className="submenu">{ resort.resortName }</div>
        <br/>
        <div id="resort-pics" className="ant-carousel">
          {this.state.skiImages.length>0 && <img src={this.state.skiImages[0].fileUri } width="100%" height="100%" alt="resort" />}
        </div>

        <br />
        <br />
        
        <div id="resort-info">
          {this.state.liftImages.length > 0 && this.state.rentalImages.length > 0 && this.state.slopeImages.length &&
          <ResortInfo resort={resort} liftImages={this.state.liftImages} rentalImages={this.state.rentalImages} slopeImages={this.state.slopeImages}/>
          }
        </div>

        <br />
        <br />

        <div id="resort-lecturs">
          <Slider {...settings}>
                               
            {recommandLecture}
                                
          </Slider>
        </div>
      </div>
    );
  };
}

export default ResortDetail;
