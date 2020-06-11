import React, { Component } from 'react'
import { 
    Form,
    Upload,
    Icon,
    Select,
    message,
    Input, 
    Button,
    notification } from 'antd';
import { AddResort } from '../util/APIUtils';
const FormItem = Form.Item;
const {Option}  = Select;
const {TextArea} = Input;

class NewResort extends Component {
    state = {
        name: '',
        location: '',
        region: '',
        intro: '',
        pageLink: '',
        resortImage: [],
        liftImage: [],
        rentalImage: [],
        slopeImage: [],
    }

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        const lengths = {
            resortImagelength : this.state.resortImage.length,
            liftImagelength : this.state.liftImage.length,
            rentalImagelength : this.state.rentalImage.length,
            slopeImagelength : this.state.slopeImage.length,
        }

        AddResort(this.state, lengths)
        .then(response => {
            console.log(response);
            notification.success({
                message: "Success !",
                description: "새 스키장이 등록되었습니다!"
            });
            
            this.props.history.push('/');
        })
        .catch(error => {
            console.log("Error ! newResort ", error);
        });
        
    }

    // 지역 핸들링
    onChangeRegion = e => {
        // console.log('Region : ', e.target.value);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.setState({
                  location : values.prefix+e.target.value,
              });
              this.setState({
                region : values.prefix,
            });
            }
        });
        
    };

    // Input 핸들링
    handleInputChange = event => {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : inputValue
        });
    }

    // 사진 핸들링들!!!!
    onChangeResortImage = event => {    // 스키장사진
        if (event.file.status === 'done') {
            let nameResort = [];
            console.log(event.fileList);
            for(var i=0; i<event.fileList.length; i++) {
                nameResort[i] = event.fileList[i].originFileObj; // 이미지
            }
            this.setState({
                resortImage: nameResort
            });
            message.success(`${event.file.name} file uploaded successfully`);
        } else if (event.file.status === 'error') {
            message.error(`${event.file.name} file upload failed.`);
        }
    }
    onChangeLiftImage = event => {      // 리프트사진
        if (event.file.status === 'done') {
            let nameLift = [];
            for(var i=0; i<event.fileList.length; i++) {
                nameLift[i] = event.fileList[i].originFileObj; // 이미지
            }
            this.setState({
                liftImage: nameLift
            });
            message.success(`${event.file.name} file uploaded successfully`);
        } else if (event.file.status === 'error') {
            message.error(`${event.file.name} file upload failed.`);
        }
    }
    onChangeRentalImage = event => {    // 렌탈사진
        if (event.file.status === 'done') {
            let nameRental = [];
            for(var i=0; i<event.fileList.length; i++) {
                nameRental[i] = event.fileList[i].originFileObj; // 이미지
            }
            this.setState({
                rentalImage: nameRental
            });
            message.success(`${event.file.name} file uploaded successfully`);
        } else if (event.file.status === 'error') {
            message.error(`${event.file.name} file upload failed.`);
        }
    }
    onChangeSlopeImage = event => {     // 슬로프사진
        if (event.file.status === 'done') { // 
            let nameSlope = [];
            for(var i=0; i<event.fileList.length; i++) {
                nameSlope[i] = event.fileList[i].originFileObj; // 이미지
            }
            this.setState({
                slopeImage: nameSlope
            });
            message.success(`${event.file.name} file uploaded successfully`);
        } else if (event.file.status === 'error') {
            message.error(`${event.file.name} file upload failed.`);
        }
    }
    
    // 사진 삭제 핸들링!!!!
    onRemoveResortImage = event => {
        this.setState({
            resortImage: this.state.resortImage.filter((s, sidx) => s !== event.name)
        });
    }
    onRemoveLiftImage = event => {
        this.setState({
            liftImage: this.state.liftImage.filter((s, sidx) => s !== event.name)
        });
    }
    onRemoveRentalImage = event => {
        this.setState({
            rentalImage: this.state.rentalImage.filter((s, sidx) => s !== event.name)
        });
    }
    onRemoveSlopeImage = event => {
        this.setState({
            slopeImage: this.state.slopeImage.filter((s, sidx) => s !== event.name)
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {initialValue: '지역',})
        (
            <Select style={{ width: 85 }}>
                <Option value="서울">서울</Option>
                <Option value="경기">경기</Option>
                <Option value="강원">강원</Option>
                <Option value="충북">충북</Option>
                <Option value="충남">충남</Option>
                <Option value="전북">전북</Option>
                <Option value="전남">전남</Option>
                <Option value="경북">경북</Option>
                <Option value="경남">경남</Option>
            </Select>,
        );
        const toast = {
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
              authorization: 'authorization-text',
            }
        };
        

        return (
             <div className="signup-container">
                <h1 className="page-title">New Resort</h1>
                <div className="newResort-content">
                    <Form onSubmit={this.handleSubmit} className="newResort-Form">
                        <FormItem 
                            label="Resort Name" >
                            <Input 
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Resort name"
                                onChange={this.handleInputChange}/>
                        </FormItem>
                        <FormItem 
                            label="Region" >
                            {getFieldDecorator('Region', {
                                rules: [{ message: 'Please input your phone number!' }],
                            })(<Input 
                                addonBefore={prefixSelector}
                                size="large"
                                name="regionName" 
                                type="text"
                                autoComplete="off"
                                onChange={this.onChangeRegion}/>)}
                        </FormItem>
                        <FormItem 
                            label="intro">
                            <TextArea 
                                size="large"
                                name="intro" 
                                type="intro"
                                autoComplete="off"
                                placeholder="50자 이내" 
                                onChange={this.handleInputChange}/>
                        </FormItem>
                        <FormItem 
                            label="pageLink">
                            <Input 
                                size="large"
                                name="pageLink" 
                                type="text"
                                autoComplete="off"
                                placeholder="input Official Resort Website URL!"
                                onChange={this.handleInputChange}/>
                        </FormItem>
                        <FormItem 
                            label="Resort Image">
                            <Upload name="resortImage"
                                {...toast}
                                onChange={(event) => this.onChangeResortImage(event)}
                                onRemove={(event) => this.onRemoveResortImage(event)} >
                                <Button>
                                <Icon type="upload" /> Click to Image Upload
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem 
                            label="Lift Image">
                            <Upload name="liftImage"
                                {...toast}
                                onChange={(event) => this.onChangeLiftImage(event)}
                                onRemove={(event) => this.onRemoveLiftImage(event)}>
                                <Button>
                                <Icon type="upload" /> Click to Image Upload
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem 
                            label="rental Image">
                            <Upload name="rentalImage"
                                {...toast}
                                onChange={(event) => this.onChangeRentalImage(event)}
                                onRemove={(event) => this.onRemoveRentalImage(event)}>
                                <Button>
                                <Icon type="upload" /> Click to Image Upload
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem 
                            label="slope Image">
                            <Upload name="slopeImage"
                                {...toast}
                                onChange={(event) => this.onChangeSlopeImage(event)}
                                onRemove={(event) => this.onRemoveSlopeImage(event)}>
                                <Button>
                                <Icon type="upload" /> Click to Image Upload
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="newResort-form-button"
                                /*disabled={this.isFormInvalid()}*/>Submit</Button>
                        </FormItem>
                    </Form>
                </div>
             </div>
        );
    }
}

export default Form.create()(NewResort);