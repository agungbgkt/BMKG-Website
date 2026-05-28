import { NavLink } from "react-router-dom";
import { FaPhone } from "react-icons/fa";
import logo from "../../assets/Logo.jpg";


function Navbar() {
  return (
    <nav className="navbar">

      {/* KIRI */}
      <div className="navbar-left">
        <img src={logo} alt="BMKG Logo" className="logo" />
        <h2 className="brand">Badan Meteorologi, Klimatologi, dan Geofisika</h2>
      </div>

      {/* TENGAH */}
      <div className="navbar-center">
         <NavLink to="/" end>
          Dashboard
         </NavLink>

         <NavLink to="/wilayah">
           Wilayah
          </NavLink>

          <NavLink to="/peringatan">
            Peringatan
          </NavLink>

        <NavLink to="/lainnya">
          Lainnya
          </NavLink>
       </div>

      {/* KANAN */}
      <div className="navbar-right">
        <a href="tel:196" className="contact-button">
          <FaPhone className="phone-icon"/>
          Contact Center 196
        </a>
      </div>

    </nav>
  );
}

export default Navbar;