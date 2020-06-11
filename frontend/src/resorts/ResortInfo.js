import React, { Component } from 'react';
import { Card } from 'antd';

class ResortInfo extends Component {
  constructor(props){
    super(props);

    this.state={
      key: 'intro',
      liftImages:props.liftImages,
    }
  }

  onTabChange = (key, type) => {
    this.setState({ 
      [type]: key,
    });
  }
  
  render() {
    const { key } = this.state;
    const { resort } = this.props;

    const tabList = [
      {
        key: 'intro',
        tab: '소개'      
      },
      {
        key: 'liftImages',
        tab: '리프트 요금'
      },
      {
        key: 'rentalImage',
        tab: '렌탈 요금'
      },
      {
        key: 'slopeImage',
        tab: '슬로프 정보'
      },

    ];
    
    const contentList = {
      intro: 
        <div className="content">{resort[key]}</div>
      ,
      liftImages: <div>
        <img
          alt={key}
          src={this.props.liftImages.length>0 && this.props.liftImages[0].fileUri}
          width="100%"
          height="100%"     
        />
      </div>,
      rentalImage: <div>
        <img
          alt={key}
          // src={resort[key]}
          src={this.props.rentalImages.length>0 && this.props.rentalImages[0].fileUri}
          width="100%"
          height="100%"     
        />
      </div>,
      slopeImage: <div>
        <img
          alt={key}
          src={this.props.slopeImages.length>0 && this.props.slopeImages[0].fileUri}
          width="100%"
          height="100%"     
        />
      </div>,
    };
    
    // if(this.state.liftImages.length > 0) console.log("987987",this.state.liftImages[0].id);

    return (
      <div>
        <Card
          style={{ width: '100%' }}
          title={resort.location}
          extra={<a href={resort.pageLink} target="blank">More</a>}
          tabList={tabList}
          activeTabKey={key}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
        >
          {contentList[key]}
        </Card>
      </div>
    );
  }
}


export default ResortInfo;