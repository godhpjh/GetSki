import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from './Appbar';
import Toolbar, { styles as toolbarStyles } from './Toolbar';
import Typography from "@material-ui/core/Typography";
import AppbarContent from './AppbarContent';

const styles = theme => ({
  title: {
    fontSize: 27,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    // flex: 1,
    // fontColor: "black",
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.black,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

function AppAppBar(props) {
//   const { classes } = props;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar style={{height: "64", justifyContent: 'space-between', marginBottom: "64"}}>

          <Link
            variant="h4"
            underline="none"
            color="inherit"
            href="/"
            style={{ textDecoration: 'none', fontSize: "27"}}
          >
              <Typography variant="h5">
            GETSKI
            </Typography>
          </Link>
        
        <AppbarContent
        isAuthenticated={props.isAuthenticated}
        currentUser={props.currentUser}
        user = {props.user}
        onLogout={props.onLogout} role={props.role}
        />
          
        </Toolbar>
      </AppBar>
      {/* <div className={classes.placeholder} /> */}
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppAppBar);