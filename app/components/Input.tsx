export default function Input({ label, ...props }: any) {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px',
    };

    const labelStyle = {
        fontSize: '0.875rem',
        color: '#52525b',
        fontWeight: '600',
    };

    const inputStyle = {
        background: '#fff',
        border: '1px solid #e4e4e7',
        borderRadius: '8px',
        padding: '12px 16px',
        color: '#000',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        width: '100%',
    };

    return (
        <div style={containerStyle as any}>
            {label && <label style={labelStyle}>{label}</label>}
            <input
                style={{ ...inputStyle, ...props.style }}
                onFocus={(e) => e.target.style.borderColor = '#000'}
                onBlur={(e) => e.target.style.borderColor = '#e4e4e7'}
                {...props}
            />
        </div>
    );
}
