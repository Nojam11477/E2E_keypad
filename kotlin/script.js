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

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(images);

    const imageSize = 150;
    const imagesPerRow = 3;
    const rows = 4;

    const imageCanvas = document.getElementById('image-canvas');
    const circleCanvas = document.getElementById('circle-canvas');

    const imageCtx = imageCanvas.getContext('2d');
    const circleCtx = circleCanvas.getContext('2d');

    if (!imageCanvas || !imageCtx || !circleCanvas || !circleCtx) {
        console.error('Failed to initialize canvas or context');
        return;
    }

    const circleRadius = 30;
    const circleSpacing = 20;
    const circles = [];
    let filledCircles = 0;

    let imagesLoaded = 0;
    const clickedIndices = [];

    // Create an off-screen canvas to combine images
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = imagesPerRow * imageSize;
    offscreenCanvas.height = rows * imageSize;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    images.forEach((image, index) => {
        if (image === '') {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                finalizeAndDrawImage();
            }
            return;
        }

        const img = new Image();
        img.src = `${imageDirPath}/${image}`;
        img.onload = () => {
            const x = (index % imagesPerRow) * imageSize;
            const y = Math.floor(index / imagesPerRow) * imageSize;
            offscreenCtx.drawImage(img, x, y, imageSize, imageSize);
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                finalizeAndDrawImage();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${image}`);
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                finalizeAndDrawImage();
            }
        };
    });

    function finalizeAndDrawImage() {
        // Draw the combined image onto the main canvas
        imageCtx.drawImage(offscreenCanvas, 0, 0);
        drawCircles();
    }

    function drawCircles() {
        const totalCircleWidth = circleRadius * 2 * 6 + circleSpacing * 5;
        const startX = (circleCanvas.width - totalCircleWidth) / 2 + circleRadius;
        const y = circleCanvas.height / 2;

        for (let i = 0; i < 6; i++) {
            const x = startX + i * (circleRadius * 2 + circleSpacing);
            circles.push({ x, y });
            circleCtx.beginPath();
            circleCtx.arc(x, y, circleRadius, 0, Math.PI * 2);
            circleCtx.lineWidth = 5;
            circleCtx.strokeStyle = 'blue';
            circleCtx.stroke();
        }
    }

    function fillCircle(index) {
        if (index >= 0 && index < circles.length) {
            const { x, y } = circles[index];
            circleCtx.beginPath();
            circleCtx.arc(x, y, circleRadius, 0, Math.PI * 2);
            circleCtx.fillStyle = 'blue';
            circleCtx.fill();
            circleCtx.lineWidth = 5;
            circleCtx.strokeStyle = 'blue';
            circleCtx.stroke();
        }
    }

    function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        return crypto.subtle.digest('SHA-256', msgBuffer).then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        });
    }

    imageCanvas.addEventListener('click', async (event) => {
        const rect = imageCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / imageSize);
        const row = Math.floor(y / imageSize);
        const clickedIndex = row * imagesPerRow + col;

        if (images[clickedIndex] !== '' && filledCircles < 6) {
            clickedIndices.push(clickedIndex);
            fillCircle(filledCircles);
            filledCircles++;

            if (filledCircles === 6) {
                const hashes = await Promise.all(clickedIndices.map(index => sha256(index.toString())));
                alert(hashes.join('\n'));
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        }
    });
});
