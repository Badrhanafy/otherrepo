import axios from 'axios'
import React, { useState } from 'react'
import Navbar from '../navbar'
import { useEffect } from 'react';
import { UserPlusIcon, LockIcon, AtSignIcon, BriefcaseIcon } from 'lucide-react';

export default function AjouterUser() {
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [pwd, setpwd] = useState('')
  const [poste, setposte] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  const makeuser = async (e) => {
    e.preventDefault();
    if (!name || !email || !pwd || !poste) {
      setError("جميع الحقول مطلوبة!");
      return;
    }
    const user = { 
      "nomemployer": name, 
      "login": email, 
      "pwd": pwd, 
      "poste": poste 
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3999/ajouterUser", user);
      alert(response.data.message);
      setname('');
      setemail('');
      setpwd('');
      setposte('');
      setError('');
    } catch (error) {
      setError("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-arabic">
      <Navbar />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-300 p-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <UserPlusIcon className="w-10 h-10 text-white" />
            <h2 className="text-3xl font-bold text-white">إضافة مستخدم</h2>
          </div>
        </div>
        
        <form onSubmit={makeuser} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <UserPlusIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="الاسم"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AtSignIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="اسم المستخدم"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <LockIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="كلمة المرور"
              value={pwd}
              onChange={(e) => setpwd(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute rigthy-9 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              {showPassword ? "إخفاء" : "إظهار"}
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <BriefcaseIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full p-3 pr-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="المنصب"
              value={poste}
              onChange={(e) => setposte(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white bg-gradient-to-r from-blue-400 to-indigo-300 hover:from-blue-600 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'جاري الإضافة...' : 'إضافة مستخدم'}
          </button>
        </form>
      </div>
    </div>
  )
}