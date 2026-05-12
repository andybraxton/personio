'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SitePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      {/* NAV */}
      <nav className="nav" aria-label="Main navigation">
        <div className="container">
          <div className="nav__inner">
            <a className="nav__logo" href="/site" aria-label="High Trust Co. — home">High Trust Digital</a>
            <ul className="nav__links" role="list">
              <li><a href="/site/approach">Approach</a></li>
              <li><a href="/site/work">Work</a></li>
              <li><a href="/site/industries">Industries</a></li>
              <li><a href="/site/about">About</a></li>
              <li><a href="/site/insights">Insights</a></li>
            </ul>
            <a href="/site/contact" className="btn btn--primary">
              Let&apos;s talk
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button
              className="nav__hamburger"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className={`nav__mobile${mobileNavOpen ? ' is-open' : ''}`} id="mobile-nav" role="navigation" aria-label="Mobile navigation">
          <a href="/site/approach">Approach</a>
          <a href="/site/work">Work</a>
          <a href="/site/industries">Industries</a>
          <a href="/site/about">About</a>
          <a href="/site/insights">Insights</a>
          <a href="/site/contact" style={{ color: 'var(--orange)', fontWeight: 700 }}>Let&apos;s talk →</a>
        </div>
      </nav>

      {/* HERO */}
      <main id="main-content">
        <section className="hero">
          <div className="container">
            <div className="hero__inner">
              <div className="hero__content">
                <h1>Most websites lose customers at moments of hesitation.</h1>
                <p className="lead">We identify where buyers lose confidence in your website, then fix the friction preventing them from taking action.</p>
                <div className="hero__actions">
                  <a href="/site/contact" className="btn btn--primary">
                    Book a chat
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="/site/work" className="btn btn--outline">How we work</a>
                </div>
              </div>
              <div className="hero__image" role="img" aria-label="Architectural staircase representing structured, upward progression">
                <div className="hero__image-placeholder">
                  <Image
                    src="/site/images/audit-example.png"
                    alt="Annotated homepage audit example"
                    width={600}
                    height={450}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            {/* Logo strip */}
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--light-grey)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(44,44,58,0.4)', marginBottom: 20 }}>BUILT FOR</p>
              <div className="logo-strip" role="list" aria-label="Client types">
                <div className="logo-strip__item" role="listitem"><span style={{ fontWeight: 400, opacity: 0.8 }}>HOME SERVICES</span></div>
                <div className="logo-strip__item" role="listitem"><span style={{ fontWeight: 400, opacity: 0.8 }}>COMPLEX BUYING DECISIONS</span></div>
                <div className="logo-strip__item" role="listitem"><span style={{ fontWeight: 400, opacity: 0.8 }}>HIGH-TICKET SERVICES</span></div>
                <div className="logo-strip__item" role="listitem"><span style={{ fontWeight: 400, opacity: 0.8 }}>HEALTHCARE PROVIDERS</span></div>
                <div className="logo-strip__item" role="listitem"><span style={{ fontWeight: 400, opacity: 0.8 }}>CONSULTANCIES</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR SYSTEM */}
        <section className="system" aria-labelledby="system-heading">
          <div className="container">
            <div className="system__header">
              <span className="label label--light">Our System</span>
              <h2 id="system-heading">A system for turning more of your existing traffic into revenue, consistently.</h2>
            </div>
            <div className="system__grid">
              <div className="system__step">
                <div className="system__step-num" aria-hidden="true">
                  01
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Accelerate</h3>
                <p>Fix what&apos;s broken now. Rapid diagnostics and high-impact changes that drive immediate results.</p>
                <div className="system__result">
                  <span className="label">Result</span>
                  <div className="system__result-text">More leads in weeks,<br />not months.</div>
                </div>
              </div>
              <div className="system__step">
                <div className="system__step-num" aria-hidden="true">
                  02
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Optimise</h3>
                <p>Improve performance across the full journey. Refine messaging, UX, and flows to increase conversions at every step.</p>
                <div className="system__result">
                  <span className="label">Result</span>
                  <div className="system__result-text">Compounding growth, without the extra workload.</div>
                </div>
              </div>
              <div className="system__step">
                <div className="system__step-num" aria-hidden="true">
                  03
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Scale</h3>
                <p>Embed systems that drive compounding growth. Continuous optimisation loops, team alignment, and processes that scale without dependency.</p>
                <div className="system__result">
                  <span className="label">Result</span>
                  <div className="system__result-text">Long-term,<br />compounding growth.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE REAL PROBLEM */}
        <section className="problem" aria-labelledby="problem-heading">
          <div className="container">
            <div className="problem__inner">
              <div className="problem__left">
                <span className="label">The Real Problem</span>
                <h2 id="problem-heading">Most products don&apos;t have a traffic problem. They have a decision problem.</h2>
              </div>
              <div className="problem__cards">
                <div className="problem__card">
                  <div className="problem__card-icon" aria-hidden="true">
                    <svg viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M14 9v6M14 18v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p>Users hesitate because key questions aren&apos;t answered.</p>
                </div>
                <div className="problem__card">
                  <div className="problem__card-icon" aria-hidden="true">
                    <svg viewBox="0 0 28 28" fill="none">
                      <path d="M14 3L4 8v7c0 5 4.5 9.3 10 10 5.5-.7 10-5 10-10V8L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>Trust is built inconsistently or too late in the journey.</p>
                </div>
                <div className="problem__card">
                  <div className="problem__card-icon" aria-hidden="true">
                    <svg viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M14 8v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>Critical information arrives too late — or is missing entirely.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="services" aria-labelledby="services-heading">
          <div className="container">
            <div className="services__inner">
              <div className="services__left">
                <span className="label">What We Do</span>
                <h2 id="services-heading">Built for teams who need results, not reports.</h2>
                <p>We combine product thinking, UX expertise, and behavioural insight to remove friction, build trust, and design experiences that convert — and keep converting.</p>
                <a href="/site/approach" className="btn btn--ghost">
                  Learn more about our approach
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              <div className="services__grid">
                <div className="services__item">
                  <div className="services__item-icon" aria-hidden="true">
                    <svg viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="18" cy="18" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M18 4v4M18 28v4M4 18h4M28 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h4>Diagnose</h4>
                  <p>Identify where trust breaks down and decisions stall.</p>
                </div>
                <div className="services__item">
                  <div className="services__item-icon" aria-hidden="true">
                    <svg viewBox="0 0 36 36" fill="none">
                      <rect x="6" y="6" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 18l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Restructure</h4>
                  <p>Reframe messaging, information hierarchy, and user flow.</p>
                </div>
                <div className="services__item">
                  <div className="services__item-icon" aria-hidden="true">
                    <svg viewBox="0 0 36 36" fill="none">
                      <rect x="4" y="8" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 32h12M18 28v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h4>Design &amp; Validate</h4>
                  <p>Create concepts, prototypes, and test to reduce risk.</p>
                </div>
                <div className="services__item">
                  <div className="services__item-icon" aria-hidden="true">
                    <svg viewBox="0 0 36 36" fill="none">
                      <path d="M6 26l8-10 6 6 6-8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Embed &amp; Scale</h4>
                  <p>Implement and build systems for continuous improvement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENGAGEMENT CTA BAND */}
        <section className="cta-band" aria-label="Start an engagement">
          <div className="container">
            <div className="cta-band__inner">
              <div className="cta-band__left">
                <div className="cta-band__arrow-circle" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10h14M11 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="cta-band__text">
                  <h3>Start with a focused engagement.</h3>
                  <p>Perfect for smaller teams or a first step towards bigger change. Delivered in 7 business days.</p>
                </div>
              </div>
              <div className="cta-band__right">
                <a href="/site/contact" className="btn btn--primary">
                  Book my free homepage review
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="/site/approach" className="btn btn--ghost-light">
                  What&apos;s included
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__brand">
              <a className="nav__logo" href="/site">High Trust Co.</a>
              <p>We help product and growth teams build trust, reduce friction, and drive meaningful outcomes.</p>
            </div>
            <div className="footer__col">
              <h5>Navigation</h5>
              <ul>
                <li><a href="/site/approach">Approach</a></li>
                <li><a href="/site/work">Work</a></li>
                <li><a href="/site/industries">Industries</a></li>
                <li><a href="/site/insights">Insights</a></li>
                <li><a href="/site/about">About</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h5>Industries</h5>
              <ul>
                <li><a href="/site/industries/healthcare">Healthcare</a></li>
                <li><a href="/site/industries/home-services">Home Services</a></li>
                <li><a href="/site/industries/industrial">Industrial</a></li>
                <li><a href="/site/industries/professional-services">Professional Services</a></li>
                <li><a href="/site/industries/smb">SMB</a></li>
                <li><a href="/site/industries/sustainability">Sustainability</a></li>
              </ul>
            </div>
            <div className="footer__contact">
              <h5>Let&apos;s work together</h5>
              <a href="mailto:hello@hightrust.co">hello@hightrust.co</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-label="(opens in new tab)">↗</span></a>
            </div>
          </div>
          <div className="footer__bottom">
            <p>&copy; 2026 High Trust Co. All rights reserved.</p>
            <p><a href="/site/privacy" style={{ color: 'rgba(44,44,58,0.5)' }}>Privacy policy</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}
