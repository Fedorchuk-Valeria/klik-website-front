const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__content">
        <div className="loader__spinner">
          <span />
          <span />
          <span />
        </div>

        <p className="loader__text">Загрузка ...</p>
      </div>
    </div>
  );
};

export default Loader;
