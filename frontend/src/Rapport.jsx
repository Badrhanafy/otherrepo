import React, { useEffect, useState } from 'react';
import Navbar from './page/navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2 } from "lucide-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Rapport() {
  const [visites, setVisites] = useState([]);
  const [admin, setAdmin] = useState({});
  const [schools, setSchools] = useState([]);
  const [filter, setFilter] = useState(""); // Stores the selected school id
  const [dateSortOrder, setDateSortOrder] = useState('desc'); // For sorting by date
  const token = sessionStorage.getItem('token');
  const MySwal = withReactContent(Swal);

  const getIdAdminFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.idadmin;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const idadmin = getIdAdminFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitesRes, adminRes, schoolsRes] = await Promise.all([
          axios.get('http://localhost:3999/raportsget'), 
          idadmin ? axios.get(`http://localhost:3999/admin/${idadmin}`) : Promise.resolve({ data: {} }),
          axios.get("http://localhost:3999/schools")
        ]);
        
        setVisites(visitesRes.data);
        if (idadmin) setAdmin(adminRes.data);
        setSchools(schoolsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idadmin]);

  const sortedVisites = () => {
    return visites.sort((a, b) => {
      const dateA = new Date(a.datevisite);
      const dateB = new Date(b.datevisite);
      return dateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleDelete = async (id) => {
    MySwal.fire({
      title: "هل انت متأكد؟",
      text: "هذه العملية من غير الممكن الغاؤها بعد التأكيد ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم, اعي ذلك!",
      cancelButtonText: "تراجع",
      
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", " تم الحذف بنجاح .", "success");
        axios.delete(`http://localhost:3999/visite/${id}`);
        setVisites((prev) => prev.filter((visite) => visite.idvisite !== id));
      }
    });
  };

  const filteredVisites = filter
    ? sortedVisites().filter((visite) => visite.idecole === parseInt(filter))
    : sortedVisites();
  for (let index = 0; index < schools.length; index++) {
     const element = schools[index].idecole;
    console.log(element.length);
    
  }
  return (
    <div className="bg-gradient-to-r from-indigo-100 to-sky-100 min-h-screen py-12">
      <Navbar />

      {/* Filter Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          className="px-5 py-3 bg-blue-100 text-blue-600 font-bold border border-blue-500 rounded-xl shadow-lg focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value=""> الكل</option>
          {schools.length > 0 ? (
            schools.map((school, i) => (
              <option value={school.idecole} key={i}>{school.nomecole} </option>
            ))
          ) : (
            <option value="">No Schools Available</option>
          )}
        </select>
      </div>

      {/* Sort Buttons */}
      <div className="flex justify-center mb-6 space-x-6">
        <button
          onClick={() => setDateSortOrder('desc')}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition ${dateSortOrder === 'desc' ? 'opacity-80' : ''}`}
        >
          الأحدث أولاً
        </button>
        <button
          onClick={() => setDateSortOrder('asc')}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition ${dateSortOrder === 'asc' ? 'opacity-80' : ''}`}
        >
          الأقدم أولاً
        </button>
      </div>

      {/* Visit Report Table */}
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-semibold text-center text-indigo-700 mb-8">التقارير</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left text-lg font-medium">تاريخ الزيارة</th>
                <th className="py-3 px-6 text-left text-lg font-medium">اسم المدرسة</th>
                <th className="py-3 px-6 text-left text-lg font-medium">التفاصيل</th>
                <th className="py-3 px-6 text-left text-lg font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredVisites.length > 0 ? (
                filteredVisites.map((visite) => (
                  <tr key={visite.idvisite} className="hover:bg-indigo-50 transition-all">
                    <td className="border-t py-4 px-6">{new Date(visite.datevisite).toLocaleDateString('en-GB')}</td>
                    <td className="border-t py-4 px-6">
                      <Link className="text-indigo-600 font-semibold hover:text-indigo-700" to={`/school/${visite.idecole}`}>
                        {schools.find(s => s.idecole === visite.idecole)?.nomecole || "Unknown School"}
                      </Link>
                    </td>
                    <td className="border-t py-4 px-6">
                      <Link
                        to={`/Visitedetails/${visite.idvisite}/${visite.idecole}`}
                        className="text-indigo-600 font-semibold hover:text-indigo-700"
                      >
                        طباعة
                      </Link>
                    </td>
                    <td className="border-t py-4 px-6">
                      <button
                        onClick={() => handleDelete(visite.idvisite)}
                        className="bg-red-500 text-white px-5 py-2 rounded-md shadow-lg hover:bg-red-600 transition"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">لم يتم اضافة اية تعليقات بعد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
