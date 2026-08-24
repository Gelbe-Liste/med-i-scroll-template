export default function StickyVisual({ step, index, total }) {
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="visual-card">
      <div className="visual-card-head">
        <span>{step.label}</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>

      <div className="visual-stage">
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-orbit orbit-one" aria-hidden="true" />
        <div className="visual-orbit orbit-two" aria-hidden="true" />

        <div className="visual-content native-visual" key={step.id}>
          <span className="visual-number">{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.visualTitle}</h3>
          <p>{step.visualCopy}</p>
          <div className="pathway" aria-hidden="true">
            <span className={index >= 0 ? "active" : ""}>A</span>
            <i />
            <span className={index >= 2 ? "active" : ""}>B</span>
            <i />
            <span className={index >= 4 ? "active" : ""}>C</span>
          </div>
        </div>
      </div>

      <div className="visual-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
