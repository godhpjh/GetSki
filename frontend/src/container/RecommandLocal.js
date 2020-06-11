import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";


const images = [
  {
    url: 'https://www.travelnbike.com/news/photo/201902/75762_136941_627.JPG',
    title: 'GANGWON',
    width: '25%',
    regionNum: 20,
  },
  {
    url: 'https://m.konjiamresort.co.kr/common/images/main/visual_main05.jpg',
    title: 'GYEONGGI',
    width: '25%',
    regionNum: 41,
  },
  {
    url: 'https://s3-ap-northeast-2.amazonaws.com/www.sktinsight.com/wp-content/uploads/2017/08/%EC%8A%A4%ED%82%A4%EC%9E%A5_lte_1-1-586x385.jpg',
    title: 'GYEONGNAM',
    width: '25%',
    regionNum: 62,
  },
  {
    url: 'https://cdn.011st.com/11dims/resize/600x600/quality/75/11src/pd/19/3/0/9/0/2/2/LXFCf/2640309022_L300.jpg',
    title: 'JEONBUK',
    width: '25%',
    regionNum: 56,
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  image: {
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

export default function RecommandLocal() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {images.map(image => (
        
        <ButtonBase
          focusRipple
          key={image.title}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: image.width,
          }}
        >
          <Link to={`/lectures/byRegion/${image.regionNum}`}>
          <span
            className={classes.imageSrc}
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          />
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {image.title}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
          </Link>
        </ButtonBase>
      ))}
    </div>
  );
}