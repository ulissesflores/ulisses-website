'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  sectionTitle?: string;
}

export function FaqSection({ items, sectionTitle = 'FAQ' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
      <h2 className='text-2xl font-semibold text-white mb-6'>{sectionTitle}</h2>

      <div className='space-y-2'>
        {items.map((item, index) => (
          <div
            key={item.question}
            className='rounded-xl border border-neutral-800 bg-neutral-950/60 overflow-hidden'
          >
            <button
              type='button'
              onClick={() => toggle(index)}
              className='w-full flex items-center justify-between px-5 py-4 text-start group'
            >
              <span className='text-sm font-medium text-neutral-200 group-hover:text-emerald-300 transition-colors pe-4'>
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-neutral-500 shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180 text-emerald-400' : ''
                }`}
              />
            </button>

            {openIndex === index && (
              <div className='px-5 pb-4'>
                <p className='text-sm text-neutral-400 leading-relaxed'>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
