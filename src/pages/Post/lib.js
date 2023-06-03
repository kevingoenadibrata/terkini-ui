export const fetchPost = async (postId) => {
  try {
    const response = await fetch(`https://terkiniai.fly.dev/posts/${postId}`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error fetching posts:", e);
    return null;
  }
};

export const fetchImages = async (query) => {
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

export const addNewlineOnPeriod = (text) => {
  return text.replace(/\. /g, ".\n\n");
};
