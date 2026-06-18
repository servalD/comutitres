import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MonEspacePage } from './pages/MonEspacePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MonEspacePage />} />
      </Routes>
    </BrowserRouter>
  )
}
