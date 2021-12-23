/**
 * Save a cookie containing the current position of the slider
 */
function saveSlider() {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + (365*24*60*60*1000));
    let expires = "expires="+ expiration.toUTCString();
    let slideValue = document.getElementById("n").value;
    document.cookie = "slider=" + slideValue + ";" + expires + ";SameSite=Lax";
}

/**
 * Load the cookie containing the last position of the slider
 */
function loadSlider() {
    cookie = document.cookie.split(';')[0];
    if (cookie) {
        document.getElementById("n").value = cookie.split('=')[1];
    }
    document.cookie.split(';')[0].split('=')[1]
}