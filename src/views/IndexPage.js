import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouteLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import { SiSpring } from 'react-icons/si';
import { SiApachemaven } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import axios from 'axios';
import { useEffect } from 'react';
import qs from 'qs';
import { useNavigate } from "react-router-dom";
import { Modal, Fade, Backdrop } from '@mui/material';
import { TextField } from '@mui/material'
import { Divider } from '@mui/material';
import { Card } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { FormLabel } from '@mui/material';
import { RadioGroup, Radio, FormControlLabel } from '@mui/material';

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

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/Harold-y">
                Harold澂冰
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function IndexPage() {
    const [recentProject, setRecentProject] = React.useState([]);
    useEffect(() => {
        const getHistory = async () => {
            const res =
                await axios.get(`http://localhost:8888/history/getRecentHistory`);
            setRecentProject(res.data);

        };
        getHistory()
    }, [])
    function getProjectImage(type) {
        if (type === "java")
            return "/jv.png"
        if (type === "maven")
            return "/mv.jpg"
        if (type === "spring")
            return "/sp.png"
    }
    const navigate = useNavigate();
    function openProject(path, type) {
        if (path === '' || type === '') {
            setError();
        } else {
            axios.post(`http://localhost:8888/history/updatePath`, qs.stringify({ path: path, type: type })).then(function (res) {
                if (res.data === 1) {
                    navigate("/dashboard");
                }
            })
        }

    }

    const [openExist, setOpenExist] = React.useState(false);
    const handleOpenExist = () => {
        setExistPath('');
        setExistType('');
        if (!openExist)
            getWisdom();
        setOpenExist(!openExist);
    };
    const [wisdom, setWisdom] = React.useState("")
    const [wisdomOrg, setWisdomOrg] = React.useState("")
    const getWisdom = () => {
        axios.get(`http://localhost:8888/wisdom/rand`).then((res) => {
            setWisdom(res.data.wisdomDescription)
            setWisdomOrg(res.data.wisdomOrigin)
        })
    }

    const [existPath, setExistPath] = React.useState('')
    const [existType, setExistType] = React.useState('')


    const [newPath, setNewPath] = React.useState('')
    const [newGroupId, setNewGroupId] = React.useState('com.example')
    const [newName, setNewName] = React.useState('')

    const [newJava, setNewJava] = React.useState(false);
    const [newMaven, setNewMaven] = React.useState(false);

    const [mavenOrSpring, setMavenOrSpring] = React.useState("maven");

    const handleOpenJava = () => {
        setNewName('');
        setNewPath('');
        if (!newJava)
            getWisdom();
        setNewJava(!newJava);
    };
    const handleOpenMaven = (name) => {
        setNewName('');
        setNewPath('');
        setMavenOrSpring(name);
        setNewGroupId('com.example');
        if (!newMaven)
            getWisdom();
        setNewMaven(!newMaven);
    };

    function createNewJava() {
        if (newName === '' || newPath === '') {
            setError();
        } else {
            axios.post(`http://localhost:8888/newProject/java`, qs.stringify({ name: newName, path: newPath })).then(function (res) {
                if (res.data === true) {
                    navigate("/dashboard");
                }
            })
        }
    }

    function createNewMavenSpring() {
        if (newName === '' || newPath === '' || newGroupId === '') {
            setError();
        } else {
            if (mavenOrSpring === 'maven') {
                axios.post(`http://localhost:8888/newProject/maven`, qs.stringify({ name: newName, path: newPath, groupId: newGroupId })).then(function (res) {
                    if (res.data === true) {
                        navigate("/dashboard");
                    }
                })
            }
            if (mavenOrSpring === 'spring') {
                axios.post(`http://localhost:8888/newProject/spring`, qs.stringify({ name: newName, path: newPath, groupId: newGroupId})).then(function (res) {
                    if (res.data === true) {
                        navigate("/dashboard");
                    }
                })
            }
        }

    }

    const [errorTip, setErrorTip] = React.useState(false);
    const setError = () => {
        setErrorTip(true);
        setTimeout(() => { setErrorTip(false) }, 3000);
    }
    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={openExist}
                onClose={handleOpenExist}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openExist}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: "20px" }}>
                            Open Existing Project
                        </Typography>
                        {errorTip ? <Alert severity="warning" style={{ marginBottom: '2vh' }}>
                            <AlertTitle>Warning</AlertTitle>
                            You must have <strong>valid Path and Type!</strong>
                        </Alert> : ''}
                        <TextField fullWidth label="Path" id="fullWidth" value={existPath} onChange={(e) => setExistPath(e.target.value)} />
                        <FormControl fullWidth style={{ marginTop: '2vh' }}>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={existType}
                                label="Type"
                                onChange={(e) => setExistType(e.target.value)}
                            >
                                <MenuItem value="java">Java</MenuItem>
                                <MenuItem value="maven">Maven</MenuItem>
                                <MenuItem value="spring">Spring</MenuItem>
                            </Select>
                        </FormControl>

                        <Button variant="outlined" style={{ marginTop: '2vh', padding: '15px' }} onClick={() => { openProject(existPath, existType) }}>Open</Button>
                        <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                        <Typography variant="body2" gutterBottom >
                            {wisdom} —— {wisdomOrg}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={newJava}
                onClose={handleOpenJava}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={newJava}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: "20px" }}>
                            Create New Java Project
                        </Typography>
                        {errorTip ? <Alert severity="warning" style={{ marginBottom: '2vh' }}>
                            <AlertTitle>Warning</AlertTitle>
                            You must have <strong>valid Name and Path!</strong>
                        </Alert> : ''}
                        <TextField fullWidth label="Name" id="fullWidth" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <TextField fullWidth label="Path" id="fullWidth" style={{ marginTop: '2vh' }} value={newPath} onChange={(e) => setNewPath(e.target.value)} />
                        <Button variant="outlined" style={{ marginTop: '2vh', padding: '15px' }} onClick={() => { createNewJava() }}>Create</Button>
                        <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                        <Typography variant="body2" gutterBottom >
                            {wisdom} —— {wisdomOrg}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={newMaven}
                onClose={handleOpenMaven}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={newMaven}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: "20px" }}>
                            Create New Maven / Spring Project
                        </Typography>
                        {errorTip ? <Alert severity="warning" style={{ marginBottom: '2vh' }}>
                            <AlertTitle>Warning</AlertTitle>
                            You must have <strong>valid Name, GroupID, and Path!</strong>
                        </Alert> : ''}
                        <TextField fullWidth label="Name" id="fullWidth" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <TextField fullWidth label="Group ID" id="fullWidth" style={{ marginTop: '2vh' }} value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)} />
                        <TextField fullWidth label="Path" id="fullWidth" style={{ marginTop: '2vh' }} value={newPath} onChange={(e) => setNewPath(e.target.value)} />
                        <FormControl style={{ marginTop: '2vh' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue=""
                                name="radio-buttons-group"
                                value={mavenOrSpring}
                                onChange={(e) => { setMavenOrSpring(e.target.value) }}
                            >
                                <FormControlLabel value="maven" control={<Radio />} label="Maven" />
                                <FormControlLabel value="spring" control={<Radio />} label="Spring" />
                            </RadioGroup>
                        </FormControl>
                        <Button variant="outlined" style={{ marginTop: '2vh', padding: '35px' }} onClick={() => { createNewMavenSpring() }}>Create</Button>
                        <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                        <Typography variant="body2" gutterBottom >
                            {wisdom} —— {wisdomOrg}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <HomeIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" color="inherit" noWrap>
                        Home
                        {/**
                         * <RouteLink to='/dashboard'>Hello, click here</RouteLink>
                         */}
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Java Online Editor
                        </Typography>
                        <Typography variant="hs" align="center" color="text.secondary" paragraph>
                            I said goodbye to my hometown and parents and set out on a long voyage. The road stretched into the distance, so far that it seemed to have the clouds of Mount Lushan obscuring its full view, and its continuation, so that the adventurer's extreme vision was also like the moon in the water. Yes, that is a ship. But it is not limited to a boat. Maybe it is an airplane, or a free trip on Highway 1 for tens of thousands of kilometers. But no matter how it is or will be carried in different forms, it started here.
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained" startIcon={<FaJava />} onClick={handleOpenJava}>New Java Project</Button>
                            <Button variant="outlined" startIcon={<SiApachemaven />} onClick={() => { handleOpenMaven("maven") }}>New Maven Project</Button>
                            <Button variant="outlined" color="success" startIcon={<SiSpring />} onClick={() => { handleOpenMaven("spring") }}>New Spring Project</Button>
                        </Stack>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                            style={{ marginTop: '2vh' }}
                        >
                            <Button variant="text" startIcon={<FaJava />} onClick={handleOpenExist}>Open Existing Project</Button>
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Typography
                        component="h4"
                        variant="h5"
                        align="center"
                        color="text.primary"
                        gutterBottom
                        style={{ marginBottom: '2vh' }}
                    >
                        Recent Opened Projects
                    </Typography>
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {recentProject.map((project) => (
                            <Grid item key={project.historyId} xs={12} sm={6} md={4}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={getProjectImage(project.historyType)}
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {project.historyName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {"Last Accessed: " + project.historyLastTime}<br></br>{project.historyPath}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => { openProject(project.historyPath, project.historyType) }}>Open</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    I Hope you Live a Long Life
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    趁现在还有机会，赶紧放弃CS吧
                </Typography>
                <Copyright />
            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}


