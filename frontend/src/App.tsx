import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import ErrorPage from "./pages/404Page";
import HomePage from "./pages/HomePage";
import RedirectPage from "./pages/RedirectPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="redirect" element={<RedirectPage />} />
                    <Route path="/invited/:invite_id" element={<RedirectPage />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
