import "./App.css";
import PostListProvider, { postList } from "./context/Post_List-store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./MainLayout";
import ProtectedRoute from "./routes/ProtectedRoutes";
function App() {
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
          <MainLayout />
        </ProtectedRoute>
      </PostListProvider>
    </>
  );
}
export default App;
