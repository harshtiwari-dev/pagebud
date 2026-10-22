function Logo({ size = 28 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            focusable="false"
        >
            <rect x="5" y="10" width="22" height="19" rx="4" fill="var(--accent)" />

            <rect x="3" y="14" width="5" height="2.4" rx="1.2" fill="var(--success)" />
            <rect x="3" y="19" width="5" height="2.4" rx="1.2" fill="var(--success)" />
            <rect x="3" y="24" width="5" height="2.4" rx="1.2" fill="var(--success)" />

            <rect x="11" y="15" width="12" height="2" rx="1" fill="#FBF9F4" />
            <rect x="11" y="19.5" width="12" height="2" rx="1" fill="#FBF9F4" />
            <rect x="11" y="24" width="5" height="2" rx="1" fill="#FBF9F4" />
            <path
                d="M18.5 24.3l1.6 1.6 3.2-3.4"
                stroke="#FBF9F4"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path d="M16 10V6.5" stroke="var(--success)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M16 7.6C16 4.6 12.6 3.6 10 4.6C10 7.2 12.6 8.4 16 7.6Z" fill="var(--success)" />
            <path d="M16 6.6C16 3 19.2 1.6 23 2.2C23 5.8 19.8 7.8 16 6.6Z" fill="var(--success)" />
        </svg>
    );
}

export default Logo;