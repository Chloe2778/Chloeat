const receiptUpload = document.getElementById("receipt-upload");
const scanButton = document.getElementById("scan-button");

if (scanButton && receiptUpload) {

    scanButton.addEventListener("click", function () {
        receiptUpload.click();
    });

    receiptUpload.addEventListener("change", function () {

        if (receiptUpload.files.length > 0) {

            const file = receiptUpload.files[0];

            localStorage.setItem("receiptName", file.name);

            window.location.href = "processing.html";
        }

    });
}
