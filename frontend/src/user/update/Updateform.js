import React, { Component } from 'react';
import { updateInfo } from '../../util/APIUtils';
// import { Link } from 'react-router-dom';
import { 
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import { 
    Form,
    Select,
    Input, 
    Button, 
    DatePicker,
    notification } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class UpdateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:{
                value:'',
            },
            email:{
                value:'',
            },
            username:{
                value:''
            },
            name:{
                value:'',
            },
            password: {
                value: ''
            },
            confirmpassword:{
                value:''
            },
            phonenumber:{
                value: ''
            },
            checked:false,
            birthdate:'',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }


    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
            }
        });

        const updateRequest = {
            id : this.props.user.id,
            email : this.props.user.email,
            name : this.props.user.name,
            username:this.props.user.username,
            password: this.state.password.value,
            phonenumber:this.state.phonenumber,
            checked:this.state.checked,
            birthdate:this.state.birthdate,
        };
        updateInfo(updateRequest)
        .then(response => {
            notification.success({
                message: 'GetSki',
                description: "성공적으로 정보가 변경 되었습니다.",
            });          
            this.refreshpage();
            
        }).catch(error => {
            notification.error({
                message: 'GetSki',
                description: error.message || '다시 시도해주세요.'
            });
        });
    }

    isFormInvalid() {
        return !(
            this.state.password.validateStatus === 'success' &&
            this.state.confirmpassword.validateStatus === 'success'
        );
    }

    toggleChecked = () => {
        this.setState({ checked: !this.state.checked });
    };

    onChange = e => {
        //console.log('checked = ', e.target.checked);
        this.setState({
          checked: e.target.checked,
        });
    };

    onChangePhone = (e) =>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                //console.log('phone num = ',values.prefix, e.target.value);
                this.setState({
                    phonenumber:values.prefix+e.target.value,
                });
            }
        });
    };

    onDateChange = (date,dateString) =>{
        console.log(date,dateString);
        this.setState({
            birthdate:dateString
        });
    }

    handleChange = (e) => {
        this.setState({
            phonenumstart: e.target.value,
        });
      };

    refreshpage(){ 
        window.location.reload(); 
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {initialValue: '010',})
        (
            <Select style={{ width: 85 }}>
                <Option value="010">010</Option>
                <Option value="011">011</Option>
            </Select>,
        );
        
        // const label = `${this.state.checked ? "I'm Tutee" : "I'm Tutor"}`;
        return (
            <div className="signup-container">
                <h1 className="page-title">Update Info</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem 
                            label="Password"
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            
                            <Input 
                                size="large"
                                name="password" 
                                type="password"
                                autoComplete="off"
                                placeholder="At least 6 characters" 
                                value={this.state.password.value} 
                            onChange={(event) => this.handleInputChange(event, this.validatePassword)} /> 
                        </FormItem>
                        <FormItem 
                            label="Confirm Password"
                            validateStatus={this.state.confirmpassword.validateStatus}
                            help={this.state.confirmpassword.errorMsg}>
                            <Input 
                                size="large"
                                name="confirmpassword" 
                                type="password"
                                autoComplete="off"
                                placeholder="Please Repeat Your Password!"
                                value={this.state.confirmpassword.value} 
                            onChange={(event) => this.handleInputChange(event, this.validateconfirmpassword)} />   
                        </FormItem>
                        <Form.Item label="Phone Number">
                            
                                {/* <Select name="phonenumstart" value={this.state.phonenumstart.value} style={{ width: 70 }} onChange={this.handleChange}>
                                    <Option value='010'>010</Option>
                                    <Option value='011'>011</Option>
                                </Select>
                                <Input 
                                    style = {{width:'100%'}}
                                    name="phonenumber"
                                    onChange={this.onChangePhone} /> */}
                            
                            {getFieldDecorator('phone', {
                                rules: [{ required: false, message: 'Please input your phone number!' }],
                            })(<Input addonBefore={prefixSelector} 
                                style={{ width: '100%' }} 
                                name="phonenumber"
                                onChange={this.onChangePhone} />)}
                        </Form.Item>
                        <Form.Item label="Birth Date">
                            <DatePicker 
                                name="birthdate" 
                                onChange={this.onDateChange}/>
                        </Form.Item>
                        {/* <FormItem /*{...tailFormItemLayout}*/ }
                            {/* label={
                                <span>
                                    유저 정보&nbsp;
                                    <Tooltip title="체크박스 체크시 강습자 / 미체크시 강사">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            }
                        >
                                <Checkbox
                                    checked={this.state.checked}
                                    onChange={this.onChange}
                                >
                                {label}
                                </Checkbox>
                            
                        </FormItem> */}
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}
                                >Update my Info</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateconfirmpassword = (confirmpassword) =>{
        if(this.state.password.value === confirmpassword){
            return{
                validateStatus: 'success',
                errorMsg: null,
            };
        }
        else{
            return{
                validateStatus: 'error',
                errorMsg: 'Two passwords that you enter is inconsistent!'
            };
        }
    }

    

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${PASSWORD_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${PASSWORD_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };            
        }
    }

}

export default Form.create()(UpdateForm);