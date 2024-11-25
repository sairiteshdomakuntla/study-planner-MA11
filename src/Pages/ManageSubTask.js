import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  TextField, 
  Autocomplete, 
  Button 
} from "@mui/material";
import DataTableCrudDemo from "../CustomComponents/CRUD-pr-table";

const ManageSubTask = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [dataForFilter, setDataForFilter] = useState([]);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Prepare data for filter
    const filterData = storedTasks.map(task => ({
      label: task.task,
      id: task.uid
    }));

    setAllTasks(storedTasks);
    setDataForFilter(filterData);
  }, []);

  useEffect(() => {
    // When a task is selected, load its subtasks
    if (selectedTask) {
      const task = allTasks.find(t => t.uid === selectedTask.id);
      setSubTasks(task.tasks || []);
    }
  }, [selectedTask, allTasks]);

  const handleTaskSelect = (event, value) => {
    setSelectedTask(value);
  };

  const handleUpdateSubtasks = () => {
    // Update tasks in localStorage
    const updatedTasks = allTasks.map(task => {
      if (task.uid === selectedTask.id) {
        return {
          ...task,
          tasks: subTasks
        };
      }
      return task;
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
  };

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" mb={8}>
        <Grid item xs={10} md={3} sm={5}>
          <Autocomplete
            disablePortal
            id="task-selector"
            options={dataForFilter}
            sx={{ width: 300 }}
            value={selectedTask}
            onChange={handleTaskSelect}
            renderInput={(params) => <TextField {...params} label="Select Task" />}
          />
        </Grid>
      </Grid>

      {selectedTask && (
        <>
          <Grid container spacing={1} justifyContent="space-around" mb={5}>
            <Button 
              variant="contained" 
              onClick={handleUpdateSubtasks}
            >
              Update Task
            </Button>
          </Grid>

          <DataTableCrudDemo 
            subTasks={subTasks} 
            setSubTasks={setSubTasks} 
          />
        </>
      )}
    </div>
  );
};

export default ManageSubTask;