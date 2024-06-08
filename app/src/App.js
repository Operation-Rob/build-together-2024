import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <div>
            <Button type="primary">Click Me</Button>
          </div>
      </header>
    </div>
  );
}

export default App;
