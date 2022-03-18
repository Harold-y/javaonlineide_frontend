import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FileList from '../components/FileList';
import CustomizedTabs from '../components/CustomizedTabs';
import CentralMonaco from '../components/CentralMonaco';
import axios from 'axios';
import { useEffect } from 'react';
import { Modal, Fade, Backdrop } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as LinkRoute } from 'react-router-dom'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/Harold-y">
        Harold Ye
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 380;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: '0px',
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [operationStep, setOpStep] = React.useState(-1);
  const [visibility, setVisibility] = React.useState(false);
  const [tabList, setTabList] = React.useState([]);
  const [editList, setEditList] = React.useState([]);
  const [selectedEditPath, setSelectedPath] = React.useState('');
  const [selectedEditText, setSelectedText] = React.useState('');
  const [selectedEditType, setSelectedType] = React.useState('');


  const handleTabClick = (path) => {
    for (var i = 0; i < editList.length; i++) {
      if (editList[i].path == path) {
        setSelectedPath(path)
        setSelectedText(editList[i].text)
        setSelectedType(editList[i].type)
        break;
      }
    }
  }

  const handleTabClose = (path) => {
    setEditList(editList.filter((item) => item.path != path))
    setTabList(tabList.filter((tab) => tab.path != path))
    if (operationStep !== 0) {
      setOpStep(operationStep - 1);
    }
    if (operationStep < 0 || operationStep >= editList.length) {
      setOpStep(0);
    }
  }

  const handleNewOpenClick = (path, name, type) => {
    if (type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'gif' || type === 'webp') {
      handleImgModal(path, type);
    } else {
      var tabJson = {
        path: path,
        name: name,
        type: type
      }
      var editJson = {
        type: type,
        path: path,
        text: ''
      }
      var found = false;
      for (var i = 0; i < tabList.length; i++) {
        if (tabList[i].path == path) {
          found = true;
          break;
        }
      }
      if (!found) {
        axios.get(`http://localhost:8888/fileOp/getContent`, { params: { path: path } }).then(function (response) {
          editJson['text'] = response.data;
          setTabList([...tabList, tabJson]);
          setEditList([...editList, editJson]);
        })
      }
    }
  }

  const handleNewValue = (newValue) => {
    setOpStep(newValue)
  }

  useEffect(() => {
    if (tabList.length === 0) {
      setVisibility(false)
    } else {
      setVisibility(true)
    }
  }, [tabList])

  useEffect(() => {
    if (operationStep === 0 && tabList.length >= 1) {
      setSelectedPath(editList[0].path)
      setSelectedText(editList[0].text)
      setSelectedType(editList[0].type)
    }
    if (tabList.length === 1) {
      setSelectedPath(editList[0].path)
      setSelectedText(editList[0].text)
      setSelectedType(editList[0].type)
    } else if (operationStep >= 1) {
      setSelectedPath(editList[operationStep].path)
      setSelectedText(editList[operationStep].text)
      setSelectedType(editList[operationStep].type)
    }
  }, [operationStep, editList])


  const [imgOpen, setImgOpen] = React.useState(false)
  const [imgBase, setImgBase] = React.useState('')
  const handleImgModal = (path, type) => {
    axios.get(`http://localhost:8888/fileOp/getImageBase64`, { params: { path: path } }).then(function (response) {
      setImgBase('data:image/' + type + ';base64, ' + response.data);
    })
    setImgOpen(!imgOpen);
  };



  return (
    <ThemeProvider theme={mdTheme}>
      <Modal
        open={imgOpen}
        onClose={handleImgModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={imgOpen}>
          <Box sx={style}>
            <img src={imgBase} style={{ height: '30vh' }}></img>
          </Box>
        </Fade>
      </Modal>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard

            </Typography>
            Exit Current Project
            <LinkRoute to='/'>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <LogoutIcon />
                </Badge>
              </IconButton>
            </LinkRoute>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <FileList handleNewOpenClick={handleNewOpenClick}></FileList>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar >
          </Toolbar>
          <Container maxWidth="false" style={{ position: 'fixed' }}>
            <CustomizedTabs value={operationStep} tabs={tabList} handleClick={handleTabClick} handleClose={handleTabClose} handleNewValue={handleNewValue}></CustomizedTabs>
          </Container>

          <Container maxWidth="false" sx={{ mt: 4, mb: 4 }} style={{}}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  {visibility ? <CentralMonaco path={selectedEditPath} type={selectedEditType} text={selectedEditText} /> : ''}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}