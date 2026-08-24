import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { StoryStep } from "../data/content";
import { trackOnce } from "../tracking/piano";

export default function StorySection({
  step,
  index,
  onActive,
}: {
  step: StoryStep;
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.55, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    onActive(index);
    trackOnce(`story-${step.id}`, "story_step_view", {
      step_id: step.id,
      step_index: index + 1,
      step_title: step.title,
    });
  }, [inView, index, onActive, step]);

  return (
    <section ref={ref} id={step.id} className="story-section">
      <motion.article
        className="story-card"
        initial={reduceMotion ? false : { opacity: 0, y: 40 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ amount: 0.35, once: false }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">{step.kicker}</p>
        <h2>{step.title}</h2>
        <p className="section-copy">{step.copy}</p>
        <div className="tag-row">
          {step.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </motion.article>
    </section>
  );
}
