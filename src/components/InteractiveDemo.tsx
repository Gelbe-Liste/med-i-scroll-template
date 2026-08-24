import { useState } from "react";
import { motion } from "motion/react";
import { trackEvent } from "../tracking/piano";

export default function InteractiveDemo() {
  const [quiz, setQuiz] = useState<string | null>(null);
  const [survey, setSurvey] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const chooseQuiz = (value: string) => {
    setQuiz(value);
    trackEvent("quiz_answer", { quiz_id: "demo_priority", answer: value });
  };

  const chooseSurvey = (value: string) => {
    setSurvey(value);
    trackEvent("survey_answer", { survey_id: "demo_format", answer: value });
  };

  const toggleVideo = () => {
    const next = !playing;
    setPlaying(next);
    trackEvent(next ? "video_start" : "video_pause", { video_id: "demo_video" });
  };

  return (
    <section className="interactive-zone" id="interaktive-demo">
      <div className="interactive-intro">
        <p className="section-kicker">Interaktive Bausteine</p>
        <h2>Vier Module – direkt im Template.</h2>
        <p>
          Diese Elemente zeigen, wie Quiz, Video, Tooltip und Survey ohne Medienbruch in das
          Scrollytelling integriert und separat getrackt werden können.
        </p>
      </div>

      <div className="interactive-grid">
        <article className="interaction-card">
          <span className="card-index">01</span>
          <h3>Mini-Quiz</h3>
          <p>Welcher Bereich soll im Beispiel zuerst vertieft werden?</p>
          <div className="button-stack">
            {["Versorgung", "Praxis", "FAQ"].map((item) => (
              <button
                key={item}
                className={quiz === item ? "selected" : ""}
                onClick={() => chooseQuiz(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {quiz && <p className="interaction-result">Auswahl erfasst: {quiz}</p>}
        </article>

        <article className="interaction-card video-card">
          <span className="card-index">02</span>
          <h3>Video</h3>
          <button className="video-stage" onClick={toggleVideo} aria-pressed={playing}>
            <motion.span animate={{ scale: playing ? 0.92 : 1 }}>{playing ? "❚❚" : "▶"}</motion.span>
            <small>{playing ? "Demo läuft" : "Video starten"}</small>
          </button>
        </article>

        <article className="interaction-card tooltip-card">
          <span className="card-index">03</span>
          <h3>Tooltip</h3>
          <p>
            Zusatzinformationen lassen sich platzsparend direkt an einem Begriff erläutern.
          </p>
          <button
            className="tooltip-trigger"
            onClick={() => {
              setTooltip((value) => !value);
              trackEvent("tooltip_open", { tooltip_id: "demo_definition" });
            }}
          >
            Begriff erklären <span>i</span>
          </button>
          {tooltip && (
            <div className="tooltip-box">
              Demo-Definition: Hier kann später eine medizinisch-redaktionell geprüfte Erklärung stehen.
            </div>
          )}
        </article>

        <article className="interaction-card">
          <span className="card-index">04</span>
          <h3>Survey</h3>
          <p>Welches Format wäre für die Vertiefung am hilfreichsten?</p>
          <div className="button-stack">
            {["Kurztext", "Grafik", "Video"].map((item) => (
              <button
                key={item}
                className={survey === item ? "selected" : ""}
                onClick={() => chooseSurvey(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {survey && <p className="interaction-result">Danke – {survey} wurde erfasst.</p>}
        </article>
      </div>
    </section>
  );
}
