const axios = require("axios");

const apiKey = "API_KEY";
const cx = "CX_KEY";
const query = "Truk Sumbu Tiga, Tol Jakarta-Cikampek, Polisi";
const num = 8;

const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}&searchType=image&num=${num}`;

async function getImages() {
  try {
    const response = await axios.get(url);
    const data = response.data;
    const images = data.items;
    images.forEach((image) => {
      console.log("image data:", image);
      //   const img = document.createElement("img");
      //   img.src = image.link;
      //   document.body.appendChild(img);
    });
  } catch (error) {
    console.error(error);
  }
}

getImages();
