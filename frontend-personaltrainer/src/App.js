import './App.css';
import Home from "./Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from "react-router";
import Login from "./Login";
import About from "./About";
import SuccessStories from "./SuccessStories";
import TrainingPrograms from "./Programs";
import Contact from "./Contact";
import MessageSuccess from "./MessageRecieved";
import Register from "./Register";
import Profile from "./UserProfile";
import {useJwt} from "./UserGlobalProvider";
import jwtDecode from "jwt-decode";
import {useEffect, useState} from "react";
import WorkoutNoteDetailsModal from "./WorkoutNoteDetailsModal";
import PrivateRoute from "./PrivateRoute";
import TrainerDashboard from "./TrainerDashboard";
import TrainerUserProfile from "./TrainerUserProfile";
import NoAccess from "./NoAccess";
import {Search} from "react-bootstrap-icons";
import SearchBar from "./SearchBar";
import AdminHome from "./AdminHome";
import ManageSuccessStories from "./ManageSuccessStories";
import ManageTrainers from "./ManageTrainers";
import ManageUsers from "./ManageUsers";


function App() {
    const user = useJwt();
    const [roles, setRoles] = useState(getRolesFromJWT());

    useEffect(() => {
        setRoles(getRolesFromJWT());
    }, [user.jwt]);

    function getRolesFromJWT() {
        if(user.jwt){
            const decoded = jwtDecode(user.jwt);
            return decoded.authorities
        }else{
            return [];
        }
    }
  return (
      <Routes>
          <Route exact path="/" element={ <Home/> } />
          <Route path="/home" element={ <Home/> } />
          <Route path="/about" element={ <About/> } />
          <Route path="/stories" element={ <SuccessStories/> } />
          <Route path="/programs" element={ <TrainingPrograms/> } />
          <Route path="/contact" element={ <Contact/> } />
          <Route path="/messagerecieved" element={ <MessageSuccess/> } />
          <Route path="/register" element={ <Register/> } />
          <Route path="/login" element={ <Login/> } />
          <Route path="/search" element={ <SearchBar/> } />

          <Route path="/workoutDetails/:workoutId" element={
              <PrivateRoute>
                <WorkoutNoteDetailsModal/>
              </PrivateRoute>} />
          <Route path="/profile" element={
                  <PrivateRoute>
                      <Profile/>
                  </PrivateRoute> } />

          <Route path="/userprofile/:userId" element={
              roles.find((role) => role === "ROLE_TRAINER") ? (
                  <PrivateRoute>
                      <TrainerUserProfile/>
                  </PrivateRoute>
              ) : (
                  <NoAccess/>
              )}>
          </Route>

          <Route path="/trainer" element={
              roles.find((role) => role === "ROLE_TRAINER") ? (
                  <PrivateRoute>
                      <TrainerDashboard/>
                  </PrivateRoute>
              ) : (
                  <Login/>
                  )}>
          </Route>

          <Route path="/admin" element={
              roles.find((role) => role === "ROLE_ADMIN") ? (
                  <PrivateRoute>
                      <AdminHome/>
                  </PrivateRoute>
              ) : (
                  <Login/>
              )}>
          </Route>

          <Route path="/manageStories" element={
              roles.find((role) => role === "ROLE_ADMIN") ? (
                  <PrivateRoute>
                      <ManageSuccessStories/>
                  </PrivateRoute>
              ) : (
                  <Login/>
              )}>
          </Route>

          <Route path="/manageUsers" element={
              roles.find((role) => role === "ROLE_ADMIN") ? (
                  <PrivateRoute>
                      <ManageUsers/>
                  </PrivateRoute>
              ) : (
                  <Login/>
              )}>
          </Route>

          <Route path="/manageTrainers" element={
              roles.find((role) => role === "ROLE_ADMIN") ? (
                  <PrivateRoute>
                      <ManageTrainers/>
                  </PrivateRoute>
              ) : (
                  <Login/>
              )}>
          </Route>

      </Routes>
  );
}

export default App;
