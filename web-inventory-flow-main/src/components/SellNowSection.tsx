import { useMemo, useState } from "react";

const BRANDS = [
  "Yamaha",
  "Honda",
  "Suzuki",
  "Bajaj",
  "TVS",
  "Hero",
  "Royal Enfield",
  "KTM",
  "GPX",
  "Lifan",
  "Runner",
  "অন্যান্য",
];

const YEARS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));

const REGISTRATIONS = ["রেজিস্ট্রেশন আছে", "রেজিস্ট্রেশন নেই", "ট্রান্সফার প্রয়োজন"];

const DIVISIONS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
];

const STEPS = ["বাইকের তথ্য", "মূল্য মূল্যায়ন", "যোগাযোগের তথ্য"];

type BikeDetails = {
  brand: string;
  model: string;
  year: string;
  odo: string;
  registration: string;
  location: string;
  condition: string;
};

const EMPTY: BikeDetails = {
  brand: "",
  model: "",
  year: "",
  odo: "",
  registration: "",
  location: "",
  condition: "ভালো",
};

function estimateRange(details: BikeDetails) {
  const year = Number(details.year) || new Date().getFullYear() - 5;
  const odo = Number(details.odo.replace(/[^0-9]/g, "")) || 0;
  const age = Math.max(0, new Date().getFullYear() - year);

  const base = 260_000;
  const conditionFactor =
    details.condition === "চমৎকার" ? 1.08 : details.condition === "মধ্যম" ? 0.88 : 1;
  const regFactor = details.registration === "রেজিস্ট্রেশন নেই" ? 0.9 : 1;

  let value = base * Math.pow(0.92, age) * conditionFactor * regFactor;
  value -= odo * 1.6;
  value = Math.max(45_000, value);

  const round = (n: number) => Math.round(n / 1000) * 1000;
  return { low: round(value * 0.92), high: round(value * 1.08) };
}

function formatBdt(n: number) {
  return `৳ ${n.toLocaleString("en-BD")}`;
}

export function SellNowSection() {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<BikeDetails>(EMPTY);
  const [contact, setContact] = useState({ name: "", phone: "", note: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const estimate = useMemo(() => estimateRange(details), [details]);

  const set = (key: keyof BikeDetails) => (value: string) => {
    setDetails((d) => ({ ...d, [key]: value }));
  };

  function goToEvaluation() {
    if (!details.brand || !details.model.trim() || !details.year || !details.odo.trim()) {
      setError("ব্র্যান্ড, মডেল, ইয়ার এবং ODO (কিমি) অবশ্যই পূরণ করুন।");
      return;
    }
    setError(null);
    setStep(1);
  }

  function submit() {
    if (!contact.name.trim() || !/^01[0-9]{9}$/.test(contact.phone.trim())) {
      setError("সঠিক নাম ও ১১ ডিজিটের ফোন নম্বর দিন (উদাহরণ: 01812345678)।");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  const waHref = `https://wa.me/8801308224400?text=${encodeURIComponent(
    `আসসালামু আলাইকুম, আমি আমার বাইক বিক্রি করতে চাই।\nব্র্যান্ড: ${details.brand}\nমডেল: ${details.model}\nইয়ার: ${details.year}\nODO: ${details.odo} কিমি\nরেজিস্ট্রেশন: ${details.registration || "—"}\nএলাকা: ${details.location || "—"}\nনাম: ${contact.name}\nফোন: ${contact.phone}`,
  )}`;

  return (
    <section className="tm-section sell-section" id="sell">
      <div className="tm-wrap">
        <div className="section-head reveal">
          <div className="kicker bn">বাইক বিক্রি করুন</div>
          <h2>৩টি সহজ ধাপ • তাৎক্ষণিক মূল্যায়ন • সেরা অফার</h2>
          <p className="bn">
            আপনার বাইকের তথ্য দিন, সাথে সাথেই একটি আনুমানিক মূল্য পান — এরপর আমাদের টিম যোগাযোগ করে
            চূড়ান্ত অফার দেবে।
          </p>
        </div>

        <ol className="sell-steps" aria-label="বিক্রির ধাপ">
          {STEPS.map((label, i) => (
            <li key={label} className={i === step ? "active" : i < step ? "done" : ""}>
              <span className="sell-step-dot">{i + 1}</span>
              <span className="sell-step-label bn">{label}</span>
            </li>
          ))}
        </ol>

        <div className="sell-card">
          {step === 0 ? (
            <>
              <h3>আপনার বাইকের তথ্য দিন</h3>
              <p className="sell-sub bn">সঠিক তথ্য দিলে সবচেয়ে নির্ভুল মূল্যায়ন পাবেন</p>
              <div className="sell-grid">
                <label className="field">
                  <span>ব্র্যান্ড</span>
                  <select value={details.brand} onChange={(e) => set("brand")(e.target.value)}>
                    <option value="">ব্র্যান্ড নির্বাচন করুন</option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>মডেল</span>
                  <input
                    type="text"
                    value={details.model}
                    onChange={(e) => set("model")(e.target.value)}
                    placeholder="যেমন: FZS V3"
                  />
                </label>
                <label className="field">
                  <span>ইয়ার</span>
                  <select value={details.year} onChange={(e) => set("year")(e.target.value)}>
                    <option value="">ইয়ার নির্বাচন করুন</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>ODO (কিমি)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={details.odo}
                    onChange={(e) => set("odo")(e.target.value)}
                    placeholder="কিমি লিখুন"
                  />
                </label>
                <label className="field">
                  <span>রেজিস্ট্রেশন</span>
                  <select
                    value={details.registration}
                    onChange={(e) => set("registration")(e.target.value)}
                  >
                    <option value="">ধরন নির্বাচন করুন</option>
                    {REGISTRATIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>এলাকা</span>
                  <select value={details.location} onChange={(e) => set("location")(e.target.value)}>
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>কন্ডিশন</span>
                  <select value={details.condition} onChange={(e) => set("condition")(e.target.value)}>
                    <option value="চমৎকার">চমৎকার</option>
                    <option value="ভালো">ভালো</option>
                    <option value="মধ্যম">মধ্যম</option>
                  </select>
                </label>
              </div>
              {error ? <div className="form-msg err">{error}</div> : null}
              <div className="sell-actions">
                <button type="button" className="submit-btn" onClick={goToEvaluation}>
                  মূল্য মূল্যায়ন দেখুন
                </button>
              </div>
            </>
          ) : step === 1 ? (
            <>
              <h3>আনুমানিক মূল্য মূল্যায়ন</h3>
              <p className="sell-sub bn">
                {details.brand} {details.model} · {details.year} · {details.odo} কিমি
              </p>
              <div className="sell-estimate">
                <span className="bn">সম্ভাব্য মূল্য পরিসীমা</span>
                <b>
                  {formatBdt(estimate.low)} – {formatBdt(estimate.high)}
                </b>
                <small className="bn">
                  চূড়ান্ত মূল্য শোরুমে বাইক পরীক্ষা করার পর নির্ধারিত হবে।
                </small>
              </div>
              <div className="sell-actions">
                <button type="button" className="btn-ghost" onClick={() => setStep(0)}>
                  পেছনে
                </button>
                <button type="button" className="submit-btn" onClick={() => setStep(2)}>
                  পরবর্তী ধাপ
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>যোগাযোগের তথ্য</h3>
              <p className="sell-sub bn">আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে</p>
              <div className="sell-grid">
                <label className="field">
                  <span>নাম</span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder="আপনার নাম"
                  />
                </label>
                <label className="field">
                  <span>ফোন নাম্বার</span>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                  />
                </label>
                <label className="field full">
                  <span>অতিরিক্ত তথ্য</span>
                  <textarea
                    value={contact.note}
                    onChange={(e) => setContact((c) => ({ ...c, note: e.target.value }))}
                    placeholder="বাইকের বিশেষ কোনো তথ্য থাকলে লিখুন..."
                  />
                </label>
              </div>
              {error ? <div className="form-msg err">{error}</div> : null}
              {submitted ? (
                <div className="form-msg ok">
                  ধন্যবাদ {contact.name}! আপনার বাইকের তথ্য পেয়েছি — আনুমানিক মূল্য{" "}
                  {formatBdt(estimate.low)} – {formatBdt(estimate.high)}। শীঘ্রই আমরা কল করব।
                </div>
              ) : null}
              <div className="sell-actions">
                <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
                  পেছনে
                </button>
                <button type="button" className="submit-btn" onClick={submit}>
                  তথ্য জমা দিন
                </button>
                <a className="wa-btn bn" href={waHref} target="_blank" rel="noopener noreferrer">
                  হোয়াটসঅ্যাপে পাঠান
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
