import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './about.css';

const stats = [
  { value: 500, suffix: '+', label: 'Products' },
  { value: 10000, suffix: '+', label: 'Customers' },
  { value: 100, suffix: '%', label: 'Quality Checked' },
  { value: 2, suffix: '+', label: 'Years Active' },
];

const values = [
  {
    num: '01',
    title: 'Built for Tech',
    description:
      'Every product is engineered for compatibility with modern devices — cables, cases, stands, and beyond.',
  },
  {
    num: '02',
    title: 'Precision Sourced',
    description:
      'We test every accessory before it reaches you. No cheap knockoffs — only gear that performs.',
  },
  {
    num: '03',
    title: 'Fast & Reliable',
    description:
      'Quick dispatch, tracked shipping, and hassle-free returns. Your order, on time.',
  },
  {
    num: '04',
    title: 'Customer First',
    description:
      'Real support from real people. We're here before, during, and after your purchase.',
  },
];

const categories = [
  { icon: '⌨', label: 'Keyboards & Mice' },
  { icon: '🎧', label: 'Audio & Headsets' },
  { icon: '📱', label: 'Phone Accessories' },
  { icon: '💡', label: 'Desk & Lighting' },
  { icon: '🔌', label: 'Cables & Hubs' },
  { icon: '🖥', label: 'Monitors & Stands' },
];

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}{suffix}
    </span>
  );
}

export default function About() {
  const storyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLDivElement>(null);

  const storyInView = useInView(storyRef);
  const statsInView = useInView(statsRef);
  const valuesInView = useInView(valuesRef);
  const catsInView = useInView(catsRef);

  return (
    <div className="about-page">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-text animate-fade-in-up">
            <p className="about-tag">Tech Accessories Store</p>
            <h1 className="about-h1">
              Gear that keeps<br />
              up with you.
            </h1>
            <p className="about-lead">
              Alaa Accessories is a curated tech accessories store built for
              people who take their setup seriously. From desk essentials to
              mobile gear — we carry it all.
            </p>
            <div className="about-hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <a href="#our-story" className="btn btn-outline">Our Story</a>
            </div>
          </div>
          <div className="about-hero-visual animate-fade-in-up delay-1">
            <div className="about-logo-box">
              <img src="/logo.png" alt="Alaa Accessories logo" />
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="about-divider">
        <div className="container">
          <div className="about-marquee-wrap">
            {['Tech Accessories', '·', 'Premium Quality', '·', 'Fast Shipping', '·', 'Tested Gear', '·', 'Tech Accessories', '·', 'Premium Quality', '·', 'Fast Shipping', '·', 'Tested Gear'].map((t, i) => (
              <span key={i} className={t === '·' ? 'about-marquee-dot' : ''}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="about-stats-section">
        <div
          className={`container about-stats-grid ${statsInView ? 'in-view' : ''}`}
          ref={statsRef}
        >
          {stats.map((s, i) => (
            <div className="about-stat" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="about-stat-num">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section id="our-story" className="about-story-section">
        <div
          className={`container about-story-grid ${storyInView ? 'in-view' : ''}`}
          ref={storyRef}
        >
          <div className="about-story-left">
            <p className="about-section-tag">Who We Are</p>
            <h2>More than a store.<br />A tech community.</h2>
          </div>
          <div className="about-story-right">
            <p>
              We started Alaa Accessories because we were tired of compromising.
              Cheap cables that fry. Cases that crack. Stands that wobble. We
              built a store around one rule: <strong>only sell what we'd use ourselves.</strong>
            </p>
            <p>
              Every product goes through our own quality checklist before it
              ever reaches a customer. We source from trusted manufacturers, test
              compatibility with major devices, and back everything with our
              satisfaction guarantee.
            </p>
            <Link to="/shop" className="about-story-cta">
              Browse the collection →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES WE COVER ── */}
      <section className="about-cats-section" style={{ background: '#fafafa' }}>
        <div className="container">
          <div className={`about-cats-header ${catsInView ? 'in-view' : ''}`} ref={catsRef}>
            <p className="about-section-tag">What We Carry</p>
            <h2>Categories</h2>
          </div>
          <div className={`about-cats-grid ${catsInView ? 'in-view' : ''}`}>
            {categories.map((c, i) => (
              <Link
                to="/shop"
                className="about-cat-card"
                key={i}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="about-cat-icon">{c.icon}</span>
                <span className="about-cat-label">{c.label}</span>
                <span className="about-cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-values-section">
        <div className="container">
          <div className={`about-values-header ${valuesInView ? 'in-view' : ''}`} ref={valuesRef}>
            <p className="about-section-tag">Our Standards</p>
            <h2>Why customers choose us</h2>
          </div>
          <div className={`about-values-list ${valuesInView ? 'in-view' : ''}`}>
            {values.map((v, i) => (
              <div
                className="about-value-row"
                key={i}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="about-value-num">{v.num}</span>
                <div className="about-value-body">
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section">
        <div className="container about-cta-inner">
          <div>
            <h2>Ready to upgrade your setup?</h2>
            <p>Shop our full range of tech accessories — delivered fast.</p>
          </div>
          <Link to="/shop" className="btn btn-primary about-cta-btn">
            Shop Collection →
          </Link>
        </div>
      </section>

    </div>
  );
}
