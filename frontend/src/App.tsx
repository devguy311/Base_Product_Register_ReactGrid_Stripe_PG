import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/HomePage";
import RedirectPage from "./pages/RedirectPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="redirect" element={<RedirectPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
