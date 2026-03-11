function WeatherCard({ kota, jam, suhu, kondisi }) {

  const getIcon = () => {
    switch (kondisi) {
      case "Cerah":
        return "☀️";
      case "Berawan":
        return "☁️";
      case "Hujan":
        return "🌧️";
      case "Petir":
        return "⛈️";
      default:
        return "☀️";
    }
  };

  return (
    <div className="weather-card">

      <div className="card-header">
        <h3>{kota}</h3>
        <p>{jam}</p>
      </div>

      <div className="card-body">

        <div className="weather-icon">
          {getIcon()}
        </div>

        <h2 className="temperature">
          {suhu}°C
        </h2>

        <p className="status">
          {kondisi}
        </p>

      </div>

    </div>
  );
}

export default WeatherCard;
