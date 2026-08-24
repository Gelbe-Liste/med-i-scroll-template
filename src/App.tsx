import { useCallback, useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import BrandHeader from "./components/BrandHeader";
import InteractiveDemo from "./components/InteractiveDemo";
import StickyVisual from "./components/StickyVisual";
import StorySection from "./components/StorySection";
import { storySteps, templateConfig } from "./data/content";
import { trackEvent, trackOnce } from "./tracking/piano";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.4]);

  useEffect(() => {
    trackOnce("page", "page.display", {
      page: "med-i-scroll-template",
      brand: "gelbe-liste",
      format: "scrollytelling",
    });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
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
  });

  const onActive = useCallback((index: number) => setActiveIndex(index), []);

  return (
    <>
      <motion.div className="top-progress" style={{ scaleX: scrollYProgress }} />
      <BrandHeader />

      <main>
        <section className="hero">
          <motion.div
            className="hero-copy-wrap"
            style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity }}
          >
            <p className="hero-eyebrow">{templateConfig.eyebrow}</p>
            <div className="hero-product">{templateConfig.product}</div>
            <h1>{templateConfig.title}</h1>
            <p className="hero-intro">{templateConfig.intro}</p>
            <a href="#einordnung" className="hero-cta">
              Story starten <span>↓</span>
            </a>
          </motion.div>

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
            <StickyVisual
              step={storySteps[activeIndex]}
              index={activeIndex}
              total={storySteps.length}
            />
          </aside>

          <div className="story-column">
            {storySteps.map((step, index) => (
              <StorySection
                key={step.id}
                step={step}
                index={index}
                onActive={onActive}
              />
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
            <button
              onClick={() =>
                trackEvent("pdf_download", {
                  asset_id: "demo-fachinformation",
                  asset_type: "pdf",
                })
              }
            >
              <span>PDF</span>
              Demo-Download
            </button>
            <button
              onClick={() =>
                trackEvent("outbound_click", {
                  target: "gelbe-liste-topic",
                })
              }
            >
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
              Inhalte, Farben, Sponsor-Branding, Story-Schritte und Tracking-Parameter sind
              modular angelegt und können pro Projekt angepasst werden.
            </p>
            <button
              onClick={() =>
                trackEvent("cta_click", {
                  cta_id: "contact",
                  cta_label: "Projekt starten",
                })
              }
            >
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
