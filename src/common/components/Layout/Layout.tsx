import { Outlet, Link } from "react-router-dom";
import styles from './layout.module.css';


const Layout = () => {
  return (
    <>
      <header className={styles.header}>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout