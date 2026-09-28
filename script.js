const receiptUpload = document.getElementById("receipt-upload");

if (receiptUpload) {
    receiptUpload.addEventListener("change", function () {

        if (receiptUpload.files.length > 0) {
            const file = receiptUpload.files[0];

            // Save the uploaded receipt name
            localStorage.setItem("receiptName", file.name);

            // Go to Your Kitchen
            window.location.href = "kitchen.html";
        }

    });
}
const receiptStatus = document.getElementById("receipt-status");

if (receiptStatus) {
    const receiptName = localStorage.getItem("receiptName");

    if (receiptName) {
        receiptStatus.textContent = `Receipt uploaded: ${receiptName}`;
    }
}
