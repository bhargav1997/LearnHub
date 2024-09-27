import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHome,
   faTachometerAlt,
   faTrophy,
   faEnvelope,
   faCalendar,
   faCog,
   faShieldAlt,
   faChartBar,
   faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/Sidebar.css";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/user/userHandle";

function Sidebar() {
   const location = useLocation();
   const dispatch = useDispatch();

   const handleLogout = () => {
      dispatch(deleteUser(null));
      localStorage.removeItem("currentUser");
   };

   const navItems = [
      { path: "/", icon: faHome, label: "Home" },
      { path: "/dashboard", icon: faTachometerAlt, label: "Dashboard" },
      { path: "/leaderboard", icon: faTrophy, label: "Leaderboard" },
      { path: "/message", icon: faEnvelope, label: "Message" },
      { path: "/calendar", icon: faCalendar, label: "Calendar" },
      { path: "/setting", icon: faCog, label: "Setting" },
      { path: "/privacy", icon: faShieldAlt, label: "Privacy" },
      { path: "/report", icon: faChartBar, label: "Report" },
   ];

   return (
      <div className='sidebar-container'>
         <div className='sidebar-header'>
            <h1 className='logo'>LearnHub</h1>
         </div>
         <nav className='sidebar-nav'>
            <ul>
               {navItems.map((item) => (
                  <li key={item.path}>
                     <Link to={item.path} className={location.pathname === item.path ? "active" : ""}>
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>
         <div className='sidebar-footer'>
            <button className='logout-btn' onClick={handleLogout}>
               <FontAwesomeIcon icon={faSignOutAlt} />
               <span>Logout</span>
            </button>
         </div>
      </div>
   );
}

export default Sidebar;