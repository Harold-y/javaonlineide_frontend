import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function CustomizedTabs({ value, tabs, handleClick, handleClose, handleNewValue }) {

  const handleChange = (event, newValue) => {
    handleNewValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: { xs: "70vw", sm: "70vw" },
        bgcolor: 'background.paper',
      }}
      style={{ position: 'relative' }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {
          tabs.map((tab) => (
            <Tab label={
              <span>
                {tab.name}
                <IconButton aria-label="delete" onClick={() => { handleClose(tab.path) }}>
                  <ClearIcon />
                </IconButton>
              </span>
            } key={tab.path} onClick={() => { handleClick(tab.path) }}></Tab>
          ))
        }
      </Tabs>
    </Box>
  );
}
