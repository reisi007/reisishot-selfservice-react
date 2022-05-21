function extensions() {
    return ['hover', 'focus', 'disabled', 'visited']
}

module.exports = {
    content: ["./src/**/*.{html,ts,tsx}", "./public/**/*.html"],
    theme: {
        extend: {
            fontWeight: extensions(),
            fontFamily: {
                sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Liberation Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
            },
            colors: {
                reisishot: {
                    DEFAULT: '#27ae60',
                    light: '#2ecc71'
                }
            },
            screens: {
                'xxl': '1400px'
            }
        },
    },
    plugins: [],
}
