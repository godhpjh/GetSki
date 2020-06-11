import React, { Component } from 'react';
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';
import moment from 'moment';

import { 
    Form,
    Icon,
    Tooltip,
    Select,
    Checkbox,
    Input, 
    Button, 
    DatePicker,
    notification } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            confirmpassword:{
                value:''
            },
            phonenumstart:{
                value:'선택',
            },
            phonenumber:{
                value: ''
            },
            favorate:{
                value:[]
            },
            role:{
                value:''
            },
            checked:false,
            birthdate:'',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
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

        const signupRequest = {
            name: this.state.name.value,
            email: this.state.email.value,
            username: this.state.username.value,
            password: this.state.password.value,
            phonenumber:this.state.phonenumber,
            checked:this.state.checked,
            birthdate:this.state.birthdate,
        };
        signup(signupRequest)
        .then(response => {
            notification.success({
                message: 'GetSki',
                description: "성공적으로 회원가입되었습니다. 로그인을 해주세요.",
            });          
            this.props.history.push("/login");
        }).catch(error => {
            notification.error({
                message: 'GetSki',
                description: '다시 시도해주세요.'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    toggleChecked = () => {
        this.setState({ checked: !this.state.checked });
    };

    onChange = e => {
        this.setState({
          checked: e.target.checked,
        });
    };

    onChangePhone = (e) =>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.setState({
                    phonenumber:values.prefix+e.target.value,
                });
            }
        });
    };

    onDateChange = (dateString) => {
        this.setState({
            birthdate: dateString
        });
    }

    handleChange = (e) => {
        this.setState({
            phonenumstart: e.target.value,
        });
      };

    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {initialValue: '010',})
        (
            <Select style={{ width: 85 }}>
                <Option value="010">010</Option>
            </Select>,
        );
        
        

        const label = `${this.state.checked ? "I'm Tutee" : "I'm Tutor"}`;
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem 
                            label="Full Name"
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input 
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Your full name"
                                value={this.state.name.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem label="Username"
                            hasFeedback
                            validateStatus={this.state.username.validateStatus}
                            help={this.state.username.errorMsg}>
                            <Input 
                                size="large"
                                name="username" 
                                autoComplete="off"
                                placeholder="A unique username"
                                value={this.state.username.value} 
                                onBlur={this.validateUsernameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateUsername)} />    
                        </FormItem>
                        <FormItem 
                            label="Email"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input 
                                size="large"
                                name="email" 
                                type="email" 
                                autoComplete="off"
                                placeholder="Your email"
                                value={this.state.email.value} 
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />    
                        </FormItem>
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
                                onChange={this.onDateChange}
                                disabledDate={(d) => moment().isBefore(d, 'day')}/>
                        </Form.Item>
                        <FormItem
                            label={
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
                        </FormItem>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}>Sign up</Button>
                            Already registed? <Link to="/login">Login now!</Link>
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

    validateName = (name) => {
        if(name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${NAME_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${NAME_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };            
        }
    }

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email는 비워둘 수 없습니다.'                
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: '유효한 Email이 아닙니다.'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 깁니다. 최대 (Maximum ${EMAIL_MAX_LENGTH} 이하로 입력해주세요.`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateUsername = (username) => {
        if(username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${USERNAME_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${USERNAME_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if(usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: 'error',
                        errorMsg: '이미 존재하는 Username 입니다.'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });    
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: '이미 존재하는 Email 입니다. '
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
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

export default Form.create()(Signup);