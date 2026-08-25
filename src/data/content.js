export const templateConfig = {
  brand: "Gelbe Liste",
  product: "med.i.scroll",
  sponsor: "Partner / Sponsor",
  eyebrow: "Medizinisches Wissen interaktiv erzählt",
  title: "Pädiatrische Prävention – kompakt eingeordnet.",
  intro:
    "Ein demonstratives Scrollytelling-Template für medizinische Inhalte. Die Texte sind Platzhalter und enthalten bewusst keine konkreten Therapie- oder Produktaussagen.",
  disclaimer:
    "Demo-Inhalte · Nicht zur medizinischen Beratung · Inhalte im Kundenprojekt redaktionell und medizinisch prüfen.",
};

export const storySteps = [
  {
    id: "einordnung",
    kicker: "01 · Einordnung",
    title: "Vom Thema zur klaren Orientierung.",
    copy:
      "Der Einstieg reduziert Komplexität: wenige Kernbotschaften, ein klarer visueller Fokus und eine eindeutige Leserichtung. So wird aus einer langen Informationsseite eine geführte Story.",
    label: "Start",
    visualTitle: "Orientierung",
    visualCopy: "Thema → Relevanz → nächster Schritt",
    tags: ["Kernaussage", "Kontext", "Zielgruppe"],
  },
  {
    id: "versorgung",
    kicker: "02 · Versorgung",
    title: "Zusammenhänge werden Schritt für Schritt sichtbar.",
    copy:
      "Versorgungssituationen, Entscheidungswege oder epidemiologische Einordnungen können nacheinander aufgebaut werden. Der visuelle Anker bleibt stehen, während sich die Inhalte im Scrollverlauf verändern.",
    label: "Story",
    visualTitle: "Versorgungs-Pfad",
    visualCopy: "Situation → Einordnung → Handlung",
    tags: ["Sticky Visual", "Scroll Trigger", "Infografik"],
  },
  {
    id: "praxis",
    kicker: "03 · Praxis",
    title: "Praxisrelevanz bekommt einen eigenen Moment.",
    copy:
      "Checklisten, FAQ, Fallbeispiele oder Entscheidungsbäume lassen sich als eigenständige Story-Schritte abbilden. Inhalte bleiben kurz, scanbar und für Smartphone-Nutzung optimiert.",
    label: "Praxis",
    visualTitle: "Praxis-Check",
    visualCopy: "Frage → Entscheidung → Vertiefung",
    tags: ["FAQ", "Checkliste", "Decision Path"],
  },
  {
    id: "interaktion",
    kicker: "04 · Interaktion",
    title: "Interaktion macht aus Content messbares Engagement.",
    copy:
      "Quiz, Umfrage, Tooltips und Video können direkt in die Story integriert werden. Jede Interaktion erhält ein eigenes Tracking-Event und kann später in Piano Analytics ausgewertet werden.",
    label: "Engage",
    visualTitle: "Interaktions-Layer",
    visualCopy: "Quiz · Video · Tooltip · Survey",
    tags: ["quiz_answer", "video_start", "survey_answer"],
  },
  {
    id: "vertiefung",
    kicker: "05 · Vertiefung",
    title: "Weiterführende Inhalte bleiben nur einen Klick entfernt.",
    copy:
      "Downloads, Fachinformationen, Literatur oder weiterführende Gelbe-Liste-Inhalte können an der passenden Stelle angeboten werden – ohne die narrative Führung zu unterbrechen.",
    label: "Deep Dive",
    visualTitle: "Weiterlesen",
    visualCopy: "Download → Literatur → Folgethema",
    tags: ["pdf_download", "outbound_click", "content_open"],
  },
  {
    id: "abschluss",
    kicker: "06 · Abschluss",
    title: "Die Story endet mit einer klaren nächsten Aktion.",
    copy:
      "Der Abschluss kann auf einen Download, eine weiterführende Themenseite, einen Kontakt-CTA oder ein weiteres Content-Modul führen. Gleichzeitig wird die Completion als eigener KPI erfasst.",
    label: "Complete",
    visualTitle: "Abschluss",
    visualCopy: "Completion → CTA → nächster Touchpoint",
    tags: ["module_complete", "cta_click", "scroll_100"],
  },
];
