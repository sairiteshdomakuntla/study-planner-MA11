import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Grid, 
  Snackbar, 
  Alert,
  Box
} from "@mui/material";
import SubjectTable from "../Components/SubjectTable";

const CreateSubject = () => {
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    id: "",
  });

  const [tabData, setTabData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    setTabData(storedSubjects);
  }, []);

  const handleClear = () => {
    setFormData({
      subject: "",
      date: "",
      id: "",
    });
  };

  const handleFormEdit = (val) => {
    setFormData(val);
  };

  const handleSubmit = () => {
    if (!formData.subject.trim()) {
      setSnackbar({ 
        open: true, 
        message: "Subject name cannot be empty", 
        severity: 'error' 
      });
      return;
    }

    const existingSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');

    if (formData.id) {
      // Update existing subject
      const updatedSubjects = existingSubjects.map(subject => 
        subject.id === formData.id 
          ? { ...formData, date: new Date().toLocaleDateString() } 
          : subject
      );

      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setTabData(updatedSubjects);
      
      setSnackbar({ 
        open: true, 
        message: "Subject updated successfully", 
        severity: 'success' 
      });
    } else {
      // Check for duplicate subject
      const isDuplicate = existingSubjects.some(
        subject => subject.subject.toLowerCase() === formData.subject.toLowerCase()
      );

      if (isDuplicate) {
        setSnackbar({ 
          open: true, 
          message: "Subject already exists", 
          severity: 'warning' 
        });
        return;
      }

      // Add new subject
      const newId = Math.floor(Math.random() * 100 + 1);
      const newSubject = { 
        ...formData, 
        id: newId, 
        date: new Date().toLocaleDateString() 
      };

      const updatedSubjects = [...existingSubjects, newSubject];
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setTabData(updatedSubjects);
      
      setSnackbar({ 
        open: true, 
        message: "Subject added successfully", 
        severity: 'success' 
      });
    }

    handleClear();
  };

  const handleTextChange = (event) => {
    setFormData(prevData => ({
      ...prevData,
      subject: event.target.value,
    }));
  };

  const handleDelete = () => {
    const existingSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const remainingSubjects = existingSubjects.filter(row => row.id !== formData.id);

    localStorage.setItem('subjects', JSON.stringify(remainingSubjects));
    setTabData(remainingSubjects);
    
    setSnackbar({ 
      open: true, 
      message: "Subject deleted successfully", 
      severity: 'info' 
    });
    
    handleClear();
  };

  return (
    <Box sx={{ p: 2 }}>
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

      <Grid 
        container 
        spacing={2} 
        alignItems="center"
      >
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={formData.subject}
            onChange={handleTextChange}
            error={!formData.subject.trim()}
            helperText={!formData.subject.trim() ? "Subject name is required" : ""}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.subject.trim()}
          >
            {formData.id ? "Update" : "Add"}
          </Button>
        </Grid>

        {formData.id && (
          <>
            <Grid item xs={12} md={4}>
              <Button 
                fullWidth 
                variant="contained" 
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={handleClear}
              >
                Clear
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      {tabData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <SubjectTable handleEdit={handleFormEdit} data={tabData} />
        </Box>
      )}
    </Box>
  );
};

export default CreateSubject;