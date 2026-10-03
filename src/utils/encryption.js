const SECRET_KEY =
    "a7f39c21d84e6b50f91c73a82d6e4b19c5a7f02e8b64d391f8a23c7e5d1046ab";

/**
 * Converts the hexadecimal secret key into a Uint8Array.
 *
 * @returns {Uint8Array} 32-byte encryption key.
 */
const getKeyBytes = () => {
    const bytes = new Uint8Array(32);

    for (let i = 0; i < 32; i++) {
        bytes[i] = parseInt(
            SECRET_KEY.slice(i * 2, i * 2 + 2),
            16
        );
    }

    return bytes;
};

/**
 * Encrypts data using AES-256-GCM.
 *
 * A random 12-byte IV is generated for every encryption.
 * The IV is stored together with the encrypted data so it
 * can be used during decryption.
 *
 * @param {any} data - Data to encrypt.
 * @returns {Promise<string|null>} Base64 encoded encrypted data.
 */
export const encryptData = async (data) => {
    try {
        const key = await crypto.subtle.importKey(
            "raw",
            getKeyBytes(),
            {
                name: "AES-GCM",
            },
            false,
            ["encrypt"]
        );

        // Convert data to JSON
        const jsonData = JSON.stringify(data);

        // Convert JSON string to bytes
        const encodedData = new TextEncoder().encode(jsonData);

        // AES-GCM recommended IV size is 12 bytes
        const iv = crypto.getRandomValues(
            new Uint8Array(12)
        );

        // Encrypt the data
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            encodedData
        );

        // Combine IV + encrypted data
        const combined = new Uint8Array(
            iv.length + encryptedData.byteLength
        );

        combined.set(iv, 0);
        combined.set(
            new Uint8Array(encryptedData),
            iv.length
        );

        // Convert to Base64 for sessionStorage
        return btoa(
            String.fromCharCode(...combined)
        );

    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
};

/**
 * Decrypts AES-256-GCM encrypted data.
 *
 * The first 12 bytes contain the IV.
 * The remaining bytes contain the encrypted data
 * and authentication tag.
 *
 * @param {string} encryptedData - Base64 encoded encrypted data.
 * @returns {Promise<any|null>} Decrypted original data.
 */
export const decryptData = async (encryptedData) => {
    try {
        if (!encryptedData) {
            return null;
        }

        const key = await crypto.subtle.importKey(
            "raw",
            getKeyBytes(),
            {
                name: "AES-GCM",
            },
            false,
            ["decrypt"]
        );

        // Decode Base64
        const combined = Uint8Array.from(
            atob(encryptedData),
            (char) => char.charCodeAt(0)
        );

        // Extract IV (first 12 bytes)
        const iv = combined.slice(0, 12);

        // Extract encrypted data
        const encryptedBytes = combined.slice(12);

        // Decrypt
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            encryptedBytes
        );

        // Convert bytes back to JSON
        const jsonData = new TextDecoder().decode(
            decryptedData
        );

        return JSON.parse(jsonData);

    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};