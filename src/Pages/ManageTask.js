import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

//import for dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Table from "../CustomComponents/EditableTable";
import ManageTaskCard from "../Components/ManageTaskCard";
import CreateNewTask from "./CreateTask";
import ManageTaskForm from "../Components/CreateTaskForm";

const ManageTask = () => {
  const [age, setAge] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [subjectsList, setSubjectsList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [actualAllTask, setActualAllTask] = useState([]);

  // Initialize localStorage on first load
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    setSubjectsList(storedSubjects);
    setAllData(storedTasks);
    setActualAllTask(storedTasks);
  }, []);

  const saveSubjectsToLocalStorage = (subjects) => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    setSubjectsList(subjects);
  };

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    setAllData(tasks);
    setActualAllTask(tasks);
  };

  const handleChange = (event) => {
    const data = event.target.value;
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (data) {
      if (data.subject) {
        const { subject } = data;
        const _filteredTasks = storedTasks.filter((item) => item.subject === subject);
        saveTasksToLocalStorage(_filteredTasks);
      } else {
        const _filteredTasks = storedTasks.filter((item) => 
          item.task.toLowerCase().includes(data.toLowerCase())
        );
        saveTasksToLocalStorage(_filteredTasks);
      }
    } else {
      saveTasksToLocalStorage(storedTasks);
    }
  };

  const handleClickOpen = (data) => {
    setSelectedTask(data);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedTask(null);
    setOpen(false);
  };

  const UpdateTaskToDb = async () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = storedTasks.map(task => 
      task.taskid === selectedTask.taskid ? selectedTask : task
    );
    
    saveTasksToLocalStorage(updatedTasks);
    setOpen(false);
    setSelectedTask(null);
  };

  const deleteTask = async () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = storedTasks.filter(task => 
      task.taskid !== selectedTask.taskid
    );
    
    saveTasksToLocalStorage(updatedTasks);
    setOpen(false);
    setSelectedTask(null);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        scroll={"body"}
        zIndex={100}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {selectedTask ? selectedTask.task : "No Name Assigned"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {selectedTask ? (
              <ManageTaskForm
                subjectsList={subjectsList}
                task={selectedTask}
                setTask={setSelectedTask}
                addTaskToDb={UpdateTaskToDb}
                DeleteTaskBtn={deleteTask}
                manage={true}
              />
            ) : (
              "Task Loading"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} justifyContent="center" mb={8}>
        <Grid item xs={10} md={3} sm={5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Subject"
              onChange={handleChange}
            >
              <MenuItem value={null}>
                <em>None</em>
              </MenuItem>
              {subjectsList.map((item) => (
                <MenuItem key={item.id} value={item}>
                  {item.subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3} sm={5}>
          <TextField
            id="outlined-basic"
            label="Search Task"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {!selectedTask && (
        <Grid container spacing={1} justifyContent="space-around" mt={2}>
          {allData.map((selectedRow) => (
            <Grid item xs={12} md={4} sm={6} key={selectedRow.taskid}>
              <div onClick={() => handleClickOpen(selectedRow)}>
                <ManageTaskCard taskData={selectedRow} />
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ManageTask;