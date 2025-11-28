import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 👈 NUEVO
import { updateUser } from "../jsApiComponents/auth";
import { Form } from "react-bootstrap";

export default function UpdateUser({ refreshUser, user_bio, user_sports, user_level, user_lastname }) {
  const [info, setInfo] = useState({ bio: "", sports: "", level: "", lastname: "" });
  const userID = localStorage.getItem("USER");
  const navigate = useNavigate();

  const updateSuccess = async (e) => {
    e.preventDefault();

    const body = {
      lastname: info.lastname,
      bio: info.bio,
      sports: info.sports,
      level: info.level,
    };

    const data = await updateUser(body, userID);

    if (data.status === 400) {
      toast.error("❌ Algo salió mal. Inténtalo nuevamente.");
      return;
    }

    if (data.status === 200) {
      toast.success("🎉 Perfil actualizado con éxito!");
      refreshUser();
      navigate("/profile");
    }
  };

  useEffect(() => {
    setInfo({
      bio: user_bio,
      sports: user_sports,
      level: user_level,
      lastname: user_lastname,
    });
  }, [user_bio, user_sports, user_level, user_lastname]);

  return (
    <Form onSubmit={updateSuccess} className="d-flex flex-column w-100">

      <Form.Group className="mb-3 text-start">
        <Form.Label><h5>Biografía</h5></Form.Label>
        <Form.Control
          as="textarea"
          placeholder="¡Hola! Soy ... "
          value={info.bio}
          onChange={(e) => setInfo({ ...info, bio: e.target.value })}
          rows={3}
          className="mf-input"
        />
      </Form.Group>

      <Form.Group className="mb-3 text-start">
        <Form.Label><h5>Deporte</h5></Form.Label>
        <Form.Control
          type="text"
          placeholder="Fútbol, Baloncesto..."
          value={info.sports}
          onChange={(e) => setInfo({ ...info, sports: e.target.value })}
          className="mf-input"
        />
      </Form.Group>

      <Form.Group className="mb-3 text-start">
        <Form.Label><h5>Nivel</h5></Form.Label>
        <Form.Control
          type="text"
          placeholder="Principiante, Intermedio..."
          value={info.level}
          onChange={(e) => setInfo({ ...info, level: e.target.value })}
          className="mf-input"
        />
      </Form.Group>

      <Form.Group className="mb-3 text-start">
        <Form.Label><h5>Apellidos</h5></Form.Label>
        <Form.Control
          type="text"
          placeholder="..."
          value={info.lastname}
          onChange={(e) => setInfo({ ...info, lastname: e.target.value })}
          className="mf-input"
        />
      </Form.Group>

      <button type="submit" className="mt-3 mf-neon-btn">
        Guardar cambios
      </button>
    </Form>
  );
}
