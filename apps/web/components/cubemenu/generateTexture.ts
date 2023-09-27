import * as THREE from "three";

export default function generateTexture(texts: string[]) {
  const canvases = [];
  const bgColors: string[] = ["#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5"];
  const textColor = "#6D278E";

  for (let i = 0; i < texts.length; i++) {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.style.borderRadius = "10px";
    canvas.width = 256;
    canvas.height = 256;
    // Get the 2D rendering context of the canvas
    const context: any = canvas.getContext("2d");
    // Set background color
    context.fillStyle = bgColors[i];
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Set the font style
    let fontSize = 30;
    context.font = `bold ${fontSize}px Arial`;
    // Set the maximum text width
    const maxWidth = canvas.width;
    // Split the text into words
    const words = texts[i].split(" ");
    // Create an array to hold the lines of text
    const lines = [];
    // Set the initial line
    let line = words[0];
    // Loop through each word starting from the second word
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const lineWithWord = line + " " + word;
      const lineWidth = context.measureText(lineWithWord).width;
      // Check if the line with the new word exceeds the maximum width
      if (lineWidth > maxWidth) {
        // Add the current line to the lines array
        lines.push(line);
        // Start a new line with the current word
        line = word;
      } else {
        // Add the word to the current line
        line = lineWithWord;
      }
    }
    // Add the last line to the lines array
    lines.push(line);

    let maxLengthText = "";
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > maxLengthText.length) {
        maxLengthText = lines[i];
      }
    }

    // Set the initial text width
    let textWidth = context.measureText(maxLengthText).width;

    // Reduce the font size until the text fits within the canvas width
    while (textWidth > maxWidth && fontSize > 0) {
      fontSize--;
      context.font = `bold ${fontSize}px Arial`;
      textWidth = context.measureText(maxLengthText).width;
    }

    // Set the initial y position
    let y = (canvas.height - fontSize * lines.length) / 2 + fontSize / 2;
    // Loop through each line and draw it on the canvas
    context.fillStyle = textColor;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const textWidth = context.measureText(line).width;
      // Calculate the x position to center the text
      const x = (canvas.width - textWidth) / 2;
      context.fillText(line, x, y);
      // Update the y position
      y += fontSize;
    }

    // Create a texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    // texture.mapping = THREE.EquirectangularReflectionMapping;
    // texture.generateMipmaps = true;
    texture.needsUpdate = true;

    // Create a material using the texture
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    canvases.push(material);
  }

  return canvases;
}
