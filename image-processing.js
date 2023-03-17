let startTime, endTime;

async function processImage() {
    startTime = performance.now();

    // Get image data from API
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const json = await response.json();
    const imageUrl = json.message;

    // Convert JSON object to string
    const jsonString = JSON.stringify(json);

    // Create a div element
    const div = document.createElement('div');

    // Insert the JSON string into the div's innerHTML
    div.innerHTML = jsonString;

    // Add the div to the body
    document.body.appendChild(div);

    // Create image element and set source
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";

    // Add the image to the body
    document.body.appendChild(image);

    endTime = performance.now();

    // Timer 1
    var results = document.createElement('p');
    results.innerHTML = 'Step 1: ' + (endTime - startTime).toFixed(0) + ' ms - fetch the json and show image';
    document.body.appendChild(results);

    startTime = performance.now();

    // Wait for image to load
    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image on canvas
    ctx.drawImage(image, 0, 0);

    // Mirror image by swapping pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvas.width / 2; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const leftPixelIndex = (x + y * canvas.width) * 4;
            const rightPixelIndex = (canvas.width - x - 1 + y * canvas.width) * 4;
            for (let i = 0; i < 4; i++) {
                const leftPixelValue = imageData.data[leftPixelIndex + i];
                imageData.data[leftPixelIndex + i] = imageData.data[rightPixelIndex + i];
                imageData.data[rightPixelIndex + i] = leftPixelValue;
            }
        }
    }

    // Put the image data back on canvas
    ctx.putImageData(imageData, 0, 0);

    // Append canvas to body
    document.body.appendChild(canvas);

    endTime = performance.now();

    // Timer 2
    var results = document.createElement('p');
    results.innerHTML = 'Step 2: ' + (endTime - startTime).toFixed(0) + ' ms - mirror the image';
    document.body.appendChild(results);

    startTime = performance.now();

    // Set the new width and height
    const newWidth = canvas.width * 2;
    const newHeight = canvas.height * 2;

    // Get the original width and height of the image
    const originalWidth = imageData.width;
    const originalHeight = imageData.height;

    // Create a new image data object with the new dimensions
    const newImageData = new ImageData(newWidth, newHeight);

    // Calculate the scaling factors
    const xScale = newWidth / originalWidth;
    const yScale = newHeight / originalHeight;

    // Iterate through the new image data
    for (let x = 0; x < newWidth; x++) {
        for (let y = 0; y < newHeight; y++) {
            // Calculate the corresponding pixel in the original image
            const originalX = Math.floor(x / xScale);
            const originalY = Math.floor(y / yScale);

            // Get the pixel index in the original image
            const originalPixelIndex = (originalY * originalWidth + originalX) * 4;

            // Get the pixel index in the new image
            const newPixelIndex = (y * newWidth + x) * 4;

            // Copy the pixel data from the original image to the new image
            for (let i = 0; i < 4; i++) {
                newImageData.data[newPixelIndex + i] = imageData.data[originalPixelIndex + i];
            }
        }
    }
    
    // Put the image data back on canvas
    ctx.putImageData(newImageData, 0, 0);

    // Append canvas to body
    document.body.appendChild(canvas);

    endTime = performance.now();

    // Timer 3
    var results = document.createElement('p');
    results.innerHTML = 'Step 3: ' + (endTime - startTime).toFixed(0) + ' ms - zoom in on the image using the pixel replication method';
    document.body.appendChild(results);
}
