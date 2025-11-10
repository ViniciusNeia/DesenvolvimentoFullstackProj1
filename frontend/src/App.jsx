import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import { PetProvider } from './contexts/PetContext.jsx'

function App() {

    return (
        <PetProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </PetProvider>
    )
}

export default App