export const getRazorpayTheme  = ()=>{
    const isDarkMode =  window.matchMedia("(prefers-color-scheme: dark)").matches;
    return {
        color: isDarkMode ? "#f16f21" : "#f16f21"
    }
}