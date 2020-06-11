import React, {Component} from 'react';
import './Lecture.css';
import Reviews from './Reviews';
import { getLecture, getCurrentUser, registerLecture, getLectureImages, getClassesInLecture, checkLectureCurrentAmount, deleteLecture } from '../util/APIUtils';
import moment from 'moment';

import { Button, Grid, GridColumn } from 'semantic-ui-react'
import { Calendar, Radio, notification } from 'antd';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// For image Carousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slidestyle from '../container/Slider.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Lecture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userid'),
      lecture: '',
      title: '',
      resort: '',
      lectureImages: [],
      selectedDateLectures: [],
      classesInLecture: [],
      selectedDate: new Date(),
      selectedMonth: moment(new Date()).format('YYYY-MM'),
      availableSeats: '',
      requestedHeadCount: 1,
      requestedLectureInfoId: '',

    };
  
    this.getListData = this.getListData.bind(this);
    this.dateCellRender = this.dateCellRender.bind(this);
    this.monthCellRender = this.monthCellRender.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);

    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeCount = this.onChangeCount.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  onClickEdit() {
    confirmAlert({
      message: '내용을 수정하시면 기존 사진들이 삭제됩니다. 그래도 수정하시겠습니까??',
      buttons: [
        {
          label: '예',
          onClick: () => this.props.history.push(`/lectureUpdate/${this.props.match.params.lectureid}`)
        },
        {
          label: '아니오',
        }
      ]
    });
  }

  onClickDelete(e) {
    console.log(this.state.lecture)
    e.preventDefault();
    if (window.confirm("강습 정보를 삭제할까요?") === true) {
      deleteLecture(this.state.lecture.lectureId)
      this.props.history.push('/')
    } else {

    }
  }

  onSubmit(e){
    e.preventDefault();
    const availableSeats = this.state.availableSeats;
    const registerRequest = {
      userId: this.state.userId,
      lectureId: this.state.lecture.lectureId,
      lectureInfoId: this.state.requestedLectureInfoId,
      headCount: this.state.requestedHeadCount
    };
    
    if ( registerRequest.headCount === 0 ) {
      notification.error({
        message: 'GetSki',
        description: '1명 이상 신청 해주세요!'
      });
    } else {
      getCurrentUser()
      .then(res=> {
        this.setState({
          userId: res.id,
          });
        }
      )
      .catch(err => {
        notification.error({
          message: 'GetSki',
          description: '먼저 로그인을 해주세요!'
        });
      }) 
  
      registerLecture(registerRequest)
      .then (res => {
        notification.success({
          message: 'Getski',
          description: "예약 완료 되었습니다.",
        });
      })
      .catch (err => {
        notification.error({
            message: 'GetSki',
            description: '예약 실패 하였습니다. 다시 확인 해주세요.'
        });
      })
  
      this.props.history.push('/')

    }

  }


  onChangeCount(e) {
    this.setState({
      requestedHeadCount: e.target.value
    })
  }


  onChangeRadio(e) {
    checkLectureCurrentAmount(e.target.value)
    .then(res => {
      this.setState({
        availableSeats: parseInt(this.state.lecture.capacity, 10) - parseInt(res, 10),
        requestedLectureInfoId: e.target.value,
      })
    })
  };
  

  onChangeDate(value) {
    this.setState({
      selectedDate: value,
    })
  };

  onSelectDate(value) {
    this.setState({
      selectedDateLectures: this.state.classesInLecture.filter( classes => 
        classes.lectureDate === value.format('YYYY-MM-DD')),
    });
  };


  getListData(date) {
    let listData;
    
    listData =  this.state.classesInLecture.filter(classes => classes.lectureDate === date);
    return listData || [];
  };


  dateCellRender(value) {
    const listData = this.getListData(value.format('YYYY-MM-DD'));
    return listData.length ? (
      <div>
        <br/>
        <i class="fas fa-skiing" style={{fontSize: "4em", color: "#B2CDFF"}} />
      </div>
      ) : null;
  };    
  
  monthCellRender(value) {
    const isLecture = this.getMonthData(value);
    return isLecture ? (
      <div className="notes-month">
        <section><i class="fas fa-skiing"></i></section>
      </div>
    ) : null;
  };

  componentDidMount() {
    window.scrollTo(0, 0)
    const lectureId = this.props.match.params.lectureid;

    getLecture(lectureId)
    .then(res => {
      this.setState({
        lecture: res,
        resort: res.lectureName.split(']')[0].split('[')[1],
        title: res.lectureName.split(']')[1]
      });
    });

    getLectureImages(lectureId)
    .then(res => {
      this.setState({
        lectureImages: res
      });
    });

    getClassesInLecture(lectureId)
    .then(res => {
      this.setState({
        classesInLecture: res
      })
    })

    getCurrentUser()
    .then(res=> {
      this.setState({
        userId: res.id,
        });
      }
    )
    
  }
  

  render() {
    const { lecture } = this.state;

    const lectureImageList = this.state.lectureImages.map((image, i) =>
      <img height="auto" width="500px" key={i} src={image.fileUri} alt="lecture" />);
    
      let editMenus;
      if ( lecture.instructorId === this.props.userId) {
          editMenus = [
            <div>
              <Button floated="right" basic color='grey' type="Submit" onClick={this.onClickEdit}>정보 수정</Button>
              <Button floated="right" basic color='red' type="Submit" onClick={this.onClickDelete}>강습 취소</Button>
            </div>
          ]
        } else if ( this.props.userRole === "ROLE_ADMIN" ) {
          editMenus = [
            <div>
              <Button floated="right" basic color='red' type="Submit" onClick={this.onClickDelete}>강습 취소</Button>
            </div>
          ]
        }


    // For image Carousel
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
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      initialSlide: 0,
      prevArrow: <NextArrow/>,
      nextArrow: <NextArrow/>,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
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
      <div className="lecture container">
        <Grid container columns={2} doubling stackable>
          <GridColumn width={12}>
            <div className="menu">
              { this.state.title }
            </div>
          </GridColumn>

          <GridColumn width={4} verticalAlign="top">
            { editMenus }
          </GridColumn>

          <GridColumn width={12}>
            <Calendar 
              dateCellRender={this.dateCellRender} 
              monthCellRender={this.monthCellRender}
              onSelect={this.onSelectDate}
              onChange={this.onChangeDate}
              disabledDate={(d) => moment().isAfter(d, 'day')}
              />
          </GridColumn>

          <Grid.Column className="box" width={4} >
            <div className="submenu" style={{alignContent:"center"}}>
              { this.state.resort }
            </div>

            <div className="submenu">
              <div>시간 선택</div>
              <Radio.Group onChange={this.onChangeRadio}>
                { this.state.selectedDateLectures.map((time, i) =>
                  <div key={i} margin="5px">
                    <Radio.Button value={time.lectureInfoId}>{time.lectureTime}</Radio.Button>
                  </div>) }
              </Radio.Group>
            </div>
        
            <div className="submenu">
              <div>인원 선택</div>
              
              <FormControl >
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                  Number of People
                </InputLabel>
                <Select
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  dafualtValue="1"
                  onChange={this.onChangeCount}
                  displayEmpty
                >
                  {[...Array(this.state.availableSeats + 1).keys()].map((num) =>
                    <MenuItem value={num} key={num}>{num}</MenuItem>
                    )}
                </Select>
                <FormHelperText>최대 신청 가능인원 { this.state.availableSeats } 명</FormHelperText>
              </FormControl>
            </div>

            <div className="submenu">
              <Button color='twitter' type="Submit" onClick={this.onSubmit}>예약 신청</Button>
            </div>
          </Grid.Column>
          
          <GridColumn>
            <div className="submenu">
              상세 정보
            </div>

            <div className="content">
              { lecture.lectureDescription }
            </div>
          </GridColumn>

          <GridColumn>
            <div>
              <Slider {...settings}>
              {lectureImageList}
              </Slider>
              
            </div>
          </GridColumn>

          <GridColumn>
            <div className="submenu">
              강습 후기
            </div>

            <Reviews lectureId={this.props.match.params.lectureid} />
          </GridColumn>
  
        </Grid> 
      </div>
    );
  };
}

export default Lecture;
