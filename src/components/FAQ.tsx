import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="container mx-auto py-16 max-w-3xl">
      <h2 id="faq-title" className="text-2xl md:text-3xl font-bold">FAQ</h2>
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="a1">
          <AccordionTrigger>When does minting open?</AccordionTrigger>
          <AccordionContent>
            As soon as the Candy Machine is configured and live. Stay tuned on Twitter/Discord.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="a2">
          <AccordionTrigger>How many can I mint?</AccordionTrigger>
          <AccordionContent>
            Supply is capped at 404. Per-wallet limits may apply during public mint.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="a3">
          <AccordionTrigger>Where can I trade after mint?</AccordionTrigger>
          <AccordionContent>
            On supported Solana marketplaces. Official links will be posted after reveal.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
