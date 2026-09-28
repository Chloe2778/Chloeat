const receiptUpload = document.getElementById("receipt-upload");

if (receiptUpload) {
    receiptUpload.addEventListener("change", function () {

        if (receiptUpload.files.length > 0) {

            const file = receiptUpload.files[0];

            localStorage.setItem("receiptName", file.name);

            window.location.href = "processing.html";
        }

    });
}
