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


// ======================================================
// Initial State
// ======================================================

loadingText.style.display = "none";

// Camera is OFF initially
eyeStatus.innerHTML = "🔴 Eyes Closed";


// ======================================================
// Start / Stop Camera
// ======================================================

startCameraBtn.addEventListener("click", async () => {

    // If camera is already running → stop it
    if (stream) {

        stopCamera();

        return;
    }

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        cameraPreview.srcObject = stream;

        cameraPreview.style.display = "block";

        cameraPlaceholder.style.display = "none";

        startCameraBtn.innerHTML = "Stop Camera";

        // Start sending frames
        predictInterval = setInterval(sendFrame, 300);

    }

    catch (error) {

        console.error("Camera Error:", error);

        alert("Unable to access camera.");

        eyeStatus.innerHTML = "🔴 Eyes Closed";
    }

});


// ======================================================
// Stop Camera
// ======================================================

function stopCamera() {

    // Stop prediction loop
    if (predictInterval) {

        clearInterval(predictInterval);

        predictInterval = null;

    }

    // Stop camera tracks
    if (stream) {

        stream.getTracks().forEach(track => {
            track.stop();
        });

    }

    stream = null;

    cameraPreview.srcObject = null;

    cameraPreview.style.display = "none";

    cameraPlaceholder.style.display = "flex";

    startCameraBtn.innerHTML = "Start Camera";


    // ==============================================
    // Camera OFF → reset eye status
    // ==============================================

    eyeStatus.innerHTML = "🔴 Eyes Closed";

}


// ======================================================
// Canvas → Blob
// ======================================================

async function canvasToBlob(canvas) {

    return new Promise(resolve => {

        canvas.toBlob(
            resolve,
            "image/jpeg"
        );

    });

}


// ======================================================
// Send Frame To FastAPI
// ======================================================

async function sendFrame() {

    if (!stream) return;

    // Make sure video is ready
    if (
        cameraPreview.readyState < 2 ||
        cameraPreview.videoWidth === 0
    ) {
        return;
    }

    loadingText.style.display = "flex";

    try {

        // Create canvas
        const canvas = document.createElement("canvas");

        canvas.width = cameraPreview.videoWidth;

        canvas.height = cameraPreview.videoHeight;

        const ctx = canvas.getContext("2d");


        // Draw current camera frame
        ctx.drawImage(
            cameraPreview,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Convert to image
        const blob = await canvasToBlob(canvas);


        const formData = new FormData();

        formData.append(
            "file",
            blob,
            "frame.jpg"
        );


        // Send to FastAPI
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                body: formData
            }
        );


        if (!response.ok) {

            throw new Error(
                "Prediction failed"
            );

        }


        const data = await response.json();


        // ==============================================
        // Update UI
        // ==============================================

        eyeStatus.innerHTML =
            data.eye_status || "🔴 Eyes Closed";


        currentBlink.innerHTML =
            data.current_blink || "—";


        currentMorse.innerHTML =
            data.current_morse || "—";


        decodedLetter.innerHTML =
            data.decoded_letter || "—";


        currentSentence.innerHTML =
            data.current_sentence || "—";

    }

    catch (error) {

        console.error(
            "Prediction Error:",
            error
        );

    }

    finally {

        loadingText.style.display = "none";

    }

}


// ======================================================
// Speak
// ======================================================

speakBtn.addEventListener(
    "click",
    () => {

        const sentence =
            currentSentence.innerText.trim();


        // Nothing to speak
        if (
            !sentence ||
            sentence === "—"
        ) {
            return;
        }


        // Stop previous speech
        speechSynthesis.cancel();


        // Speak current sentence
        const speech =
            new SpeechSynthesisUtterance(
                sentence
            );


        speechSynthesis.speak(
            speech
        );

    }
);


// ======================================================
// Clear
// ======================================================

clearBtn.addEventListener(
    "click",
    async () => {

        // Stop speech
        speechSynthesis.cancel();


        // Reset frontend
        currentBlink.innerHTML = "—";

        currentMorse.innerHTML = "—";

        decodedLetter.innerHTML = "—";

        currentSentence.innerHTML = "—";


        // Keep camera status correct
        if (stream) {

            // Camera is ON
            // Backend will update eye status
            // on the next frame.

        }
        else {

            // Camera is OFF
            eyeStatus.innerHTML =
                "🔴 Eyes Closed";

        }


        // Reset backend Morse state
        try {

            await fetch(
                "http://127.0.0.1:8002/clear",
                {
                    method: "POST"
                }
            );

        }

        catch (error) {

            console.log(
                "Backend clear endpoint not available."
            );

        }

    }
);