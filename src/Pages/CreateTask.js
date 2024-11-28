import React, { useState, useEffect } from "react";
import { 
  Grid, 
  TextField, 
  Button, 
  MenuItem, 
  Snackbar, 
  Alert 
} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

const CreateNewTask = () => {
  const [subjectsList, setSubjectsList] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    setSubjectsList(storedSubjects);
  }, []);

  const addTaskToDb = () => {
    // Validation checks
    if (!task.subject) {
      setSnackbar({ 
        open: true, 
        message: "Please select a subject", 
        severity: 'error' 
      });
      return;
    }
    if (!task.task) {
      setSnackbar({ 
        open: true, 
        message: "Task name is required", 
        severity: 'error' 
      });
      return;
    }
    if (subTasks.some(subTask => !subTask.name)) {
      setSnackbar({ 
        open: true, 
        message: "All subtasks must have a name", 
        severity: 'error' 
      });
      return;
    }

    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    const newTaskEntry = {
      ...task,
      uid: uuidv4(),
      tasks: subTasks
    };

    const updatedTasks = [...existingTasks, newTaskEntry];

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Success snackbar
    setSnackbar({ 
      open: true, 
      message: "Task saved successfully!", 
      severity: 'success' 
    });

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
    if (subTasks.length >= 5) {
      setSnackbar({ 
        open: true, 
        message: "Maximum of 5 subtasks allowed", 
        severity: 'warning' 
      });
      return;
    }

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
    setSnackbar({ 
      open: true, 
      message: "Subtask removed", 
      severity: 'info' 
    });
  };

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
            error={!task.subject}
            helperText={!task.subject ? "Subject is required" : ""}
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
            error={!task.task}
            helperText={!task.task ? "Task name is required" : ""}
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
            disabled={subTasks.length >= 5}
          >
            Add Subtask {subTasks.length}/5
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
                  error={!subTask.name}
                  helperText={!subTask.name ? "Subtask name is required" : ""}
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

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Button 
                fullWidth
                variant="contained" 
                color="success" 
                onClick={addTaskToDb}
              >
                Save Task
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                fullWidth
                variant="outlined" 
                color="secondary" 
                onClick={setEmptyTaskAndSubTask}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateNewTask;