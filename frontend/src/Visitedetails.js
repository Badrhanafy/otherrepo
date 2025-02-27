import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./page/navbar";
import html2pdf from "html2pdf.js";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import default styles
export default function VisiteDetail() {
  const { idvisite, idecole } = useParams();
  const [visite, setVisite] = useState([]);
   const [admin,setAdmin] = useState([])

  const [ecole, setEcole] = useState({});
  const [ecoleImage, setEcoleImage] = useState(null);
  const token = sessionStorage.getItem("token");
  const pdfRef = useRef();

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

  const idadmin = getIdAdminFromToken();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [resVisite, resEcole,resAdmin] = await Promise.all([
          axios.get(`http://localhost:3999/raportsget/${idvisite}`),
          axios.get(`http://localhost:3999/school/${idecole}`),
          axios.get(`http://localhost:3999/visite/${idvisite}`),
        ]);
       
        setVisite(resVisite.data);
        setEcole(resEcole.data);
        setAdmin(resAdmin)
        
        
        // Fetch the image as a Blob and convert to Base64
        if (resEcole.data.image) {
          const imageResponse = await axios.get(`http://localhost:3999${resEcole.data.image}`, {
            responseType: 'blob',
          });
          const reader = new FileReader();
          reader.onloadend = () => {
            setEcoleImage(reader.result); // Set Base64 image
          };
          reader.readAsDataURL(imageResponse.data);
        }


      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [idvisite, idecole, idadmin]);
 
    const downloadPDF = () => {
    const element = pdfRef.current;

    // Add a class to hide buttons
    element.classList.add('hide-buttons');

    setTimeout(() => {
      html2pdf()
        .from(element)
        .save(`${ecole.nomecole}.pdf`)
        .then(() => {
          // Remove the class after PDF is generated
          element.classList.remove('hide-buttons');
        });
    }, 500); // Adjust delay as needed
  };

  return (
    <center>
         <div style={{position:"relative",top:"-13vh",width:"1000px"}} className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen mt-16  ">
      <Navbar />
      <div className="container mx-auto px-6 py-8" ref={pdfRef}>
        {/* Header Section */}
        <div className="bg-white rounded-t-xl p-6 border-b-4 border-blue-300 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-blue-300 rounded-full w-96 h-96 -top-32 -left-32"></div>
          <div className="absolute inset-0 opacity-10 bg-blue-300 rounded-full w-96 h-96 -bottom-32 -right-32"></div>
          <img
            src={`${process.env.PUBLIC_URL}/academilogo.png`}
            alt="Official Logo"
            className="mx-auto h-auto z-10 relative w-2/4"
          />
          <h2 id="message" className="text-3xl font-bold mt-4 text-gray-800 relative z-10">
            تقرير الزيارة
          </h2>
          <h4 className="text-xl mt-2 text-gray-600 relative z-10">
            {ecole.nomecole || "N/A"}
          </h4>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* School Image */}
         

          {/* Visit Information */}
          <div className="rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <h5 className="text-lg font-semibold mb-4 text-gray-700 bg-emerald-300 px-1 text-end  ">
              معلومات الزيارة
            </h5>
           
            {visite.length > 0 ? (
              visite.map((visit) => (
                <div key={visit.idvisite} className="mb-4 text-end" style={{lineHeight:"7vh"}} >
                  
                  
                  <p className="text-gray-600">
                    <strong className="strongs">تاريخ الزيارة &ensp;</strong> &ensp;:&ensp;{visit.datevisite.split('T')[0]}
                  </p>
                  <p className="text-gray-600">
                    {ecole.nomecole || "N/A"}&ensp; :&ensp;&ensp;<strong className="strongs">اسم المدرسة</strong>
                  </p>
                  <p className="text-gray-600">
                    {visit.pourcentage || "N/A"} %&ensp; :&ensp;&ensp;<strong className="strongs">نسبة تقدم الأشغال</strong>
                  </p>
                  
                  <p className="text-gray-600" >
             {visit.fullname || "N/A"} : <strong className="strongs">الاسم الكامل</strong>
          </p>
          <p className="text-gray-600">
          {visit.email || "N/A"} : <strong className="strongs"> البريد الالكتروني</strong>
          </p>
          <div className="rounded-xl p-6 mt-8 bg-gradient-to-br from-blue-50 to-blue-100 text-end" style={{lineHeight:"6vh"}}>
          <h5 className="text-lg font-semibold mb-4 text-gray-700 bg-emerald-300 px-1"> نص التقرير</h5>
          {visit.observation}&ensp;:&ensp;&ensp;<strong className="strongs">الملاحظات</strong>
        </div>
                </div>
                
              ))
            ) : (
              <p className="text-gray-600">No visit details available.</p>
            )}
          </div>
          <div className="rounded-xl p-6 bg-gradient-to-br from-blue-100 to-blue-50">
            {ecoleImage ? (
              <img
                src={ecoleImage} // Use Base64 string for the image
                alt={ecole.nomecole}
                className="object-cover w-full h-64 rounded-lg border border-blue-200"
              />
            ) : (
              <p className="text-gray-500 text-center">No image available</p>
            )}
          </div>
        </div>

        {/* Admin Information */}
       

        {/* Print & PDF Download Buttons */}
        <div className="text-center mt-8">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 mr-4"
          >
            تحميل
          </button>
          
        </div>
      </div>

      {/* CSS to hide buttons during PDF generation */}
      <style jsx>{`
        .hide-buttons button {
          display: none !important;
        }
      `}</style>
     {/*  {
        console.log(visite[0].pourcentage)
        
        
      } */}
     
    </div>
    </center>
  );
  
}