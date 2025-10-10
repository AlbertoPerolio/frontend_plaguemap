import "../App.css";
import "../styles/Register.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });
  return (
    <div className="register-from-div">
      <section className="register-form">
        <form onSubmit={onSubmit}>
          <h3 className="heading-register">Crear una cuenta</h3>
          <div className="register">
            {<div className="text-exist">{registerErrors.body?.mensaje}</div>}
            <div className="register-field">
              <label>Nombre:</label>
              <input
                type="text"
                className="RegisterForm"
                placeholder="Nombre"
                {...register("name", { required: true })}
              ></input>
            </div>
            <div>
              {errors.name && (
                <p className="text-required">El nombre es requerido</p>
              )}
            </div>
            <div className="register-field">
              <label>Usuario:</label>
              <input
                type="text"
                {...register("user", { required: true })}
                className="RegisterForm"
                placeholder="user"
              ></input>
            </div>
            <div>
              {errors.user && (
                <p className="text-required">El usuario es requerido</p>
              )}
            </div>
            <div className="register-field">
              <label>Email:</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="RegisterForm"
                placeholder="email"
              ></input>
            </div>
            <div>
              {errors.email && (
                <p className="text-required">El email es requerido</p>
              )}
            </div>
            <div className="register-field">
              <label>Contraseña:</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="RegisterForm"
                placeholder="password"
              ></input>
            </div>
            <div>
              {errors.password && (
                <p className="text-required">La contraseña es requerida</p>
              )}
            </div>
            <div className="register-button">
              <button type="submit" className="btn-register">
                Regístrate
              </button>
            </div>
            <p className="not-count-reg">
              ¿Tienes una cuenta?{" "}
              <Link to="/login" className="nc-t-reg">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
export default RegisterPage;
