import React, { Component } from 'react';
import { setReview } from '../util/APIUtils';

import 'antd/dist/antd.css';
import { Comment, Form, Input, Button } from 'antd';
import { Rating } from '@material-ui/lab';

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <Input.TextArea name="commentDescription" row={6} onChange={onChange} value={value} />
    </Form.Item>

    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        후기 남기기 
      </Button>
    </Form.Item>
  </div>
);

class LectureReviewInput extends Component {
    state = {
      submitting: false,
      comments: {
        commentDescription : '',
        rate : 0
      },
      lectureid: 0,
      userid: 0,
    };
    
    constructor(props) {
      super(props);
      this.state.lectureid = props.lectureId;
      this.state.userid = localStorage.getItem('userid');
    }

    handleSubmit = () => {
      if (!this.state.comments.commentDescription) {
        return;
      }
      this.setState({
        submitting: true,
      });

      setReview(this.state.comments, this.state.lectureid, this.state.userid)
      .then( res => {
        this.setState({
          submitting : false
        });
      })
      .catch( err => {
        console.log("Error writing a review", err);
      })
      window.history.go(0);
    }; // sumbit
  
    // 댓글 쓰기 핸들링
    handleChangeDescription = e => {
      this.setState({
        comments : {
          commentDescription : e.target.value,
          rate: this.state.comments.rate
        }
      });
    };
    
    // 별점 주기 핸들링
    handleChangeStar = e => {
      this.setState({
        comments : {
          commentDescription : this.state.comments.commentDescription,
          rate : e.target.value
        }
      });
    };


    render() {
      const { submitting, comments } = this.state;
      
      return (
        <div>
          <hr/>
          {localStorage.getItem('userid') && 
          <table style={{'width':'30em'}}>
            <tr>
              <td style={{'textAlign':'center'}}>
                {localStorage.getItem('username')}
              </td>
              <td>
                <Rating
                  onChange={this.handleChangeStar} 
                  value={comments.rate}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Comment
                  content={
                    <Editor
                      onChange={this.handleChangeDescription}
                      onSubmit={this.handleSubmit}
                      submitting={submitting}
                      value={comments.commentDescription}
                    />
                  }
                />
              </td>
            </tr>
          </table>}
        </div>
      );
    }
  }

export default LectureReviewInput;