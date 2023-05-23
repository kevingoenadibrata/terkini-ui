import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Canvas from "../components/Canvas/Canvas";
import CanvasContent from "../components/CanvasContent/CanvasContent";

const fetchPost = async (postId) => {
  try {
    const response = await fetch(`https://terkiniai.fly.dev/posts/${postId}`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error fetching posts:", e);
    return null;
  }
};

const Post = () => {
  const { postId } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [frame, setFrame] = useState(null);
  const [frame2, setFrame2] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = require("../components/Canvas/Cover.png");
    setFrame(img);

    const img2 = new Image();
    img2.src = require("../components/CanvasContent/Frame2.png");
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
      setContent(data.content);
      setCategory(data.category);
    };

    getData();
  }, [postId]);

  const handleImageUpload = (e) => {
    var reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      setImage(img);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleDownload = (id) => {
    const link = document.createElement("a");
    link.download = "cover.png";
    link.href = document.getElementById(id).toDataURL();
    link.click();
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
          width={1080}
          height={1080}
        />
        <CanvasContent
          contentContent={content}
          contentCategory={category}
          contentFrame={frame2}
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
        <button onClick={() => handleDownload("canvas-cover")}>
          Download Cover
        </button>
        <button onClick={() => handleDownload("canvas-content")}>
          Download Content
        </button>
      </div>
    </>
  );
};

export default Post;
