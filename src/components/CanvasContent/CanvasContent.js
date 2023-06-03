import React, { useRef, useEffect } from "react";

const CanvasContent = (props) => {
  const {
    contentContent,
    contentFrame,
    contentCategory,
    setIsContentButtonDisabled,
  } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (contentFrame) {
      context.drawImage(contentFrame, 0, 0, 1080, 1080);
    }

    context.fillStyle = "#ffffff";
    context.font = "300 42px helvetica";
    let lines = [];
    const newLines = contentContent.split("\n");
    for (let line = 0; line < newLines.length; line++) {
      const parsed = getLines(context, newLines[line], 900);
      lines = [...lines, ...parsed];
    }

    if (lines.length > 14) setIsContentButtonDisabled(true);
    else setIsContentButtonDisabled(false);

    for (let i = 0; i < lines.length; i++) {
      const lineHeight = i * 55;
      context.fillText(lines[i], 90, 250 + lineHeight);
    }

    context.font = "700 32px helvetica";
    const leftPadding = (280 - context.measureText(contentCategory).width) / 2;
    context.fillText(contentCategory, 270 + leftPadding, 122);
  }, [
    contentContent,
    contentCategory,
    contentFrame,
    setIsContentButtonDisabled,
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
      id="canvas-content"
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

export default CanvasContent;
