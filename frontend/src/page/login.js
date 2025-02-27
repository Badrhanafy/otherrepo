import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Style/Navbar.css';
import {TriangleAlert} from "lucide-react"
const Login = () => {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3999/login", {
                email,
                pwd,
            });
            console.log(response.data);
            alert(response.data.message);
            sessionStorage.setItem('token', response.data.token);
            navigate("/Schools"); 
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50"
            style={{
                backgroundImage: "url('img/img2.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position:"absolute",
                top:"0",
                width:"100%"
            }}
        >
            <div
             style={{
                backdropFilter:"blur(35px)",
                /* position:'relative',
                left:"75vh",
                bottom:"6vh" */
             }}
            className=" border-2 border-blue-500 max-w-md w-full space-y-8 bg-white-50 p-6 rounded-lg shadow-md  backdrop-blur-sm">
                <img src="academilogo.png"  alt="logo"/>
                <center className=" "><span className="text-center text-white font-bold">Log-in</span></center>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-sm  text-white font-bold">
                            Email
                        </label>
                        <input
                            type="text"
                            className=" opacity-70 mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            className=" opacity-70 bg-none mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-orange-200 text-sm font-bold flex"><TriangleAlert />&ensp;<span>{error}</span> </div>
                    )}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
