import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dpLaayoune from './img/academilogo.png';
import { HomeIcon, UserPlusIcon, School, BookOpen,LogOut } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect } from "react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  /* const [dropdownOpen, setDropdownOpen] = useState(false); */
  const [showMessage, setShowMessage] = useState(false);
  const menuItems = [
    { path: "/Schools", label: "الرئيسية", icon: <HomeIcon /> },
    { path: "/Addschool", label: "أضف مؤسسة", icon: <School /> },
  ];
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate()
  const [admin,setAdmin]=useState({})
  const getIdAdminFromToken = () => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.idadmin;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };
  useEffect(() => {
    const idAdmin = getIdAdminFromToken();
    const fetchAdminData = async () => {
        if (!idAdmin) return; // Prevent fetching if no id
        try {
            const response = await axios.get(`http://localhost:3999/admin/${idAdmin}`);
            setAdmin(response.data); // Store the data in state
        } catch (error) {
            console.error('Error fetching admin:', error);
        }
    };

    fetchAdminData();
}, []);

if (admin.isSupper==="no") {
  /* document.getElementById("link").style.backgroundColor="green" */
  const link = document.getElementById("item");
  const icon = document.getElementById("icon");
    link.removeAttribute("href"); // Remove link functionality
    
    link.style.color = "gray"; // Change color to indicate it's disabled
    link.style.cursor = "not-allowed"; // Show "disabled" cursor
    link.style.pointerEvents = "none"; // Disable clicking
   
   
    
    
    

}


  //////
  function showConfirm() {
    Swal.fire({
      title: "تقدم !",
      text: "هل أنت متأكد من تسجيل الخروج ؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "! نعم",
      cancelButtonText: "لا",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout action here (e.g., clearing session, redirecting)
        Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("idAdmin");
        // Example: Redirect to login page
        setTimeout(() => {
          window.location.href = "/"; // Change this to your actual login route
        }, 1500);
      }
    });
}

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-indigo-300 fixed top-0 w-full z-50 shadow-lg"
    style={{
      position:"fixed",
      left:"0vh",
      
      
    }}
    >
      <div className="container mx-auto flex items-center justify-between lg:h-16 md:h-16 md:text-blue-500 sm:h-10 px-4 ">
        
        <NavLink
          to="/Schools"
          id="title2"
          className="flex items-center text-white text-2xl font-bold hover:scale-105 transition-transform duration-300"
        >
          <img src={dpLaayoune} alt="DP Laayoune" className="w-60 h-20 mt-2" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 relative">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              id="title2"
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold flex items-center justify-center px-4 py-2 rounded-md bg-blue-700 shadow-lg transform transition-all duration-300"
                  : "text-white hover:text-blue-300 flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
              }
            >
              {item.icon} <span className="ml-2">{item.label}</span>
            </NavLink>
          ))}

          {/* Dropdown for Add Admin and Add User */}
         

          <NavLink
            to="/Rapport"
            id="title2"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold flex items-center justify-center px-4 py-2 rounded-md bg-blue-700 shadow-lg transform transition-all duration-300"
                : "text-white hover:text-blue-300 flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
            }
          >
            <BookOpen />  <span className="ml-2">لائحة التقارير</span>
          </NavLink>
         
          <NavLink
          to="/AddAdmin"
          className={({ isActive }) =>
            `flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 ${
              isActive ? 'bg-blue-700 text-white font-semibold shadow-lg transform' : 
              admin.isSupper === "no" ? 
                'opacity-60 cursor-not-allowed pointer-events-none text-gray-300' : 
                'text-white hover:text-blue-300 hover:scale-105'
            }`
          }
        >
          <UserPlusIcon className={admin.isSupper === "no" ? "text-gray-300" : ""} />
          <span className="ml-2">أضف أدمين</span>
        </NavLink>
                   {/* Log-out button with hover message */}
                   <div className="relative">
            <button
              className="btn btn-danger"
              onClick={showConfirm}
              onMouseEnter={() => setShowMessage(true)}
              onMouseLeave={() => setShowMessage(false)}
            >
              <LogOut />
            </button>
            {showMessage && (
              <p className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-red-500 bg-white p-2 rounded-md shadow-lg">
                تسجيل الخروج
              </p>
            )}
          </div>

        </div>
   
       
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden float-end " >
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{zIndex:"1000",position:"relative",bottom:"7vh",right:"3vh"}}
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-400 focus:outline-none transition-all duration-300"
          >
            <span className="sr-only">Open main menu</span>
            <div className={`space-y-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <span className={`block h-0.5 w-8 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block h-0.5 w-8 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-8 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
      

      {/* Mobile Menu with Animations */}
      <div style={{zIndex:"-1"}} className={`md:hidden absolute w-full overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-300 pt-2 pb-4">
          <div className="flex flex-col space-y-4 px-4 text-white">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transform transition-all duration-300 ${
                    isActive ? 'bg-blue-700 scale-105' : 'hover:bg-blue-400 hover:scale-105'
                  }`
                }
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}

            <NavLink
              to="/Rapport"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transform transition-all duration-300 ${
                  isActive ? 'bg-blue-700 scale-105' : 'hover:bg-blue-400 hover:scale-105'
                }`
              }
            >
              <BookOpen />
              <span className="ml-2">لائحة التقارير</span>
            </NavLink>

            <NavLink
              to="/AddAdmin"
              id="item"
              className={`flex items-center px-4 py-3 rounded-lg transform transition-all duration-300 ${
                admin.isSupper === "no" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400 hover:scale-105'
              }`}
            >
              <UserPlusIcon id="icon" />
              <span className="ml-2"> أضف أدمين</span>
            </NavLink>

            <div className="pt-4 border-t border-blue-300">
              <button
                onClick={showConfirm}
                onMouseEnter={() => setShowMessage(true)}
                onMouseLeave={() => setShowMessage(false)}
                className="w-full flex justify-center items-center px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transform transition-all duration-300 hover:scale-105"
              >
                <LogOut />
                <span className="ml-2">تسجيل الخروج</span>
              </button>
              {showMessage && (
                <p className="mt-2 text-sm text-red-200 text-center animate-pulse">
                  تسجيل الخروج
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
