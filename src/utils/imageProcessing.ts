import * as pdfjsLib from 'pdfjs-dist';
import { CropArea, ImageDimensions } from '../types/imageCrop';

// Configure PDF.js worker - use local worker file from public folder
// This avoids CDN availability issues and version mismatches
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

/**
 * Convert the first page of a PDF file to an image data URL
 * @param file - PDF file to convert
 * @returns Promise resolving to base64 image data URL
 */
export const convertPdfToImage = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        // Get the first page
        const page = await pdf.getPage(1);

        // Set scale for better quality
        const scale = 2.0;
        const viewport = page.getViewport({ scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Failed to get canvas context');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
        };

        await page.render(renderContext).promise;

        // Convert canvas to data URL
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Error converting PDF to image:', error);
        throw new Error('Failed to convert PDF to image. Please ensure the file is a valid PDF.');
    }
};

/**
 * Crop an image based on the crop area and convert to JPG blob
 * @param imageSrc - Source image URL or data URL
 * @param cropArea - Crop area in pixels
 * @param quality - JPG quality (0-1), default 0.9
 * @returns Promise resolving to cropped image as Blob
 */
export const cropImageToBlob = async (imageSrc: string, cropArea: CropArea, quality: number = 0.9): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            try {
                // Create canvas for cropping
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Set canvas size to crop area
                canvas.width = cropArea.width;
                canvas.height = cropArea.height;

                // Draw cropped portion of image
                ctx.drawImage(
                    image,
                    cropArea.x,
                    cropArea.y,
                    cropArea.width,
                    cropArea.height,
                    0,
                    0,
                    cropArea.width,
                    cropArea.height
                );

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to create blob from canvas'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            } catch (error) {
                reject(error);
            }
        };

        image.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        image.src = imageSrc;
    });
};

/**
 * Resize an image blob while maintaining aspect ratio
 * @param blob - Image blob to resize
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPG quality (0-1), default 0.9
 * @returns Promise resolving to resized image as Blob
 */
export const resizeImage = async (
    blob: Blob,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.9
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const image = new Image();

        image.onload = () => {
            try {
                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = image;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }

                // Create canvas with new dimensions
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw resized image
                ctx.drawImage(image, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (newBlob) => {
                        URL.revokeObjectURL(url);
                        if (newBlob) {
                            resolve(newBlob);
                        } else {
                            reject(new Error('Failed to create blob from canvas'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            } catch (error) {
                URL.revokeObjectURL(url);
                reject(error);
            }
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for resizing'));
        };

        image.src = url;
    });
};

/**
 * Get image dimensions from a file
 * @param file - Image file or blob
 * @returns Promise resolving to image dimensions
 */
export const getImageDimensions = (file: File | Blob): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve({
                width: image.width,
                height: image.height,
            });
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        image.src = url;
    });
};

/**
 * Calculate dimensions maintaining aspect ratio
 * @param currentWidth - Current width
 * @param currentHeight - Current height
 * @param newWidth - New width (optional)
 * @param newHeight - New height (optional)
 * @returns New dimensions maintaining aspect ratio
 */
export const calculateAspectRatio = (
    currentWidth: number,
    currentHeight: number,
    newWidth?: number,
    newHeight?: number
): ImageDimensions => {
    const aspectRatio = currentWidth / currentHeight;

    if (newWidth && !newHeight) {
        return {
            width: newWidth,
            height: Math.round(newWidth / aspectRatio),
        };
    }

    if (newHeight && !newWidth) {
        return {
            width: Math.round(newHeight * aspectRatio),
            height: newHeight,
        };
    }

    return {
        width: currentWidth,
        height: currentHeight,
    };
};

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file type for image upload
 * @param file - File to validate
 * @returns Boolean indicating if file type is valid
 */
export const isValidFileType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    return validTypes.includes(file.type);
};

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default 25)
 * @returns Boolean indicating if file size is valid
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 25): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};
