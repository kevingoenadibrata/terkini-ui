const SuggestedImages = ({ images, onSelect }) => {
  return (
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
        {images.map((image, index) => (
          <div
            key={index}
            style={{ margin: "10px", cursor: "pointer" }}
            onClick={() => onSelect(image)}
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
  );
};

export default SuggestedImages;
