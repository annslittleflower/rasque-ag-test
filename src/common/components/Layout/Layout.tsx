import { Outlet, Link } from "react-router-dom";


const Layout = () => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <Outlet />
    </header>
  );
}

export default Layout