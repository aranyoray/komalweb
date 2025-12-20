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
            className="border-b border-border/60 last:border-0 px-0"
          >
            <AccordionTrigger className="text-lg font-medium text-text hover:no-underline hover:text-primary transition-colors py-6 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-text-dim text-base leading-relaxed pb-8">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
