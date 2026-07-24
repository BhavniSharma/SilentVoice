// ==========================================================
// SILENTVOICE AI
// DETECT PAGE
// ==========================================================

const API_URL = "http://127.0.0.1:8001/predict";
const FRAME_SIZE = 260;

// ==========================================================
// UPLOAD ELEMENTS
// ==========================================================

const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const uploadContent = document.getElementById("uploadContent");
const detectButton = document.getElementById("detectButton");

// ==========================================================
// RESULT ELEMENTS
// ==========================================================

const loadingText = document.getElementById("loadingText");
const resultCard = document.getElementById("resultCard");

const prediction = document.getElementById("prediction");
const confidence = document.getElementById("confidence");
const confidenceFill = document.getElementById("confidenceFill");

// ===== NEW UI =====

const historyContainer =
document.getElementById("historyContainer");

const currentWord =
document.getElementById("currentWord");

const speakBtn =
document.getElementById("speakBtn");

const clearBtn =
document.getElementById("clearBtn");

// ==========================================================
// CAMERA ELEMENTS
// ==========================================================

const uploadTab =
document.getElementById("uploadTab");

const cameraTab =
document.getElementById("cameraTab");

const uploadWorkspace =
document.getElementById("uploadWorkspace");

const cameraWorkspace =
document.getElementById("cameraWorkspace");

const dashboardBtn =
document.getElementById("dashboardBtn");

const startCameraBtn =
document.getElementById("startCamera");

const cameraPreview =
document.getElementById("cameraPreview");

const cameraPlaceholder =
document.getElementById("cameraPlaceholder");

const captureCanvas =
document.getElementById("captureCanvas");

const handStatus =
document.getElementById("handStatus");

// ==========================================================
// VARIABLES
// ==========================================================

let cameraStream = null;

let predictionInterval = null;

let isPredicting = false;

let predictionHistory = [];

let detectedWord = "";

let lastLetter = "";

const MAX_HISTORY = 10;

// ==========================================================
// INITIAL UI
// ==========================================================

loadingText.style.display = "none";

resultCard.style.display = "none";

uploadWorkspace.classList.remove("hidden");

cameraWorkspace.classList.add("hidden");

uploadTab.classList.add("active");

cameraTab.classList.remove("active");

// ==========================================================
// IMAGE UPLOAD
// ==========================================================

uploadBox.addEventListener("click", () => {

    imageInput.click();

});

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    predictionHistory = [];
lastLetter = "";

    if (!file) return;

    previewImage.src = URL.createObjectURL(file);

    previewImage.style.display = "block";

    uploadContent.style.display = "none";

    resultCard.style.display = "none";

    prediction.textContent = "-";

    confidence.textContent = "-";

    confidenceFill.style.width = "0%";

});

// ==========================================================
// IMAGE DETECT
// ==========================================================

detectButton.addEventListener("click", async () => {

    const file = imageInput.files[0];

    if (!file) {

        alert("Please upload an image first.");

        return;

    }

    detectButton.disabled = true;

    detectButton.innerHTML = "Detecting...";

    loadingText.style.display = "flex";

    resultCard.style.display = "none";

    try{

        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(API_URL,{

            method:"POST",

            body:formData

        });

        if(!response.ok){

            throw new Error("Prediction Failed");

        }

        const data = await response.json();

        updatePrediction(data,true);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    finally{

        loadingText.style.display = "none";

        detectButton.disabled = false;

        detectButton.innerHTML = "Detect Sign";

    }

});

// ==========================================================
// TAB SWITCHING
// ==========================================================

uploadTab.addEventListener("click", () => {

    stopCamera();

    uploadTab.classList.add("active");
    cameraTab.classList.remove("active");

    uploadWorkspace.classList.remove("hidden");
    cameraWorkspace.classList.add("hidden");

});

cameraTab.addEventListener("click", () => {

    uploadTab.classList.remove("active");
    cameraTab.classList.add("active");

    uploadWorkspace.classList.add("hidden");
    cameraWorkspace.classList.remove("hidden");

});

// ==========================================================
// DASHBOARD BUTTON
// ==========================================================

if(dashboardBtn){

    dashboardBtn.addEventListener("click",()=>{

        stopCamera();

    });

}

// ==========================================================
// START CAMERA
// ==========================================================

startCameraBtn.addEventListener("click", () => {

    if (cameraStream) {

        stopCamera();

    } else {

        startCamera();

    }

});

async function startCamera(){

    stopCamera();

    try{

        cameraStream =
        await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user"
            }

        });

        cameraPreview.srcObject = cameraStream;

        await cameraPreview.play();

        cameraPreview.style.display = "block";

        cameraPlaceholder.style.display = "none";

        startCameraBtn.disabled = false;

        startCameraBtn.innerHTML = `
    
    Stop Camera
`;

        lucide.createIcons();

        predictionInterval =
        setInterval(captureAndPredict,700);

    }

    catch(error){

        console.error(error);

        alert("Unable to access camera.");

    }

}

// ==========================================================
// CANVAS TO BLOB
// ==========================================================

function canvasToBlob(canvas){

    return new Promise(resolve=>{

        canvas.toBlob(resolve,"image/jpeg");

    });

}

// ==========================================================
// LIVE CAMERA PREDICTION
// ==========================================================

async function captureAndPredict(){

    if(!cameraStream) return;

    if(isPredicting) return;

    if(cameraPreview.videoWidth===0) return;

    if(!handDetected) return;

    isPredicting = true;

    loadingText.style.display = "flex";

    try{

        captureCanvas.width = FRAME_SIZE;

        captureCanvas.height = FRAME_SIZE;

        const ctx =
        captureCanvas.getContext("2d");

        ctx.setTransform(1,0,0,1,0,0);

        ctx.translate(FRAME_SIZE,0);

        ctx.scale(-1,1);

        const sx =
        (cameraPreview.videoWidth-FRAME_SIZE)/2;

        const sy =
        (cameraPreview.videoHeight-FRAME_SIZE)/2;

        ctx.drawImage(

            cameraPreview,

            sx,
            sy,

            FRAME_SIZE,
            FRAME_SIZE,

            0,
            0,

            FRAME_SIZE,
            FRAME_SIZE

        );

        const blob =
        await canvasToBlob(captureCanvas);

        const formData =
        new FormData();

        formData.append(

            "file",

            blob,

            "camera.jpg"

        );

        const response =
        await fetch(API_URL,{

            method:"POST",

            body:formData

        });

        if(!response.ok){

            throw new Error("Prediction Failed");

        }

        const data =
        await response.json();

        updatePrediction(data,true);

    }

    catch(error){

        console.error(error);

    }

    finally{

        loadingText.style.display = "none";

        isPredicting = false;

    }

}

// ==========================================================
// PREDICTION HISTORY
// ==========================================================

function getStablePrediction(newPrediction){

    predictionHistory.push(newPrediction);

    if(predictionHistory.length > MAX_HISTORY){

        predictionHistory.shift();

    }

    const count = {};

    predictionHistory.forEach(letter=>{

        count[letter] = (count[letter] || 0) + 1;

    });

    let bestLetter = newPrediction;

    let bestCount = 0;

    for(const letter in count){

        if(count[letter] > bestCount){

            bestCount = count[letter];

            bestLetter = letter;

        }

    }

    return bestLetter;

}

// ==========================================================
// HISTORY UI
// ==========================================================

function addHistory(letter){

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `

        <span>${letter}</span>

        <small>${new Date().toLocaleTimeString()}</small>

    `;

    historyContainer.prepend(item);

    while(historyContainer.children.length > 8){

        historyContainer.removeChild(historyContainer.lastChild);

    }

}

// ==========================================================
// WORD BUILDER
// ==========================================================

function appendLetter(letter){

    if(letter === lastLetter) return;

    lastLetter = letter;

    detectedWord += letter;

    currentWord.textContent = detectedWord;

}

// ==========================================================
// SPEAK
// ==========================================================

speakBtn.addEventListener("click",()=>{

    if(detectedWord.length===0) return;

    const speech = new SpeechSynthesisUtterance(detectedWord);

    speech.rate = 0.9;

    speech.pitch = 1;

    speech.lang = "en-US";

    speechSynthesis.cancel();

    speechSynthesis.speak(speech);

});

// ==========================================================
// CLEAR WORD
// ==========================================================

clearBtn.addEventListener("click",()=>{

    detectedWord="";

    lastLetter="";

    currentWord.textContent="";

});

// ==========================================================
// UPDATE RESULT CARD
// ==========================================================

function updatePrediction(data,isUpload=false){

    const stablePrediction = isUpload
    ? data.prediction
    : getStablePrediction(data.prediction);
    const confidenceValue =
    Math.round(data.confidence);

    resultCard.style.display="block";

    prediction.textContent =
    stablePrediction;

    confidence.textContent =
    `${confidenceValue}%`;

    confidenceFill.style.width =
    `${confidenceValue}%`;

    if(confidenceValue>=90){

        confidenceFill.style.background="#22c55e";

    }

    else if(confidenceValue>=70){

        confidenceFill.style.background="#f59e0b";

    }

    else{

        confidenceFill.style.background="#ef4444";

    }

    if(confidenceValue>=80){

        appendLetter(stablePrediction);

        addHistory(stablePrediction);

    }

    prediction.animate(

        [

            {

                transform:"scale(.8)",

                opacity:.5

            },

            {

                transform:"scale(1)",

                opacity:1

            }

        ],

        {

            duration:250

        }

    );

}

// ==========================================================
// RESET DETECTION UI
// ==========================================================

function resetDetectionUI(){

    loadingText.style.display = "none";

    resultCard.style.display = "none";

    prediction.textContent = "-";

    confidence.textContent = "-";

    confidenceFill.style.width = "0%";

    confidenceFill.style.background =
    "linear-gradient(90deg,#2563eb,#60a5fa)";

    predictionHistory = [];

    detectedWord = "";

    lastLetter = "";

    currentWord.textContent = "";

    historyContainer.innerHTML = `
        <p class="empty-text">
            No predictions yet
        </p>
    `;

}

// ==========================================================
// RESET CAMERA
// ==========================================================

function resetCamera(){

    cameraPreview.pause();

    cameraPreview.srcObject = null;

    cameraPreview.style.display = "none";

    cameraPlaceholder.style.display = "flex";

    startCameraBtn.disabled = false;

    startCameraBtn.innerHTML = `
        Start Camera
    `;

    

}

// ==========================================================
// STOP CAMERA
// ==========================================================

function stopCamera(){

    if(predictionInterval){

        clearInterval(predictionInterval);

        predictionInterval = null;

    }

    isPredicting = false;

    if(cameraStream){

        cameraStream.getTracks().forEach(track=>{

            track.stop();

        });

        cameraStream = null;

    }

    resetCamera();

    resetDetectionUI();

handDetected = false;

handStatus.innerHTML = "🔴 No Hand Detected";

handStatus.style.background = "#fee2e2";

handStatus.style.color = "#991b1b";

}

// ==========================================================
// MEDIAPIPE
// ==========================================================

let handDetected = false;

const hands = new Hands({

    locateFile:(file)=>{

        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }

});

hands.setOptions({

    maxNumHands:1,

    modelComplexity:1,

    minDetectionConfidence:.7,

    minTrackingConfidence:.6

});

hands.onResults(results=>{

    if(results.multiHandLandmarks &&
        results.multiHandLandmarks.length>0){

        handDetected = true;

        handStatus.innerHTML =
        "🟢 Hand Detected";

        handStatus.style.background =
        "#d1fae5";

        handStatus.style.color =
        "#065f46";

    }

    else{

        handDetected = false;

        handStatus.innerHTML =
        "🔴 No Hand Detected";

        handStatus.style.background =
        "#fee2e2";

        handStatus.style.color =
        "#991b1b";

    }

});

// ==========================================================
// RUN MEDIAPIPE
// ==========================================================
let mediapipeBusy = false;
async function detectHand(){

    if(!cameraStream) return;

    if(cameraPreview.readyState < 2) return;

    if(mediapipeBusy) return;

    mediapipeBusy = true;

    try{

        await hands.send({

            image: cameraPreview

        });

    }

    catch(error){

        console.error(error);

    }

    finally{

        mediapipeBusy = false;

    }

}

setInterval(detectHand,200);

// ==========================================================
// PAGE EVENTS
// ==========================================================

window.addEventListener(

    "beforeunload",

    stopCamera

);

window.addEventListener(

    "pagehide",

    stopCamera

);

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            stopCamera();

        }

    }

);

// ==========================================================
// CAMERA ERROR
// ==========================================================

cameraPreview.addEventListener(

    "error",

    ()=>{

        console.error("Camera Error");

        stopCamera();

    }

);

// ==========================================================
// PREVENT DOUBLE CLICK
// ==========================================================

startCameraBtn.addEventListener(

    "dblclick",

    e=>{

        e.preventDefault();

    }

);

// ==========================================================
// INITIAL HISTORY
// ==========================================================

historyContainer.innerHTML = `
    <p class="empty-text">
        No predictions yet
    </p>
`;