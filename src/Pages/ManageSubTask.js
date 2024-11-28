import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  TextField, 
  Autocomplete, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from "@mui/icons-material";

const EnhancedManageSubTask = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [dataForFilter, setDataForFilter] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSubTask, setCurrentSubTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    const filterData = storedTasks.map(task => ({
      label: task.task,
      id: task.uid
    }));

    setAllTasks(storedTasks);
    setDataForFilter(filterData);
  }, []);

  useEffect(() => {
    if (selectedTask) {
      const task = allTasks.find(t => t.uid === selectedTask.id);
      setSubTasks(task.tasks || []);
    }
  }, [selectedTask, allTasks]);

  const handleTaskSelect = (event, value) => {
    setSelectedTask(value);
  };

  const handleUpdateSubtasks = () => {
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

  const handleAddSubTask = () => {
    const newSubTask = {
      id: Date.now().toString(),
      name: currentSubTask.name,
      description: currentSubTask.description
    };
    
    setSubTasks([...subTasks, newSubTask]);
    setIsDialogOpen(false);
    setCurrentSubTask(null);
  };

  const handleEditSubTask = (subTask) => {
    setCurrentSubTask(subTask);
    setIsDialogOpen(true);
  };

  const handleDeleteSubTask = (subTaskToDelete) => {
    const updatedSubTasks = subTasks.filter(st => st.id !== subTaskToDelete.id);
    setSubTasks(updatedSubTasks);
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: 'auto', 
      padding: 3, 
      backgroundColor: '#f5f5f5' 
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          marginBottom: 4,
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        SubTask Management
      </Typography>

      <Grid container spacing={2} justifyContent="center" mb={4}>
        <Grid item xs={10} md={6}>
          <Autocomplete
            disablePortal
            id="task-selector"
            options={dataForFilter}
            sx={{ width: '100%' }}
            value={selectedTask}
            onChange={handleTaskSelect}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Select Parent Task" 
                variant="outlined" 
                fullWidth 
              />
            )}
          />
        </Grid>
      </Grid>

      {selectedTask && (
        <>
          <Grid container spacing={2} justifyContent="flex-end" mb={3}>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  setCurrentSubTask(null);
                  setIsDialogOpen(true);
                }}
                startIcon={<AddIcon />}
              >
                Add SubTask
              </Button>
              <Button 
                variant="contained" 
                onClick={handleUpdateSubtasks}
                sx={{ marginLeft: 2 }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {subTasks.map((subTask) => (
              <Grid item xs={12} sm={6} md={4} key={subTask.id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'scale(1.03)' 
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {subTask.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subTask.description || 'No description'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    padding: 1 
                  }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditSubTask(subTask)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteSubTask(subTask)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* SubTask Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentSubTask ? 'Edit SubTask' : 'Create New SubTask'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SubTask Name"
                value={currentSubTask?.name || ''}
                onChange={(e) => setCurrentSubTask(prev => ({
                  ...prev, 
                  name: e.target.value
                }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={currentSubTask?.description || ''}
                onChange={(e) => setCurrentSubTask(prev => ({
                  ...prev, 
                  description: e.target.value
                }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleAddSubTask}
              >
                {currentSubTask ? 'Update SubTask' : 'Create SubTask'}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EnhancedManageSubTask;