// src/hooks/useFileUpload.ts
import { useState } from 'react';
import { getStorage, ref, uploadBytes } from "firebase/storage";

export type UploadStatus = 'idle' | 'uploading' | 'successful' | 'error';

interface UseFileUploadHook {
    uploadFile: (file: File) => void;
    status: UploadStatus;
    error: Error | null;
    downloadURL: string | null;
}

interface UseFileUploadOptions {
    onComplete?: (downloadUrl: string, status: UploadStatus) => void; // Callback to be invoked when upload is complete
    onError?: (error: Error) => void; // Callback for handling errors
}

export function useFileUpload(options?: UseFileUploadOptions): UseFileUploadHook {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [error, setError] = useState<Error | null>(null);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);

    const uploadFile = async (file: File) => {
        if (!file) {
            alert("Please select a file to upload");
            return;
        }
        const storage = getStorage();
        const storageRef = ref(storage, `files/${file.name}`);
        try {
            setStatus('uploading');
            const snapshot = await uploadBytes(storageRef, file);
            const downloadPath = snapshot.ref.fullPath;
            setDownloadURL(downloadPath);
            setStatus('successful');

            // If an onComplete callback is provided, and upload was successful
            console.log("Options: ", options, " ", status);
            if (options?.onComplete) {
                options.onComplete(downloadPath, 'successful');
            }
        } catch (error: any) {
            console.error('Upload failed', error);
            setError(error);
            setStatus('error');

            // If an onError callback is provided
            if (options?.onError) {
                options.onError(error);
            }
        }
    };

    return { uploadFile, status, error, downloadURL };
}