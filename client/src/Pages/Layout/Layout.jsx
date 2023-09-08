import { Outlet, Link } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="/">Employees</Link>
        </li>
        <li className="grow">
          <Link to="/equipment">Equipment</Link>
        </li>
        <li className="grow">
          <Link to="/tools">Tools</Link>
        </li>
        <li className="grow">
          <Link to="/games-list">Board games</Link>
        </li>
        <li>
          <Link to="/create">
            <button type="button">Create Employee</button>
          </Link>
        </li>
      </ul>
    </nav>
    <div className="content">
    <Outlet />
    </div>
    <Footer />
  </div>
);

export default Layout;
