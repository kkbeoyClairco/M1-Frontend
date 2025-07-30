import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from 'react-bootstrap';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class KonvaErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Konva Error Boundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Alert variant="danger" className="m-3">
                    <Alert.Heading>Canvas Error</Alert.Heading>
                    <p>Something went wrong with the drawing canvas. This might be due to:</p>
                    <ul>
                        <li>Browser compatibility issues</li>
                        <li>Invalid image data</li>
                        <li>Memory constraints</li>
                    </ul>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => this.setState({ hasError: false, error: undefined })}>
                            Try Again
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-3">
                            <summary>Error Details (Development Only)</summary>
                            <pre className="mt-2 p-2 bg-light border rounded">{this.state.error?.stack}</pre>
                        </details>
                    )}
                </Alert>
            );
        }

        return this.props.children;
    }
}
