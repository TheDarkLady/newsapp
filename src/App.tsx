import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { UserProvider } from './UserContext';
function App() {

  return (
    <UserProvider>
      <Router basename="/newsapp">
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
