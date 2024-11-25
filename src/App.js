import "./App.css";
import { darkTheme } from "./Theme.js";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./CustomComponents/NavBar";
import ArchivedTask from "./Pages/ArchivedTasks";
import PredefinedTask from "./Pages/PredefinedTasks";
import CreateNewTask from "./Pages/CreateTask";
import CalenderView from "./Components/CalenderView";
import { Box } from "@mui/system";

import ManageTask from "./Pages/ManageTask";
import AllTask from "./Pages/AllTask";
import Dashboard from "./Pages/Dashboard";
import NewSubject from "./Pages/CreateSubject";
import ErrorPage from "./Pages/404";
import ManageSubTask from "./Pages/ManageSubTask";

const useStyles = makeStyles({
  root: {
    display: "flex",
    paddingRight: "0px",
  },
});

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Router>
          <div className={classes.root}>
            <Navbar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/archived" component={ArchivedTask} />
                <Route exact path="/newsub" component={NewSubject} />
                <Route exact path="/predefined" component={PredefinedTask} />
                <Route exact path="/createnewtask" component={CreateNewTask} />
                <Route exact path="/managetask" component={ManageTask} />
                <Route exact path="/alltask" component={AllTask} />
                <Route exact path="/calender" render={() => (
                  <div style={{ width: "80%" }}>
                    <CalenderView />
                  </div>
                )} />
                <Route exact path="/managesubtask" render={() => (
                  <div style={{ width: "80%" }}>
                    <ManageSubTask />
                  </div>
                )} />
                <Route path="*" component={ErrorPage} />
              </Switch>
            </Box>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;