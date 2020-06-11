import React, {Component} from 'react';
import './Lecture.css';
import { Menu, Input, Form, notification, Calendar, Button, Card, Col, Row, Dropdown, Icon } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import ImageUploader from 'react-images-upload';
import { getResortList, getLecture
    , getClassesInLecture, getResortByLectureId
    , updateLecture, deleteLectureAllImage } from '../util/APIUtils';

const defaultStime = "08:00";
const defaultEtime = "20:00";

// 오늘 이전의 날짜 선택 금지
function disabledDate(current) {
    if (!current) {
        // allow empty select
        return false;
    }
    const date = moment();
    date.hour(0);
    date.minute(0);
    date.second(0);
    return current.valueOf() < date.valueOf();  // can not select days before today
}

// main
class LectureUpdate extends Component {
    state = {
        count: 1,
        datelist: [],
        price: 0,
        timelist: [{stime:'', etime:''}],

        lecture_id: 0,              // 강의 id
        instructor_id: 0,           // 강사 id
        lecture_name: '',           // 강의 제목
        lecture_price: 0,           // 강의 가격
        lecture_time: '',           // 강의 시간
        resort_id: 0,               // 스키장 id
        lecture_capacity: 0,       // 강의 정원
        lecture_description: '',    // 강의 상세내용
        resorts: [],        // 스키장 정보들!
        menuName: '목록',   // 스키장 버튼 글자
        images: [],         // 강의 사진들
        imageslength: 0,    // 강의 사진 수
    }

    constructor(props) {
        super(props);
        this.state.instructor_id = props.match.params.userid;

        const lectureId = props.match.params.lectureid;
        
        // 스키장 정보 셋팅하기(콤보박스)
        getResortList()
        .then( response => {
            this.setState({
                resorts: response
            });
        })
        .catch( error => {
            console.log("Error getResortList",error);
        })

        // 기존 강습정보 받아오기
        getLecture(lectureId) 
        .then( response => {
            this.setState({
                lecture_id: response.lectureId,
                instructor_id: response.instructorId,
                lecture_name: response.lectureName,
                lecture_price: response.lecturePrice,
                lecture_capacity: response.capacity,
            })

            if(response.lectureDescription !== "undefined") {
                this.setState({
                    lecture_description: response.lectureDescription,
                });
            }
        })
        .catch( error => {
            console.log("Error getLecture",error);
        })

        // 이미지 전체삭제
        deleteLectureAllImage(lectureId)
        .then( res => {

        })

        // 해당강의 날짜시간 가져오기
        getClassesInLecture(lectureId)
        .then(res => {
            res.map( (item) => {
                this.setState({
                    datelist: this.state.datelist.concat(item.lectureDate),
                    timelist: this.state.timelist.concat([{ stime: item.lectureTime.substr(0,5) , etime: item.lectureTime.substr(6,5) }])
                });
            });
            
            const unique_datelist = this.state.datelist.reduce((list, item) => {
                if (!list.some(obj => obj === item)) {
                    list.push(item);
                }
                return list;
                }, []
            );

            this.setState({
                datelist: unique_datelist, // 중복제거
                timelist : this.state.timelist.filter((s, sidx) => sidx !== 0) // 첫줄제거
            });

        });

        // 해당 강의의 스키장정보 가져오기
        getResortByLectureId(lectureId)
        .then( response => {
            this.setState({
                menuName: response.resortName,
                resortId: response.resortId
            });
        })

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onChangeCapacity = this.onChangeCapacity.bind(this);
        this.onChangeResortId = this.onChangeResortId.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }
    
    // 스키장 Dropdown 메뉴들
    setMenu(){
        // 데이터가 마운트 되면 보여주기
        if(this.state.resorts.length > 0){
            return(
                <Menu onClick={this.onChangeResortId}>
                    {this.setMenuItem()}
                </Menu>
            );
        }
    }

    // 전체 스키장 목록 리스트화
    setMenuItem(){
        return this.state.resorts.map(item => {
            return(
                <Menu.Item key={item.resortId}>
                    <Icon type="dingding" />
                    {item.resortName}
                </Menu.Item>
            );
        })
    }

    // state 셋팅(event)
    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] :  inputValue,
        });
    }
    
    // Img 파일 업로드
    handleImageChange(event) {
        console.log(event);
        let names = {};
        for(var i=0; i<event.length; i++) {
            names[i] = event[i]; // 이미지
        }
        this.setState({
            images : names,
            imageslength : event.length
        }); 
    }

    // state 셋팅(value)
    onChangeCapacity(val) {
        this.setState({
            lecture_capacity: val
        });
    }
    onChangePrice(val) {
        this.setState({
            lecture_price: val
        });
    }
    // 콤보박스 이벤트
    onChangeResortId(e) {
        this.setState({
            resort_id: e.key,
            menuName: e.item.props.children[1]
        });
    }

    // 날짜 핸들링
    onChangeDate(e) {
        let dates = ""+e._d;
        dates = dates.substr(11, 4) + "-" + dates.substr(4, 3) + "-" +dates.substr(8,2);
        
        // 날짜 가공
        dates = dates.replace("Jan", "01");
        dates = dates.replace("Feb", "02");
        dates = dates.replace("Mar", "03");
        dates = dates.replace("Apr", "04");
        dates = dates.replace("May", "05");
        dates = dates.replace("Jun", "06");
        dates = dates.replace("Jul", "07");
        dates = dates.replace("Aug", "08");
        dates = dates.replace("Sep", "09");
        dates = dates.replace("Oct", "10");
        dates = dates.replace("Nov", "11");
        dates = dates.replace("Dec", "12");

        // 중복 제거
        let check = true;
        this.state.datelist.some(function(item) {
            if(item === dates) check = false;
            return 0;
        });

        // 날짜 추가
        if(check) {
            this.setState({
                datelist: this.state.datelist.concat(dates)
            });
        }
    }
    // 날짜 삭제
    removeDate = idx => () => {
        this.setState({
            datelist: this.state.datelist.filter((s, sidx) => idx !== sidx)
        });
    }
    

    // 시간버튼 이벤트
    handleTimeChange(event, idx) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        const list = this.state.timelist.map((time, sidx) => {
            if (idx !== sidx) return time;
            return { ...time, 
                [inputName] :inputValue,
                 };
            });

        this.setState({ timelist: list });

    }

    // 시간 추가
    addTimes = () => {
        this.setState({
            timelist: this.state.timelist.concat([{ stime: defaultStime , etime: defaultEtime }])
        });
    }

    // 시간 삭제
    removeTimes = idx => () => {
        this.setState({
            timelist: this.state.timelist.filter((s, sidx) => idx !== sidx)
        });
    }

    // submit
    onSubmit = (e) => {
        e.preventDefault();

        // 시간 가공......
        const a = this.state.timelist;
        let times = [];
        for(var i=0; i<a.length; i++) {
            times = times.concat([a[i].stime + "~" + a[i].etime]);
        }

        const lectureInfo = {
            instructorId: this.state.instructor_id,
            lectureName: this.state.lecture_name,
            lecturePrice: this.state.lecture_price,  
            resortId: this.state.resort_id,  
            lectureCapacity: this.state.lecture_capacity,   
            lectureDescription: this.state.lecture_description,
            files: this.state.images,
            fileslength: this.state.imageslength,
            lectureTime: times,
            lectureDate: this.state.datelist,
            timelength: this.state.timelist.length,
            datelength: this.state.datelist.length
        }
         
        console.log(lectureInfo);
        
        // 강습 수정!
        updateLecture(lectureInfo, this.props.match.params.lectureid)
        .then(response => {
            console.log(response);
            notification.success({
                message: "Success !",
                description: "강습이 수정되었습니다!"
            });
        })
        .catch(error => {
            console.log("Error ! "+error);
            notification.error({
                message: "Fail !",
                description: "강습 수정에 실패하였습니다.!"
            });
        })
        this.props.history.push(`/lectures/${this.props.match.params.lectureid}`);
    }
  componentDidMount() {
      window.scrollTo(0, 0);
  }
  render() {
    return (
        <div className="container">
            <Form onSubmit={this.onSubmit} className="signup-form">
            <div style={{'textAlign':'center'}}>
                <Button style={{'float':'right'}} type="Submit" onClick={this.onSubmit}>수정하기</Button>
                <div>강습 수정</div>
            </div>
            <hr />

            <div>
                {/* ---------------------------------- 상단 ----------------------------- */}
                <Row gutter={32}>
                    <Col span={16}>
                     {/* 1) 테이블 기본입력폼 */}
                    <Card title="기본정보를 추가하세요" bordered >
                        <table>
                            <tr>
                                <td style={{'textAlign':'right', 'paddingRight':'10px'}}>제목</td>
                                <td colSpan={5}>
                                <Input name="lecture_name"
                                    value={this.state.lecture_name}
                                    onChange={(event) => this.handleInputChange(event)} />
                                </td>
                            </tr>
                            <tr>
                                <td style={{'textAlign':'right', 'paddingRight':'10px'}}>스키장</td>
                                <td style={{'textAlign':'left'}}>
                                <Dropdown overlay={this.setMenu()} >
                                    <Button style={{'width':'200px'}}>
                                        {this.state.menuName} <Icon type="down" />
                                    </Button>
                                </Dropdown>
                                </td>
                                <td style={{'textAlign':'right', 'paddingRight':'10px'}}>수용인원</td>
                                <td style={{'textAlign':'left'}}>
                                <Input type="number" name="lecture_capacity"
                                value={this.state.lecture_capacity} 
                                onChange={this.onChangeCapacity} />
                                </td>
                                <td style={{'textAlign':'right', 'paddingRight':'10px'}}>가격</td>
                                <td>
                                <Input type="number" name="lecture_price" 
                                value={this.state.lecture_price}
                                onChange={(event) => this.handleInputChange(event)} />
                                </td>
                            </tr>
                            <tr>
                                <td style={{'textAlign':'right', 'paddingRight':'10px'}}>상세내용</td>
                                <td colSpan={6}>
                                <TextArea name="lecture_description"
                                    
                                    rows={13}
                                    value = {this.state.lecture_description}
                                    onChange={(event) => this.handleInputChange(event)} />
                                </td>
                            </tr>
                        </table>
                    </Card>
                    </Col>
                    <Col span={8}>
                    {/* 2) 달력  */}
                    <Card title="날짜를 추가하세요" bordered>
                    
                        <Calendar fullscreen={false} 
                            disabledDate={disabledDate}
                            onChange={(event) => this.onChangeDate(event)}
                            />
                    </Card>
                    </Col>
                </Row>
                {/* -------------------------------- 하단 ----------------------------- */}
                <Row gutter={32} style={{'marginTop':'20px'}}>
                <Col span={5}>
                    {/* 3) 추가날짜 */}
                    <Card title="날짜확인" bordered>
                    {/* <FixedSizeList height={365} itemSize={20} itemCount={10} > */}
                        {this.state.datelist.map((item, idx) => (
                            <div style={{'marginBottom':'10px'}}>
                                <Button onClick={this.removeDate(idx)}>{item}<Icon type="delete" /></Button>
                            </div>
                        ))}
                    {/* </FixedSizeList> */}
                    </Card>
                </Col>
                <Col span={7}>
                    {/* 4) 시간 및 인원 */}
                    <Card title="시간을 추가하세요" bordered>
                    {/* <FixedSizeList height={365} itemSize={20} itemCount={this.state.timelist.length} > */}
                    {this.state.timelist.map((item, idx) => (
                        <div style={{'marginBottom':'10px'}}>
                        <TextField
                            id={`stime${idx+1}`}
                            name={`stime`}
                            label="시작"
                            type="time"
                            defaultValue={defaultStime}
                            value={item.stime}
                            onChange={(event) => this.handleTimeChange(event, idx)}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                        />
                        <TextField
                            id={`etime${idx+1}`}
                            name={`etime`}
                            label="종료"
                            type="time"
                            defaultValue={defaultEtime}
                            value={item.etime}
                            onChange={(event) => this.handleTimeChange(event, idx)}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                        />
                        <Button onClick={this.removeTimes(idx)}><Icon type="delete" /></Button>
                        </div>
                    ))}
                    {/* </FixedSizeList>          */}
                    <Button onClick={this.addTimes}>+</Button>
                    </Card>
                </Col>
                <Col span={12}>
                    {/* 5) 이미지 */}
                    <Card title="사진을 추가하세요" bordered>
                    <ImageUploader
                        withIcon={true}
                        withPreview={true}
                        buttonText='Choose Images'
                        imgExtension={['.jpg', '.png', '.gif']}
                        maxFileSize={5242880}
                        onChange={(event) => this.handleImageChange(event)}
                    />
                    </Card>
                </Col>
                </Row>
            </div>

            
            </Form>
        </div>
    );
    }
}

export default LectureUpdate;
