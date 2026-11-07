import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fingerprintPromise;

export async function getDeviceId() {
    if (!fingerprintPromise) {
        fingerprintPromise = FingerprintJS.load();
    }

    const fingerprint = await fingerprintPromise;
    const result = await fingerprint.get();
    return result.visitorId;
}