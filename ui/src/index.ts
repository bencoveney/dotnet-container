import "./index.module.css";

fetch("/api/healthcheck")
  .then((res) => res.text())
  .then((text) => {
    const paragraph = document.createElement("p");
    paragraph.innerText = `Server Healthcheck: ${text}`;
    document.body.appendChild(paragraph);
  });
