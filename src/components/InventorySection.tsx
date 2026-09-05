import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { getInventory, type Bike } from "@/lib/inventory.functions";

const STATUS_LABEL: Record<string, string> = {
  Available: "স্টকে আছে",
  Reserved: "বুকিং হয়েছে",
  Sold: "বিক্রি হয়ে গেছে",
};

const SPEC_LABEL: Record<string, string> = {
  new: "নতুন",
  "brand new": "একদম নতুন",
  used: "ইউজড",
  excellent: "চমৎকার",
  good: "ভালো",
  fair: "মধ্যম",
  registered: "রেজিস্টার্ড",
  unregistered: "আনরেজিস্টার্ড",
  papers: "কাগজপত্র সহ",
  "1st owner": "১ম মালিক",
  "first owner": "১ম মালিক",
  "2nd owner": "২য় মালিক",
  "second owner": "২য় মালিক",
  "3rd owner": "৩য় মালিক",
  fresh: "ফ্রেশ",
  dhaka: "ঢাকা",
};

function bn(value: string | null | undefined) {
  if (!value) return "—";
  return SPEC_LABEL[value.trim().toLowerCase()] ?? value;
}

function formatPrice(price: number | null) {
  if (price === null) return "মূল্য জানতে কল করুন";
  return `৳ ${price.toLocaleString("en-BD")}`;
}

function BikeCard({ bike, onOpen }: { bike: Bike; onOpen: (bike: Bike, index: number) => void }) {
  const statusKey = bike.status.toLowerCase();
  const hasGallery = bike.images.length > 1;
  return (
    <article className={`bike-card status-${statusKey}`}>
      <div
        className={`bike-media${hasGallery ? " clickable" : ""}`}
        role={hasGallery ? "button" : undefined}
        tabIndex={hasGallery ? 0 : undefined}
        aria-label={hasGallery ? `${bike.brand} ${bike.model} — ছবি দেখুন` : undefined}
        onClick={hasGallery ? () => onOpen(bike, 0) : undefined}
        onKeyDown={
          hasGallery
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(bike, 0);
                }
              }
            : undefined
        }
      >
        {bike.images[0] ? (
          <img src={bike.images[0]} alt={`${bike.brand} ${bike.model}`} loading="lazy" />
        ) : (
          <span aria-hidden="true">{bike.brand.slice(0, 1) || "T"}</span>
        )}
        <span className={`bike-status status-${statusKey}`}>
          {STATUS_LABEL[bike.status] ?? bike.status}
        </span>
        {bike.featured ? <span className="bike-featured bn">ফিচার্ড</span> : null}
        {hasGallery ? (
          <span className="bike-gallery-hint bn">১/{bike.images.length} ছবি</span>
        ) : null}
      </div>
      <div className="bike-body">
        <h3>
          {bike.brand} {bike.model}
        </h3>
        <div className="bike-price">{formatPrice(bike.price)}</div>
        <ul className="bike-specs">
          <li>
            <span>মডেল ইয়ার</span>
            <b>{bike.year || "—"}</b>
          </li>
          <li>
            <span>মাইলেজ</span>
            <b>{bike.mileage !== null ? `${bike.mileage.toLocaleString("en-BD")} কিমি` : "—"}</b>
          </li>
          <li>
            <span>ইঞ্জিন</span>
            <b>{bike.engine || "—"}</b>
          </li>
          <li>
            <span>রেজিস্ট্রেশন</span>
            <b>{bike.registration || "—"}</b>
          </li>
          <li>
            <span>কন্ডিশন</span>
            <b>{bike.condition || "—"}</b>
          </li>
          <li>
            <span>ওনারশিপ</span>
            <b>{bike.ownership || "—"}</b>
          </li>
        </ul>
        {bike.description ? <p className="bn bike-desc">{bike.description}</p> : null}
        <div className="bike-actions">
          <a className="call-btn bike-cta" href="tel:01308224400">
            কল করুন
          </a>
          <a
            className="wa-btn bike-cta bn"
            href={`https://wa.me/${(bike.whatsapp || "8801308224400").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `আসসালামু আলাইকুম, ${bike.brand} ${bike.model} বাইকটি সম্পর্কে জানতে চাই।`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            হোয়াটসঅ্যাপ
          </a>
        </div>
      </div>
    </article>
  );
}

function Lightbox({
  bike,
  index,
  onClose,
  onNav,
}: {
  bike: Bike;
  index: number;
  onClose: () => void;
  onNav: (index: number) => void;
}) {
  const total = bike.images.length;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % total);
      if (e.key === "ArrowLeft") onNav((index - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, total, onClose, onNav]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="lightbox-close" aria-label="বন্ধ করুন" onClick={onClose}>
        ✕
      </button>
      <figure className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <img src={bike.images[index]} alt={`${bike.brand} ${bike.model} — ছবি ${index + 1}`} />
        {total > 1 ? (
          <>
            <button
              type="button"
              className="lightbox-nav prev"
              aria-label="আগের ছবি"
              onClick={() => onNav((index - 1 + total) % total)}
            >
              ‹
            </button>
            <button
              type="button"
              className="lightbox-nav next"
              aria-label="পরের ছবি"
              onClick={() => onNav((index + 1) % total)}
            >
              ›
            </button>
          </>
        ) : null}
        <figcaption className="bn">
          {bike.brand} {bike.model} · {index + 1}/{total}
        </figcaption>
      </figure>
    </div>
  );
}

function isNewBike(bike: Bike) {
  const c = `${bike.condition ?? ""}`.toLowerCase();
  return c.includes("new") || c.includes("নতুন") || c.includes("brand");
}

export function InventorySection() {
  const fetchInventory = useServerFn(getInventory);
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetchInventory(),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    retry: 1,
    retryDelay: 3_000,
  });

  const [lightbox, setLightbox] = useState<{ bike: Bike; index: number } | null>(null);

  const [tab, setTab] = useState<"all" | "new" | "used">("all");
  const [brands, setBrands] = useState<string[]>([]);
  const [status, setStatus] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const onFilter = (e: Event) => {
      const detail = (e as CustomEvent).detail as "all" | "new" | "used";
      if (detail === "all" || detail === "new" || detail === "used") setTab(detail);
    };
    window.addEventListener("tm-stock-filter", onFilter);
    return () => window.removeEventListener("tm-stock-filter", onFilter);
  }, []);

  const bikes = data?.bikes ?? [];
  const brandOptions = useMemo(
    () => Array.from(new Set(bikes.map((b) => b.brand).filter(Boolean))).sort(),
    [bikes],
  );

  const query = q.trim().toLowerCase();
  const min = Number(minPrice.replace(/[^0-9]/g, "")) || 0;
  const max = Number(maxPrice.replace(/[^0-9]/g, "")) || Infinity;

  const visible = bikes
    .filter((b) => (tab === "all" ? true : tab === "new" ? isNewBike(b) : !isNewBike(b)))
    .filter((b) => (brands.length === 0 ? true : brands.includes(b.brand)))
    .filter((b) => (status === "all" ? true : b.status === status))
    .filter((b) => (b.price === null ? min === 0 : b.price >= min && b.price <= max))
    .filter((b) =>
      query === ""
        ? true
        : [b.brand, b.model, b.year, b.engine, b.color, b.condition, b.description]
            .join(" ")
            .toLowerCase()
            .includes(query),
    )
    .sort((a, b) => {
      if (sort === "price-asc") return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (sort === "price-desc") return (b.price ?? -1) - (a.price ?? -1);
      if (sort === "year-desc") return Number(b.year || 0) - Number(a.year || 0);
      return Number(b.featured) - Number(a.featured);
    });

  const toggleBrand = (brand: string) =>
    setBrands((list) => (list.includes(brand) ? list.filter((b) => b !== brand) : [...list, brand]));

  const resetAll = () => {
    setBrands([]);
    setStatus("all");
    setMinPrice("");
    setMaxPrice("");
    setQ("");
    setTab("all");
    setSort("featured");
  };

  return (
    <section className="tm-section" id="inventory">
      <div className="tm-wrap">
        <div className="section-head reveal in">
          <div className="kicker bn">আমাদের কালেকশন</div>
          <h2>এখন যেসব বাইক আমাদের শোরুমে আছে।</h2>
          <p className="bn">
            আমাদের ইনভেন্টরি শিট থেকে সরাসরি আপডেট হয় — নতুন বাইক যোগ করলেই এখানে দেখা যাবে।
          </p>
        </div>

        <div className="inv-tabs" role="tablist" aria-label="বাইকের ধরন">
          {[
            { key: "all", label: "সব বাইক" },
            { key: "new", label: "নতুন বাইক" },
            { key: "used", label: "ইউজড বাইক" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`inv-tab bn${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key as typeof tab)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="inv-layout">
          <aside className="inv-sidebar" aria-label="ফিল্টার">
            <div className="inv-side-head">
              <h3 className="bn">ফিল্টার</h3>
              <button type="button" className="inv-reset bn" onClick={resetAll}>
                রিসেট
              </button>
            </div>

            <label className="field field-search">
              <span>খুঁজুন</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ব্র্যান্ড, মডেল, ইঞ্জিন..."
              />
            </label>

            <div className="inv-filter-group">
              <h4 className="bn">ব্র্যান্ড</h4>
              <div className="inv-checks">
                {brandOptions.length === 0 ? (
                  <p className="inv-side-empty bn">লোড হচ্ছে...</p>
                ) : (
                  brandOptions.map((b) => (
                    <label key={b} className="inv-check">
                      <input
                        type="checkbox"
                        checked={brands.includes(b)}
                        onChange={() => toggleBrand(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="inv-filter-group">
              <h4 className="bn">মূল্য পরিসীমা (৳)</h4>
              <div className="inv-price-row">
                <input
                  type="text"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="সর্বনিম্ন"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="সর্বোচ্চ"
                />
              </div>
            </div>

            <div className="inv-filter-group">
              <h4 className="bn">স্টক অবস্থা</h4>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">সবগুলো</option>
                <option value="Available">স্টকে আছে</option>
                <option value="Reserved">বুকিং হয়েছে</option>
                <option value="Sold">বিক্রি হয়ে গেছে</option>
              </select>
            </div>

            <button
              type="button"
              className="btn-refresh bn"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {isFetching ? "আপডেট হচ্ছে..." : "স্টক রিফ্রেশ করুন"}
            </button>
          </aside>

          <div className="inv-main">
            <div className="inv-resultbar">
              <span className="bn">{visible.length} টি বাইক পাওয়া গেছে</span>
              <label className="field">
                <span>সাজান</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">ফিচার্ড আগে</option>
                  <option value="price-asc">দাম: কম থেকে বেশি</option>
                  <option value="price-desc">দাম: বেশি থেকে কম</option>
                  <option value="year-desc">নতুন মডেল আগে</option>
                </select>
              </label>
            </div>

            {isPending ? (
              <div className="inv-grid">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bike-card skeleton" />
                ))}
              </div>
            ) : isError ? (
              <p className="inv-empty bn">
                স্টক লোড করা যাচ্ছে না: {error instanceof Error ? error.message : "অজানা সমস্যা"}
              </p>
            ) : visible.length === 0 ? (
              <p className="inv-empty bn">এই ফিল্টারে কোনো বাইক পাওয়া যায়নি।</p>
            ) : (
              <div className="inv-grid">
                {visible.map((bike) => (
                  <BikeCard
                    key={bike.bike_id}
                    bike={bike}
                    onOpen={(b, i) => setLightbox({ bike: b, index: i })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {lightbox ? (
          <Lightbox
            bike={lightbox.bike}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onNav={(i) => setLightbox((s) => (s ? { ...s, index: i } : s))}
          />
        ) : null}
      </div>
    </section>
  );
}
