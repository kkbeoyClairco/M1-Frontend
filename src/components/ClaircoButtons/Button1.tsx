import classNames from 'classnames';

interface ButtonProps {
    variant?: string;
    size?: string;
    disabled?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant, size, disabled, onClick, children, className }) => {
    const buttonClass = classNames('btn', `btn-${variant}`, size && `btn-${size}`, className);

    return (
        <button
            style={{ background: '#008675', color: 'white' }}
            className={buttonClass}
            disabled={disabled}
            onClick={onClick}
            type="button">
            {children}
        </button>
    );
};
export default Button;
