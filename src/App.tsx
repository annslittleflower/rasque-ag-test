// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'


import { AuthProvider } from "@/common/contexts/auth";

import AppRouter from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
};

export default App;
