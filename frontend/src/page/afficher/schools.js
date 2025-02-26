import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactSpeedometer from "react-d3-speedometer";
import { SearchIcon, FilterIcon } from "lucide-react";
import Footer from "../Footer";
import Lottie from "lottie-react";
import NotFoundAnimation from "./Animation - 1739215242873.json"
import Nodata from "./nodataAnimation.json"
import loadinganimation from "./loading animation.json"
const SchoolsList = () => {
    const [schools, setSchools] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [direction, setDirection] = useState("");
    const [status, setStatus] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            axios
                .get("http://localhost:3999/schools")
                .then((response) => {
                    setSchools(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError("!حدث  خطأ أثناء التحميل");
                    setLoading(false);
                    console.error("خطأ في التحميل !", error);
                });
        } else {
            navigate("/");
        }
    }, [navigate]);

    const filteredSchools = schools.filter((school) => {
        const matchesSearch = school.nomecole.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter ? school.typeecole === filter : true;
        const matchesDirection = direction ? school.direction === direction : true;
        const matchesStatus = status ? school.statut === status : true;
        return matchesSearch && matchesFilter && matchesDirection && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100"
            
            >
                    <div className="flex flex-col items-center justify-center h-screen text-center " 
    style={{
      /* overflowY:"hidden" */
    }}>
      <div className="w-1/2">
        <Lottie animationData={loadinganimation} loop={true} />
        
      </div>
     
      
    </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 mt-0" style={{position:"relative",top:"-10vh",overflowY:"hidden"}}>
                <div className="text-2xl font-semibold text-red-600 p-6 bg-blue-200 rounded-xl shadow-lg mt-0">
                    
                    <div className="flex flex-col items-center justify-center h-screen text-center " 
    style={{
      /* overflowY:"hidden" */
    }}>
      <div className="w-1/2">
        <Lottie animationData={NotFoundAnimation} loop={true} />
        
      </div>
     
      
    </div>
    <span className="  ">{error}</span>
                </div>
            </div>
        );
    }

    const typeCounts = ["ابتدائية", "اعدادية", "ثانوية"].map(type => ({
        type,
        count: filteredSchools.filter(school => school.typeecole === type).length,
    }));

    return (
        <div style={{position:"relative",top:"-2vh"}} className="min-h-screen bg-gradient-to-l from-blue-200 via-blue-100 to-stone-100 font-arabic">
            <Navbar />
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-400 to-indigo-200 text-white py-4 px-4 sm:px-6 lg:px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h1 id="title2" className="text-4xl font-extrabold mb-6 drop-shadow-lg">  مصلحة التخطيط و الخريطة المدرسية</h1>
                    

                    <div className="bg-white rounded-xl shadow-2xl p-6 ">
                        <div className="relative mb-4 ">
                            <input
                                type="text"
                                className="text-right placeholder:mr-6 w-full pl-10 pr-4 py-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                placeholder="ابحث عن اسم المدرسة"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-96 pl-3 flex items-center pointer-events-none ">
                                <SearchIcon className="text-blue-500 h-5 w-5 relative inset-y-0 left-72"/>
                            </div>
                        </div>

                        <div className="flex justify-center ">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                <FilterIcon className="h-5 w-5" />
                                {showFilters ? " بحث معمق" : " بحث معمق"}
                            </button>
                        </div>

                        {/* Filters Section with Animation */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className="mt-6 p-4 border rounded-lg shadow-md bg-white border-red-800">
                                <p className="text-blue-300" id="message">قلص دائرة البحث</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Type Filter as Buttons */}
                                    <div>
                                        <h3 className="font-medium mb-2">نوع المدرسة</h3>
                                        <div className="flex gap-2">
                                            {typeCounts.map(({ type, count }) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFilter(filter === type ? "" : type)}
                                                    className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                                        filter === type 
                                                            ? "bg-blue-500 text-white scale-105 shadow-md" 
                                                            : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                                                    }`}
                                                    aria-pressed={filter === type}
                                                >
                                                    {type} ({count})
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Direction Filter */}
                                    <div>
                                        <h3 className="font-medium mb-2">المديرية</h3>
                                        <select
                                            id="directionFilter"
                                            className="p-2 rounded-lg border-2 border-blue-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full"
                                            value={direction}
                                            onChange={(e) => setDirection(e.target.value)}
                                            aria-label="Filter by direction"
                                        >
                                            <option value="">جميع المديريات</option>
                                            {["laayoune", "boujdour", "essemar", "tarfaya"].map((dir) => (
                                                <option key={dir} value={dir}>{dir}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Filter as Buttons */}
                                    <div>
                                        <h3 className="font-medium mb-2">الحالة</h3>
                                        <div className="flex gap-2">
                                            {["en cours", "terminé"].map(stat => {
                                                const count = filteredSchools.filter(school => school.statut === stat).length;
                                                return (
                                                    <button
                                                        key={stat}
                                                        onClick={() => setStatus(status === stat ? "" : stat)}
                                                        className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                                            status === stat 
                                                                ? "bg-blue-500 text-white scale-105 shadow-md" 
                                                                : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                                                        }`}
                                                        aria-pressed={status === stat}
                                                    >
                                                        {stat} ({count})
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schools List Section */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchools.length === 0 ? (
                       <center>
                             <div className=" items-center justify-center h-screen text-center " 
                       style={{
                        marginLeft:"49vh",
                        top:"29vh",
                        position:"absolute"
                         /* overflowY:"hidden" */
                       }}>
                         <div className="">
                           <Lottie animationData={Nodata} loop={true} />
                            <p 
                            className="typing"
                            style={{position:"relative",bottom:"10vh"}}
                            >لم يتم العثور على بيانات</p>
                         </div>
                        
                         
                       </div>
                       </center>
                    ) : (
                        filteredSchools.map(school => (
                            <div
                                key={school.idecole}
                                className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-b-4 border-blue-400"
                            >
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`http://localhost:3999${school.image}`}
                                        alt={school.nomecole}
                                        className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                                        loading="lazy"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                        {school.nomecole}
                                    </h3>
                                    
                                    <p className={`font-bold mb-4 text-center ${school.statut === 'en cours' ? 'text-red-400' : 'text-green-400'}`}>
                                        {school.statut}
                                    </p>

                                    {/* Speedometer Section */}
                                    <div className="mb-4">
                                        <ReactSpeedometer
                                            value={school.pourcentage}
                                            minValue={0}
                                            maxValue={100}
                                            segments={5}
                                            width={150}
                                            height={120}
                                            needleColor="orange"
                                            startColor="#ff0000"
                                            endColor="#53f00b"
                                            textColor="gray"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                                        <Link
                                            to={`/school/${school.idecole}`}
                                            className="w-full text-center bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md"
                                        >
                                            تفاصيل المؤسسة
                                        </Link>
                                        <button
                                            onClick={() => navigate(`/TaskSelector/${school.idecole}`)}
                                            className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md"
                                        >
                                            أدخل المهام
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default SchoolsList;