import React, { useState, useEffect } from "react";
import { Grid, Box, Button } from "@mui/material";
import Card from "../CustomComponents/TaskCard";
import CardPanTask from "../Components/SideDrawerTask";

const AllTasks = () => {
  const [opener, setOpener] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setAllData(storedTasks);
  }, []);

  const openDrawer = (data) => {
    setOpener(true);
    setSelectedTask(data);
  };

  const closeDrawer = () => {
    setOpener(false);
  };

  const handleDeleteTask = (taskToDelete) => {
    const updatedTasks = allData.filter(task => task.uid !== taskToDelete.uid);
    setAllData(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    closeDrawer();
  };

  return (
    <div>
      <Box
        sx={{
          width: opener ? "90%" : 0,
          position: "fixed",
          zIndex: 10005,
          top: 0,
          right: 0,
          backgroundColor: "RGB(13, 30, 45)",
          color: "BB86FC",
          opacity: 0.99,
          overflowX: "auto",
          transition: "0.5s",
          paddingTop: "60px",
        }}
      >
        {selectedTask && (
          <CardPanTask 
            closePanel={closeDrawer} 
            taskData={selectedTask} 
            onDelete={() => handleDeleteTask(selectedTask)}
          />
        )}
      </Box>
      <Grid container spacing={2}>
        {allData.length === 0 ? (
          <Grid item xs={12} textAlign="center">
            <h3>No tasks available. Create a new task!</h3>
          </Grid>
        ) : (
          allData.map((selectedRow, index) => (
            <Grid key={selectedRow.uid || index} item md={4} sm={8} xs={12}>
              <div onClick={() => openDrawer(selectedRow)}>
                <Card taskData={selectedRow} />
              </div>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default AllTasks;