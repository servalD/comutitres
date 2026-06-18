import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MonDossierPage } from './pages/MonDossierPage'
import { MonEspacePage } from './pages/MonEspacePage'
import { MonFoyerPage } from './pages/MonFoyerPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MonEspacePage />} />
        <Route path="/dossier" element={<MonDossierPage />} />
        <Route path="/foyer" element={<MonFoyerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
