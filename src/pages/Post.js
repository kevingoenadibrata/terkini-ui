import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Canvas from "../components/Canvas/Canvas";
import CanvasContent from "../components/CanvasContent/CanvasContent";

const fetchImages = async (query) => {
  // Get keys from .env file
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const cx = process.env.REACT_APP_GOOGLE_CX_KEY;
  const num = 8;

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}&searchType=image&num=${num}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const images = data.items;
    return images.map((image) => image.link);
  } catch (e) {
    console.error("Error fetching images:", e);
    return [];
  }
};

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
  const [imageQuery, setImageQuery] = useState("");
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [frame, setFrame] = useState(null);
  const [frame2, setFrame2] = useState(null);
  const [isContentButtonDisabled, setIsContentButtonDisabled] = useState(false);
  const [isTitleButtonDisabled, setIsTitleButtonDisabled] = useState(false);

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
      setImageQuery(data.image_query);
    };

    getData();
  }, [postId]);

  useEffect(() => {
    const getImages = async () => {
      const images = await fetchImages(imageQuery);
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

  const handleDownload = (id) => {
    const link = document.createElement("a");
    link.download = "cover.png";
    link.href = document.getElementById(id).toDataURL();
    link.click();
  };

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
      {/* Suggested image section */}
      <div className="groupInput">
        <h2>Suggested Images</h2>
        {/* Output suggested images */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {suggestedImages.map((image, index) => (
            <div
              key={index}
              style={{ margin: "10px", cursor: "pointer" }}
              onClick={() => handleImageSelect(image)}
            >
              <img
                src={image}
                crossOrigin="anonymous"
                alt="suggested"
                width="200"
                height="200"
              />
            </div>
          ))}
        </div>
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
        <button
          disabled={isTitleButtonDisabled}
          onClick={() => handleDownload("canvas-cover")}
        >
          Download Cover
        </button>
        <button
          disabled={isContentButtonDisabled}
          onClick={() => handleDownload("canvas-content")}
        >
          Download Content
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
