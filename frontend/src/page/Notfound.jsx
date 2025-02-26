import React from "react";
import Lottie from "lottie-react";
import NotFoundAnimation from "./Animation - 1739142743289.json"; // Your animation file
import Footer from "./Footer";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center " 
    style={{
      /* overflowY:"hidden" */
    }}>
      <div className="w-1/2">
        <Lottie animationData={NotFoundAnimation} loop={true} />
        
      </div>
      <button  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      style={{
        position:"relative",
       
        bottom:"20vh"
      }}
     onClick={()=>{
      window.history.back()
     }}
      >
        Go Back
      </button>
      <Footer/>
    </div>
  );
};

export default NotFound;
