// Kör all JavaScript när DOM:en har laddats
document.addEventListener("DOMContentLoaded", () => {

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

  // Felmeddelanderuta (om inte finns, skapa en)
  let errorBox = document.getElementById("errors");
  if (!errorBox) {
    errorBox = document.createElement("div");
    errorBox.id = "errors";
    document.body.prepend(errorBox);
  }

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

    // Nollställar röda kanter
    [fullnameInput, emailInput, phoneInput].forEach(el => el.style.border = "");

    // Namnvalidering
    if (!fullname) {
      errors.push("Fyll i ditt namn.");
      fullnameInput.style.border = "2px solid red";
    } else if (!namePattern.test(fullname)) {
      errors.push("Fel format för namn – använd bara bokstäver.");
      fullnameInput.style.border = "2px solid red";
    }

    // E-postvalidering
    if (!email) {
      errors.push("Fyll i din e-postadress.");
      emailInput.style.border = "2px solid red";
    } else if (!emailPattern.test(email)) {
      errors.push("Fel format för e-postadress.");
      emailInput.style.border = "2px solid red";
    }

    // Telefonnummer-validering
    if (!phone) {
      errors.push("Fyll i ditt telefonnummer.");
      phoneInput.style.border = "2px solid red";
    } else if (!phonePattern.test(phone)) {
      errors.push("Fel format för telefonnummer – skriv bara siffror och tillåtna tecken (+, -, mellanslag).");
      phoneInput.style.border = "2px solid red";
    }

    // Om fel hittades, visa dem och avbryt
    if (errors.length > 0) {
      renderErrors(errors);
      resetPreviewPlaceholders();
      return;
    }

    // Inga fel, återställ, spara och visa kortet
    renderErrors([]);
    [fullnameInput, emailInput, phoneInput].forEach(el => el.style.border = "");

    saveToHistory(fullname, email, phone); // Sparar kortetsinfo till historiken
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
    errorBox.innerHTML = "";
    if (errors.length === 0) return;

    const ul = document.createElement("ul");
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

  // Sparar giltig inmatning i localStorage och kollar om namnet redan finns registrerat.
  function saveToHistory(fullname, email, phone) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Kontrollerar om namnet redan finns (case-insensitive)
    const nameExists = history.some(entry =>
      entry.fullname.trim().toLowerCase() === fullname.trim().toLowerCase()
    );

    if (nameExists) {
      fullnameInput.style.border = "2px solid red";
      renderErrors(["Namn redan registrerat."]);
      return; // Avbryt sparningen
    }

    fullnameInput.style.border = "";

    // Lägg till ny post och spara
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