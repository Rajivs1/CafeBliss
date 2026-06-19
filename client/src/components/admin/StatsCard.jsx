const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h4>{title}</h4>
        <p className="stats-value">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
