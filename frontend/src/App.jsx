import "./App.css";
import PostListProvider, { postList } from "./context/Post_List-store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./MainLayout";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useState, useEffect } from "react";
function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
      />
      <PostListProvider>
        <ProtectedRoute>
          <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      </PostListProvider>
    </>
  );
}
export default App;
