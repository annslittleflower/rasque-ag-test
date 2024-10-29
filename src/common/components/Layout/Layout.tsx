import { Outlet, Link } from "react-router-dom";
import styles from './layout.module.css';

const Layout = () => {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <div className={styles.smallLinks}>
            <Link to='/my-todos'>Todos</Link>
            <Link to='/summary'>Summary</Link>
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout