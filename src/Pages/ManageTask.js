import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  TextField, 
  Autocomplete,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Search as SearchIcon 
} from '@mui/icons-material';

const EnhancedManageTask = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState(null);

  // Load initial data from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    setTasks(storedTasks);
    setSubjects(storedSubjects);
  }, []);

  // Filter tasks based on search and subject
  const filteredTasks = tasks.filter(task => 
    (searchQuery === '' || task.task.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!filterSubject || task.subject === filterSubject.subject)
  );

  // Update localStorage and state
  const updateStorage = (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  // Open task edit dialog
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  // Delete task
  const handleDeleteTask = (taskToDelete) => {
    const updatedTasks = tasks.filter(task => task.taskid !== taskToDelete.taskid);
    updateStorage(updatedTasks);
  };

  // Update task
  const handleUpdateTask = () => {
    const updatedTasks = tasks.map(task => 
      task.taskid === selectedTask.taskid ? selectedTask : task
    );
    updateStorage(updatedTasks);
    setIsDialogOpen(false);
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
        Task Management
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={subjects}
            getOptionLabel={(option) => option.subject}
            value={filterSubject}
            onChange={(_, newValue) => setFilterSubject(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Filter by Subject" 
                variant="outlined" 
                fullWidth 
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ marginRight: 1, color: 'gray' }} />
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.taskid}>
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
              <CardActionArea onClick={() => handleEditTask(task)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {task.task}
                    </Typography>
                    <Chip 
                      label={task.subject} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    {task.description || 'No description'}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                padding: 1 
              }}>
                <IconButton 
                  color="primary" 
                  onClick={() => handleEditTask(task)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => handleDeleteTask(task)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
            onClick={() => {
              setSelectedTask(null);
              setIsDialogOpen(true);
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AddIcon sx={{ fontSize: 50, color: 'primary.main' }} />
              <Typography variant="h6" color="primary">
                Add New Task
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit/Create Task Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Name"
                value={selectedTask?.task || ''}
                onChange={(e) => setSelectedTask(prev => ({
                  ...prev, 
                  task: e.target.value
                }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={subjects}
                getOptionLabel={(option) => option.subject}
                value={selectedTask?.subject || null}
                onChange={(_, newValue) => setSelectedTask(prev => ({
                  ...prev, 
                  subject: newValue?.subject
                }))}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Subject" 
                    variant="outlined" 
                    fullWidth 
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={selectedTask?.description || ''}
                onChange={(e) => setSelectedTask(prev => ({
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
                onClick={handleUpdateTask}
              >
                {selectedTask ? 'Update Task' : 'Create Task'}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EnhancedManageTask;