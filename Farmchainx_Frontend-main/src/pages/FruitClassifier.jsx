import React, { useState } from "react";

export default function FruitClassifier() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleClassify = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("https://saicode18-fruit-classifier.hf.space/api/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>🍎 Fruit Classifier</h2>
        <p style={styles.subtitle}>Upload an image to classify the fruit.</p>

        <div style={styles.uploadBox}>
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>

        {preview && (
          <img src={preview} alt="preview" style={styles.previewImage} />
        )}

        <button style={styles.classifyBtn} onClick={handleClassify}>
          {loading ? "Classifying..." : "Classify"}
        </button>

       {result && (
  <>
    {/* Prediction Header */}
    <div style={styles.predictionHeader}>
      <h3 style={styles.predictionTitle}>
        {result.prediction} — {result.confidence_score}
        <span style={styles.modelVersion}>
          (model: {result.model_version})
        </span>
      </h3>
    </div>

    {/* Raw JSON Result */}
    <div style={styles.resultBox}>
      <h3 style={{ marginBottom: 10 }}>📊 Prediction Result</h3>
      <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
    </div>
  </>
)}
            
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "40px 0",
    background: "#f7f8ff",
    minHeight: "100vh",
  },
  card: {
    width: "500px",
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    marginTop: "-5px",
    marginBottom: "20px",
    color: "#666",
  },
  uploadBox: {
    padding: "15px",
    border: "2px dashed #c9c9ff",
    borderRadius: "12px",
    background: "#fafaff",
    textAlign: "center",
    marginBottom: "20px",
  },
  previewImage: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #eee",
  },
  classifyBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #00c853, #00e676)",
    border: "none",
    color: "white",
    fontWeight: "600",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  resultBox: {
    background: "#f3f7ff",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #dce6ff",
    marginTop: "10px",
  },
  pre: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontSize: "14px",
  },

  predictionHeader: {
  background: "#fff7e6",
  padding: "12px 16px",
  borderRadius: "12px",
  marginBottom: "18px",
  border: "1px solid #ffe4b3",
},

predictionTitle: {
  fontSize: "18px",
  fontWeight: "600",
  color: "#d35400",
  margin: 0,
  textTransform: "capitalize",
},

modelVersion: {
  color: "#777",
  marginLeft: "6px",
  fontSize: "14px",
},

};


