// Kör all JavaScript när DOM:en har laddats
document.addEventListener("DOMContentLoaded", () => {

  // Lägger till enkel CSS för field-error dynamiskt
  const style = document.createElement("style");
  style.textContent = `
    .field-error {
      color: red;
      margin: 2px 0;
      padding-left: 20px;
      list-style-type: disc;
      font-size: 0.9em;
    }
  `;
  document.head.appendChild(style);

  // Skapar en gemensam ruta för felmeddelanden ovanför formuläret
  let errorBox = document.getElementById("errorlist");
  if (!errorBox) {
    errorBox = document.createElement("div");
    errorBox.id = "errorlist";
    errorBox.style.color = "red";
    errorBox.style.marginBottom = "10px";
    const newSection = document.getElementById("new");
    if (newSection) newSection.prepend(errorBox);
  }

  /*-------------------- Hämtar element från DOM --------------------*/
  const fullnameInput = document.getElementById("fullname");
  const emailInput    = document.getElementById("email");
  const phoneInput    = document.getElementById("phone");
  const fontSelect    = document.getElementById("font");
  const generateBtn   = document.getElementById("generate");
  const clearBtn      = document.getElementById("clear");

  const previewName   = document.getElementById("previewfullname");
  const previewEmail  = document.getElementById("previewemail");
  const previewPhone  = document.getElementById("previewphone");

  // Historiksektion (skapas dynamiskt om den saknas)
  let historyContainer = document.getElementById("history");
  if (!historyContainer) {
    historyContainer = document.createElement("section");
    historyContainer.id = "history";
    const h3 = document.createElement("h3");
    h3.textContent = "Historik";
    historyContainer.appendChild(h3);
    document.body.appendChild(historyContainer);
  }

  /*-------------------- Eventlyssnare --------------------*/
  generateBtn.addEventListener("click", generateCard);
  clearBtn.addEventListener("click", clearForm);

  /*-------------------- Fonten ändras dynamiskt --------------------*/
  fontSelect.addEventListener("change", () => {
    const font = fontSelect.value;
    [previewName, previewEmail, previewPhone].forEach(el => {
      if (el) el.style.fontFamily = font;
    });
  });

  /*-------------------- Hjälpfunktion: Visa fel ovanför fält --------------------*/
  function showFieldError(inputElement, message) {
    // används ej i denna version, men sparad för referens
  }

  /*-------------------- Skapar studentkort --------------------*/
  function generateCard(event) {
    event.preventDefault();
    const errors = [];

    const fullname = fullnameInput.value.trim();
    const email    = emailInput.value.trim();
    const phone    = phoneInput.value.trim();
    const font     = fontSelect.value;

    // Sätter tillåtna format för inmätning
    const namePattern  = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\s-]{6,20}$/;

    // Rensar tidigare felmeddelanden
    errorBox.innerHTML = "";

    // Namnvalidering
    if (!fullname) {
      errors.push("Namn måste anges");
      fullnameInput.style.border = "2px solid red";
    } else if (!namePattern.test(fullname)) {
      errors.push("Fel format för namn");
      fullnameInput.style.border = "2px solid red";
    } else {
      fullnameInput.style.border = "";
    }

    // E-postvalidering
    if (!email) {
      errors.push("E-post måste anges");
      emailInput.style.border = "2px solid red";
    } else if (!emailPattern.test(email)) {
      errors.push("Fel format för e-postadress");
      emailInput.style.border = "2px solid red";
    } else {
      emailInput.style.border = "";
    }

    // Telefonnummer-validering
    if (!phone) {
      errors.push("Telefonnummer måste anges");
      phoneInput.style.border = "2px solid red";
    } else if (!phonePattern.test(phone)) {
      errors.push("Fel format för telefonnummer");
      phoneInput.style.border = "2px solid red";
    } else {
      phoneInput.style.border = "";
    }

    // Om fel hittades, visa dem och avbryt
    if (errors.length > 0) {
      renderErrors(errors);
      resetPreviewPlaceholders();
      return;
    }

    // Inga fel, återställ, spara och visa kortet
    renderErrors([]); // töm felrutan när allt är okej
    saveToHistory(fullname, email, phone, font); // sparar data till historiken (font ignoreras vid jämförelse)
    renderPreview(fullname, email, phone, font);
  }

  /*-------------------- Rensar formuläret --------------------*/
  function clearForm(event) {
    event.preventDefault();

    // Rensar inmätningsfältet
    fullnameInput.value = "";
    emailInput.value    = "";
    phoneInput.value    = "";
    fontSelect.selectedIndex = 0;

    // Rensar fel, kort och fältmarkering
    renderErrors([]);
    resetPreviewPlaceholders();
    [fullnameInput, emailInput, phoneInput].forEach(el => el.style.border = "");
  }

  /*-------------------- Visar felmeddelanden --------------------*/
  function renderErrors(errors) {
    errorBox.innerHTML = ""; // Rensa tidigare fel
    if (errors.length === 0) return;

    const ul = document.createElement("ul");
    ul.style.listStyleType = "disc";
    ul.style.paddingLeft = "20px";
    ul.style.margin = "0";

    errors.forEach(message => {
      const li = document.createElement("li");
      li.textContent = message;
      ul.appendChild(li);
    });

    errorBox.appendChild(ul);
  }

  /*-------------------- Visar färdigt kort --------------------*/
  function renderPreview(name, email, phone, font) {
    previewName.textContent  = name;
    previewEmail.textContent = email;
    previewPhone.textContent = phone;

    [previewName, previewEmail, previewPhone].forEach(el => {
      if (el) el.style.fontFamily = font || "";
    });
  }

  /*-------------------- Återställer kortets exempel text (standard) --------------------*/
  function resetPreviewPlaceholders() {
    previewName.textContent  = "Namn";
    previewEmail.textContent = "E-post";
    previewPhone.textContent = "Telefon";
  }

  /*-------------------- Historik (localStorage) --------------------*/

  // Visar historik direkt vid start
  displayHistory();

  // Sparar giltig inmatning i localStorage och lägger till historik för varje förändring (utom font)
  function saveToHistory(fullname, email, phone, font) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Skapa signatur för aktuell data (exkluderar font)
    const currentSignature = `${fullname.trim().toLowerCase()}|${email.trim().toLowerCase()}|${phone.trim()}`;

    // Hämta senaste posten i historiken (exkluderar font)
    const lastEntry = history.length > 0 ? history[history.length - 1] : null;
    const lastSignature = lastEntry
      ? `${lastEntry.fullname.trim().toLowerCase()}|${lastEntry.email.trim().toLowerCase()}|${lastEntry.phone.trim()}`
      : "";

    // Om inget ändrats (förutom font) → gör ingenting
    if (currentSignature === lastSignature) {
      renderErrors([]); // ingen felruta
      fullnameInput.style.border = "";
      return;
    }

    // Annars, lägg till ny post i historiken (lagrar inte font i historiken)
    history.push({ fullname, email, phone });
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
  }

  // Skriver ut sparad historik till DOM.
  function displayHistory() {
    if (!historyContainer) return;

    const history = JSON.parse(localStorage.getItem("history")) || [];
    historyContainer.innerHTML = "<h3>Historik</h3>";

    if (history.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Ingen historik ännu.";
      historyContainer.appendChild(p);
      createClearHistoryButton();
      return;
    }

    const list = document.createElement("ul");
    history.forEach(entry => {
      const item = document.createElement("li");
      item.textContent = `${entry.fullname} – ${entry.email} – ${entry.phone}`;
      list.appendChild(item);
    });
    historyContainer.appendChild(list);

    createClearHistoryButton();
  }

  // Rensar historiken i localStorage.
  function clearHistory() {
    localStorage.removeItem("history");
    displayHistory();
  }

  // Återskapar "Rensa historik"-knappen.
  function createClearHistoryButton() {
    const oldBtn = document.getElementById("clearHistoryBtn");
    if (oldBtn) oldBtn.remove();

    const clearHistoryBtn = document.createElement("button");
    clearHistoryBtn.id = "clearHistoryBtn";
    clearHistoryBtn.textContent = "Rensa historik";
    clearHistoryBtn.style.marginTop = "10px";
    clearHistoryBtn.style.display = "block";

    clearHistoryBtn.addEventListener("click", clearHistory);

    if (historyContainer) {
      historyContainer.appendChild(clearHistoryBtn);
    }
  }

  // Kör vid sidstart
  createClearHistoryButton();
  resetPreviewPlaceholders();
});