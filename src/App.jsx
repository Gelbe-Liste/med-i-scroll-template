import { useCallback, useEffect, useState } from "react";
import BrandHeader from "./components/BrandHeader";
import InteractiveDemo from "./components/InteractiveDemo";
import StickyVisual from "./components/StickyVisual";
import StorySection from "./components/StorySection";
import { storySteps, templateConfig } from "./data/content";
import { trackEvent, trackOnce } from "./tracking/piano";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    trackOnce("page", "page.display", {
      page: "med-i-scroll-template",
      brand: "gelbe-liste",
      format: "scrollytelling",
    });

    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const value = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      setScrollProgress(value);

      [25, 50, 75, 100].forEach((milestone) => {
        const threshold = milestone === 100 ? 0.985 : milestone / 100;
        if (value >= threshold) {
          trackOnce(`depth-${milestone}`, "scroll_depth", {
            depth_percent: milestone,
            module_id: "med-i-scroll-template",
          });
        }
      });

      if (value >= 0.985) {
        trackOnce("complete", "module_complete", {
          module_id: "med-i-scroll-template",
        });
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onActive = useCallback((index) => setActiveIndex(index), []);
  const heroOffset = Math.min(scrollProgress / 0.18, 1);

  return (
    <>
      <div className="top-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
      <BrandHeader />

      <main>
        <section className="hero">
          <div
            className="hero-copy-wrap"
            style={{
              transform: `translateY(${-70 * heroOffset}px)`,
              opacity: 1 - 0.6 * Math.min(scrollProgress / 0.15, 1),
            }}
          >
            <p className="hero-eyebrow">{templateConfig.eyebrow}</p>
            <div className="hero-product">{templateConfig.product}</div>
            <h1>{templateConfig.title}</h1>
            <p className="hero-intro">{templateConfig.intro}</p>
            <a href="#einordnung" className="hero-cta">
              Story starten <span>↓</span>
            </a>
          </div>

          <div className="hero-side" aria-hidden="true">
            <div className="yellow-panel">
              <span>GL</span>
              <strong>SCROLL</strong>
              <i>01—06</i>
            </div>
          </div>
        </section>

        <section className="story-shell">
          <aside className="sticky-column">
            <StickyVisual step={storySteps[activeIndex]} index={activeIndex} total={storySteps.length} />
          </aside>

          <div className="story-column">
            {storySteps.map((step, index) => (
              <StorySection key={step.id} step={step} index={index} onActive={onActive} />
            ))}
          </div>
        </section>

        <InteractiveDemo />

        <section className="resource-section">
          <div>
            <p className="section-kicker">Weiterführende Inhalte</p>
            <h2>Downloads und Links – im Flow integriert.</h2>
            <p>
              Im Kundenprojekt können hier beispielsweise Fachinformationen, Literatur,
              Studienzusammenfassungen oder weiterführende Gelbe-Liste-Inhalte eingebunden werden.
            </p>
          </div>
          <div className="resource-actions">
            <button onClick={() => trackEvent("pdf_download", { asset_id: "demo-fachinformation", asset_type: "pdf" })}>
              <span>PDF</span>
              Demo-Download
            </button>
            <button onClick={() => trackEvent("outbound_click", { target: "gelbe-liste-topic" })}>
              <span>→</span>
              Weiterführender Inhalt
            </button>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-mark">med.i.scroll</div>
          <div>
            <p className="section-kicker">Template bereit</p>
            <h2>Ein technisches Grundgerüst für viele Indikationen.</h2>
            <p>
              Inhalte, Farben, Sponsor-Branding, Story-Schritte und Tracking-Parameter sind modular angelegt
              und können pro Projekt angepasst werden.
            </p>
            <button onClick={() => trackEvent("cta_click", { cta_id: "contact", cta_label: "Projekt starten" })}>
              Projekt starten
            </button>
          </div>
        </section>

        <footer>
          <p>{templateConfig.disclaimer}</p>
          <nav aria-label="Rechtliche Hinweise">
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
          </nav>
        </footer>
      </main>
    </>
  );
}
