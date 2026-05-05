import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm
} from "react-icons/wi";

function WeatherCard({ desa, kecamatan, jam, suhu, kondisi }) {

  const getIcon = () => {
    switch (kondisi) {
      case "Cerah":
        return <WiDaySunny className="text-yellow-400 text-5xl" />;
      case "Berawan":
        return <WiCloudy className="text-gray-400 text-5xl" />;
      case "Hujan":
        return <WiRain className="text-blue-400 text-5xl" />;
      case "Petir":
        return <WiThunderstorm className="text-purple-500 text-5xl" />;
      default:
        return <WiDaySunny className="text-yellow-400 text-5xl" />;
    }
  };

  return (
    <div className="weather-card">

      <div className="card-header">
        <h3>{desa}</h3>
        <p className="kecamatan">{kecamatan}</p>
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