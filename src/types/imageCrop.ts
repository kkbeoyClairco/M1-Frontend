/**
 * Type definitions for image upload and crop functionality
 */

/**
 * Represents the cropped area in pixels
 */
export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Represents image dimensions
 */
export interface ImageDimensions {
    width: number;
    height: number;
}

/**
 * Represents uploaded file data with metadata
 */
export interface UploadedFileData {
    file: File;
    preview: string;
    type: 'image' | 'pdf';
}

/**
 * Represents the crop data from react-easy-crop
 */
export interface CropData {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Represents the metadata sent with the uploaded image
 */
export interface ImageUploadMetadata {
    originalFileName: string;
    dimensions: ImageDimensions;
    uploadedAt: string;
    fileSize: number;
}

/**
 * Represents the response from the backend after image upload
 */
export interface ImageUploadResponse {
    success: boolean;
    imageUrl: string;
    message?: string;
}
