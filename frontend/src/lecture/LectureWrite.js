import React, {Component} from 'react';
import './Lecture.css';
import { Menu, InputNumber, Input, Form, notification, Calendar, Card, Dropdown, Icon, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import ImageUploader from 'react-images-upload';
import { getResortList, createLecture } from '../util/APIUtils';

import { Button as SubmitButton, Grid, GridColumn } from 'semantic-ui-react'


// 해당 강의의 가격을 받아올 변수
const lecturePrice = 300000;

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
class LectureWrite extends Component {
    
    state = {
        count: 1,
        datelist: [],
        price: lecturePrice,
        timelist: [{stime:defaultStime, etime:defaultEtime}],

        lecture_id: 0,              // 강의 id
        instructor_id: 0,           // 강사 id
        lecture_name: '',           // 강의 제목
        lecture_price: 0,           // 강의 가격
        lecture_time: '',           // 강의 시간
        resort_id: 0,               // 스키장 id
        lecture_capacity: 10,       // 강의 정원
        lecture_description: '',    // 강의 상세내용
        resorts: [],        // 스키장 정보들!
        menuName: '목록',   // 스키장 버튼 글자
        images: [],         // 강의 사진들
        imageslength: 0,    // 강의 사진 수
    }

    constructor(props) {
        super(props);
        this.state.instructor_id = props.match.params.userid;

        // 마운트 되기 전 스키장 정보 셋팅하기
        getResortList()
        .then( response => {
            this.setState({
                resorts: response
            });
        })
        .catch( error => {
            console.log("Error", error);
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

        this.setState({
            [event.target.name] : {
                value: event.target.value,
            }
        });
    }
    
    // Img 파일 업로드
    handleImageChange(event) {
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
        const selectedTimeList = this.state.timelist.map((time, sidx) => {
            if (idx !== sidx) return time;
            return { ...time, 
                [event.target.name] :event.target.value,
                 };
            });
        this.setState({ timelist: selectedTimeList });

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
            lectureName: '[' + this.state.menuName + '] ' + this.state.lecture_name.value,
            lecturePrice: this.state.lecture_price.value,  
            resortId: this.state.resort_id,  
            lectureCapacity: this.state.lecture_capacity,   
            lectureDescription: this.state.lecture_description.value,
            files: this.state.images,
            fileslength: this.state.imageslength,
            lectureTime: times,
            lectureDate: this.state.datelist,
            timelength: this.state.timelist.length,
            datelength: this.state.datelist.length
        }
         
        // 작성!
        createLecture(lectureInfo)
        .then(response => {
            notification.success({
                message: "Success !",
                description: "강의가 등록되었습니다!"
            });
        })
        .catch(error => {
            console.log("Error ! " + error);
            notification.error({
                message: "Fail !",
                description: "강의 등록에 실패하였습니다.!"
            });
        })
        this.props.history.push('/');
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

  render() {
    return (
        <div className="container">
            <Form onSubmit={this.onSubmit} className="signup-form">
            <Grid container columns={2} doubling stackable>
                    <GridColumn width={12}>  
                        <div className="menu">강습 등록</div>
                    </GridColumn>
                    
                    <GridColumn width={4} floated="right" verticalAlign="middle">
                        <SubmitButton color='twitter' style={{'float':'right'}} type="Submit" onClick={this.onSubmit}>등록하기</SubmitButton>
                    </GridColumn>
                    
                    <GridColumn width={12}>                        
                        <Card title="기본정보를 입력하세요" >
                            <table>
                                <tr>
                                    <td style={{'textAlign':'right', 'paddingRight':'10px'}}>제목</td>
                                    <td colSpan={5}>
                                    <Input 
                                        placeholder="강의 제목을 입력해주세요."
                                        name="lecture_name"
                                        value={this.state.lecture_name.value} 
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
                                    <InputNumber name="lecture_capacity"
                                    min={1} max={20} defaultValue={this.state.lecture_capacity} 
                                    onChange={this.onChangeCapacity} />
                                    </td>
                                    <td style={{'textAlign':'right', 'paddingRight':'10px'}}>가격</td>
                                    <td>
                                    <Input type="number" name="lecture_price" 
                                    value={this.state.lecture_price.value}
                                    onChange={(event) => this.handleInputChange(event)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{'textAlign':'right', 'paddingRight':'10px'}}>상세내용</td>
                                    <td colSpan={6}>
                                    <TextArea name="lecture_description"
                                        placeholder="상세 정보를 입력해주세요."
                                        rows={13}
                                        value = {this.state.lecture_description.value}
                                        onChange={(event) => this.handleInputChange(event)} />
                                    </td>
                                </tr>
                            </table>
                        </Card>
                    </GridColumn>
                    
                    <GridColumn width={4}> 
                            <Card title="날짜를 추가하세요" bordered>
                            
                                <Calendar fullscreen={false} 
                                    disabledDate={disabledDate}
                                    onChange={(event) => this.onChangeDate(event)}
                                    />
                            </Card>
                    </GridColumn>
                    
                    <GridColumn width={5}>  

                        <Card title="날짜확인" bordered>
                        {/* <FixedSizeList height={365} itemSize={20} itemCount={10} > */}
                            {this.state.datelist.map((item, idx) => (
                                <div style={{'marginBottom':'10px'}}>
                                    <Button onClick={this.removeDate(idx)}>{item}<Icon type="delete" /></Button>
                                </div>
                            ))}
                        {/* </FixedSizeList> */}
                        </Card>
                    </GridColumn>
                    
                    <GridColumn width={5}>  
                        <Card title="시간을 추가하세요" bordered>
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
                    </GridColumn>
                    
                    <GridColumn width={6}>  
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

                    </GridColumn>

                
                </Grid>
            </Form>
        </div>
    );
    }
}

export default LectureWrite;
