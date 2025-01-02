import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import store from "./redux/store";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { SocketProvider } from "./helpers/SocketContext.js";
import RegisterPage from "./pages/RegisterPage.jsx";
function App() {
  return (
    <SocketProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home/*" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </SocketProvider>
  );
}

export default App;
