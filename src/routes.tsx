import { Routes, Route } from "react-router-dom";
import Layout from '@/common/components/Layout/Layout';
import { Users, MyTodos, Summary } from '@/pages'

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Users />} />
      <Route path="my-todos" element={<MyTodos />} />
      <Route path="summary" element={<Summary />} />
      <Route path="*" element={<div>not found</div>} />
    </Route>
  </Routes>
)

export default AppRouter