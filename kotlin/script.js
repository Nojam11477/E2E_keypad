document.addEventListener('DOMContentLoaded', () => {
    const imageDirPath = 'mnt/data';
    const images = [
        '0.png',
        '1.png',
        '2.png',
        '3.png',
        '4.png',
        '5.png',
        '6.png',
        '7.png',
        '8.png',
        '9.png',
        '', // 빈칸
        ''  // 빈칸
    ];

    // 이미지 배열을 셔플하는 함수
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 이미지 배열 셔플
    shuffle(images);

    const canvas = document.getElementById('combined-image');
    const ctx = canvas.getContext('2d');
    const imageSize = 150; // 각 이미지의 크기 (150x150 픽셀)

    let imagesLoaded = 0;
    images.forEach((image, index) => {
        if (image === '') {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                processImage();
            }
            return; // 빈칸은 건너뜀
        }

        const img = new Image();
        img.src = `${imageDirPath}/${image}`;
        img.onload = () => {
            const x = (index % 3) * imageSize;
            const y = Math.floor(index / 3) * imageSize;
            ctx.drawImage(img, x, y, imageSize, imageSize);
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                processImage();
            }
        };
    });

    function processImage() {
        // Canvas를 base64로 인코딩
        const dataURL = canvas.toDataURL('image/png');

        // base64 문자열에서 해시값 계산
        sha256(dataURL).then(hash => {
            console.log('Base64 Encoded Image:', dataURL);
            console.log('SHA-256 Hash:', hash);
        });
    }

    // SHA-256 해시 계산 함수
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});
