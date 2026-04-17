import "../styles/skeleton.css"
const Skeleton = ({ width = "100%", height = "16px", radius = "8px" }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
      }}
    />
  );
};

export default Skeleton;