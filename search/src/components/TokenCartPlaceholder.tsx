const TokenCartPlaceholder = () => {
  return (
    <div className="tkn">
      <div className="tkn-title placeholder-glow">
        <span className="placeholder col-6"></span>
      </div>
      <div className="tkn-description placeholder-glow">
        <span className="placeholder col-6 subtitle-placeholder"></span>
        <span className="placeholder col-4 subtitle-placeholder"></span>
        <span className="placeholder col-4 subtitle-placeholder"></span>
        <span className="placeholder col-5 subtitle-placeholder"></span>
        <span className="placeholder col-2 subtitle-placeholder"></span>
        <span className="placeholder col-5 subtitle-placeholder"></span>
        <span className="placeholder col-2 subtitle-placeholder"></span>
        <span className="placeholder col-3 subtitle-placeholder"></span>
        <span className="placeholder col-6 subtitle-placeholder"></span>
        <span className="placeholder col-4 subtitle-placeholder"></span>
      </div>
      <div className="tkn-stock placeholder-glow">
        <span className="placeholder col-6"></span>
      </div>
      <div className="tkn-price placeholder-glow">
        <span className="placeholder col-6"></span>
      </div>
      <hr className="tkn-price-divider" />
      <a className="tkn-btn btn btn-primary disabled placeholder col-6 placeholder-wave"></a>
    </div>
  );
};

export default TokenCartPlaceholder;
