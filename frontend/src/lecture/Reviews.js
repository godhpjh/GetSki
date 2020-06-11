import React, { Component } from 'react';
import { getReviewByLectureId, deleteReview } from '../util/APIUtils';
import LectureReviewInput from './LectureReviewInput';

import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {Icon, Button} from 'antd';



class Reviews extends Component { 

  constructor(props) {
    super(props);
    this.state = {
      lectureId: '',
      commentList: [],
    };
  }


  componentDidMount(){
    getReviewByLectureId(this.props.lectureId)
    .then( res => {
      this.setState({
        commentList: res
      })
    })
  };
  
  // 내 댓글 삭제
  removeReview(e, idx) {
    deleteReview(e.target.value)
    .then(
      window.history.go(0)
    )
    .catch( err => {
      console.log("err Reivews", err);
    })
  }

  render() {
    const classes = makeStyles(theme => ({
      root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,

      }
    ,
      inline: {
        display: 'inline',
      },
    })
    );

    return (
      <div>

      <List className={classes.root}>
        {this.state.commentList.map((comment, i) =>
          <ListItem >
            <Rating alignItems="center" value={comment.rate} readOnly="true" size="small" />
            <ListItemText
              primary={comment.commentDescription}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body1"
                    className={classes.inline}
                    color="textPrimary"
                    >
                    by. {comment.user.username}
                  </Typography>
                </React.Fragment>
              }
              />
            
            {localStorage.getItem('username')===comment.user.username &&             
            <Button type="link" value={comment.commentId} onClick={(event) => this.removeReview(event, i)}>
              <Icon type="delete" fontSize="small" style={{'color':'red'}} />
            </Button>
            }
          </ListItem>
        )}
      </List>
      <div>
        <LectureReviewInput lectureId={this.props.lectureId}/>
      </div>
      </div>
    );
}
}

export default Reviews;