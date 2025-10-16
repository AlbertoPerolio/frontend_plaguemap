import "../styles/InfPlag.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlagaSection from "../components/PlagueSection";

function InfPlag() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  //  Datos de todas las plagas incluyendo las nuevas
  const plagas = [
    {
      id: "dengue",
      title: "Dengue",
      imgSrc: require("../img/dengue.jpg"),
      imgAlt: "Persona enferma",
      content: [
        {
          label: "Zonas",
          details: [
            "Regiones tropicales y subtropicales de América Latina, Caribe, Sudeste Asiático, África, Oceanía.",
            "En América: muy común en Brasil, Argentina (norte y centro), Paraguay, Bolivia, México, Colombia, etc.",
          ],
        },
        {
          label: "Transmisión",
          details: ["Picadura del mosquito Aedes aegypti."],
        },
        {
          label: "¿Dónde se lo puede encontrar?",
          details: [
            "Agua limpia y estancada en recipientes domésticos: baldes, floreros, botellas, neumáticos, charcos, canaletas.",
            "Vive principalmente en áreas urbanas y periurbanas.",
          ],
        },
        {
          label: "Síntomas",
          details: [
            "Fiebre alta, dolor de cabeza intenso, dolor detrás de los ojos, dolores musculares y articulares, erupciones cutáneas, cansancio extremo.",
            "En casos graves: sangrado, shock y complicaciones que pueden ser mortales (dengue grave o hemorrágico).",
          ],
        },
        {
          label: "Prevención",
          details: [
            "Eliminar criaderos de mosquitos (agua estancada).",
            "Uso de repelentes y mosquiteros.",
            "Ropa que cubra el cuerpo.",
            "Existe una vacuna aprobada en algunos países, pero su uso depende de haber tenido dengue antes.",
          ],
        },
      ],
    },
    {
      id: "zika",
      title: "Zika",
      imgSrc: require("../img/zika.jpg"),
      imgAlt: "Interfaz gráfica",
      content: [
        {
          label: "Zonas",
          details: [
            "Regiones tropicales y subtropicales.",
            "Brotes importantes en Brasil, Colombia, Centroamérica y Caribe (2015-2016).",
          ],
        },
        {
          label: "Transmisión",
          details: [
            "Picadura del mosquito Aedes aegypti.",
            "También puede transmitirse por vía sexual, transfusiones de sangre y de madre a hijo durante el embarazo.",
          ],
        },
        {
          label: "¿Dónde se lo puede encontrar?",
          details: [
            "Agua limpia y estancada en recipientes domésticos: baldes, floreros, botellas, neumáticos, charcos, canaletas.",
            "Vive principalmente en áreas urbanas y periurbanas.",
          ],
        },
        {
          label: "Síntomas",
          details: [
            "Generalmente leves: fiebre baja, sarpullido, conjuntivitis, dolor en músculos y articulaciones.",
            "Riesgo importante: puede causar microcefalia y malformaciones congénitas en bebés si la madre se infecta durante el embarazo.",
          ],
        },
        {
          label: "Prevención",
          details: [
            "Eliminar criaderos de mosquitos (agua estancada).",
            "Uso de repelentes y mosquiteros.",
            "Ropa que cubra el cuerpo.",
            "Uso de preservativo en zonas con brotes.",
          ],
        },
      ],
    },
    {
      id: "leishmaniasis",
      title: "Leishmaniasis",
      imgSrc: require("../img/leishmania.jpg"),
      imgAlt: "Prevención",
      content: [
        {
          label: "Zonas",
          details: [
            "Cutánea: América Latina (Brasil, Perú, Colombia, Bolivia), Medio Oriente, África del Norte.",
            "Visceral: India, Nepal, Bangladesh, Sudán, Brasil.",
          ],
        },
        {
          label: "Transmisión",
          details: ["Picadura de moscas de arena (flebótomos infectados)."],
        },
        {
          label: "¿Dónde se lo puede encontrar?",
          details: [
            "Lugares húmedos, oscuros y con materia orgánica: grietas en paredes, establos, corrales, troncos huecos.",
            "Asociada a zonas rurales, selváticas y periurbanas.",
            "Los perros y algunos roedores pueden ser portadores del parásito.",
          ],
        },
        {
          label: "Tipos",
          details: [
            "Cutánea: lesiones en piel (úlceras).",
            "Mucocutánea: afecta nariz, boca y garganta.",
            "Visceral: la más grave, afecta órganos internos (hígado, bazo, médula ósea).",
          ],
        },
        {
          label: "Síntomas",
          details: [
            "Cutánea: llagas en la piel que no cicatrizan.",
            "Visceral: fiebre prolongada, pérdida de peso, anemia, hígado y bazo agrandados.",
          ],
        },
        {
          label: "Prevención",
          details: [
            "Uso de repelentes y mosquiteros finos.",
            "Control de perros infectados.",
            "Control de vectores (flebótomos).",
          ],
        },
      ],
    },
    {
      id: "chikunguna",
      title: "Chikunguña",
      imgSrc: require("../img/chikun.jpg"),
      imgAlt: "Persona enferma",
      content: [
        {
          label: "Zonas",
          details: [
            "África, Asia y desde 2013 en América Latina y Caribe.",
            "Casos en Argentina, Paraguay, Brasil, Colombia, Venezuela, Centroamérica y México.",
          ],
        },
        {
          label: "Transmisión",
          details: ["Picadura del mosquito Aedes aegypti y Aedes albopictus."],
        },
        {
          label: "¿Dónde se lo puede encontrar?",
          details: [
            "Agua limpia y estancada en recipientes domésticos: baldes, floreros, botellas, neumáticos, charcos, canaletas.",
            "Aedes albopictus (mosquito tigre) también puede habitar en climas más templados.",
          ],
        },
        {
          label: "Síntomas",
          details: [
            "Fiebre alta y dolor articular intenso e incapacitante (puede durar semanas o meses).",
            "También erupciones, dolor muscular, fatiga y dolor de cabeza.",
          ],
        },
        {
          label: "Prevención",
          details: [
            "Eliminar criaderos de mosquitos (agua estancada).",
            "Uso de repelentes y mosquiteros.",
            "Ropa que cubra el cuerpo.",
          ],
        },
      ],
    },
    {
      id: "oropuche",
      title: "Oropuche",
      imgSrc: require("../img/oropouche.webp"),
      imgAlt: "Mosquito Oropuche",
      content: [
        {
          label: "Zonas",
          details: ["Regiones tropicales de América del Sur y Caribe."],
        },
        {
          label: "Transmisión",
          details: ["Picadura del mosquito Culex y Aedes."],
        },
        {
          label: "¿Dónde se lo puede encontrar?",
          details: [
            "Ambientes húmedos y cercanos a agua estancada.",
            "Áreas urbanas y periurbanas.",
          ],
        },
        {
          label: "Síntomas",
          details: [
            "Fiebre, dolor de cabeza, dolores musculares, fatiga.",
            "En casos graves puede afectar articulaciones y causar erupciones cutáneas.",
          ],
        },
        {
          label: "Prevención",
          details: [
            "Eliminar criaderos de mosquitos.",
            "Uso de repelentes y mosquiteros.",
            "Ropa que cubra el cuerpo.",
          ],
        },
      ],
    },
    {
      id: "mayaro",
      title: "Mayaro",
      imgSrc: require("../img/mayaro.webp"),
      imgAlt: "Mosquito Mayaro",
      content: [
        {
          label: "Zonas",
          details: [
            "Regiones tropicales de América Central y América del Sur.",
          ],
        },
        {
          label: "Transmisión",
          details: ["Picadura del mosquito Haemagogus y Aedes."],
        },
        {
          label: "¿Dónde se lo puede encontrar?",
          details: [
            "Selvas, áreas rurales y periurbanas.",
            "Cercanías de agua estancada y vegetación densa.",
          ],
        },
        {
          label: "Síntomas",
          details: [
            "Fiebre, dolor de cabeza, dolor articular intenso, erupciones cutáneas.",
            "En algunos casos puede confundirse con dengue o chikunguña.",
          ],
        },
        {
          label: "Prevención",
          details: [
            "Eliminar criaderos de mosquitos.",
            "Uso de repelentes y mosquiteros.",
            "Ropa que cubra el cuerpo.",
          ],
        },
      ],
    },
  ];

  return (
    <div>
      {/* 🔹 Sección introductoria */}
      <div className="read-us-container">
        <div className="read-us full-text">
          <div className="content-read">
            <h3 className="heading-read">Situación problemática</h3>
            <p className="para-read">
              Existen varias plagas peligrosas que afectan la salud humana.
              Entre ellas: Dengue, Zika, Leishmaniasis, Chikunguña, Oropuche y
              Mayaro. Estas enfermedades se propagan principalmente por
              mosquitos, y su presencia está asociada a agua estancada, zonas
              urbanas y rurales.
            </p>
            <ul className="para-read">
              {plagas.map((p) => (
                <li key={p.id}>
                  <b>{p.title}:</b>
                  <ol>
                    Mosquito relacionado.{" "}
                    <a className="btn-more-inf" href={`#${p.id}`}>
                      Leer Más
                    </a>
                  </ol>
                </li>
              ))}
            </ul>
            <p className="para-read">
              Por eso, surge la necesidad de tener un control adecuado de las
              zonas donde pueden formarse focos de infección.
            </p>
          </div>
          <img
            src={require("../img/logo2-terciario6039")}
            className="img-read"
            alt="Persona enferma"
          />
        </div>
      </div>

      {/*  Renderizado dinámico de cada plaga */}
      {plagas.map((plaga) => (
        <PlagaSection key={plaga.id} {...plaga} />
      ))}
    </div>
  );
}

export default InfPlag;
