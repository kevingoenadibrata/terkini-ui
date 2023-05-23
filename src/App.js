import { Route, Routes } from "react-router-dom";
import Post from "./pages/Post";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/p/:postId" element={<Post />} />
      </Routes>
    </div>
  );
};

export default App;
