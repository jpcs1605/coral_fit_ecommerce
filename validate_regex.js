function normalizeImageUrl(url) {
    if (!url) return "";

    // Se já for uma URL do Google Drive direta, mantém
    if (url.includes("lh3.googleusercontent.com")) return url;

    // Extrair ID do Google Drive
    let id = "";

    // Padrão 1: drive.google.com/uc?export=view&id=XXX
    const matchId = url.match(/[?&]id=([^&]+)/);
    if (matchId) {
        id = matchId[1];
    }
    // Padrão 2: drive.google.com/file/d/XXX/view
    else {
        const matchFileId = url.match(/\/d\/([^/]+)/);
        if (matchFileId) {
            id = matchFileId[1];
        }
    }

    if (id) {
        return `https://lh3.googleusercontent.com/d/${id}`;
    }

    return url;
}

const testCases = [
    "https://drive.google.com/uc?export=view&id=1M6DbdtzomV2nEC7d8xPX-cXSARjNkGKY",
    "https://drive.google.com/file/d/1M6DbdtzomV2nEC7d8xPX-cXSARjNkGKY/view?usp=sharing",
    "https://lh3.googleusercontent.com/d/1M6DbdtzomV2nEC7d8xPX-cXSARjNkGKY",
    "https://example.com/image.jpg"
];

console.log("Testing Normalization:");
testCases.forEach(url => {
    console.log(`${url} -> ${normalizeImageUrl(url)}`);
});
