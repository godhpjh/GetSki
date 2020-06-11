import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';
import './Login.css';

import { Form, Input, Button, Icon, notification } from 'antd';

class Login extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const AntWrappedLoginForm = Form.create({})(LoginForm)
        return (
            <div>
                <div className="login-container">
                    <h1 className="page-title">Login</h1>
                    <div className="login-content">
                        <AntWrappedLoginForm onLogin={this.props.onLogin} />
                    </div>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            message: 'GetSki',
                            description: '아이디 혹은 비밀번호가 일치하지 않습니다. 다시 시도해주세요.'
                        });                    
                    } else {
                        notification.error({
                            message: 'GetSki',
                            description: '등록된 회원이 아닙니다.'
                        });                                            
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: '아이디 혹은 이메일을 입력해주세요.' }],
                    })(
                    <Input 
                        prefix={<Icon type="user" />}
                        size="large"
                        name="usernameOrEmail" 
                        placeholder="Username or Email" />    
                    )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: '비밀번호를 입력해주세요.' }],
                })(
                    <Input 
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="password" 
                        type="password" 
                        placeholder="Password"  />                        
                )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </Form.Item>
            </Form>
        );
    }
}

export default Login;