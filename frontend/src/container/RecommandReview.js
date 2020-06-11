import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

import Slider from "react-slick";


const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      minWidth: 300,
      width: '100%',
    },
    image: {
      position: 'relative',
      height: 300,
      [theme.breakpoints.down('xs')]: {
        width: '100% !important', 
        height: 250,
      },
    },
    imageButton: {
      position: 'absolute',
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.black,
    },
    imageSrc: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    },
    imageTitle: {
      position: 'relative',
      margin: "1.5rem 1.5rem"
    },
  }));

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 4000,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
    ]
  };

export default function RecommandReview(props) {
  const classes = useStyles();
                      


  return (
    <Slider {...settings}>
      { props.reviewlist && props.reviewlist.map(review => (
        <ButtonBase
          focusRipple
          key={review.commentId}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: "25%",
          }}
        >
          <Link to={`/lectures/${review.lecture.lectureId}`}>
          <span
            className={classes.imageSrc}
            style={{
            backgroundImage: `url("https://cdn.pixabay.com/photo/2014/03/25/16/31/note-297252_1280.png")`,
            backgroundSize: 'cover',
            margin: "5px 5px"
            }}
          />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              <div style={{fontSize: "1.2rem", textAlign: "center"}}>
                {review.lecture.lectureName}
              </div>
              <div style={{fontSize: "1rem", textAlign: "center"}}>
                {review.commentDescription} 
              </div>
              
            </Typography>
          </span>
          </Link>
        </ButtonBase>
        
      ))}
    </Slider>
  );
}