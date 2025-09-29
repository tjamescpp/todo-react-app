// components/LoadingSpinner.js
export default function LoadingSpinner({ size = 30, color = 'black' }) {
    const spinnerStyle = {
        width: `${size}px`,
        height: `${size}px`,
        border: `2px solid #f3f3f3`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <div style={spinnerStyle}></div>
            <style jsx="true">{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
