import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tasks } from '../taskx'; 
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TaskSelector = () => {
  const [selectedTasks, setSelectedTasks] = useState([]); 
  const [existingTasks, setExistingTasks] = useState([]); 
  const { idecole } = useParams(); 
  const [comment, setComment] = useState("");
const navigate = useNavigate();
  const getIdAdminFromToken = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        return payload.idadmin;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const idadmin = getIdAdminFromToken();

  useEffect(() => {
    const fetchExistingTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3999/getTasksBySchool/${idecole}`,
          { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        );
        setExistingTasks(response.data);
      } catch (error) {
        console.error('خطأ في جلب المهام المدخلة مسبقًا:', error);
      }
    };

    fetchExistingTasks();
  }, [idecole]);

  const handleCheckboxChange = (task, category, subCategory) => {
    setSelectedTasks((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (t) => t.nomtache === task.name && t.category === category && t.sub_category === subCategory
      );

      if (isAlreadySelected) {
        return prevSelected.filter((t) => !(t.nomtache === task.name && t.category === category && t.sub_category === subCategory));
      } else {
        return [
          ...prevSelected,
          {
            nomtache: task.name,
            category,
            sub_category: subCategory,
            t_pourcentage: task.percentage,
            idecole,
          },
        ];
      }
    });
  };

  const isTaskExisting = (name, category, subCategory) => {
    return existingTasks.some((task) => task.nomtache === name && task.category === category && task.sub_category === subCategory);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3999/submitTasks', {
        tasks: selectedTasks,
        idecole,
        idadmin,
      });
      console.log('تم إرسال المهام بنجاح:', response.data);
      alert('تم إرسال المهام بنجاح');
      navigate("/Schools")
      
    } catch (error) {
      console.error('خطأ في إرسال المهام:', error);
      alert('حدث خطأ أثناء إرسال المهام');
    }
  };
    //////////alert costumization :
    const customToastStyle = {
      background: '#53f00b', // Dark background
      color: 'white', // Yellow text
      fontSize: '16px',
      borderRadius: '10px',
      padding: '10px',
    };
   
  return (
    <div className="min-h-screen bg-gray-100 mt-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10" id='title2'>اختيار الأشغال</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Task Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {tasks.map((categoryObj, catIndex) => (
              <div className="mb-6" key={catIndex}>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">{categoryObj.category}</h2>
                {categoryObj.subcategories.map((subcategory, subcatIndex) => (
                  <div key={subcatIndex} className="mb-4">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">{subcategory.name}</h3>
                    {subcategory.tasks ? (
                      subcategory.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start mb-2">
                          <input
                            type="checkbox"
                            id={`task-${catIndex}-${subcatIndex}-${taskIndex}`}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                            checked={selectedTasks.some(
                              (t) => t.nomtache === task.name && t.category === categoryObj.category && t.sub_category === subcategory.name
                            )}
                            disabled={isTaskExisting(task.name, categoryObj.category, subcategory.name)}
                            onChange={() => handleCheckboxChange(task, categoryObj.category, subcategory.name)}
                          />
                          <label
                            className={`ml-2 text-lg ${isTaskExisting(task.name, categoryObj.category, subcategory.name) ? 'text-gray-400' : 'text-gray-700'}`}
                            htmlFor={`task-${catIndex}-${subcatIndex}-${taskIndex}`}
                          >
                            {task.name} - <span className="text-blue-600">{task.percentage}%</span>
                            {isTaskExisting(task.name, categoryObj.category, subcategory.name) && <span className="text-gray-400 ml-2">(مكتملة)</span>}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">لا توجد مهام داخل هذه الفئة الفرعية</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button
            className={`px-8 py-3 rounded-lg font-semibold text-white text-lg transition-colors ${
              selectedTasks.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
            }`}
            onClick={handleSubmit}
            disabled={selectedTasks.length === 0}
          >
            أضافة
          </button>
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-1/2">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4 ">إضافة تعليق</h2>
            <form className="flex flex-col">
              <textarea
                placeholder='تعليق؟'
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border border-gray-300 rounded-md mb-4 h-24"
              />
              <button
                className='px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition'
                onClick={(e) => {
                  
                  e.preventDefault();
                  axios.post(`http://localhost:3999/comment/${idecole}/${idadmin}`, {
                    idadmin,
                    idecole,
                    observation: comment
                  }).then(() => {
                    
                    setComment(""); // Clear the comment field after submission
                  }).catch((error) => {
                    console.error("خطأ في إضافة التعليق:", error);
                    alert("حدث خطأ أثناء إضافة التعليق");
                  });
                  toast(" تمت الاضاقة بنجاح!", {
                    position: "top-right",
                    autoClose: 3000,
                    style: customToastStyle,
                    icon: "✅", // Custom emoji
                })
                }}
              >
                إضافة تعليق
              </button>
              <ToastContainer />
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          
        </div>
      </div>
    </div>
  );
};

export default TaskSelector;