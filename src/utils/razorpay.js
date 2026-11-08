
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            resolve(!!window.Razorpay);
        };

        script.onerror = () => {
            resolve(false);
        };

        document.body.appendChild(script);
    });
};
