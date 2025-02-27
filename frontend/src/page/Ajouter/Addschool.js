import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import { ImageIcon, SaveIcon,University } from "lucide-react";
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddSchool = () => {
  const [formData, setFormData] = useState({
    nomecole: "",
    dd_construction: "",
    adress: "",
    statut: "",
    type: "",
    direction: "",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post("http://localhost:3999/add-school", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("!  تمت الاضافة بنجاح    ", {
        position: "bottom-right",
        autoClose: 3000,
        style: { background: "green", color: "#fff", fontWeight: "bold" ,fontFamily:"f1"},
      });
     /*  navigate("/Schools"); */
     setTimeout(()=>{
      navigate("/schools")
     },3005)
    } catch (error) {
      console.error("Error adding school:", error);
      toast.warn("!    هنالك خطأ ما     ", {
        position: "bottom-right",
        autoClose: 3000,
        style: { background: "gray", color: "gold", fontWeight: "bold" ,fontFamily:"f1"},
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-arabic mt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-4 mb-3">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-300 py-3  px-8">
            <h2 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-4">
              <University className="w-10 h-10" />
              إضافة مؤسسة جديدة 
            </h2>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المؤسسة
                    </label>
                    <input
                      type="text"
                      name="nomecole"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.nomecole}
                      onChange={handleChange}
                      placeholder="أدخل اسم المؤسسة"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ التأسيس
                    </label>
                    <input
                      type="date"
                      name="dd_construction"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.dd_construction}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السلك
                    </label>
                    <select
                      name="type"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر سلك المؤسسة</option>
                      <option value="ابتدائية">ابتدائية</option>
                      <option value="اعدادية">اعدادية</option>
                      <option value="ثانوية">ثانوية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحالة
                    </label>
                    <input
                      type="text"
                      name="statut"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={"en cours"}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <textarea
                      name="adress"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      rows="3"
                      value={formData.adress}
                      onChange={handleChange}
                      placeholder="أدخل عنوان المؤسسة"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المديرية
                    </label>
                    <select
                      name="direction"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.direction}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر المديرية</option>
                      <option value="laayoune">Laayoune</option>
                      <option value="boujdour">Boujdour</option>
                      <option value="essemar">Essemar</option>
                      <option value="tarfaya">Tarfaya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة المؤسسة
                    </label>
                    <input
                      type="file"
                      className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-400 to-indigo-300 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                >
                  <SaveIcon className="w-5 h-5" />
                   تسجيل المؤسسة
                </button>
                <ToastContainer />
              </form>
            </div>

            {/* Image Preview Section */}

            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-xs aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-blue-300 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                    <p>معاينة الصورة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div >
      <br/><br/>
      <Footer/>
    </div>
  );
};

export default AddSchool;
