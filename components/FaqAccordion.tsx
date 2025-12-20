"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number }) {
  return (
    <div className="faq-list w-full">
      <Accordion
        type="single"
        collapsible
        defaultValue={items[defaultOpen] ? `item-${defaultOpen}` : undefined}
        className="w-full"
      >
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border border-border/40 rounded-xl mb-3 last:mb-0 px-4 md:px-5 bg-white shadow-sm"
          >
            <AccordionTrigger className="text-base md:text-lg font-medium text-text hover:no-underline hover:text-primary transition-colors text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-text-dim text-sm md:text-base leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
