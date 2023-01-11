import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./app/ProtectedRoute";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default App;
