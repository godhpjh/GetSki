import React, { Component } from 'react';
import { getResortByRegion } from '../util/APIUtils';
import { Link } from 'react-router-dom';
import { Card} from 'antd';
import { Grid, GridColumn } from 'semantic-ui-react'
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';


class Resorts extends Component {
  state = {
    resortsInRegion: [],
    region: [],
  }
  
  componentDidMount() {
    window.scrollTo(0, 0);
    const regionNum = this.props.match.params.region
    getResortByRegion(regionNum)
      .then(res => {
        this.setState({
          resortsInRegion: res,
        })
      });
    
    var temp;
    if (regionNum === '20'){
      temp = '강원도' 
    } else if (regionNum === '41'){
      temp = '경기도'
    } else if(regionNum === '56'){
      temp = '전라북도'
    } else if(regionNum === '62'){
      temp = '경상남도'
    };

    this.setState({
      region: temp
    })

  }

  render() {
    const { Meta } = Card;
    const { resortsInRegion } = this.state;
    let resortImages;
    let curImage;
    if(this.state.resortsInRegion.length>0) console.log("asdasdasda",this.state.resortsInRegion);

    const resortCard = resortsInRegion.map((resort) => {
      resortImages = resort.resortImage;
      for(var k=0;k<resortImages.length;k++){
        if(resortImages[k].imageType==='스키장'){
          curImage = resortImages[k];
        }
      }
      return (      
        // <Col className="cardStyle" span={6}>
        <GridColumn width={4}>
        <Link to={`/resorts/${resort.resortId}`}>
            <Card cover={
              <img
                alt={resort.resortName}
                // src={resort.resortImage.length>0 && resort.resortImage[0].fileUri}
                src={curImage.fileUri}
                width="200"
                height="200"     
              />
              }
            >
            <Meta
              title={resort.resortName}
              description={resort.location}
              style={{height: "75px"}}
            />
            </Card>
          </Link>
        </GridColumn>
        // </Col>
        
      )
    })
    
    return (
      <div className="container">
        <div style={{margin: "20px 0"}}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{color: "inherit"}}>

            <HomeIcon style={{marginRight: '0.5', width: "20", height: "20"}} />
            Home
          </Link>
          <Link style={{color: "inherit"}}>
            전국 스키장
          </Link>
          {/* <Link to="/resortsByRegion/20" style={{color: "inherit"}}>
            강원도
          </Link> */}
          <Typography color="textPrimary" style={{display: "flex"}}>
            {this.state.region}
          </Typography>
        </Breadcrumbs>
        </div>
        <div className="submenu">스키장 목록</div>
        <div>
        <Grid container columns={2} doubling stackable>
          {resortCard}
        </Grid>
        {/* <Row gutter={20}>
          {resortCard}
        </Row>   */}
        </div>

      </div>
    )
  };
}

export default Resorts;