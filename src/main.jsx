import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Download,
  Mail,
  Menu,
  Phone,
  Send,
  Sparkles,
  X
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { portfolio } from "./portfolio-data";
import "./styles.css";

const reveal = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.76, ease: [0.22, 1, 0.36, 1] }
  }
};

function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`section ${className}`}>
      <motion.div
        className="section__header"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const navItems = ["work", "skills", "experience", "contact"];
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Muhammad Hassan home">
          <span>MH</span>
          <strong>Muhammad Hassan</strong>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item}`}>
              {item}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          <Mail size={17} />
          Contact
        </a>
        <button
          className="icon-button mobile-toggle"
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mobile-menu__panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            >
              <button
                className="icon-button"
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
              {navItems.map((item) => (
                <a key={item} href={`#${item}`} onClick={() => setOpen(false)}>
                  {item}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  return (
    <main id="top" className="hero">
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">
          <Sparkles size={18} /> Available for full-stack and AI projects
        </p>
        <h1 className="hero-title">
          <span className="hero-title__focus">AI/ML + Full Stack</span>
          <span className="hero-title__role">Developer</span>
          <span className="hero-title__support">
            building sharp web products with intelligent systems.
          </span>
        </h1>
        <p className="hero__summary">{portfolio.summary}</p>
        <div className="hero__actions">
          <a className="button button--dark" href="#work">
            View work <ArrowUpRight size={18} />
          </a>
          <a className="button button--light" href="/assets/Hassan_Resume.pdf" download>
            Frontend resume <Download size={18} />
          </a>
          <a className="button button--light" href="/assets/Muhammad_Hassan_Resume_AI_ML.pdf" download>
            AI/ML resume <Download size={18} />
          </a>
        </div>
      </motion.div>

      <motion.div
        className="hero__portrait-wrap"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src="/assets/muhammad-hassan-profile.png" alt="Muhammad Hassan" />
      </motion.div>

      <motion.div
        className="hero__ticker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span>React</span>
        <span>Express</span>
        <span>MongoDB</span>
        <span>Computer Vision</span>
        <span>YOLO</span>
        <span>Python</span>
      </motion.div>
    </main>
  );
}

function AboutStrip() {
  return (
    <motion.section
      className="about-strip"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      {portfolio.stats.map((stat) => (
        <div key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </motion.section>
  );
}

function Projects() {
  const categories = ["All", "Web", "AI/ML", "Systems"];
  const [active, setActive] = useState("All");
  const filtered = useMemo(
    () =>
      active === "All"
        ? portfolio.projects
        : portfolio.projects.filter((project) => project.category === active),
    [active]
  );

  return (
    <Section id="work" eyebrow="Selected Work" title="Projects with product polish and engineering depth.">
      <div className="filters" role="tablist" aria-label="Project filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={active === category ? "is-active" : ""}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div className="project-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.article
              className="project-card"
              key={project.title}
              layout
              variants={reveal}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
            >
              <a href={project.href || "#contact"} target={project.href ? "_blank" : undefined} rel="noreferrer">
                <div className="project-card__media">
                  <img src={project.image} alt="" />
                  <span>{project.href ? "Open project" : "Ask for details"}</span>
                </div>
                <div className="project-card__body">
                  <div className="project-card__meta">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="stack">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Capabilities" title="Frontend craft, backend APIs, and model-driven workflows.">
      <div className="skill-grid">
        {portfolio.skills.map((group, index) => (
          <motion.article
            className="skill-card"
            key={group.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            transition={{ delay: index * 0.08 }}
          >
            <BrainCircuit size={24} />
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Background" title="Computer engineering foundation with practical delivery.">
      <div className="timeline">
        {portfolio.timeline.map((item, index) => (
          <motion.article
            className="timeline-item"
            key={item.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            transition={{ delay: index * 0.08 }}
          >
            <span>{item.date}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function submit(event) {
    event.preventDefault();
    setStatus({ state: "loading", message: "Sending..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Message failed.");
      }

      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus({ state: "success", message: "Message saved successfully. I will review it and reply by email." });
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Start a conversation about your next product or AI idea."
      className="contact-section"
    >
      <div className="contact-layout">
        <motion.div
          className="contact-panel"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          <div className="contact-panel__intro">
            <span>Open to</span>
            <h3>Internships, freelance builds, AI dashboards, and full-stack product work.</h3>
            <p>
              Send a short note with the role, project scope, or collaboration idea. I usually respond through email.
            </p>
          </div>
          <div className="contact-methods">
            <a href={`mailto:${portfolio.contact.email}`}>
              <span className="contact-methods__icon"><Mail size={20} /></span>
              <span>
                <small>Email</small>
                {portfolio.contact.email}
              </span>
            </a>
            <a href={`tel:${portfolio.contact.phone.replaceAll("-", "").replace("+", "00")}`}>
              <span className="contact-methods__icon"><Phone size={20} /></span>
              <span>
                <small>Phone</small>
                {portfolio.contact.phone}
              </span>
            </a>
            <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">
              <span className="contact-methods__icon"><FaLinkedinIn /></span>
              <span>
                <small>Network</small>
                LinkedIn
              </span>
            </a>
            <a href={portfolio.contact.github} target="_blank" rel="noreferrer">
              <span className="contact-methods__icon"><FaGithub /></span>
              <span>
                <small>Code</small>
                GitHub
              </span>
            </a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={submit}
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          <div className="contact-form__header">
            <span>Direct message</span>
            <h3>Tell me what you want to build.</h3>
          </div>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            Subject
            <input
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
            />
          </label>
          <label>
            Message
            <textarea
              required
              rows="5"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
            />
          </label>
          <button className="button button--dark" type="submit" disabled={status.state === "loading"}>
            Send message <Send size={18} />
          </button>
          {status.message && <p className={`form-status ${status.state}`}>{status.message}</p>}
        </motion.form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Muhammad Hassan</span>
      <span>AI/ML + Full Stack Developer</span>
      <a href="#top">Back to top</a>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <Hero />
      <AboutStrip />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = globalThis.__portfolioRoot || createRoot(rootElement);
globalThis.__portfolioRoot = root;
root.render(<App />);
