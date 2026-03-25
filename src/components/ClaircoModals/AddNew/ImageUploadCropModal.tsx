import React, { useState, useCallback, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Row, Col, ProgressBar } from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import {
    convertPdfToImage,
    cropImageToBlob,
    getImageDimensions,
    calculateAspectRatio,
    formatFileSize,
    isValidFileType,
    isValidFileSize,
} from '../../../utils/imageProcessing';
import { ImageDimensions, CropArea } from '../../../types/imageCrop';
import { Spinner } from 'components';

type ImageUploadCropModalProps = {
    show: boolean;
    onClose: () => void;
    onUpload: (imageBlob: Blob, metadata: any) => Promise<void>;
    floorId?: string;
    floorName?: string;
};

type Stage = 'upload' | 'crop' | 'resize';

const ImageUploadCropModal: React.FC<ImageUploadCropModalProps> = ({ show, onClose, onUpload, floorId, floorName }) => {
    const [stage, setStage] = useState<Stage>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });

    // Crop state
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

    // Resize state
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [croppedPreview, setCroppedPreview] = useState<string>('');
    const [resizeWidth, setResizeWidth] = useState<number>(0);
    const [resizeHeight, setResizeHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);

    // Loading states
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string>('');

    // Reset all state when modal closes
    useEffect(() => {
        if (!show) {
            resetModal();
        }
    }, [show]);

    const resetModal = () => {
        setStage('upload');
        setSelectedFile(null);
        setImagePreview('');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setCroppedBlob(null);
        setCroppedPreview('');
        setError('');
        setIsProcessing(false);
        setIsUploading(false);
        setUploadProgress(0);
    };

    // Handle file selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        // Validate file type
        if (!isValidFileType(file)) {
            setError('Invalid file type. Please upload an image (JPG, PNG, GIF) or PDF file.');
            return;
        }

        // Validate file size
        if (!isValidFileSize(file, 25)) {
            setError('File size exceeds 25MB limit. Please choose a smaller file.');
            return;
        }

        setSelectedFile(file);
        setIsProcessing(true);

        try {
            let preview = '';

            // Handle PDF files
            if (file.type === 'application/pdf') {
                preview = await convertPdfToImage(file);
            } else {
                // Handle image files
                preview = URL.createObjectURL(file);
            }

            setImagePreview(preview);

            // Get image dimensions
            const dimensions = await getImageDimensions(file);
            setImageDimensions(dimensions);

            setIsProcessing(false);
        } catch (err) {
            console.error('Error processing file:', err);
            setError('Failed to process file. Please try again.');
            setIsProcessing(false);
        }
    };

    // Handle crop complete
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Move to crop stage
    const handleNextToCrop = () => {
        if (!imagePreview) {
            setError('Please select a file first.');
            return;
        }
        setStage('crop');
    };

    // Move to resize stage
    const handleNextToResize = async () => {
        if (!croppedAreaPixels || !imagePreview) {
            setError('Please complete the crop selection.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const cropArea: CropArea = {
                x: croppedAreaPixels.x,
                y: croppedAreaPixels.y,
                width: croppedAreaPixels.width,
                height: croppedAreaPixels.height,
            };

            const blob = await cropImageToBlob(imagePreview, cropArea);
            setCroppedBlob(blob);

            // Create preview URL
            const previewUrl = URL.createObjectURL(blob);
            setCroppedPreview(previewUrl);

            // Set initial resize dimensions
            setResizeWidth(cropArea.width);
            setResizeHeight(cropArea.height);

            setStage('resize');
            setIsProcessing(false);
        } catch (err) {
            console.error('Error cropping image:', err);
            setError('Failed to crop image. Please try again.');
            setIsProcessing(false);
        }
    };

    // Handle resize width change
    const handleWidthChange = (newWidth: number) => {
        setResizeWidth(newWidth);

        if (maintainAspectRatio && croppedBlob) {
            const dimensions = calculateAspectRatio(resizeWidth, resizeHeight, newWidth, undefined);
            setResizeHeight(dimensions.height);
        }
    };

    // Handle resize height change
    const handleHeightChange = (newHeight: number) => {
        setResizeHeight(newHeight);

        if (maintainAspectRatio && croppedBlob) {
            const dimensions = calculateAspectRatio(resizeWidth, resizeHeight, undefined, newHeight);
            setResizeWidth(dimensions.width);
        }
    };

    // Handle final upload
    const handleUpload = async () => {
        if (!croppedBlob || !selectedFile) {
            setError('No image to upload.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            // Create metadata
            const metadata = {
                originalFileName: selectedFile.name,
                dimensions: {
                    width: resizeWidth,
                    height: resizeHeight,
                },
                uploadedAt: new Date().toISOString(),
                fileSize: croppedBlob.size,
            };

            // Simulate progress (you can enhance this with actual upload progress)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 100);

            await onUpload(croppedBlob, metadata);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Close modal after successful upload
            setTimeout(() => {
                resetModal();
                onClose();
            }, 500);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Render upload stage
    const renderUploadStage = () => (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Select Floor Image or PDF</Form.Label>
                <Form.Control type="file" accept="image/*,.pdf" onChange={handleFileChange} disabled={isProcessing} />
                <Form.Text className="text-muted">Supported formats: JPG, PNG, GIF, PDF (max 25MB)</Form.Text>
            </Form.Group>

            {isProcessing && (
                <div className="text-center my-3">
                    <Spinner className="text-primary m-2" color="primary" />
                    <p>Processing file...</p>
                </div>
            )}

            {imagePreview && !isProcessing && (
                <div className="mb-3">
                    <Form.Label>Preview</Form.Label>
                    <div className="border rounded p-2" style={{ maxHeight: '400px', overflow: 'auto' }}>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                    <div className="mt-2">
                        <small className="text-muted">
                            <strong>File:</strong> {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                            <br />
                            <strong>Dimensions:</strong> {imageDimensions.width} × {imageDimensions.height} px
                        </small>
                    </div>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleNextToCrop}
                    disabled={!imagePreview || isProcessing}
                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                    Next: Crop Image
                </Button>
            </div>
        </>
    );

    // Render crop stage
    const renderCropStage = () => (
        <>
            <div className="mb-3">
                <Form.Label>Crop Image</Form.Label>
                <div className="position-relative border rounded" style={{ height: '400px', backgroundColor: '#333' }}>
                    <Cropper
                        image={imagePreview}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
            </div>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Zoom: {zoom.toFixed(1)}x</Form.Label>
                        <Form.Range
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Aspect Ratio</Form.Label>
                        <Form.Select
                            value={aspectRatio || 'free'}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'free') {
                                    setAspectRatio(undefined);
                                } else {
                                    setAspectRatio(parseFloat(value));
                                }
                            }}>
                            <option value="free">Free</option>
                            <option value={16 / 9}>16:9</option>
                            <option value={4 / 3}>4:3</option>
                            <option value={1}>1:1</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setStage('upload')}>
                    Back
                </Button>
                <Button
                    variant="primary"
                    onClick={handleNextToResize}
                    disabled={!croppedAreaPixels || isProcessing}
                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                    {isProcessing ? 'Processing...' : 'Next: Resize'}
                </Button>
            </div>
        </>
    );

    // Render resize stage
    const renderResizeStage = () => (
        <>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label>Cropped Preview</Form.Label>
                    <div className="border rounded p-2" style={{ maxHeight: '300px', overflow: 'auto' }}>
                        {croppedPreview && (
                            <img
                                src={croppedPreview}
                                alt="Cropped preview"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        )}
                    </div>
                    {croppedBlob && (
                        <small className="text-muted mt-2 d-block">Size: {formatFileSize(croppedBlob.size)}</small>
                    )}
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Resize Dimensions</Form.Label>
                        <div className="d-flex align-items-center mb-2">
                            <Form.Check
                                type="checkbox"
                                label="Maintain aspect ratio"
                                checked={maintainAspectRatio}
                                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            />
                        </div>
                        <Row>
                            <Col>
                                <Form.Label>Width (px)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={resizeWidth}
                                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                    min={500}
                                    max={8000}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Height (px)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={resizeHeight}
                                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                    min={500}
                                    max={8000}
                                    disabled={maintainAspectRatio}
                                />
                            </Col>
                        </Row>
                        <Form.Text className="text-muted">Min: 500px, Max: 8000px</Form.Text>
                    </Form.Group>
                </Col>
            </Row>

            {isUploading && (
                <div className="mb-3">
                    <Form.Label>Uploading...</Form.Label>
                    <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} animated />
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setStage('crop')} disabled={isUploading}>
                    Back
                </Button>
                <Button
                    variant="success"
                    onClick={handleUpload}
                    disabled={!croppedBlob || isUploading}
                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                    {isUploading ? 'Uploading...' : 'Upload Floor Image'}
                </Button>
            </div>
        </>
    );

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="lg"
            aria-labelledby="image-upload-crop-modal"
            className="modal-center"
            centered
            backdrop={isUploading ? 'static' : true}
            keyboard={!isUploading}>
            <Modal.Header
                closeButton={!isUploading}
                className="justify-content-center"
                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title className="text-white text-center">
                    Upload Floor Image {floorName && `- ${floorName}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {stage === 'upload' && renderUploadStage()}
                {stage === 'crop' && renderCropStage()}
                {stage === 'resize' && renderResizeStage()}
            </Modal.Body>
        </Modal>
    );
};

export default ImageUploadCropModal;
