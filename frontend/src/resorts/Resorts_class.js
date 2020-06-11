import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResort } from '../util/APIUtils';


class ResortsClass extends Component {
  state = {
    infos: []
  }
  // make the GET request to fetch data from the URL then using promise function to handle response.
  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/posts`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({
          infos: res.data
        });
      });
  }

  render() {
    const { infos } = this.state;
    const infoList = infos.map(info => <li key={info.id}>{info.title}</li>);
    return (
      <>
        <div>
          hello
          <div>{infoList}</div>

        </div>
      </>
    )
  };
}
  export default ResortsClass;
