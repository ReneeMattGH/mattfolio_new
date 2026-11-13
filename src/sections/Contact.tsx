import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { profile } from '../data/profile';
import { copyText } from '../lib/clipboard';

type FormValues = { name: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error' | 'mailto';
type Toast = 'copied' | 'failed' | null;

const emptyValues: FormValues = { name: '', email: '', message: '' };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (values.message.trim().length < 10) {
    errors.message = 'A sentence or two about the work helps.';
  }
  return errors;
}

function mailtoHref(values: FormValues): string {
  const subject = encodeURIComponent(
    `Portfolio enquiry${values.name.trim() ? ` from ${values.name.trim()}` : ''}`,
  );
  const body = encodeURIComponent(
    `${values.message}\n\n— ${values.name}\n${values.email}`,
  );
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [toast, setToast] = useState<Toast>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const showToast = (next: Exclude<Toast, null>) => {
    setToast(next);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 2600);
  };

  const copyEmail = async () => {
    const copied = await copyText(profile.email);
    showToast(copied ? 'copied' : 'failed');
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === 'error' || status === 'mailto') setStatus('idle');
  };

  const sendMessage = async (
    payload: FormValues,
  ): Promise<'sent' | 'mailto' | 'failed'> => {
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...payload,
          _subject: `Portfolio enquiry from ${payload.name}`,
        }),
      });
      return response.ok ? 'sent' : 'failed';
    }

    if (serviceId && templateId && publicKey) {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: payload.name,
            reply_to: payload.email,
            message: payload.message,
          },
        }),
      });
      return response.ok ? 'sent' : 'failed';
    }

    window.location.href = mailtoHref(payload);
    return 'mailto';
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      const firstInvalid = nextErrors.name
        ? 'contact-name'
        : nextErrors.email
          ? 'contact-email'
          : 'contact-message';
      window.requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }

    setStatus('submitting');
    try {
      const result = await sendMessage(values);
      if (result === 'failed') throw new Error('Send failed');
      if (result === 'sent') {
        setStatus('success');
        setValues(emptyValues);
      } else {
        setStatus('mailto');
      }
    } catch {
      setStatus('error');
    }
  };

  const hasEndpoint = Boolean(
    import.meta.env.VITE_FORM_ENDPOINT ||
      (import.meta.env.VITE_EMAILJS_SERVICE_ID &&
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY),
  );

  return (
    <section id="contact" className="section">
      <div className="shell">
        <SectionHeader
          index="07"
          label="Contact"
          title={
            <>
              Let&apos;s build something <span className="text-outline">reliable<span className="title-punct">.</span></span>
            </>
          }
          description="Open to engineering roles, Chennai or remote."
        />

        <div className="grid gap-4 md:grid-cols-12">
          <div className="min-w-0 md:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="kicker text-accent">[ Direct ]</span>
                <span aria-hidden="true" className="h-px w-7 bg-accent/50" />
                <span className="kicker text-faint">Email</span>
              </div>

              <a
                href={`mailto:${profile.email}`}
                className="group mt-5 flex items-end justify-between gap-5 border-b border-line pb-5"
              >
                <span className="break-all text-[clamp(1.45rem,3.6vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.04em] text-ink transition-colors duration-300 group-hover:text-accent">
                  {profile.email}
                </span>
                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="mb-1.5 shrink-0 text-faint transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                />
              </a>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="control inline-flex items-center gap-2 rounded-field px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted"
                  aria-label="Copy email address"
                >
                  {toast === 'copied' ? (
                    <Check size={13} className="text-accent" />
                  ) : (
                    <Copy size={13} />
                  )}
                  {toast === 'copied' ? 'Copied' : 'Copy'}
                </button>
                <span className="kicker text-faint">{profile.status}</span>
              </div>

              <p className="mt-4 max-w-[48ch] text-[14px] leading-[1.65] text-muted">
                For roles, collaborations or a technical conversation, email is the
                fastest route.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="data-console mt-9 p-6 md:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.08]">
                        <Check size={15} className="text-accent" />
                      </span>
                      <p className="text-[16px] font-medium text-ink">Message sent.</p>
                    </div>
                    <p className="mt-3 max-w-[46ch] text-[14px] leading-[1.65] text-muted">
                      Thanks — I&apos;ll reply to the email you provided.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mono-label mt-6 inline-flex items-center gap-2 transition-colors hover:text-ink"
                    >
                      Send another message
                      <ArrowUpRight size={12} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onSubmit={onSubmit}
                    noValidate
                    className="data-console mt-9 p-6 md:p-7"
                  >
                  <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
                    <span className="kicker text-accent">[ Brief ]</span>
                    <span className="kicker text-faint">
                      {hasEndpoint ? 'Direct send' : 'Email draft'}
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-name" className="mono-label">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        className="field"
                        placeholder="Your name"
                        value={values.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      />
                      {errors.name ? (
                        <p id="contact-name-error" role="alert" className="text-[12px] text-ink">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-email" className="mono-label">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="field"
                        placeholder="you@company.com"
                        value={values.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      />
                      {errors.email ? (
                        <p id="contact-email-error" role="alert" className="text-[12px] text-ink">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <label htmlFor="contact-message" className="mono-label">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      className="field resize-y"
                      placeholder="What are you building?"
                      value={values.message}
                      onChange={(event) => updateField('message', event.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                    {errors.message ? (
                      <p id="contact-message-error" role="alert" className="text-[12px] text-ink">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send message'}
                      {status === 'submitting' ? null : (
                        <ArrowUpRight size={14} className="btn-arrow" />
                      )}
                    </button>
                    <p className="mono-label">
                      {hasEndpoint ? 'Sent securely' : 'Opens your email app'}
                    </p>
                  </div>

                  <div aria-live="polite">
                    {status === 'error' ? (
                      <p className="mt-4 text-[13px] leading-[1.6] text-ink">
                        Sending failed. Please email{' '}
                        <a href={`mailto:${profile.email}`} className="link-underline">
                          {profile.email}
                        </a>{' '}
                        directly.
                      </p>
                    ) : null}
                    {status === 'mailto' ? (
                      <p className="mt-4 text-[13px] leading-[1.6] text-muted">
                        Your email app should open with the message ready. If it does not,
                        write to{' '}
                        <a href={`mailto:${profile.email}`} className="link-underline text-ink">
                          {profile.email}
                        </a>
                        .
                      </p>
                    ) : null}
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </Reveal>
          </div>

          <Reveal className="h-full min-w-0 md:col-span-5" delay={0.04}>
            <div className="data-console flex h-full flex-col p-6 md:p-7">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <span className="kicker text-faint">Elsewhere</span>
                <span className="kicker tabular text-faint">
                  {String(profile.socials.length).padStart(2, '0')}
                </span>
              </div>

              <ul className="-mb-px">
                {profile.socials.map((social, index) => (
                  <li key={social.label} className="border-b border-line last:border-b-0">
                    <a
                      href={social.href}
                      {...(social.href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                      className="group row-hover flex items-center justify-between gap-4 py-4 pl-4"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[9px] tabular text-faint">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[15px] text-ink transition-colors">
                          {social.label}
                        </span>
                      </span>
                      <span className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-faint">
                        <span className="truncate">{social.handle}</span>
                        <ArrowUpRight
                          size={12}
                          className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-line pt-5">
                <span className="kicker text-faint">Availability</span>
                <p className="mt-2 flex items-start gap-2 text-[13px] leading-[1.6] text-muted">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-mint status-dot" />
                  {profile.status}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 left-5 right-5 z-[85] flex items-center gap-2 rounded-field border border-line bg-surface px-4 py-3 sm:left-auto sm:right-5 sm:w-auto"
          >
            {toast === 'copied' ? (
              <Check size={14} className="text-accent" />
            ) : (
              <Copy size={14} className="text-faint" />
            )}
            <span className="text-[13px] text-ink">
              {toast === 'copied'
                ? 'Email copied to clipboard'
                : 'Copy failed — select the address above'}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
