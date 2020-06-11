import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { getLectureByResortId } from '../util/APIUtils';
import "./Resort.css"


const { Meta } = Card;

class ResortLectures extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      resortId: '',
      lectures: []
    }
  }

  componentDidMount() {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value};
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState){
    if (this.props.resortId !== prevProps.resortId) {
      this.setState({
        ...this.state,
        resortId: this.props.resortId
      })

      getLectureByResortId(this.props.resortId)
      .then(res => {
        this.setState({
          lectures: res,
        })
      });
    }
  
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };


  


  render() {
    const { lectures } = this.state
    
    const lecturesCard = lectures.map((lecture) => {
      return (      
        <Col className="cardStyle" span={6}>

          <Card onClick={this.showModal}
            style={{ width: 300 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
               }
            actions={[
            // <Icon type="heart" key="like" onClick={() => console.log("찜")} />,
            // <Icon type="shopping" key="bag" onClick={() => console.log("장바구니")} />,
            <Link to="/" />
            ]}
          >
            <Meta
              title={lecture.lectureName}
              description={lecture.lectureDescription}
            />
            </Card>

        </Col>
        
      )
    })

    return (
      <div>

        <Row gutter={20}>
          {lecturesCard}
        </Row>  
      </div>
    )
  }
};

export default ResortLectures;