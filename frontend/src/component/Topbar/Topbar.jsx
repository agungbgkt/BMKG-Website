import { useEffect, useState } from "react";

function Topbar() {
  const [tanggal, setTanggal] = useState("");
  const [jamUTC, setJamUTC] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format tanggal Indonesia
      const formattedDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Format jam UTC
      const formattedUTC = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      });

      setTanggal(formattedDate);
      setJamUTC(formattedUTC);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div>{tanggal}</div>
      <div>STANDAR WAKTU INDONESIA (UTC) : {jamUTC}</div>
    </div>
  );
}

export default Topbar;