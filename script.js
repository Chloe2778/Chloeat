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
const processingPage = document.querySelector(".processing-page");

if (processingPage) {

    const title = document.querySelector(".processing-page h1");
    const message = document.querySelector(".processing-text");

    const steps = [
        {
            title: "Uploading your receipt...",
            message: "We're getting your receipt ready."
        },
        {
            title: "Reading your receipt...",
            message: "We're looking for the groceries on it."
        },
        {
            title: "Finding your groceries...",
            message: "We're organizing everything we found."
        },
        {
            title: "Almost done...",
            message: "Just putting everything together."
        }
    ];

    let step = 0;

    const interval = setInterval(function () {

        title.textContent = steps[step].title;
        message.textContent = steps[step].message;

        step++;

        if (step === steps.length) {

            clearInterval(interval);

            setTimeout(function () {
                window.location.href = "review.html";
            }, 700);

        }

    }, 1200);
}
