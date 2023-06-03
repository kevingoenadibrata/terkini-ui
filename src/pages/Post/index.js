import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import Canvas from "../../components/Canvas";
import CanvasContent from "../../components/CanvasContent";
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
  const [isContentButtonDisabled, setIsContentButtonDisabled] = useState(false);
  const [isTitleButtonDisabled, setIsTitleButtonDisabled] = useState(false);

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
    setIsTitleButtonDisabled(true);
    setIsContentButtonDisabled(true);

    const zip = new JSZip();
    const coverCanvas = document.getElementById("canvas-cover");
    const contentCanvas = document.getElementById("canvas-content");

    const coverBlob = await new Promise((resolve) =>
      coverCanvas.toBlob(resolve, "image/png")
    );
    const contentBlob = await new Promise((resolve) =>
      contentCanvas.toBlob(resolve, "image/png")
    );

    zip.file("cover.png", coverBlob);
    zip.file("content.png", contentBlob);

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "download.zip");
      setIsTitleButtonDisabled(false);
      setIsContentButtonDisabled(false);
    });
  }, []);

  // Set selected image to state and prepare image for canvas
  const handleImageSelect = (image) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    setImage(img);
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
          setIsTitleButtonDisabled={setIsTitleButtonDisabled}
          width={1080}
          height={1080}
        />
        <CanvasContent
          contentContent={content}
          contentCategory={category}
          contentFrame={frame2}
          setIsContentButtonDisabled={setIsContentButtonDisabled}
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

      <div className="groupInput">
        <button disabled={isTitleButtonDisabled} onClick={handleDownload}>
          Download Cover & Content
        </button>
      </div>
      <div className="groupInput">
        {isContentButtonDisabled && (
          <p className="warning">
            Your content is too long, please reduce to have less lines
          </p>
        )}
        {isTitleButtonDisabled && (
          <p className="warning">
            Your title is too long, please reduce to have less lines
          </p>
        )}
      </div>
    </>
  );
};

export default Post;
