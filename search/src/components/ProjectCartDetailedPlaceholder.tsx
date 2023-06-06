
const ProjectCartDetailedPlaceholder = () => {
  const progressBarStyle = {
    width: "30%",
  };

  return (
    <div className="prj-detailed shadow-lg box">
      <div className="prj-img-wrapper-detailed">
        <img className="prj-img-detailed placeholder-wave" src="./test.png" />
      </div>
      <div className="prj-detail">
        <div className="prj-exp-time-detailed placeholder-glow">
          <span className="placeholder col-5"></span>
        </div>
        <div className="prj-title-detailed placeholder-glow">
          <span className="placeholder col-6"></span>
        </div>
        <hr className="prj-title-divider-detailed1" />
        <hr className="prj-title-divider-detailed2" />
        <div className="prj-subtitle-detailed placeholder-glow">
          <span className="placeholder col-6 subtitle-placeholder"></span>
          <span className="placeholder col-4 subtitle-placeholder"></span>
          <span className="placeholder col-4 subtitle-placeholder"></span>
          <span className="placeholder col-5 subtitle-placeholder"></span>
          <span className="placeholder col-2 subtitle-placeholder"></span>
          <span className="placeholder col-5 subtitle-placeholder"></span>
          <span className="placeholder col-2 subtitle-placeholder"></span>
          <span className="placeholder col-6 subtitle-placeholder"></span>
          <span className="placeholder col-4 subtitle-placeholder"></span>
        </div>
        <div className="prj-invest-detailed">
          <div className="prj-invest-amount-detailed placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
          <div className="prj-invest-count-detailed placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </div>
        <div className="prj-category-detailed placeholder-glow">
          <span className="placeholder col-6"></span>
        </div>
        <div
          className="progress prj-progress-detailed placeholder-wave"
          role="progressbar"
          aria-label="Success example"
          aria-valuenow={25}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-bar bg-primary"
            style={progressBarStyle}
          ></div>
        </div>
        <div className="prj-like-detailed">
        <a className="prj-detailed-btn1 btn btn-secondary disabled placeholder col-6 placeholder-wave"></a>
        <a className="prj-detailed-btn2 btn btn-secondary disabled placeholder col-6 placeholder-wave"></a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCartDetailedPlaceholder;
