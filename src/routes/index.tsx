import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { InventorySection } from "@/components/InventorySection";
import { SellNowSection } from "@/components/SellNowSection";

const TITLE = "টর্ক Moto — বাংলাদেশের প্রিমিয়াম ব্যবহৃত মোটরসাইকেল";
const DESCRIPTION =
  "সেরা মূল্যে প্রিমিয়াম ব্যবহৃত মোটরসাইকেল কিনুন, বিক্রি করুন অথবা এক্সচেঞ্জ করুন। লাইভ স্টক, ৪০+ যাচাইকৃত রিভিউ এবং ১০০% সুপারিশ।";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useShrinkNav() {
  const [shrink, setShrink] = useState(false);
  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return shrink;
}

const NAV_LINKS = [
  { href: "#top", label: "হোম" },
  { href: "#inventory", label: "স্টক" },
  { href: "#sell", label: "বাইক বিক্রি" },
  { href: "#about", label: "আমাদের সম্পর্কে" },
  { href: "#testimonials", label: "রিভিউ" },
  { href: "#contact", label: "যোগাযোগ" },
];

const STATS = [
  { target: "৩৭৬K+", label: "ফেসবুক ফলোয়ার্স" },
  { target: "১০০%", label: "রিকমেন্ডেশন রেট" },
  { target: "৪০+", label: "যাচাইকৃত রিভিউ" },
  { target: "৬৪৩+", label: "কমিউনিটি মেম্বার" },
];

const FEATURES = [
  {
    num: "01 — কিনুন",
    title: "প্রিমিয়াম ব্যবহৃত বাইক কিনুন",
    body: "যাচাইকৃত ইঞ্জিন ও কাগজপত্রসহ সেরা কন্ডিশনের ইউজড বাইক, বেস্ট প্রাইজে।",
    mark: "B",
    reverse: false,
  },
  {
    num: "02 — বিক্রি করুন",
    title: "দ্রুত আপনার বাইক বিক্রি করুন",
    body: "আপনার বাইকের সঠিক মূল্যায়ন করে দ্রুত ও নিরাপদে বিক্রি করার সুবিধা।",
    mark: "S",
    reverse: true,
  },
  {
    num: "03 — এক্সচেঞ্জ করুন",
    title: "সহজে এক্সচেঞ্জ করে আপগ্রেড করুন",
    body: "পুরনো বাইক দিয়ে নতুন পছন্দের বাইকে সহজে এক্সচেঞ্জ করুন, বাড়তি ঝামেলা ছাড়াই।",
    mark: "E",
    reverse: false,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "বাইকের কন্ডিশন এক্সাক্টলি যেমনটা বলা হয়েছিল তেমনই পেয়েছি। কাগজপত্র নিয়ে কোনো ঝামেলা হয়নি।",
    name: "রাকিব হাসান",
    role: "যাচাইকৃত ক্রেতা",
    avatar: "র",
  },
  {
    quote: "আমার পুরনো বাইকটা এক্সচেঞ্জ করে নতুন বাইক নিলাম, পুরো প্রসেসটা অনেক দ্রুত এবং স্বচ্ছ ছিল।",
    name: "সাদিয়া আক্তার",
    role: "এক্সচেঞ্জ গ্রাহক",
    avatar: "স",
  },
  {
    quote: "ভালো দামে বাইক বিক্রি করতে পেরেছি, টিম অনেক প্রফেশনাল এবং হেল্পফুল ছিল।",
    name: "মাহমুদুল হাসান",
    role: "বিক্রেতা",
    avatar: "ম",
  },
  {
    quote: "ইঞ্জিন থেকে শুরু করে সব কিছু আগে থেকেই চেক করা ছিল, তাই কেনার সময় কোনো টেনশন ছিল না।",
    name: "তানভীর আহমেদ",
    role: "যাচাইকৃত ক্রেতা",
    avatar: "ত",
  },
];

function ContactForm() {
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  return (
    <form
      className="tm-form"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        if (!name || !/^01[0-9]{9}$/.test(phone)) {
          setMsg({
            kind: "err",
            text: "অনুগ্রহ করে সঠিক নাম ও ১১ ডিজিটের ফোন নম্বর দিন (উদাহরণ: 01812345678)।",
          });
          return;
        }
        setMsg({
          kind: "ok",
          text: "ধন্যবাদ! আপনার মেসেজ পাঠানো হয়েছে, শীঘ্রই আমাদের টিম যোগাযোগ করবে।",
        });
        form.reset();
      }}
    >
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">নাম</label>
          <input type="text" id="name" name="name" placeholder="আপনার নাম" />
        </div>
        <div className="field">
          <label htmlFor="phone">ফোন নাম্বার</label>
          <input type="tel" id="phone" name="phone" placeholder="01XXXXXXXXX" />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="interest">আপনি কী করতে চান?</label>
          <select id="interest" name="interest">
            <option value="buy">কিনুন — বাইক কিনতে চাই</option>
            <option value="sell">বিক্রি করুন — বাইক বিক্রি করতে চাই</option>
            <option value="exchange">এক্সচেঞ্জ — বাইক এক্সচেঞ্জ করতে চাই</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="message">মেসেজ</label>
          <textarea id="message" name="message" placeholder="বাইকের মডেল বা বিস্তারিত লিখুন..." />
        </div>
      </div>
      <button type="submit" className="submit-btn">
        মেসেজ পাঠান
      </button>
      {msg ? <div className={`form-msg ${msg.kind}`}>{msg.text}</div> : null}
    </form>
  );
}

function Index() {
  useReveal();
  const shrink = useShrinkNav();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="tm-root">
      <nav className="tm-nav" aria-label="প্রধান নেভিগেশন">
        <div className={`tm-nav-inner${shrink ? " shrink" : ""}`}>
          <a href="#top" className="logo-mark" aria-label="টর্ক Moto — home">
            <span className="logo-torque">টর্ক</span>
            <span className="logo-moto">মোটো</span>
          </a>
          <ul className={`tm-nav-links${menuOpen ? " open" : ""}`}>
            {NAV_LINKS.map((link) =>
              link.href === "#inventory" ? (
                <li key={link.href} className="has-sub">
                  <a href={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label} <span aria-hidden="true">▾</span>
                  </a>
                  <ul className="tm-subnav">
                    {[
                      { key: "all", label: "সব বাইক" },
                      { key: "new", label: "নতুন বাইক" },
                      { key: "used", label: "ইউজড বাইক" },
                    ].map((item) => (
                      <li key={item.key}>
                        <a
                          href="#inventory"
                          onClick={() => {
                            setMenuOpen(false);
                            window.dispatchEvent(
                              new CustomEvent("tm-stock-filter", { detail: item.key }),
                            );
                          }}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
          <div className="tm-nav-cta">
            <a href="tel:01308224400" className="call-btn">
              এখনই কল করুন
            </a>
            <button
              type="button"
              className={`burger${menuOpen ? " open" : ""}`}
              aria-label="মেনু খুলুন বা বন্ধ করুন"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <header className="tm-hero" id="top">
          <div className="hero-inner">
            <div className="hero-eyebrow bn">বাংলাদেশের সেরা প্রিমিয়াম ইউজড বাইকের শোরুম</div>
            <h1>
              আজই আপনার
              <br />
              <em>পরবর্তী বাইকটি</em> নিয়ে বাড়ি ফিরুন।
            </h1>
            <p className="hero-sub bn">
              আপনার পছন্দের প্রিমিয়াম ইউজড বাইকটি বেস্ট প্রাইজে কিনুন, বিক্রি করুন অথবা এক্সচেঞ্জ
              করতে আজই চলে আসুন টর্ক মোটো-তে।
            </p>
            <div className="hero-actions">
              <a href="tel:01308224400" className="btn-primary">
                এখনই কল করুন
              </a>
              <a href="#inventory" className="btn-ghost">
                বাইক দেখুন
              </a>
            </div>
            <div className="gauge-wrap" aria-hidden="true">
              <svg viewBox="0 0 380 230" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 30 190 A 160 160 0 0 1 350 190"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 30 190 A 160 160 0 0 1 350 190"
                  fill="none"
                  stroke="#d0102a"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="340 502"
                />
                <g fill="#a1a1a6" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600">
                  <text x="20" y="210">
                    0
                  </text>
                  <text x="150" y="80">
                    টর্ক মোটো
                  </text>
                  <text x="350" y="210">
                    100
                  </text>
                </g>
                <g className="needle">
                  <line
                    x1="190"
                    y1="190"
                    x2="190"
                    y2="60"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="190" cy="190" r="11" fill="#ffffff" />
                  <circle cx="190" cy="190" r="4" fill="#0a0a0a" />
                </g>
              </svg>
            </div>
          </div>
        </header>

        <div className="stats-band">
          <div className="tm-wrap stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="stat-num">{stat.target}</div>
                <div className="stat-label bn">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <InventorySection />

        <SellNowSection />

        <section className="tm-section" id="services" style={{ background: "var(--bg-alt)" }}>
          <div className="tm-wrap">
            <div className="section-head reveal">
              <div className="kicker bn">আমরা যা করি</div>
              <h2>কেনা, বিক্রি বা এক্সচেঞ্জ — সবকিছুই সঠিকভাবে।</h2>
              <p className="bn">
                প্রতিটি বাইক যাচাই করা হয় ইঞ্জিন, কাগজপত্র ও কন্ডিশন অনুযায়ী, যাতে আপনি নিশ্চিন্তে
                সিদ্ধান্ত নিতে পারেন।
              </p>
            </div>
            {FEATURES.map((f) => (
              <div key={f.num} className={`feature-row reveal${f.reverse ? " reverse" : ""}`}>
                <div>
                  <div className="feature-num">{f.num}</div>
                  <h3>{f.title}</h3>
                  <p className="bn">{f.body}</p>
                </div>
                <div className="feature-visual">
                  <span>{f.mark}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="tm-section" id="about">
          <div className="tm-wrap">
            <div className="about-grid reveal">
              <div className="about-visual">
                <h3>১০০% সন্তুষ্টির হার</h3>
                <div className="big">১০০%</div>
                <p className="bn about-note">৪০টি যাচাইকৃত রিভিউর ভিত্তিতে</p>
                <div className="badge-row">
                  <div>
                    <b>৩৭৬K</b>
                    <span className="bn">ফলোয়ার</span>
                  </div>
                  <div>
                    <b>৬৪৩</b>
                    <span className="bn">গ্রুপ সদস্য</span>
                  </div>
                </div>
              </div>
              <div className="about-copy">
                <div className="kicker bn">কেন টর্ক Moto</div>
                <h2>শুধু লেনদেন নয়, বিশ্বাসের ওপর গড়ে ওঠা একটি শোরুম।</h2>
                <p className="bn">
                  প্রতিটি বাইক আমাদের নিজস্ব চেকলিস্ট অনুযায়ী পরীক্ষা করা হয় — ইঞ্জিন কন্ডিশন,
                  কাগজপত্র, এবং মূল্য যাচাই সবকিছু নিশ্চিত করেই আপনার হাতে তুলে দেওয়া হয়।
                </p>
                <ul className="check-list">
                  <li>যাচাইকৃত কাগজপত্র ও ইঞ্জিন কন্ডিশন রিপোর্ট</li>
                  <li>স্বচ্ছ মূল্য নির্ধারণ, কোনো লুকানো চার্জ নেই</li>
                  <li>দ্রুত Buy, Sell এবং Exchange প্রসেস</li>
                  <li>৪০+ গ্রাহকের ১০০% সন্তুষ্টি</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="tm-section" id="testimonials" style={{ background: "var(--bg-alt)" }}>
          <div className="tm-wrap">
            <div className="section-head reveal">
              <div className="kicker bn">গ্রাহকদের মতামত</div>
              <h2>সারা বাংলাদেশের রাইডারদের আস্থার ঠিকানা।</h2>
            </div>
            <div className="testi-grid">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="testi-card reveal">
                  <div className="stars">★★★★★</div>
                  <p className="bn">{t.quote}</p>
                  <div className="testi-who">
                    <div className="testi-avatar">{t.avatar}</div>
                    <div>
                      <b>{t.name}</b>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tm-section" id="contact">
          <div className="tm-wrap">
            <div className="section-head reveal">
              <div className="kicker bn">যোগাযোগ করুন</div>
              <h2>চলুন, আপনার পছন্দের বাইকটি খুঁজে নিই।</h2>
              <p className="bn">
                নিচের ফর্মটি পূরণ করুন অথবা সরাসরি কল করুন, আমাদের টিম দ্রুত যোগাযোগ করবে।
              </p>
            </div>
            <div className="contact-grid reveal">
              <div className="contact-info">
                <h3>শোরুমের তথ্য</h3>
                <div className="info-row">
                  <div className="ico">☎</div>
                  <div>
                    <b>আমাদের কল করুন</b>
                    <span>01308-224400</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ico">@</div>
                  <div>
                    <b>ইনস্টাগ্রাম</b>
                    <span>torque_4400</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ico">f</div>
                  <div>
                    <b>ফেসবুক</b>
                    <span className="bn">৩৭৬K ফলোয়ার্স • পাবলিক গ্রুপ ৬৪৩ সদস্য</span>
                  </div>
                </div>
                <div className="info-row last">
                  <div className="ico">⏱</div>
                  <div>
                    <b>প্রতিদিন খোলা</b>
                    <span className="bn">সকাল ১০টা – রাত ৯টা</span>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="tm-footer">
        <div className="tm-wrap">
          <div className="foot-grid">
            <div>
              <a href="#top" className="logo-mark">
                <span className="logo-torque">টর্ক</span>
                <span className="logo-moto">মোটো</span>
              </a>
              <p className="bn">
                বাংলাদেশের সেরা প্রিমিয়াম ইউজড বাইকের শোরুম। বিশ্বস্ততার সাথে কেনা, বিক্রি ও
                এক্সচেঞ্জ সেবা দিয়ে আসছি।
              </p>
              <div className="foot-social">
                <a
                  href="https://www.facebook.com/profile.php?id=61587078313557"
                  aria-label="ফেসবুক"
                >
                  f
                </a>
                <a href="https://www.instagram.com/torque_4400" aria-label="ইনস্টাগ্রাম">
                  ig
                </a>
                <a href="tel:01308224400" aria-label="ফোন করুন">
                  ☎
                </a>
              </div>
            </div>
            <div className="foot-col">
              <h4>দ্রুত লিংক</h4>
              <ul>
                <li>
                  <a href="#inventory">স্টক</a>
                </li>
                <li>
                  <a href="#services">সার্ভিস</a>
                </li>
                <li>
                  <a href="#about">আমাদের সম্পর্কে</a>
                </li>
                <li>
                  <a href="#contact">যোগাযোগ</a>
                </li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>সেবাসমূহ</h4>
              <ul>
                <li>বাইক কিনুন</li>
                <li>বাইক বিক্রি করুন</li>
                <li>বাইক এক্সচেঞ্জ করুন</li>
                <li>বিনামূল্যে মূল্যায়ন</li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>যোগাযোগ</h4>
              <ul>
                <li>01308-224400</li>
                <li>@torque_4400</li>
                <li className="bn">প্রতিদিন সকাল ১০টা – রাত ৯টা</li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 টর্ক Moto। সর্বস্বত্ব সংরক্ষিত।</span>
            <span className="bn">বাংলাদেশের সেরা প্রিমিয়াম ইউজড বাইকের শোরুম</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
