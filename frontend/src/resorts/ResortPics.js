import React, { Component } from 'react';
import { Carousel } from 'antd';

class ResortPics extends Component {

	constructor(props){
    super(props);
    this.state={
      resort: [],
    }
	}
	
	componentDidMount() {
		this.setState({
			resort: this.props.resort
		});
	}


	render() {
		const { resort } = this.state;
		console.log("mapppppp", this.props);
		const images = resort.resortImage;
		const imagesList = images.map((image, index) => (<div><img key={index} src={image} alt="resort" /></div>));
			
		return (
			<Carousel effect="fade" autoplay>
				{imagesList}
			</Carousel>
		)
	};
}

export default ResortPics;
