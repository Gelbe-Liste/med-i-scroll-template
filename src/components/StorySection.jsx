import { useEffect, useRef, useState } from "react";
import { trackOnce } from "../tracking/piano";

export default function StorySection({ step, index, onActive }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        onActive(index);
        trackOnce(`story-${step.id}`, "story_step_view", {
          step_id: step.id,
          step_index: index + 1,
          step_title: step.title,
        });
      },
      { threshold: 0.55, rootMargin: "-10% 0px -10% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [index, onActive, step]);

  return (
    <section ref={ref} id={step.id} className="story-section">
      <article className={`story-card native-reveal ${visible ? "is-visible" : ""}`}>
        <p className="section-kicker">{step.kicker}</p>
        <h2>{step.title}</h2>
        <p className="section-copy">{step.copy}</p>
        <div className="tag-row">
          {step.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </article>
    </section>
  );
}
