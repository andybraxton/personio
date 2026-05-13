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

        {/* WHERE TRUST BREAKS */}
        <section className="trust-gaps" aria-labelledby="trust-gaps-heading">
          <div className="container">

            {/* Header row */}
            <div className="trust-gaps__header">
              <div className="trust-gaps__header-left">
                <span className="label">Where Trust Breaks</span>
                <h2 id="trust-gaps-heading">It&apos;s rarely the offer.<br />It&apos;s the experience.</h2>
                <p>Across hundreds of high-intent websites, we see the same confidence gaps that quietly cost businesses leads, revenue, and growth.</p>
              </div>
              <div className="trust-gaps__header-right">
                <div className="trust-gaps__insight-card">
                  <div className="trust-gaps__insight-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M11 7v5M11 15v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <h4>Trust isn&apos;t built in one moment.</h4>
                    <p>It&apos;s earned across dozens of small interactions. When any of them create doubt, visitors hesitate — and most won&apos;t come back.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap cards */}
            <div className="trust-gaps__grid">
              {[
                { num: '01', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 3h14a1 1 0 011 1v10a1 1 0 01-1 1H7l-4 3V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 9h.5M11 9h.5M13 9h.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: 'Unclear what you do', body: 'Vague messaging or jargon makes it hard to understand the value.', level: 'High', filled: 4 },
                { num: '02', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L3 5.5v6c0 4.1 3.5 7.7 8 8.5 4.5-.8 8-4.4 8-8.5v-6L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>, title: 'Missing reasons to trust', body: 'Lack of proof, credibility signals, or customer validation creates doubt.', level: 'High', filled: 4 },
                { num: '03', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v14M4 11l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 15h4M16 15h4M2 18h4M16 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: 'No clear next step', body: 'Too many choices or unclear CTAs leave visitors unsure what to do.', level: 'High', filled: 4 },
                { num: '04', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9h8M7 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: 'Too much friction', body: 'Long forms, unnecessary fields, or complex steps create drop-off.', level: 'High', filled: 4 },
                { num: '05', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M11 6v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Slow or clunky experience', body: 'Performance issues or poor mobile experience erode confidence instantly.', level: 'Medium', filled: 3 },
              ].map(({ num, icon, title, body, level, filled }) => (
                <div key={num} className="trust-gaps__card">
                  <div className="trust-gaps__card-top">
                    <div className="trust-gaps__card-icon" aria-hidden="true">{icon}</div>
                    <span className="trust-gaps__card-num">{num}</span>
                  </div>
                  <h4>{title}</h4>
                  <p>{body}</p>
                  <div className="trust-gaps__card-footer">
                    <span className="trust-gaps__drop-label">Confidence Drop</span>
                    <span className={`trust-gaps__drop-level trust-gaps__drop-level--${level.toLowerCase()}`}>{level}</span>
                    <div className="trust-gaps__bar" aria-label={`${level} confidence drop`}>
                      {Array.from({ length: 7 }, (_, i) => (
                        <span key={i} className={`trust-gaps__bar-seg${i < filled ? ' trust-gaps__bar-seg--on' : ''}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="trust-gaps__stats">
              <div className="trust-gaps__stats-intro"><p>The numbers behind<br />lost confidence</p></div>
              {[
                { num: '80%', text: 'Only read your headline and first line of copy.', source: 'Nielsen Norman Group' },
                { num: '57%', text: 'Of engagement time happens above the fold.', source: '29a Chloe' },
                { num: '50%+', text: 'Lift in conversions from removing one form field.', source: 'Unbounce' },
                { num: '7%', text: 'Drop in conversions for every 1s of load time.', source: 'Cloudflare' },
                { num: '0.05s', text: 'The time it takes to form a first impression.', source: 'MIT / Princeton Research' },
              ].map(({ num, text, source }) => (
                <div key={num} className="trust-gaps__stat">
                  <div className="trust-gaps__stat-num">{num}</div>
                  <p>{text}</p>
                  <span className="trust-gaps__stat-source">{source}</span>
                </div>
              ))}
            </div>

            {/* Closing CTA */}
            <div className="trust-gaps__close">
              <div className="trust-gaps__close-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 15l4-5 4 4 4-6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p><strong>We close these gaps.</strong> Systematically. Continuously. Built around how real buyers make decisions.</p>
              <a href="/site/approach" className="trust-gaps__close-link">
                See our approach
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
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
