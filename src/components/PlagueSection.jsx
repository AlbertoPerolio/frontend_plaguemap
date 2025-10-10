// src/components/PlagaSection.jsx
import React from "react";

function PlagaSection({ id, title, content, imgSrc, imgAlt }) {
  return (
    <div className="read-us-container" id={id}>
      <div className="read-us">
        <div className="content-read">
          <h3 className="heading-read">{title}</h3>
          <ul className="para-read">
            {content.map((item, index) => (
              <li key={index}>
                <b>{item.label}:</b>
                {item.details.map((text, i) => (
                  <ol key={i}>{text}</ol>
                ))}
              </li>
            ))}
          </ul>
        </div>
        <img src={imgSrc} className="img-read" alt={imgAlt} />
      </div>
    </div>
  );
}

export default PlagaSection;
