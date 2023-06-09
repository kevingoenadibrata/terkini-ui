import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const {
    contentImage,
    contentFrame,
    contentTitle,
    contentCategory,
    setIsTitleButtonDisabled,
  } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (contentImage) {
      let loadedImageWidth = contentImage.width;
      let loadedImageHeight = contentImage.height;
      // get the scale
      // it is the min of the 2 ratios
      let scaleFactor = Math.max(
        canvas.width / loadedImageWidth,
        canvas.height / loadedImageHeight
      );

      // Finding the new width and height based on the scale factor
      let newWidth = loadedImageWidth * scaleFactor;
      let newHeight = loadedImageHeight * scaleFactor;

      // get the top left position of the image
      // in order to center the image within the canvas
      let x = canvas.width / 2 - newWidth / 2;
      let y = canvas.height / 2 - newHeight / 2;

      // When drawing the image, we have to scale down the image
      // width and height in order to fit within the canvas
      context.drawImage(contentImage, x, y, newWidth, newHeight);
    } else {
      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (contentFrame) {
      context.drawImage(contentFrame, 0, 0, 1080, 1080);
    }

    context.fillStyle = "#ffffff";
    context.font = "700 58px helvetica";
    const titleLines = getLines(context, contentTitle, 950);
    for (let i = 0; i < titleLines.length; i++) {
      const lineHeight = i * 70;
      context.fillText(titleLines[i], 80, 830 + lineHeight);
    }

    if (titleLines.length > 3) setIsTitleButtonDisabled(true);
    else setIsTitleButtonDisabled(false);

    context.font = "700 32px helvetica";
    const leftPadding = (280 - context.measureText(contentCategory).width) / 2;
    context.fillText(contentCategory, 270 + leftPadding, 122);
  }, [
    contentTitle,
    contentImage,
    contentCategory,
    contentFrame,
    setIsTitleButtonDisabled,
  ]);

  const getLines = (context, text, maxWidth) => {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  return (
    <canvas
      id="canvas-cover"
      ref={canvasRef}
      {...props}
      style={{
        width: "90vw",
        height: "90vw%",
        maxWidth: "500px",
        maxHeight: "500px",
        border: "2px solid black",
      }}
    />
  );
};

export default Canvas;
