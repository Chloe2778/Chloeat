const receiptUpload = document.getElementById("receipt-upload");
const scanButton = document.getElementById("scan-button");

if (scanButton && receiptUpload) {

    scanButton.addEventListener("click", function () {

        receiptUpload.click();

    });


    receiptUpload.addEventListener("change", async function () {

        if (receiptUpload.files.length === 0) {
            return;
        }


        const file = receiptUpload.files[0];


        /*
         * Save the receipt name
         */

        localStorage.setItem(
            "receiptName",
            file.name
        );


        /*
         * Save the image temporarily
         */

        const imageURL =
            URL.createObjectURL(file);


        localStorage.setItem(
            "receiptImage",
            imageURL
        );


        /*
         * Go to the processing page
         */

        window.location.href =
            "processing.html";

    });

}
