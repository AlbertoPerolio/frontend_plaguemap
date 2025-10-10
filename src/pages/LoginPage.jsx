import "../styles/Login.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);
  return (
    <div className="login-from-div">
      <section className="login-form">
        <form onSubmit={onSubmit}>
          <h3 className="heading-login">Iniciar Sesión</h3>
          <div className="login">
            {<div className="text-exist">{signinErrors.body?.mensaje}</div>}
            <div className="login-field">
              <label>Usuario/Email:</label>
              <input
                type="text"
                {...register("user", { required: true })}
                className="loginForm"
                placeholder="user/email"
              ></input>
            </div>
            <div>
              {errors.user && (
                <p className="text-required">El usuario o email es requerido</p>
              )}
            </div>
            <div className="login-field">
              <label>Contraseña:</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="loginForm"
                placeholder="password"
              ></input>
            </div>
            <div>
              {errors.password && (
                <p className="text-required">Mínimo 6 caracteres</p>
              )}
            </div>
            <div className="login-button">
              <button type="submit" className="btn-login">
                Iniciar sesión
              </button>
            </div>
            <p className="not-count">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="nc-t">
                Crear cuenta
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
