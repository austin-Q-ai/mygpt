import React, { useEffect, useState } from "react";

function MapComp() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const success = (position: any) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
  }, []);

  return (
    <>
      {location.latitude && location.longitude && (
        <iframe
          style={{ border: 0 } as React.CSSProperties}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          height="250px"
          src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=en&z=14&amp;&output=embed`}
        />
      )}
    </>
  );
}

export default MapComp;
