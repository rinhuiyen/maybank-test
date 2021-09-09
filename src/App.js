import "./App.css";
import PreLoader from "./components/loading/preloader";

function App() {
  localStorage.clear();
  return (
    <div className="App">
      <PreLoader />
    </div>
  );
}

export default App;