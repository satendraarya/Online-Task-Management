import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import FlipLoginRegistrationForm from './component/Authentication/FlipLoginRegistrationForm';
import TaskManagement from './component/TaskManagement/TaskManagement';
import axios from 'axios';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<FlipLoginRegistrationForm></FlipLoginRegistrationForm>}> </Route>
        <Route path='home' element={<TaskManagement></TaskManagement>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
