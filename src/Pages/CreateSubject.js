import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import SubjectTable from "../Components/SubjectTable";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";

const CreateSubject = () => {
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    id: "",
  });

  const [tabData, setTabData] = useState([]);

  const handleClear = () => {
    setFormData({
      subject: "",
      date: "",
      id: "",
    });
  };

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    setTabData(storedSubjects);
  }, []);

  const handleFormEdit = (val) => {
    setFormData(val);
  };

  const handleSubmimt = () => {
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
    } else {
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
    }

    handleClear();
  };

  const handleTextChange = (event) => {
    const value = event.target.value;

    setFormData(prevData => ({
      ...prevData,
      subject: value,
    }));
  };

  const handleDelete = () => {
    const existingSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const remainingSubjects = existingSubjects.filter(row => row.id !== formData.id);

    localStorage.setItem('subjects', JSON.stringify(remainingSubjects));
    setTabData(remainingSubjects);
    handleClear();
  };

  return (
    <div>
      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ marginBottom: "5rem" }}
      >
        <Grid item md={12} sm={12}>
          <TextField
            id="subject"
            label="Subject"
            variant="outlined"
            onChange={handleTextChange}
            value={formData.subject}
          />
        </Grid>

        <Grid item md={2} sm={12}>
          <Button variant="contained" onClick={handleSubmimt}>
            {formData.id ? "Update" : "Add"}
          </Button>
        </Grid>

        <Grid
          item
          md={2}
          sm={12}
          sx={{ display: formData.id ? "inline" : "none" }}
        >
          <Button variant="contained" onClick={handleDelete} disabled={false}>
            Delete
          </Button>
        </Grid>

        <Grid
          item
          md={2}
          sm={12}
          sx={{ display: formData.id ? "inline" : "none" }}
        >
          <Button variant="contained" onClick={handleClear} disabled={false}>
            Clear
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ marginBottom: "5rem" }}
      >
        {tabData.length > 0 && (
          <Grid item md={10} xs={12}>
            <SubjectTable handleEdit={handleFormEdit} data={tabData} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default CreateSubject;