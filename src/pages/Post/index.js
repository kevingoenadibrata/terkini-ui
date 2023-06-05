import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import Canvas from "../../components/Canvas";
import CanvasContent from "../../components/CanvasContent";
import endingImg from "../../components/CanvasContent/End Slide.png";
import { addNewlineOnPeriod, fetchImages, fetchPost } from "./lib";
import SuggestedImages from "./SuggestedImages";

const Post = () => {
  const { postId } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imageQuery, setImageQuery] = useState("");
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [frame, setFrame] = useState(null);
  const [frame2, setFrame2] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = require("../../components/Canvas/Cover.png");
    setFrame(img);

    const img2 = new Image();
    img2.src = require("../../components/CanvasContent/Frame2.png");
    setFrame2(img2);
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPost(postId);

      if (!data) {
        return;
      }

      // Set data according to fetched data
      setTitle(data.title);
      setContent(addNewlineOnPeriod(data.content));
      setCaption(addNewlineOnPeriod(data.caption));
      setCategory(data.category);
      setImageQuery(data.image_query);
    };

    getData();
  }, [postId]);

  useEffect(() => {
    const getImages = async () => {
      const images = await fetchImages(imageQuery);

      if (!images) {
        return;
      }

      setSuggestedImages(images);
    };

    // Skip fetching if imageQuery is empty
    if (!imageQuery) {
      return;
    }

    getImages();
  }, [imageQuery]);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      setImage(img);
    };
    try {
      reader.readAsDataURL(e.target.files[0]);
    } catch (e) {
      console.error("error uploading image", e);
    }
  };

  const handleDownload = useCallback(async () => {
    setIsDownloadDisabled(true);

    try {
      const zip = new JSZip();
      const coverCanvas = document.getElementById("canvas-cover");
      const contentCanvas = document.getElementById("canvas-content");

      const coverBlob = await new Promise((resolve) =>
        coverCanvas.toBlob(resolve, "image/png")
      );
      const contentBlob = await new Promise((resolve) =>
        contentCanvas.toBlob(resolve, "image/png")
      );

      const endingImgBlob = await fetch(endingImg).then((res) => res.blob());

      zip.file("1 Cover.png", coverBlob);
      zip.file("2 Content.png", contentBlob);
      zip.file("3 End Cover.png", endingImgBlob, { binary: true });

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(zipBlob, "download.zip");
      setIsDownloadDisabled(false);
    } catch (error) {
      console.error("Failed to download zip file", error);
      setIsDownloadDisabled(false);
    }
  }, []);

  // Set selected image to state and prepare image for canvas
  const handleImageSelect = (image) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    setImage(img);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopyMessage("Caption copied to clipboard!");

    // Hide message after 5 seconds of showing
    setTimeout(() => {
      setCopyMessage("");
    }, 5000);
  };

  return (
    <>
      <h1>Instagram Post Generator</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Canvas
          contentTitle={title}
          contentCategory={category}
          contentImage={image}
          contentFrame={frame}
          setIsTitleButtonDisabled={setIsDownloadDisabled}
          width={1080}
          height={1080}
        />
        <CanvasContent
          contentContent={content}
          contentCategory={category}
          contentFrame={frame2}
          setIsContentButtonDisabled={setIsDownloadDisabled}
          width={1080}
          height={1080}
        />
      </div>
      <div className="groupInput">
        <h2>Cover Image</h2>
        <input
          className="input"
          type="file"
          id="imageLoader"
          name="imageLoader"
          onChange={handleImageUpload}
        />
      </div>
      <SuggestedImages images={suggestedImages} onSelect={handleImageSelect} />
      <div className="groupInput">
        <h2>Title</h2>
        <textarea
          className="input"
          rows="4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {isDownloadDisabled && (
          <p className="warning">
            Your title is too long, please reduce to have less lines
          </p>
        )}
      </div>
      <div className="groupInput">
        <h2>Category</h2>
        <input
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="groupInput">
        <h2>Content</h2>
        <textarea
          className="input"
          rows="18"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {isDownloadDisabled && (
          <p className="warning">
            Your content is too long, please reduce to have less lines
          </p>
        )}
      </div>
      <div
        className="groupInput"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <button disabled={isDownloadDisabled} onClick={handleDownload}>
          Download Cover & Content
        </button>
      </div>
      <div className="groupInput">
        <h2>Caption</h2>
        <textarea
          className="input"
          rows="18"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      <div
        className="groupInput"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <button onClick={handleCopyCaption}>Copy Caption</button>
        {copyMessage && <p style={{ marginTop: "8px" }}>{copyMessage}</p>}
      </div>
    </>
  );
};

export default Post;
