import os
from flask import Flask, render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
from gtts import gTTS
import re
import base64
from io import BytesIO
from flask_cors import CORS

import mysql.connector
from groq import Groq
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'webm', 'wav', 'mp3', 'm4a'}

#  Groq client
groq_client = Groq(api_key="API_KEY")



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# audio
def transcribe_audio(filepath):
    with open(filepath, "rb") as f:
        response = groq_client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=f
        )
    return response.text


#     return ask_groq(question)
def get_answer_groq(question):
    q = question.lower().strip()

    if any(word in q for word in ["price", "cost", "rate", "sales", "earning", "sell"]):

        words = re.findall(r'\b[a-zA-Z]+\b', q)
        veg_name = None

        # FIND VEGETABLE NAME
        for word in words:
            with db.cursor(dictionary=True, buffered=True) as c:
                c.execute("SELECT name FROM vegetables WHERE LOWER(name) = %s", (word,))
                result = c.fetchone()
                if result:
                    veg_name = result["name"]
                    break

        # FETCH PRICE
        if veg_name:
            with db.cursor(dictionary=True, buffered=True) as c:
                c.execute("SELECT price FROM vegetables WHERE name = %s", (veg_name,))
                price_result = c.fetchone()

            if price_result:
                return f"🥦 The current price of {veg_name} is ₹{price_result['price']} per kg."
            else:
                return ask_groq(question)

        # FETCH TOTAL SALES
        elif "total sales" in q or "sales" in q:
            with db.cursor(dictionary=True, buffered=True) as c:
                c.execute("SELECT SUM(amount) AS total FROM sales")
                result = c.fetchone()

            if result and result["total"]:
                return f"💰 Total sales so far: ₹{result['total']}."
            else:
                return "📉 Hmm, there’s no sales data recorded yet."

    return ask_groq(question)



def ask_groq(question):
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are FarmChainX Chatbot, a friendly farming assistant 😊. "
                    "Keep responses short, warm, and in simple English with emojis. "
                    "If users greet you or ask about farming in general, respond like your CLI chatbot."
                )
            },
            {"role": "user", "content": question}
        ],
    )
    return response.choices[0].message.content
 
#database management 
db = mysql.connector.connect(
    host="localhost",
    user="root",              
    password="Sleep925@vsl", 
    database="farmchain_db"   
)

cursor = db.cursor(dictionary=True)
print("✅ Connected to MySQL successfully!")

cursor.execute("SELECT * FROM vegetables")
for row in cursor.fetchall():
    print(row)


cursor = db.cursor(dictionary=True)
# Convert answer to voice
def text_to_audio(text):
    
    tts = gTTS(text)
    audio_bytes = BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)

    
    audio_base64 = base64.b64encode(audio_bytes.read()).decode('utf-8')
    return f"data:audio/mp3;base64,{audio_base64}"
   

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({"error": "Invalid request"}), 400

    question = data["question"]
    answer = get_answer_groq(question)
    audio_data = text_to_audio(answer)

    return jsonify({
        "text": answer,
        "voice": audio_data
    })



if __name__ == '__main__':
    print("🚀 Starting FarmChainX Chatbot Server...")
    app.run(host='127.0.0.1', port=5000, debug=True)

# if __name__ == '__main__':
#     os.makedirs("uploads", exist_ok=True)
#     os.makedirs("static/audio", exist_ok=True)
#     app.run(debug=True)
