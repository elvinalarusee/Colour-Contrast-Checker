const textColor = document.getElementById("textColor");
const bgColor = document.getElementById("bgColor");

const textHex = document.getElementById("textHex");
const bgHex = document.getElementById("bgHex");

const preview = document.getElementById("preview");

const ratioText = document.getElementById("ratio");

const aaNormal = document.getElementById("aaNormal");
const aaLarge = document.getElementById("aaLarge");

const aaaNormal = document.getElementById("aaaNormal");
const aaaLarge = document.getElementById("aaaLarge");

const swapBtn = document.getElementById("swapBtn");


/* Convert HEX colour to RGB */

function hexToRgb(hex) {

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    return [r, g, b];
}


/* Calculate colour luminance */

function getLuminance(r, g, b) {

    const values = [r, g, b].map(value => {

        value = value / 255;

        if (value <= 0.03928) {
            return value / 12.92;
        }

        return Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * values[0]
         + 0.7152 * values[1]
         + 0.0722 * values[2];
}


/* Calculate contrast ratio */

function getContrastRatio(color1, color2) {

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const luminance1 = getLuminance(...rgb1);
    const luminance2 = getLuminance(...rgb2);

    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);

    return (brightest + 0.05) / (darkest + 0.05);
}


/* Display PASS or FAIL */

function displayResult(element, pass) {

    if (pass) {

        element.textContent = "PASS";
        element.className = "pass";

    } else {

        element.textContent = "FAIL";
        element.className = "fail";
    }
}


/* Update the checker */

function updateContrast() {

    const text = textColor.value;
    const background = bgColor.value;

    /* Update preview */

    preview.style.color = text;
    preview.style.backgroundColor = background;

    /* Update HEX values */

    textHex.textContent = text.toUpperCase();
    bgHex.textContent = background.toUpperCase();

    /* Calculate contrast */

    const ratio = getContrastRatio(text, background);

    ratioText.textContent = ratio.toFixed(2) + ":1";

    /* WCAG results */

    displayResult(aaNormal, ratio >= 4.5);

    displayResult(aaLarge, ratio >= 3);

    displayResult(aaaNormal, ratio >= 7);

    displayResult(aaaLarge, ratio >= 4.5);
}


/* Change colours automatically */

textColor.addEventListener("input", updateContrast);

bgColor.addEventListener("input", updateContrast);


/* Swap colours */

swapBtn.addEventListener("click", function() {

    const temporaryColor = textColor.value;

    textColor.value = bgColor.value;

    bgColor.value = temporaryColor;

    updateContrast();
});


/* Run when page opens */

updateContrast();