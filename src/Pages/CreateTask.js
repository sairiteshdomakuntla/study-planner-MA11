import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

const CreateNewTask = () => {
  const [subjectsList, setSubjectsList] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [task, setTask] = useState({
    uid: uuidv4(),
    completed: false,
    precentComp: Math.random() * 100,
    subject: "",
    subid: "",
    task: "",
    description: "",
    fromdate: "",
    todate: "",
  });

  // Load subjects from localStorage on component mount
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    setSubjectsList(storedSubjects);
  }, []);

  const addTaskToDb = () => {
    // Get existing tasks from localStorage
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Prepare new task object
    const newTaskEntry = {
      ...task,
      uid: uuidv4(),
      tasks: subTasks
    };

    // Add new task to existing tasks
    const updatedTasks = [...existingTasks, newTaskEntry];

    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Reset form
    setEmptyTaskAndSubTask();

    return newTaskEntry;
  };

  const setEmptyTaskAndSubTask = () => {
    setTask({
      uid: uuidv4(),
      completed: false,
      precentComp: Math.random() * 100,
      subject: "",
      subid: "",
      task: "",
      description: "",
      fromdate: "",
      todate: "",
    });

    setSubTasks([]);
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSubTask = () => {
    const newSubTask = {
      id: uuidv4(),
      name: '',
      description: '',
      status: 'Pending'
    };
    setSubTasks([...subTasks, newSubTask]);
  };

  const updateSubTask = (index, updates) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = { ...updatedSubTasks[index], ...updates };
    setSubTasks(updatedSubTasks);
  };

  const deleteSubTask = (id) => {
    setSubTasks(subTasks.filter(subTask => subTask.id !== id));
  };

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={10}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            select
            value={task.subject}
            onChange={handleTaskChange}
            variant="outlined"
            margin="normal"
          >
            {subjectsList.map((subject) => (
              <MenuItem key={subject.id} value={subject.subject}>
                {subject.subject}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Task Name"
            name="task"
            value={task.task}
            onChange={handleTaskChange}
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={task.description}
            onChange={handleTaskChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
          />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="From Date"
                name="fromdate"
                type="date"
                value={task.fromdate}
                onChange={handleTaskChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="To Date"
                name="todate"
                type="date"
                value={task.todate}
                onChange={handleTaskChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Button 
            variant="contained" 
            color="primary" 
            onClick={addSubTask}
            sx={{ mt: 2 }}
          >
            Add Subtask
          </Button>

          {subTasks.map((subTask, index) => (
            <Grid container spacing={2} key={subTask.id} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Subtask Name"
                  value={subTask.name}
                  onChange={(e) => updateSubTask(index, { name: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Subtask Description"
                  value={subTask.description}
                  onChange={(e) => updateSubTask(index, { description: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Status"
                  select
                  value={subTask.status}
                  onChange={(e) => updateSubTask(index, { status: e.target.value })}
                  variant="outlined"
                >
                  {['Pending', 'In Progress', 'Completed'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => deleteSubTask(subTask.id)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button 
            variant="contained" 
            color="success" 
            onClick={addTaskToDb}
            sx={{ mt: 2, mr: 2 }}
          >
            Save Task
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={setEmptyTaskAndSubTask}
            sx={{ mt: 2 }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateNewTask;