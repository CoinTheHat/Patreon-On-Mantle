export default function Button({ children, onClick, variant = 'primary', className = '', ...props }: any) {
    const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#65b3ad] text-white hover:bg-[#4d8f8a] focus:ring-[#65b3ad]",
        secondary: "bg-[#1a1d24] text-white border border-[#2e333d] hover:border-[#65b3ad] focus:ring-[#2e333d]",
        outline: "bg-transparent text-[#65b3ad] border border-[#65b3ad] hover:bg-[#65b3ad] hover:text-white"
    };

    // Note: Since we are not using Tailwind, we need inline styles or global CSS classes. 
    // However, for this Hackathon MVP with "Vanilla CSS" requirement but creating Next.js app, 
    // I will use inline styles mapping for simplicity if Tailwind is disabled, 
    // OR rely on the globals.css classes I should define.

    // Actually, I should use CSS modules or global classes. 
    // Let's use inline styles tailored for the "premium" feel to ensure it looks good immediately without complex CSS file management for now.

    const styles: any = {
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    };

    if (variant === 'primary') {
        styles.background = '#000';
        styles.color = '#fff';
        styles.border = '1px solid #000';
    } else if (variant === 'secondary') {
        styles.background = '#fff';
        styles.color = '#000';
        styles.border = '1px solid #e4e4e7';
    } else if (variant === 'outline') {
        styles.background = 'transparent';
        styles.color = '#000';
        styles.border = '1px solid #e4e4e7';
    }

    const handleMouseEnter = (e: any) => {
        if (props.disabled) return;
        if (variant === 'primary') {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = '#333';
        } else if (variant === 'secondary' || variant === 'outline') {
            e.currentTarget.style.borderColor = '#000';
            e.currentTarget.style.background = '#f4f4f5';
        }
    };

    const handleMouseLeave = (e: any) => {
        if (props.disabled) return;
        if (variant === 'primary') {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = '#000';
        } else if (variant === 'secondary') {
            e.currentTarget.style.borderColor = '#e4e4e7';
            e.currentTarget.style.background = '#fff';
        } else if (variant === 'outline') {
            e.currentTarget.style.borderColor = '#e4e4e7';
            e.currentTarget.style.background = 'transparent';
        }
    };

    return (
        <button
            onClick={onClick}
            style={{ ...styles, ...props.style }}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </button>
    );
}
