/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0B0F19', // Deepest background
                    800: '#111827', // Card background
                    700: '#1F2937', // Hover/Active
                },
                primary: {
                    400: '#34D399', // Emerald Green (Growth)
                    500: '#10B981',
                    600: '#059669',
                },
                accent: {
                    400: '#A78BFA', // Soft Purple (AI/Premium)
                    500: '#8B5CF6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
