import { useState } from "react";
import { trackEvent } from "../tracking/piano";

function normalizeContent(content) {
  if (!content) return [];
  return Array.isArray(content) ? content : [content];
}

export default function AccordionGroup({ items = [], page, pageName, variant = "faq" }) {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (item, index) => {
    const accordionId = item.id || `${page.id}-accordion-${index + 1}`;
    const isOpen = openItems.includes(accordionId);
    const nextState = isOpen ? openItems.filter((id) => id !== accordionId) : [...openItems, accordionId];
    setOpenItems(nextState);

    trackEvent("accordion.toggle", {
      page: pageName,
      chapter_id: page.id,
      chapter_title: page.nav,
      content_type: variant,
      element_id: accordionId,
      accordion_id: accordionId,
      accordion_title: item.heading,
      accordion_group: page.nav || page.title,
      interaction_state: isOpen ? "close" : "open",
      trigger_source: "accordion_toggle"
    });
  };

  return (
    <div className={`accordion-group accordion-group--${variant}`}>
      {items.map((item, index) => {
        const accordionId = item.id || `${page.id}-accordion-${index + 1}`;
        const contentId = `${accordionId}-content`;
        const isOpen = openItems.includes(accordionId);
        const answerLines = normalizeContent(item.answer);
        const teaserLines = normalizeContent(item.teaser);

        return (
          <section className={`accordion ${isOpen ? "is-open" : ""}`} key={accordionId}>
            <h3 className="accordion__heading">{item.heading}</h3>

            {teaserLines.length > 0 && (
              <div className="accordion__teaser">
                {teaserLines.map((line, teaserIndex) => <p key={`${accordionId}-teaser-${teaserIndex}`}>{line}</p>)}
              </div>
            )}

            <button
              type="button"
              className="accordion__toggle"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggleItem(item, index)}
            >
              <span>{isOpen ? "Antwort ausblenden" : "Antwort aufklappen"}</span>
              <span className="accordion__icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>

            <div id={contentId} className={`accordion__body ${isOpen ? "is-open" : ""}`}>
              {answerLines.map((line, answerIndex) => <p key={`${accordionId}-answer-${answerIndex}`}>{line}</p>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
