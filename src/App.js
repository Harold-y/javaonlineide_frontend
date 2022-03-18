import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // get router
import Dashboard from './views/Dashboard';
import IndexPage from './views/IndexPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={
          <div className="App">
            <IndexPage></IndexPage>
          </div>
        } />
        <Route path='/dashboard' element={<><Dashboard></Dashboard></>} />
      </Routes>
      
    </Router>

  );
}

export default App;
