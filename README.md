# Labbgrund till Moment 4 i kursen DT084G, Introduktion till programmering i JavaScript

## 🧠 Beskrivning av lösningen
Applikationen genererar ett **studentkort** utifrån användarens inmatning av namn, e-postadress och telefonnummer.  
Ett valbart typsnitt används för att anpassa utseendet på kortet.

När användaren klickar på **“Generera”**:
- Fältens innehåll valideras.
- Eventuella fel visas tydligt i listform ovanför formuläret.
- Ett kort med giltiga uppgifter förhandsvisas på sidan.

Historiken lagras lokalt i webbläsaren via **localStorage** och uppdateras automatiskt varje gång en förändring görs i något textfält (namn, e-post eller telefonnummer).  
Typsnittet kan ändras **dynamiskt** utan att klicka på *Generera*, men dessa ändringar sparas inte i historiken.

---

## ⚙️ Teknisk implementation
- **HTML**: Struktur för formulär och förhandsvisning.  
- **CSS**: Stil för kortets layout och formatering.  
- **JavaScript**:
  - DOM-manipulation med `addEventListener()` och `querySelector()`.
  - Fältvalidering med reguljära uttryck.
  - Hantering av felmeddelanden direkt i DOM.
  - Lagring av historik i `localStorage`.
  - Dynamisk uppdatering av typsnitt.

---

## 🗂️ Filstruktur
moment4/
│
├── index.html  
├── css/  
│   └── styles.css  
└── js/  
    └── main.js  

---

## 🌐 Publik länk
Projektet är publicerat via **GitHub Pages**:  
👉 [https://dulfi.github.io/moment4-ht25/](https://dulfi.github.io/moment4-ht25/)

---

## 🧾 Kommentarer
- Felmeddelandet *“Namn redan finns”* togs bort eftersom det störde funktionen vid typsnittsändring.  
- Fontändringar sker nu dynamiskt utan att användaren behöver klicka på *Generera*.  
- Historiken uppdateras endast vid faktiska förändringar i datafälten.

---

## 📚 Källa
Laborationen är skapad som en del av kursen **DT084G – Introduktion till programmering med JavaScript** vid **Mittuniversitetet**.