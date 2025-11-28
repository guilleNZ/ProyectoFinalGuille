// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export const EventDetails = () => {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     const loadEvent = async () => {
//       try {
//         const resp = await fetch(`${BASE_URL}/api/activities/${id}`);
//         if (!resp.ok) throw new Error("No se pudo cargar el evento");
//         const data = await resp.json();
//         setEvent(data);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadEvent();
//   }, [id]);

//   if (loading) return <p style={{ marginTop: "100px", textAlign: "center" }}>Cargando…</p>;
//   if (error) return <p style={{ marginTop: "100px", textAlign: "center", color: "#EE6C4D" }}>{error}</p>;
//   if (!event) return <p style={{ marginTop: "100px", textAlign: "center" }}>Evento no encontrado</p>;

//   return (
//     <div style={{ marginTop: "120px", padding: "20px", textAlign: "center" }}>
//       <h1>{event.title || event.name}</h1>
//       <h3>{event.sport}</h3>

//       {event.image && (
//         <img
//           src={event.image}
//           alt={event.title}
//           style={{ width: "60%", borderRadius: "10px", marginTop: "20px" }}
//         />
//       )}

//       <p style={{ marginTop: "20px", fontSize: "1.1rem" }}>{event.description}</p>

//       <p>
//         Participantes: {(event.participants?.length ?? 0)}/{event.max_participants ?? 0}
//       </p>

//       {event.creator_name && (
//         <p><strong>Creado por:</strong> {event.creator_name}</p>
//       )}

//       {event.date && (
//         <p><strong>Fecha:</strong> {new Date(event.date).toLocaleString()}</p>
//       )}

//       {event.latitude != null && event.longitude != null && (
//         <p>
//           <strong>Ubicación:</strong> <br />
//           Lat: {event.latitude.toFixed(5)}, Lng: {event.longitude.toFixed(5)}
//         </p>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const resp = await fetch(`${BASE_URL}/api/activities/${id}`);
        if (!resp.ok) throw new Error("No se pudo cargar el evento");
        const data = await resp.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column text-light">
        <Spinner animation="border" variant="light" />
        <p className="mt-3">Cargando evento…</p>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <p className="text-danger">{error}</p>
      </div>
    );

  if (!event)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-light">Evento no encontrado</p>
      </div>
    );

  return (
    <div className="container mt-5 mb-5">
      <div className="profile-stable-card mx-auto text-center p-4">

        {/* Título */}
        <h2 className="meetfit-text-custom mb-2">{event.title || event.name}</h2>
        <h5 className="text-info mb-3">{event.sport}</h5>

        {/* Imagen */}
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="profile-avatar"
            style={{
              width: "60%",
              borderRadius: "12px",
              border: "2px solid #817DF9",
              boxShadow: "0 0 8px #E3FE18",
            }}
          />
        )}

        {/* Descripción */}
        <p className="text-light mt-4">{event.description}</p>

        <hr className="my-4" />

        {/* Info */}
        <div className="text-start px-4">
          <p><strong> Fecha:</strong> {new Date(event.date).toLocaleString()}</p>

          <p>
            <strong>Participantes:</strong>{" "}
            {(event.participants?.length ?? 0)}/{event.max_participants}
          </p>

          {event.creator_name && (
            <p><strong> Creado por:</strong> {event.creator_name}</p>
          )}

          {event.latitude && (
            <p>
              <strong>📍 Ubicación:</strong><br />
              Lat: {event.latitude.toFixed(5)} | Lng: {event.longitude.toFixed(5)}
            </p>
          )}
        </div>

        <hr className="my-4" />

        {/* Botón volver */}
        <button
          className="mf-neon-btn w-100 mt-2"
          onClick={() => navigate("/events")}
        >
          ← Volver a eventos
        </button>

      </div>
    </div>
  );
};
