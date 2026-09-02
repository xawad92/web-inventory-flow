import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { getInventory, type Bike } from "@/lib/inventory.functions";

const STATUS_LABEL: Record<string, string> = {
  Available: "স্টকে আছে",
  Reserved: "বুকিং হয়েছে",
  Sold: "বিক্রি হয়ে গেছে",
};

function formatPrice(price: number | null) {
  if (price === null) return "মূল্য জানতে কল করুন";
  return `৳ ${price.toLocaleString("en-BD")}`;
}

function BikeCard({ bike }: { bike: Bike }) {
  const statusKey = bike.status.toLowerCase();
  return (
    <article className={`bike-card status-${statusKey}`}>
      <div className="bike-media">
        {bike.images[0] ? (
          <img src={bike.images[0]} alt={`${bike.brand} ${bike.model}`} loading="lazy" />
        ) : (
          <span aria-hidden="true">{bike.brand.slice(0, 1) || "T"}</span>
        )}
        <span className={`bike-status status-${statusKey}`}>
          {STATUS_LABEL[bike.status] ?? bike.status}
        </span>
        {bike.featured ? <span className="bike-featured bn">ফিচার্ড</span> : null}
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

export function InventorySection() {
  const fetchInventory = useServerFn(getInventory);
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetchInventory(),
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState("all");

  const bikes = data?.bikes ?? [];
  const brands = useMemo(
    () => Array.from(new Set(bikes.map((b) => b.brand).filter(Boolean))).sort(),
    [bikes],
  );

  const visible = bikes
    .filter((b) => (brand === "all" ? true : b.brand === brand))
    .filter((b) => (status === "all" ? true : b.status === status))
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <section className="tm-section" id="inventory">
      <div className="tm-wrap">
        <div className="section-head reveal in">
          <div className="kicker bn">লাইভ স্টক</div>
          <h2>এখন যেসব বাইক আমাদের শোরুমে আছে।</h2>
          <p className="bn">
            আমাদের ইনভেন্টরি শিট থেকে সরাসরি আপডেট হয় — নতুন বাইক যোগ করলেই এখানে দেখা যাবে।
          </p>
        </div>

        <div className="inv-toolbar">
          <div className="inv-filters">
            <label className="field">
              <span>ব্র্যান্ড</span>
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="all">সব ব্র্যান্ড</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>স্টক অবস্থা</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">সবগুলো</option>
                <option value="Available">স্টকে আছে</option>
                <option value="Reserved">বুকিং হয়েছে</option>
                <option value="Sold">বিক্রি হয়ে গেছে</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className="btn-refresh bn"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            {isFetching ? "আপডেট হচ্ছে..." : "স্টক রিফ্রেশ করুন"}
          </button>
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
              <BikeCard key={bike.bike_id} bike={bike} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
