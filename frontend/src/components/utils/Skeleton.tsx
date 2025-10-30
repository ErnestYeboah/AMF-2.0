const Skeleton = () => {
  return (
    <div className="skeleton_wrapper">
      {[...Array(10)].map((_) => (
        <div className="skeleton_card">
          <div className="figure"></div>
          <div className="skeleton_text space-y-2">
            <p className="text"></p>
            <p className="text"></p>
            <p className="text"></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
