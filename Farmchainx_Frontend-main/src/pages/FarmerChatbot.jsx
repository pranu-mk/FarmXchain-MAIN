import React from "react";
import Header from "../components/Shared/Header";
import Chatbot from "./chatbot";

function FarmerChatbot() {
  return (
    <div className="dashboard farmer-dashboard">
      <Header 
        title="FarmChainX - Farming Chatbot"
        user={JSON.parse(localStorage.getItem("user"))}
      />

      <div className="chatbot-page-container" style={{ padding: "20px" }}>
        
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          
        </h2>

        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}>
          <div style={{ width: "80%" }}>
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerChatbot;
