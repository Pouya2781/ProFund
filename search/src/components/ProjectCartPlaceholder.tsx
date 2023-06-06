
const ProjectCartPlaceholder = () => {
  const progressBarStyle = {
    width: `30%`,
  };

  return (
    <div className="prj">
      <div className="prj-img-wrapper">
        <img className="prj-img placeholder-wave" src="./test.png" alt="..." />
      </div>
      <div
        className="progress prj-progress placeholder-wave"
        role="progressbar"
        aria-label="Success example"
        aria-valuenow={25}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar bg-primary" style={progressBarStyle}></div>
      </div>
      <div className="prj-exp-time placeholder-glow">
        <span className="placeholder col-5"></span>
      </div>
      <div className="prj-title placeholder-glow">
        <span className="placeholder col-6"></span>
      </div>
      <div className="prj-subtitle placeholder-glow">
        <span className="placeholder col-7 subtitle-placeholder"></span>
        <span className="placeholder col-4 subtitle-placeholder"></span>
        <span className="placeholder col-4 subtitle-placeholder"></span>
        <span className="placeholder col-6 subtitle-placeholder"></span>
        <span className="placeholder col-8 subtitle-placeholder"></span>
      </div>
      <a className="prj-btn btn btn-secondary disabled placeholder col-6 placeholder-wave"></a>
    </div>
  );
};

export default ProjectCartPlaceholder;
