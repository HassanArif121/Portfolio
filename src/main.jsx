import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  Code2,
  BrainCircuit,
  CheckCircle2,
  Download,
  GraduationCap,
  LayoutTemplate,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  Server,
  TriangleAlert,
  Workflow,
  X
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { portfolio } from "./portfolio-data";
import {
  AnimatedHeadline,
  CountUp,
  EASE,
  Marquee,
  Reveal,
  SlidingIndicator,
  ThemeToggle,
  useActiveSection,
  useSpotlight,
  useTheme
} from "./ui";
import "./styles.css";

// Base URL for the backend API. Empty in local dev (Vite proxy handles /api),
// set to the backend web-service URL in production via VITE_API_BASE_URL.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const NAV = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" }
];

const SKILL_ICONS = {
  layout: LayoutTemplate,
  server: Server,
  brain: BrainCircuit,
  workflow: Workflow
};

/* ------------------------------------------------------------------ */

function SectionHead({ index, title, aside }) {
  return (
    <Reveal className="section__head">
      <div>
        <p className="section__index mono">
          <b>{index}</b> {title.label}
        </p>
        <h2 className="section__title">{title.heading}</h2>
      </div>
      {aside && <p className="section__aside">{aside}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

const NAV_IDS = NAV.map((item) => item.id);

function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const navRef = useRef(null);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={stuck ? "header is-stuck" : "header"}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="shell header__inner">
          <a className="brand" href="#top" aria-label={`${portfolio.name}, home`}>
            <span className="brand__mark">{portfolio.initials}</span>
            <span className="brand__name">{portfolio.name}</span>
          </a>

          <nav className="nav" aria-label="Primary" ref={navRef}>
            <SlidingIndicator
              containerRef={navRef}
              activeSelector="a.is-active"
              className="nav__pill"
            />
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? "is-active" : ""}
                aria-current={active === item.id ? "true" : undefined}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <a className="btn btn--solid header__cta" href="#contact">
              Get in touch
              <ArrowUpRight size={17} />
            </a>
            <button
              className="icon-btn mobile-toggle"
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="drawer__panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="drawer__head">
                <span className="mono">Menu</span>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="drawer__links">
                {NAV.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.06, duration: 0.4, ease: EASE }}
                  >
                    <i>0{index + 1}</i>
                    {item.label}
                  </motion.a>
                ))}
              </div>

              <div className="drawer__foot">
                <span className="mono" style={{ color: "var(--ink-4)" }}>
                  Elsewhere
                </span>
                <a href={portfolio.contact.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -46]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="shell hero__grid">
        <div>
          <motion.p
            className="badge"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="badge__dot" />
            {portfolio.availability}
          </motion.p>

          <AnimatedHeadline lines={portfolio.headline} className="hero__title" />

          <motion.p
            className="hero__summary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          >
            {portfolio.summary}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          >
            <a className="btn btn--solid" href="#work">
              View selected work
              <ArrowUpRight size={17} />
            </a>
            <a className="btn btn--ghost" href="/assets/Hassan_Resume.pdf" download>
              Frontend CV
              <Download size={16} className="icon-down" />
            </a>
            <a className="btn btn--ghost" href="/assets/Muhammad_Hassan_Resume_AI_ML.pdf" download>
              AI/ML CV
              <Download size={16} className="icon-down" />
            </a>
          </motion.div>

          <motion.div
            className="hero__meta mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <span>
              <MapPin size={14} /> {portfolio.location}
            </span>
            <span>
              <GraduationCap size={14} /> ITU Lahore, class of 2026
            </span>
            <span>
              <Code2 size={14} /> {portfolio.role}
            </span>
          </motion.div>
        </div>

        <motion.div
          className="portrait"
          style={{ y: portraitY }}
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.25 }}
        >
          <div className="portrait__frame">
            <img
              src="/assets/muhammad-hassan-profile.png"
              alt={portfolio.name}
              width="820"
              height="1025"
            />
          </div>
          <motion.div
            className="portrait__tag"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
          >
            <strong>B.Sc. Computer Engineering</strong>
            <span>Class of 2026 · 3.30 CGPA</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Stats() {
  return (
    <div className="shell">
      <div className="stats">
        {portfolio.stats.map((stat, index) => (
          <Reveal className="stats__item" key={stat.label} delay={index}>
            <span className="stats__value">
              <CountUp value={stat.value} suffix={stat.suffix} plain={stat.plain} />
            </span>
            <span className="stats__label">{stat.label}</span>
            <span className="stats__note">{stat.note}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProjectCard({ project, index }) {
  const onMove = useSpotlight();
  const external = Boolean(project.href);

  return (
    <motion.article
      className={project.featured ? "card card--featured spotlight" : "card spotlight"}
      layout
      variants={{
        hidden: { opacity: 0, y: 26 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay: index * 0.06 } }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22 } }}
      onMouseMove={onMove}
    >
      <a
        href={external ? project.href : "#contact"}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <div className="card__media">
          <img src={project.image} alt="" loading="lazy" />
          {project.featured && <span className="card__flag">Featured</span>}
          <span className="card__open" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="card__body">
          <p className="card__meta">
            <span>{project.category}</span>
            <i />
            <span>{project.year}</span>
          </p>
          <h3 className="card__title">{project.title}</h3>
          <p className="card__text">{project.description}</p>
          <div className="tags">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </a>
    </motion.article>
  );
}

function Work() {
  const categories = ["All", "Web", "AI/ML", "Systems"];
  const [active, setActive] = useState("All");
  const filtersRef = useRef(null);
  const filtered = useMemo(
    () =>
      active === "All"
        ? portfolio.projects
        : portfolio.projects.filter((project) => project.category === active),
    [active]
  );

  return (
    <section className="section" id="work">
      <div className="shell">
        <SectionHead
          index="01"
          title={{ label: "Selected work", heading: "Things I have designed, built and shipped." }}
          aside="A mix of client sites, university research and product experiments — front-end craft on one side, applied computer vision on the other."
        />

        <div className="filters" role="tablist" aria-label="Filter projects" ref={filtersRef}>
          <SlidingIndicator
            containerRef={filtersRef}
            activeSelector="button.is-active"
            className="filters__pill"
          />
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active === category}
              className={active === category ? "is-active" : ""}
              onClick={() => setActive(category)}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>

        <motion.div className="projects" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard project={project} index={index} key={project.title} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Stack() {
  return (
    <section className="section section--alt" id="stack">
      <div className="shell">
        <SectionHead
          index="02"
          title={{ label: "Capabilities", heading: "The stack I reach for." }}
          aside="Comfortable owning a feature end to end — interface, API, data and the model behind it."
        />

        <div className="skills">
          {portfolio.skills.map((group, index) => {
            const Icon = SKILL_ICONS[group.icon] || CheckCircle2;
            return (
              <Reveal className="skill" key={group.title} delay={index}>
                <div className="skill__top">
                  <span className="skill__icon">
                    <Icon size={20} />
                  </span>
                  <h3>{group.title}</h3>
                </div>
                <p className="skill__blurb">{group.blurb}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Journey() {
  return (
    <section className="section" id="journey">
      <div className="shell">
        <SectionHead
          index="03"
          title={{ label: "Journey", heading: "Experience & education." }}
          aside="Four years of computer engineering at ITU Lahore, an industry internship, and cloud fundamentals along the way."
        />

        <div className="timeline">
          {portfolio.timeline.map((item, index) => (
            <Reveal className="entry" key={item.title} delay={index} as="article">
              <div className="entry__when">
                <time>{item.date}</time>
                <span className="entry__kind">{item.kind}</span>
              </div>
              <div className="entry__rail" aria-hidden="true">
                <span className="entry__dot" />
              </div>
              <div className="entry__body">
                <h3>{item.title}</h3>
                <p className="entry__org">{item.org}</p>
                {item.status && (
                  <span className="entry__status">
                    <CheckCircle2 size={13} />
                    {item.status}
                  </span>
                )}
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

// The API is hosted on a plan that spins the container down when idle, so the
// first request after a quiet period pays a ~30s cold start. These numbers are
// sized for that: wait long enough to outlast a boot, and warn the sender once
// it is clearly a wake-up rather than a hang.
const SEND_TIMEOUT_MS = 45000;
const SLOW_NOTICE_MS = 7000;

class TransportError extends Error {}

async function postContact(body) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } catch (error) {
    // Timed out or never reached the server — worth another attempt.
    throw new TransportError(error.name === "AbortError" ? "timeout" : "network");
  } finally {
    window.clearTimeout(timeoutId);
  }

  const data = await response.json().catch(() => null);

  // A failure with no API payload came from a gateway or proxy in front of a
  // still-booting service (Render answers 502/503 while a container wakes), not
  // from the app itself — that is worth another attempt.
  if (!response.ok && typeof data?.error !== "string") {
    throw new TransportError(`http-${response.status}`);
  }

  // The API answered for real, so retrying would just repeat the same rejection.
  if (!response.ok || !data.ok) {
    throw new Error(data?.error || "Message could not be sent.");
  }
  return data;
}

function Field({ id, label, value, onChange, onFocus, type = "text", required = false, rows }) {
  const shared = {
    id,
    value,
    required,
    onFocus,
    placeholder: " ",
    onChange: (event) => onChange(event.target.value)
  };
  return (
    <div className="field">
      {rows ? <textarea rows={rows} {...shared} /> : <input type={type} {...shared} />}
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const sectionRef = useRef(null);
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Wake the API as soon as someone reaches the contact section, so it is warm
  // by the time they finish typing. Fire-and-forget: failure here is harmless.
  const warmed = useRef(false);
  const warmUp = useCallback(() => {
    if (warmed.current) return;
    warmed.current = true;
    fetch(`${API_BASE}/api/health`, { cache: "no-store" }).catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) warmUp();
      },
      { rootMargin: "300px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [warmUp]);

  async function submit(event) {
    event.preventDefault();
    setStatus({ state: "loading", message: "Sending your message…" });

    const slowNotice = window.setTimeout(() => {
      setStatus((prev) =>
        prev.state === "loading"
          ? { state: "loading", message: "Waking the mail server — this can take up to a minute." }
          : prev
      );
    }, SLOW_NOTICE_MS);

    try {
      let data;
      try {
        data = await postContact(form);
      } catch (error) {
        // A cold start eats the first request; the retry lands on a warm server.
        if (!(error instanceof TransportError)) throw error;
        setStatus({ state: "loading", message: "Server was asleep — retrying…" });
        data = await postContact(form);
      }

      setForm(EMPTY_FORM);
      setStatus({
        state: "success",
        message: data.email === "sent"
          ? "Message sent. I'll reply by email shortly."
          : "Message received. I'll reply by email shortly."
      });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof TransportError
            ? `Couldn't reach the server. Please email me directly at ${portfolio.contact.email}.`
            : error.message
      });
    } finally {
      window.clearTimeout(slowNotice);
    }
  }

  const methods = [
    { icon: <Mail size={17} />, small: "Email", label: portfolio.contact.email, href: `mailto:${portfolio.contact.email}` },
    {
      icon: <Phone size={17} />,
      small: "Phone",
      label: portfolio.contact.phone,
      href: `tel:${portfolio.contact.phone.replaceAll("-", "").replace("+", "00")}`
    },
    { icon: <FaLinkedinIn size={16} />, small: "Network", label: "LinkedIn", href: portfolio.contact.linkedin, external: true },
    { icon: <FaGithub size={16} />, small: "Code", label: "GitHub", href: portfolio.contact.github, external: true }
  ];

  return (
    <section className="section section--alt" id="contact" ref={sectionRef}>
      <div className="shell">
        <SectionHead
          index="04"
          title={{ label: "Contact", heading: "Let's build something." }}
          aside="Open to full-time roles, internships and freelance builds. Tell me what you have in mind and I'll get back to you."
        />

        <div className="contact">
          <Reveal className="contact__aside">
            <p className="contact__lede">
              Whether it's a product front-end, an API, or a vision model that needs to become a
              usable tool — send a short note with the scope and timeline.
            </p>
            <div className="links">
              {methods.map((method) => (
                <a
                  key={method.small}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noreferrer" : undefined}
                >
                  <span className="links__icon">{method.icon}</span>
                  <span className="links__text">
                    <small>{method.small}</small>
                    <b>{method.label}</b>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="form" as="form" delay={1} onSubmit={submit}>
            <div className="form__row">
              <Field
                id="name"
                label="Your name"
                value={form.name}
                onChange={set("name")}
                onFocus={warmUp}
                required
              />
              <Field
                id="email"
                type="email"
                label="Email address"
                value={form.email}
                onChange={set("email")}
                onFocus={warmUp}
                required
              />
            </div>
            <Field
              id="subject"
              label="Subject"
              value={form.subject}
              onChange={set("subject")}
              onFocus={warmUp}
            />
            <Field
              id="message"
              label="What are you working on?"
              value={form.message}
              onChange={set("message")}
              onFocus={warmUp}
              rows={5}
              required
            />

            <div className="form__foot">
              <button className="btn btn--solid" type="submit" disabled={status.state === "loading"}>
                {status.state === "loading" ? "Sending…" : "Send message"}
                <Send size={16} />
              </button>
              <span className="form__note">Usually replies within a day.</span>
            </div>

            <AnimatePresence>
              {status.message && (
                <motion.p
                  className={`status ${status.state}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  role="status"
                >
                  {status.state === "loading" && <span className="spinner" />}
                  {status.state === "success" && <CheckCircle2 size={16} />}
                  {status.state === "error" && <TriangleAlert size={16} />}
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__cta" data-footer-cta>
          <Reveal as="h2">
            Have a project in mind? <span className="serif">Let's talk.</span>
          </Reveal>
          <Reveal delay={1}>
            <a className="btn btn--solid" href={`mailto:${portfolio.contact.email}`}>
              {portfolio.contact.email}
              <ArrowUpRight size={17} />
            </a>
          </Reveal>
        </div>
      </div>

      <span className="footer__word" aria-hidden="true">
        MUHAMMAD HASSAN
      </span>

      <div className="shell">
        <div className="footer__bar">
          <span>
            © {new Date().getFullYear()} {portfolio.name} · {portfolio.role}
          </span>
          <div className="footer__social">
            <a href={portfolio.contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub size={16} />
            </a>
            <a
              href={portfolio.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={16} />
            </a>
            <a href={`mailto:${portfolio.contact.email}`} aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
          <a className="to-top" href="#top">
            Back to top <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

function App() {
  const [theme, setTheme] = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} />
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
        <Marquee items={portfolio.marquee} />
        <Stats />
        <Work />
        <Stack />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = globalThis.__portfolioRoot || createRoot(rootElement);
globalThis.__portfolioRoot = root;
root.render(<App />);
