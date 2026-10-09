import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './about.css';

const stats = [
  { value: '500+', label: 'Products Available' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '5★', label: 'Average Rating' },
  { value: '2+', label: 'Years of Excellence' },
];

const values = [
  {
    icon: '✦',
    title: 'Premium Quality',
    description:
      'Every accessory is carefully selected and quality-checked to ensure you receive nothing but the best.',
  },
  {
    icon: '◈',
    title: 'Curated Selection',
    description:
      'We handpick only the most stylish and functional pieces — no clutter, only essentials that matter.',
  },
  {
    icon: '⟡',
    title: 'Fast Delivery',
    description:
      'We ship quickly and securely so your order arrives on time, every time, right to your doorstep.',
  },
  {
    icon: '◇',
    title: 'Customer First',
    description:
      'Your satisfaction is our mission. We stand behind every product with dedicated support.',
  },
];

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function AnimatedCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d]/g, '');
    if (isNaN(num)) { setDisplay(target); return; }
    let start = 0;
    const duration = 1600;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setDisplay(start + suffix);
      if (start >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{display}</span>;
}

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const storyInView = useInView(storyRef);
  const valuesInView = useInView(valuesRef);
  const statsInView = useInView(statsRef);

  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero-bg">
          <div className="about-hero-orb orb-1" />
          <div className="about-hero-orb orb-2" />
          <div className="about-hero-grid" />
        </div>
        <div className="container about-hero-content">
          <span className="about-eyebrow">Our Story</span>
          <h1 className="about-hero-title">
            Crafted with <span className="about-hero-accent">passion</span>,<br />
            worn with pride.
          </h1>
          <p className="about-hero-desc">
            Alaa Accessories was born from a love for style and a belief that
            great accessories shouldn't cost a fortune — they should be
            accessible, premium, and timeless.
          </p>
          <div className="about-hero-cta">
            <Link to="/shop" className="btn btn-primary about-btn-primary">
              Shop Collection
            </Link>
            <a href="#story" className="btn btn-outline about-btn-outline">
              Learn More ↓
            </a>
          </div>
        </div>
        <div className="about-hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="story" className="about-story" ref={storyRef}>
        <div className={`container about-story-inner ${storyInView ? 'in-view' : ''}`}>
          <div className="about-story-visual">
            <div className="about-logo-frame">
              <img src="/logo.png" alt="Alaa Accessories" className="about-logo-large" />
              <div className="about-logo-ring ring-1" />
              <div className="about-logo-ring ring-2" />
            </div>
          </div>
          <div className="about-story-text">
            <span className="about-eyebrow">Who We Are</span>
            <h2>More than a store —<br />a lifestyle.</h2>
            <p>
              Founded with a clear vision: to bring premium accessories to
              everyone. At Alaa Accessories, we believe that the details make
              the difference. From the clasp of a bracelet to the finish of a
              watch strap, we obsess over quality so you don't have to.
            </p>
            <p>
              Every product in our collection is thoughtfully sourced, rigorously
              tested, and beautifully presented — because you deserve nothing
              less than extraordinary.
            </p>
            <Link to="/shop" className="about-story-link">
              Explore our collection →
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats" ref={statsRef}>
        <div className={`container about-stats-grid ${statsInView ? 'in-view' : ''}`}>
          {stats.map((s, i) => (
            <div className="about-stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="about-stat-value">
                <AnimatedCounter target={s.value} />
              </div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values" ref={valuesRef}>
        <div className="container">
          <div className={`about-values-header ${valuesInView ? 'in-view' : ''}`}>
            <span className="about-eyebrow">What Drives Us</span>
            <h2>Our Core Values</h2>
            <p>The principles that guide every decision we make.</p>
          </div>
          <div className={`about-values-grid ${valuesInView ? 'in-view' : ''}`}>
            {values.map((v, i) => (
              <div className="about-value-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="about-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="about-cta">
        <div className="about-cta-bg">
          <div className="about-cta-orb" />
        </div>
        <div className="container about-cta-content">
          <h2>Ready to elevate your style?</h2>
          <p>Discover our full collection of premium accessories.</p>
          <Link to="/shop" className="btn about-cta-btn">
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
