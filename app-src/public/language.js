window.translate = (str) => {
    if (!window.translationStrings) {
        window.translationStrings = {};
    }

    return window.translationStrings[str] || str;
};
