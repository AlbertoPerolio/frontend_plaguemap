import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { useRef } from "react";

// Datos de plagas
const plagas = [
  {
    id: "dengue",
    title: "Dengue",
    img: require("../img/dengue.jpg"),
    description:
      "Es un mosquito de tamaño pequeño de unos 4-7mm, con un color negro con marcas blancas en las patas y cuerpo, suele picar por el día.",
  },
  {
    id: "zika",
    title: "Zika",
    img: require("../img/zika.jpg"),
    description:
      "Es un mosquito de tamaño pequeño de unos 4-7mm, con un color negro con marcas blancas en las patas y cuerpo, suele picar por el día.",
  },
  {
    id: "leishmaniasis",
    title: "Leishmaniasis",
    img: require("../img/leishmania.jpg"),
    description:
      'Es un mosquito muy pequeño de 2-4mm, color marrón claro o amarillento, con un cuerpo peludo y alas largas. Sus alas en reposo forman una "V". Suele picar durante la noche, solo las hembras.',
  },
  {
    id: "chikunguna",
    title: "Chikunguña",
    img: require("../img/chikun.jpg"),
    description:
      "Es un mosquito de tamaño pequeño de unos 4-7mm, con un color negro con marcas blancas en las patas y cuerpo, suele picar por el día.",
  },
  {
    id: "oropuche",
    title: "Oropuche",
    img: require("../img/oropouche.webp"),
    description:
      "Mosquito Culex y Aedes, presente en regiones tropicales de Sudamérica y Caribe, se encuentra en ambientes húmedos y cercanos a agua estancada.",
  },
  {
    id: "mayaro",
    title: "Mayaro",
    img: require("../img/mayaro.webp"),
    description:
      "Mosquito Haemagogus y Aedes, regiones tropicales de América Central y Sur, se encuentra en selvas, áreas rurales y periurbanas.",
  },
];

function HomePage() {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <div>
      {/* Sección Inicio */}
      <section className="section-home" id="inicio">
        <div className="content-home">
          <div className="content-home2">
            <div className="home-image">
              <img
                src={require("../img/logo2-terciario6039.png")}
                alt="img-home"
                className="img-home"
              />
            </div>
            <div className="home-text">
              <h1 className="home-heading">
                Mapa sobre <span className="home-span">Plagas</span>
              </h1>
              <p className="para-home">Página para localizar plagas</p>
              <a href="#plagas" className="home-links btn-2">
                <Link
                  to="/login"
                  className="btn-navbar"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Plagas Información */}
      <section className="section-about" id="Mas_informacion">
        <div className="about-us-container">
          <div className="about-us">
            <div className="about-left">
              <h3 className="heading-about">Plagas</h3>
              <p className="para-about">
                Actualmente se conocen muchas plagas que están en Aguaray, como
                Dengue, Zika, Leishmaniasis, Chikunguña, Oropuche y Mayaro. Esta
                página permite localizar posibles focos de infección.
              </p>
              <p className="para-about">
                Para más información sobre cada plaga haga click en el botón de
                abajo.
              </p>
              <Link
                to="/InfPlag"
                className="link-about"
                onClick={() => window.scrollTo(0, 0)}
              >
                Leer más
              </Link>
            </div>
            <div className="about-right"></div>
          </div>
        </div>
      </section>

      {/* Sección Plagas Cards - Carrusel */}
      <section className="product-category" id="plagas">
        <h2 className="heading-product">Plagas</h2>

        <div className="carousel-wrapper">
          <button className="carousel-btn left" onClick={scrollLeft}>
            ◀
          </button>

          <div ref={carouselRef} className="scroll-container">
            {plagas.map((plaga) => (
              <div className="card-product" key={plaga.id}>
                <img src={plaga.img} className="img-card" alt={plaga.title} />
                <div className="card-body">
                  <h5 className="card-title">{plaga.title}</h5>
                  <p className="card-text">{plaga.description}</p>
                  <Link to={`/InfPlag#${plaga.id}`} className="btn-product-ctg">
                    Leer más
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-btn right" onClick={scrollRight}>
            ▶
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
