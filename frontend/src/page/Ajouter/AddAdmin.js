import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar";
import { data, useNavigate } from "react-router-dom";
import { UserPlusIcon, LockIcon, AtSignIcon, Eye,UserRoundMinus } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
const AddAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    pwd: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [admins, setAdmins] = useState([]);
  const token = sessionStorage.getItem('token');
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:3999/getallAdmins");
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, [admins]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3999/add-admin", formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setFormData({ fullname: "", email: "", pwd: "" });
      
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
      setSuccessMessage("");
    }
  };
  
   
  
  
 /*  const getIdAdminFromToken = () => {
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
const idAdmin = getIdAdminFromToken; */
  function showConfirm(id) {
    Swal.fire({
      title: `؟ " ${admins.find((a)=>{return a.idadmin===id}).fullname} " حذف`,
      text: "هل أنت متأكد من تسجيل الخروج ؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "! نعم",
      cancelButtonText: "لا",
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire("الحذف ناجح !  ", "تمت أزالة الحساب بنجاح", "success");
        const res = axios.delete(`http://localhost:3999/remove/admin/${id}`).then(
        
        )
        
        setTimeout(() => {
          toast.success("تم  الحذف بنجاح   ", {
            position: "bottom-right",
            autoClose: 3000,
            style: { background: "green", color: "#fff", fontWeight: "bold", fontFamily: "f2" },
        })
        }, 1500);
      }
    });
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex sm:flex-col md:flex-auto  items-center justify-center p-4">
      <Navbar />
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Admin Form Section */}
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <div className="bg-blue-300 p-6 text-center rounded-lg">
            <div className="flex items-center justify-center gap-4">
              <UserPlusIcon className="w-10 h-10 text-white" />
              <h2 className="text-3xl font-bold text-white " id="title">أضف أدمين جديد</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errorMessage && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-lg text-center">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-2 border-green-300 text-green-700 p-3 rounded-lg text-center">
                {successMessage}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <UserPlusIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="fullname"
                className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AtSignIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="pwd"
                className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                value={formData.pwd}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-9 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <Eye /> : <Eye />}
              </button>
              <ToastContainer />
            </div>

            <button
              type="submit"
              className={`w-full p-3 rounded-lg text-white bg-gradient-to-r from-blue-400 to-indigo-300 hover:from-blue-600 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            >
              اضافة
            </button>
          </form>
        </div>

        {/* Scrollable Admin List Section */}
        <div className="w-1/2 p-6 bg-gray-100 overflow-y-auto max-h-screen">
          
          <h2 className="text-2xl font-bold mb-4 text-end" id="title2">مجمل الأدمينز</h2>
          
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li key={admin.id} className="p-4 bg-white rounded-lg shadow">
                <p className="font-semibold">{admin.fullname}</p>
                <p className="text-gray-500">{admin.email}</p>
                <button onClick={()=>{
                    showConfirm(parseInt(admin.idadmin))
                }}
                style={{float:"right",position:"relative",bottom:"2vh"}}
                className="  rounded-lg p-1 text-white font-bold mt-0"
                >
                 <span className="text-red-400"> <UserRoundMinus /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default AddAdmin;