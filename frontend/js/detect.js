const uploadBox =
    document.getElementById("uploadBox");


const imageInput =
    document.getElementById("imageInput");


const previewImage =
    document.getElementById("previewImage");


const uploadContent =
    document.getElementById("uploadContent");


const detectButton =
    document.getElementById("detectButton");


const loadingText =
    document.getElementById("loadingText");


const resultCard =
    document.getElementById("resultCard");


const prediction =
    document.getElementById("prediction");


const confidence =
    document.getElementById("confidence");



uploadBox.addEventListener(
    "click",
    () => {

        imageInput.click();

    }
);



imageInput.addEventListener(
    "change",
    () => {


        const file =
            imageInput.files[0];


        if (!file) {

            return;

        }


        const imageURL =
            URL.createObjectURL(file);


        previewImage.src =
            imageURL;


        previewImage.style.display =
            "block";


        uploadContent.style.display =
            "none";


        resultCard.style.display =
            "none";


    }
);



detectButton.addEventListener(
    "click",
    async () => {


        const file =
            imageInput.files[0];


        if (!file) {


            alert(
                "Please select a sign image first."
            );


            return;


        }



        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );



        loadingText.style.display =
            "block";


        resultCard.style.display =
            "none";


        detectButton.disabled =
            true;


        detectButton.innerText =
            "Detecting...";



        try {


            const response =
                await fetch(

                    "http://127.0.0.1:8001/predict",

                    {

                        method: "POST",

                        body: formData

                    }

                );



            if (!response.ok) {


                throw new Error(

                    "Prediction request failed"

                );


            }



            const data =
                await response.json();



            prediction.innerText =
                data.prediction;



            confidence.innerText =

                `Confidence: ${data.confidence}%`;



            resultCard.style.display =
                "block";


        }


        catch (error) {


            console.error(error);


            alert(

                "Could not connect to SilentVoice AI backend."

            );


        }


        finally {


            loadingText.style.display =
                "none";


            detectButton.disabled =
                false;


            detectButton.innerText =
                "Detect Sign";


        }


    }
);