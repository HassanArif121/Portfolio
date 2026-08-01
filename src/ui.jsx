import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------
   Reveal — the single scroll-in animation used across every section.
   ------------------------------------------------------------------ */

export const revealVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.07 }
  })
};

export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={revealVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   Theme — persisted, system-aware, animated with View Transitions.
   ------------------------------------------------------------------ */

function currentTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* private mode — the in-memory value still works for this session */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0d0d0e" : "#f6f4f1");
  }, [theme]);

  // Follow the OS until the visitor makes an explicit choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      let explicit = null;
      try {
        explicit = localStorage.getItem("theme-explicit");
      } catch {
        /* ignore */
      }
      if (!explicit) setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return [theme, setTheme];
}

export function ThemeToggle({ theme, setTheme }) {
  const reduceMotion = useReducedMotion();

  const toggle = useCallback(
    (event) => {
      const next = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme-explicit", "1");
      } catch {
        /* ignore */
      }

      // Circular wipe out from the button. Falls back to a plain swap.
      if (reduceMotion || typeof document.startViewTransition !== "function") {
        setTheme(next);
        return;
      }

      const { clientX: x, clientY: y } = event;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
          },
          {
            duration: 620,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
    },
    [theme, setTheme, reduceMotion]
  );

  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          style={{ display: "grid", placeItems: "center" }}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------------------------------------------
   CountUp — animates numeric stats once they scroll into view.
   ------------------------------------------------------------------ */

export function CountUp({ value, suffix = "", plain = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const target = Number.parseFloat(value);
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;
  const still = plain || reduceMotion || Number.isNaN(target);
  const [display, setDisplay] = useState(still ? value : (0).toFixed(decimals));

  useEffect(() => {
    if (!inView || still) return undefined;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (latest) => setDisplay(latest.toFixed(decimals))
    });
    return () => controls.stop();
  }, [inView, still, target, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix ? <em>{suffix}</em> : null}
    </span>
  );
}

/* ------------------------------------------------------------------
   Spotlight — tracks the pointer so cards light up under the cursor.
   ------------------------------------------------------------------ */

export function useSpotlight() {
  return useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
}

/* ------------------------------------------------------------------
   useActiveSection — drives the nav indicator.
   ------------------------------------------------------------------ */

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ------------------------------------------------------------------
   SlidingIndicator — a pill that follows the active child. Measured
   directly rather than via layout projection, which mis-sizes
   absolutely positioned elements on first mount.
   ------------------------------------------------------------------ */

export function SlidingIndicator({ containerRef, activeSelector, className }) {
  const [box, setBox] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const target = container?.querySelector(activeSelector);
      if (!container || !target) {
        setBox(null);
        return;
      }
      const outer = container.getBoundingClientRect();
      const inner = target.getBoundingClientRect();
      const styles = getComputedStyle(container);
      const next = {
        // Absolute children are placed against the padding box, so the
        // container's own border has to come off the offset.
        x: inner.left - outer.left - Number.parseFloat(styles.borderLeftWidth),
        y: inner.top - outer.top - Number.parseFloat(styles.borderTopWidth),
        width: inner.width,
        height: inner.height
      };
      setBox((prev) =>
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  });

  if (!box) return null;

  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={false}
      animate={box}
      transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.7 }}
    />
  );
}

/* ------------------------------------------------------------------
   AnimatedHeadline — word-by-word mask reveal for the hero.
   Words are inline-block with a margin instead of literal spaces so
   each one can be transformed independently and still wrap.
   ------------------------------------------------------------------ */

export function AnimatedHeadline({ lines, className = "" }) {
  const reduceMotion = useReducedMotion();
  let order = 0;

  return (
    <h1 className={className}>
      {lines.map((segments, lineIndex) => (
        <span className="line" key={lineIndex}>
          {segments.flatMap((segment, segmentIndex) =>
            segment.text
              .split(" ")
              .filter(Boolean)
              .map((word, wordIndex) => {
                const delay = 0.16 + order * 0.055;
                order += 1;
                return (
                  <motion.span
                    className={segment.em ? "word serif" : "word"}
                    key={`${lineIndex}-${segmentIndex}-${wordIndex}`}
                    initial={reduceMotion ? false : { y: "108%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.85, ease: EASE, delay }}
                  >
                    {word}
                  </motion.span>
                );
              })
          )}
        </span>
      ))}
    </h1>
  );
}

/* ------------------------------------------------------------------
   Marquee — seamless loop built from two identical tracks.
   ------------------------------------------------------------------ */

export function Marquee({ items }) {
  const track = (
    <div className="marquee__track">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );

  return (
    <div className="marquee" aria-hidden="true">
      {track}
      {track}
    </div>
  );
}
