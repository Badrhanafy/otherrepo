import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import { Modal, Button, Form, Carousel } from 'react-bootstrap';
import {ImagePlus,ListChecks } from "lucide-react"
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

const SchoolDetails = () => {
    const { idecole } = useParams();
    const [school, setSchool] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        nomecole: "",
        adress: "",
        statut: "",
        pourcentage: "",
        typeecole: "",
    });
     const naviaget = useNavigate();

    const [selectedTasks, setSelectedTasks] = useState([]);

    // Add these new functions
    const handleSelectAll = () => {
        if (selectedTasks.length === tasks.length) {
            setSelectedTasks([]);
        } else {
            const allTaskIds = tasks.map(task => task.idtache);
            setSelectedTasks(allTaskIds);
        }
    };

    const handleTaskSelect = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter(id => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedTasks.length === 0) return;
    
        Swal.fire({
            title: "حذف الأشغال المحددة",
            text: "هل أنت متأكد من رغبتك في حذف جميع المهام المحددة؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم، احذف",
            cancelButtonText: "إلغاء"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3999/tasks/bulk-delete`, {
                    data: {
                        idecole: idecole,
                        taskIds: selectedTasks
                    }
                })
                .then(() => {
                    toast.success("تم حذف المهام المحددة بنجاح", {
                        position: "bottom-right",
                        autoClose: 3000,
                        style: { background: "green", color: "#fff", fontWeight: "bold", fontFamily: "f1" },
                    });
                    setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task.idtache)));
                    setSelectedTasks([]);
                })
                .catch(error => {
                    console.error("Error deleting tasks:", error);
                    toast.error("حدث خطأ أثناء حذف المهام");
                });
            }
        });
    };
    
    useEffect(() => {
        const token = sessionStorage.getItem("token")
        if(token){

        // Fetch school information
        axios.get(`http://localhost:3999/school/${idecole}`)
            .then((response) => {
                const foundSchool = response.data;
                setSchool(foundSchool);
                setFormData({
                    nomecole: foundSchool.nomecole,
                    adress: foundSchool.adress,
                    statut: foundSchool.statut,
                    pourcentage: foundSchool.pourcentage,
                    typeecole: foundSchool.typeecole,
                });
            })
            .catch((error) => {
                console.error("Error fetching school:", error);
            });

        // Fetch tasks associated with the school
        axios.get(`http://localhost:3999/tache/${idecole}`)
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });

        // Fetch school images
        axios.get(`http://localhost:3999/ecoles/${idecole}/images`)
            .then((response) => {
                setImages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            });
}

else{
    naviaget("/");
  }

},[idecole]);




const handleShowModal = () => setShowModal(true);
const handleCloseModal = () => {
setShowModal(false);
setImageFile(null); // Reset the image file on modal close
};

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData((prevData) => ({
    ...prevData,
    [name]: value,
}));
};

const handleFormSubmit = (e) => {
e.preventDefault();

const updateSchool = async () => {
    try {
        // Update school information
        await axios.put(`http://localhost:3999/school/${idecole}`, formData);
        toast.success("تم  التعديل بنجاح   ", {
            position: "bottom-right",
            autoClose: 3000,
            style: { background: "green", color: "#fff", fontWeight: "bold", fontFamily: "f2" },
        });
        // If there's an image file, upload it
        if (imageFile) {
            const imagesForm = new FormData();
            imagesForm.append("image", imageFile);

            await axios.post(`http://localhost:3999/school/${idecole}/upload`, imagesForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        // Close the modal and reset state
        handleCloseModal();
    } catch (error) {
        console.error("Error updating school:", error);
    }
};

updateSchool();
};

const handleImageUpload = () => {
if (!imageFile) {
   
    toast.error("! يرجى اختيار صورة لرفعها", {
        position: "bottom-right",
        autoClose: 3000,
        style: { background: "#ef4444", color: "#fff", fontWeight: "bold" ,fontFamily:"f1"},
      });
    return;
}

const imagesForm = new FormData();
imagesForm.append("image", imageFile);

axios
    .post(`http://localhost:3999/school/${idecole}/upload`, imagesForm, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then(() => {
        /////// tostify alert !
        toast.success(" تم الرفع بنجاح", {
            position: "top-right",
            autoClose: 3000,
          });
        // Optionally refresh the images list
        axios.get(`http://localhost:3999/ecoles/${idecole}/images`)
            .then((response) => {
                setImages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            });
    })
    .catch((error) => {
        console.error("حدث خطأ أثناء رفع الصورة:", error);
        alert("حدث خطأ أثناء رفع الصورة.");
    });
};

const handleDeleteTask = (task) => {
const shouldDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذه المهمة؟");
if (shouldDelete) {
   
      
}
};
function showConfirm(task) {
Swal.fire({
  title: "حذف الأشغال",
  text: "بحذف هذا الشق ستؤثر علي نسبة تقدم المشروع",
  icon: "info",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "! استمرار",
  cancelButtonText: "تراجع ",
}).then((result) => {
  if (result.isConfirmed) {
    // 
    axios.delete(`http://localhost:3999/delete/${idecole}/${task.idtache}`)
    .then((res) => {
        toast.success("! تم الحذف بنجاح   ", {
            position: "bottom-right",
            autoClose: 3000,
            style: { background: "#ef4444", color: "#fff", fontWeight: "bold" ,fontFamily:"f1"},
          });
        
        // Immediately update the state to remove the deleted task from the view
        setTasks((prevTasks) => prevTasks.filter((deletedtask) => deletedtask.idtache !== task.idtache));
    })
    
  }
});
}
if (!school) return <div>Loading...</div>;
    // In the JSX, add these elements before the tasks list:
    return (
        // ... existing code ...
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-end">{school?.nomecole}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="bg-white rounded-lg shadow p-6 text-end">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4" id="message">معلومات المؤسسة </h3>
                        <div className="space-y-3">
                            <p className="text-gray-700">{school.adress} : <span className="font-medium" id="title2">العنوان</span> </p>
                            <p className="text-gray-700">   {school.statut} : <span className="font-medium" id="title2">الحالة</span></p>
                            <p className="text-gray-700">  {school.pourcentage}%   :    <span className="font-medium" id="title2">التقدم</span> </p>
                            <p className="text-gray-700">  <span className="font-medium" id="title2">سلك المؤسسة</span> : {school.typeecole} </p>
                        </div>
                        <div className="mt-6 space-x-4">
                            <button
                                onClick={handleShowModal}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                            >
                                تعديل
                            </button>
                            <Link
                                to={`/TaskSelector/${school.idecole}`}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150"
                            >
                                أضف مهام
                            </Link>
                            <br/><br/>
                            <div className="inline-flex items-center mr-10">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                                <button
                                    onClick={handleImageUpload}
                                    className=" mt-3 mb-3 ml-2 py-2 px-4 text-white bg-cyan-500 rounded-md shadow hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                                >
                                     <ImagePlus />
                                </button>
                                <ToastContainer />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Carousel for images */}
                        {images.length >= 2 ? (
                            <Carousel>
                                {images.map((image, index) => (
                                    <Carousel.Item key={image.idimage}>
                                        <img
                                            src={`http://localhost:3999${image.image_url}`}
                                            className="d-block w-100"
                                            alt={`Slide ${index + 1}`}
                                            style={{ height: "400px", objectFit: "cover" }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <div>
                                <img
                                    src={`http://localhost:3999${school.image}`}
                                    className="d-block w-100"
                                    alt={`Slide ${school.image}`}
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                

                {/* Modal for editing school information */}
                <Modal show={showModal} onHide={handleCloseModal} className="text-end">
                    <Modal.Header closeButton>
                        <Modal.Title>تعديل معلومات المؤسسة </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formNomecole">
                                <Form.Label id="title2">اسم المؤسسة </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nomecole"
                                    value={formData.nomecole}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label id="title2">العنوان</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="adress"
                                    value={formData.adress}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formStatut">
                                <Form.Label id="title2">الحالة</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="statut"
                                    value={formData.statut}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="formPourcentage">
                                <Form.Label id="title2">نسبة التقدم </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="pourcentage"
                                    value={formData.pourcentage}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="formTypeecole">
                                <Form.Label id="title2"> سلك المؤسسة </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="typeecole"
                                    value={formData.typeecole}
                                    onChange={handleInputChange}
                                    required
                                    className="mb-8"
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                حفظ
                            </Button>
                            
                        </Form>
                    </Modal.Body>
                </Modal>

        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-end" id="title2">: الأشغال المنجزة</h3>
           {tasks.length>0?(
             <div className="bg-white rounded-lg shadow overflow-hidden">
             <div className="flex items-center justify-between p-4 border-b">
                 <div className="flex items-center">
                 
                     <input
                         type="checkbox"
                         onChange={handleSelectAll} 
                         checked={selectedTasks.length === tasks.length && tasks.length > 0}
                        
                         className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                     />&ensp;
                     <span className="text-sm text-gray-700" > تحديد الكل</span>
                 </div>
                 <button
                     onClick={handleDeleteSelected}
                     disabled={selectedTasks.length === 0}
                     className={`px-4 py-2 rounded-lg ${
                         selectedTasks.length > 0 
                         ? 'bg-red-600 text-white hover:bg-red-700' 
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                 >
                     حذف المحدد ({selectedTasks.length})
                 </button>
             </div>
             <ul className="divide-y divide-gray-200">
                 {tasks.map((task) => (
                     <li
                         key={task.idecoletache}
                         className="flex items-center justify-between p-4 hover:bg-gray-50"
                     >
                         <div className="flex items-center">
                             <input
                                 type="checkbox"
                                 checked={selectedTasks.includes(task.idtache)}
                                 onChange={() => handleTaskSelect(task.idtache)}
                                 className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                             />
                             <span className={`${task.statut ? "text-green-600" : "text-gray-700"}`}>
                                 {task.nomtache} ({task.t_pourcentage}%)
                             </span>
                         </div>
                         <button
                             className="bg-red-200 hover:bg-red-500 p-2 lg:rounded-lg"
                             onClick={() => showConfirm(task)}
                         >
                             حذف
                         </button>
                         
                     </li>
                 ))}
             </ul>
         </div>
           ):(<p id="message">لم يتم انجاز أية أشغال بعد</p>)}
        </div>
   </div></div>
        // ... rest of existing code ...
    );
};

export default SchoolDetails;