import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import { PetProvider } from './components/PetContext.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function App() {
    return (
        <AuthProvider>
            <PetProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                    </Routes>
                </BrowserRouter>
            </PetProvider>
        </AuthProvider>
    );
}

export default App