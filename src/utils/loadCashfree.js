
const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

let cashfreeScriptPromise = null;

export const loadCashfreeSDK = () => {
    if (window.Cashfree) {
        return Promise.resolve(window.Cashfree);
    }

    if (cashfreeScriptPromise) {
        return cashfreeScriptPromise;
    }

    cashfreeScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
            `script[src="${CASHFREE_SDK_URL}"]`
        );

        const script = existingScript || document.createElement("script");

        const handleLoad = () => {
            if (window.Cashfree) {
                resolve(window.Cashfree);
            } else {
                cashfreeScriptPromise = null;
                reject(new Error("Cashfree SDK failed to initialize."));
            }
        };

        const handleError = () => {
            cashfreeScriptPromise = null;
            reject(new Error("Failed to load Cashfree SDK."));
        };

        script.addEventListener("load", handleLoad, { once: true });
        script.addEventListener("error", handleError, { once: true });

        if (!existingScript) {
            script.src = CASHFREE_SDK_URL;
            script.async = true;
            document.body.appendChild(script);
        } else if (window.Cashfree) {
            handleLoad();
        }
    });

    return cashfreeScriptPromise;
};
