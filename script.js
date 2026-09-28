const receiptUpload = document.getElementById("receipt-upload");

if (receiptUpload) {
    receiptUpload.addEventListener("change", function () {

        if (receiptUpload.files.length > 0) {
            window.location.href = "kitchen.html";
        }

    });
}
