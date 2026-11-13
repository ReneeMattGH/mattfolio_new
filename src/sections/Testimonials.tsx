import { ArrowUpRight } from 'lucide-react';
import { AnimatedTitle } from '../components/AnimatedTitle';
import { Reveal } from '../components/Reveal';
import { testimonials } from '../data/testimonials';

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section">
      <div className="shell">
        <header className="mb-12 md:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <span className="kicker text-accent">[ Collaborators ]</span>
              <span aria-hidden="true" className="h-px w-7 bg-accent/50" />
              <span className="kicker text-muted">Testimonials</span>
            </div>
            <span className="kicker tabular text-faint">
              {String(testimonials.length).padStart(2, '0')} quotes
            </span>
          </div>

          <AnimatedTitle className="h-section mt-8">
            Words from people I have <span className="text-outline">built</span> with.
          </AnimatedTitle>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={`${testimonial.name}-${index}`} delay={index * 0.05} className="h-full">
              <figure className="flex h-full flex-col rounded-card border border-line bg-surface p-6 md:p-7">
                <span className="kicker tabular text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <blockquote className="mt-4 flex-1 text-[15px] leading-[1.7] text-muted">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <p className="text-[14px] font-medium text-ink">{testimonial.name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                    {testimonial.role} · {testimonial.company}
                  </p>
                  {testimonial.href ? (
                    <a
                      href={testimonial.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink"
                    >
                      Profile
                      <ArrowUpRight size={11} aria-hidden="true" />
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
