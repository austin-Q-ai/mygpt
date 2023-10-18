import axios from "axios";
import React, { useEffect, useState } from "react";

import { GOOGLE_MAP_API_KEY } from "@calcom/lib/constants";

function MapComp(props: any) {
  const [location, setLocation] = useState({
    latitude: 45.764043,
    longitude: 4.835659,
  });

  const fetchLocation = () => {
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          key: GOOGLE_MAP_API_KEY,
          address: props.address,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.statusText === "OK") {
          setLocation({
            latitude: response.data.results[0].geometry.location.lat,
            longitude: response.data.results[0].geometry.location.lng,
          });
        }
      });
  };

  useEffect(() => {
    fetchLocation();
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
