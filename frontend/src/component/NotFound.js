import React, { Component } from 'react';

class NotFound extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div className='container'>
                <div style={{textAlign: "center", }}>
                <h1>Not Found</h1>
                <div>
                이 페이지는 존재하지 않습니다.
                </div>
                </div>
            </div>
        );
    }
}

export default NotFound;