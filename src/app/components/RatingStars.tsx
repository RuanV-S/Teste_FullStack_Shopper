const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating); // Full stars
  const halfStar = rating % 1 >= 0.5; // Half star if applicable

  return (
    <div style={{ display: "flex" }}>
      {Array(fullStars)
        .fill(null)
        .map((_, index) => (
          <i
            key={`full-${index}`}
            className="bx bxs-star"
            style={{ color: "gold" }}
          ></i>
        ))}
      {halfStar && (
        <i className="bx bxs-star-half" style={{ color: "gold" }}></i>
      )}
      {Array(5 - Math.ceil(rating))
        .fill(null)
        .map((_, index) => (
          <i
            key={`empty-${index}`}
            className="bx bx-star"
            style={{ color: "gold" }}
          ></i>
        ))}
    </div>
  );
};

export default RatingStars;
