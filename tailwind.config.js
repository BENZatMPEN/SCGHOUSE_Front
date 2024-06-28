/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "light-gray-01": "#f7f7f7",
                "light-gray-02": "#696687",
                "dark-01": "#333",
                "dark-blue-01": "#001529",
                "purple-01": "#9c27b0",
                "light-purple-01": "#f0eef7",
                "red-01": "#cc0000",
                "red": "#ff0000",
            },
        },
    },
    plugins: [],
};
