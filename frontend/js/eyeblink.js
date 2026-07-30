// ======================================================
// EyeBlink AI
// ======================================================


const API_URL = "http://127.0.0.1:8002/predict";


const startCameraBtn = document.getElementById("startCamera");
const cameraPreview = document.getElementById("cameraPreview");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");

const eyeStatus = document.getElementById("eyeStatus");
const currentBlink = document.getElementById("currentBlink");
const currentMorse = document.getElementById("currentMorse");
const decodedLetter = document.getElementById("decodedLetter");
const currentSentence = document.getElementById("currentSentence");

const loadingText = document.getElementById("loadingText");

const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");

let stream = null;
let predictInterval = null;

loadingText.style.display = "none";

// ======================================================
// Start Camera
// ======================================================

startCameraBtn.addEventListener("click", async () => {

    if(stream){

        stopCamera();
        return;

    }

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video:true

        });

        cameraPreview.srcObject = stream;

        cameraPreview.style.display = "block";

        cameraPlaceholder.style.display = "none";

        startCameraBtn.innerHTML = "Stop Camera";

        predictInterval = setInterval(sendFrame,300);

    }

    catch(error){

        console.error(error);

        alert("Unable to access camera.");

    }

});

// ======================================================
// Stop Camera
// ======================================================

function stopCamera(){

    clearInterval(predictInterval);

    predictInterval = null;

    if(stream){

        stream.getTracks().forEach(track=>track.stop());

    }

    stream = null;

    cameraPreview.srcObject = null;

    cameraPreview.style.display = "none";

    cameraPlaceholder.style.display = "flex";

    startCameraBtn.innerHTML = "Start Camera";

}

// ======================================================
// Canvas → Blob
// ======================================================

async function canvasToBlob(canvas){

    return new Promise(resolve=>{

        canvas.toBlob(resolve,"image/jpeg");

    });

}

// ======================================================
// Send Frame To FastAPI
// ======================================================

async function sendFrame(){

    if(!stream) return;

    loadingText.style.display = "flex";

    try{

        const canvas = document.createElement("canvas");

        canvas.width = cameraPreview.videoWidth;

        canvas.height = cameraPreview.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(

            cameraPreview,

            0,
            0,

            canvas.width,
            canvas.height

        );

        const blob = await canvasToBlob(canvas);

        const formData = new FormData();

        formData.append(

            "file",

            blob,

            "frame.jpg"

        );

        const response = await fetch(API_URL, {

    method: "POST",

    body: formData

});

        if(!response.ok){

            throw new Error("Prediction failed");

        }

        const data = await response.json();

        eyeStatus.innerHTML = data.eye_status;

        currentBlink.innerHTML = data.current_blink;

        currentMorse.innerHTML = data.current_morse;

        decodedLetter.innerHTML = data.decoded_letter;

        currentSentence.innerHTML = data.current_sentence;

    }

    catch(error){

        console.error(error);

    }

    finally{

        loadingText.style.display = "none";

    }

}

// ======================================================
// Speak
// ======================================================

speakBtn.addEventListener("click",()=>{

    if(currentSentence.innerText==="—") return;

    speechSynthesis.cancel();

    speechSynthesis.speak(

        new SpeechSynthesisUtterance(

            currentSentence.innerText

        )

    );

});

// ======================================================
// Clear
// ======================================================

clearBtn.addEventListener("click",()=>{

    currentBlink.innerHTML="—";

    currentMorse.innerHTML="—";

    decodedLetter.innerHTML="—";

    currentSentence.innerHTML="—";

});