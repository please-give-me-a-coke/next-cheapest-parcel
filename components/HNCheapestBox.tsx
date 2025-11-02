"use client";

import styles from './comment-form.module.css';
import React, { useMemo, useState } from "react";

function isRecord(v: unknown): v is Record<string, any> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function toTitle(item: any): string {
    if (!isRecord(item)) return String(item);
    const cands = [item.title, item.name, item.agent, item.agentName, item.service, item.serviceType, item.carrier, item.region].filter(Boolean);
    return String(cands[0] ?? "(no title)");
}

function toPrice(item: any): string | undefined {
    if (!isRecord(item)) return undefined;
    const cands = [item.price, item.amount, item.cost, item.fare, item.totalPrice];
    const val = cands.find((v) => v !== undefined && v !== null);
    if (val === undefined) return undefined;
    const num = Number(val);
    if (!Number.isNaN(num)) return new Intl.NumberFormat().format(num);
    return String(val);
}

export default function HNCheapestBox() {
    const [type, setType] = useState("STORE_TO_HOUSE");
    const [region, setRegion] = useState("SAME_AREA");
    const [weight, setWeight] = useState("1000");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const computedUrl = useMemo(() => {
        const base = "https://api.cheapest-parcel.dedyn.io/parcels-prices/cheapest";
        const params = new URLSearchParams();
        params.set("type", type);
        params.set("region", region);
        params.set("weight", weight);
        params.set("continue", "");
        return `${base}?${params.toString()}`;
    }, [type, region, weight]);

    async function fetchNow() {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const res = await fetch(computedUrl, { headers: { Accept: "application/json" } });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
            }
            const body = await res.json().catch(async () => ({ value: await res.text() }));
            setData(body);
        } catch (e: any) {
            setError(e?.message ?? String(e));
        } finally {
            setLoading(false);
        }
    }

    const items = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (isRecord(data)) {
            for (const key of ["items", "data", "results", "list", "rates"]) {
                if (Array.isArray((data as any)[key])) return (data as any)[key];
            }
            return [data];
        }
        return [data];
    }, [data]);

    const wrap: React.CSSProperties = { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif", color: "#111", background: "#fff" };
    const container: React.CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "8px 12px" };
    const chip: React.CSSProperties = { padding: "6px 10px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 };
    const chipActive: React.CSSProperties = { ...chip, borderColor: "#ffb066", background: "#fff4e6" };
    const inputSm: React.CSSProperties = { padding: "6px 8px", borderRadius: 8, border: "1px solid #ccc", outline: "none", width: 120 };
    const pill: React.CSSProperties = { background: "#fff4e6", color: "#a14a00", padding: "2px 6px", borderRadius: 6, fontSize: 12, fontWeight: 700 };
    const card: React.CSSProperties = { border: "1px solid #eee", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,.03)" };

    return (
        <div style={wrap}>
            <div style={{ ...container, marginTop: 12 }}>
                <div style={{ ...card, padding: 12 }}>
                    <div style={{ display: "grid", gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Type</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[{ key: "STORE_TO_HOUSE", label: "편의점에서 집으로" }, { key: "STORE_TO_STORE", label: "편의점에서 편의점으로" }].map((t) => (
                                    <button key={t.key} type="button" onClick={() => setType(t.key)} style={type === t.key ? chipActive : chip}>{t.label}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Region</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[
                                    { key: "SAME_AREA", label: "동일권" },
                                    { key: "OTHER_AREA", label: "타권" },
                                    { key: "JEJU", label: "제주권" },
                                    { key: "ISLANDS", label: "도서산간" },
                                ].map((r) => (
                                    <button key={r.key} type="button" onClick={() => setRegion(r.key)} style={region === r.key ? chipActive : chip}>{r.label}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Weight(g)</div>
                            <input type="number" min={0} step={10} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 1000" style={inputSm} />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                            <button onClick={fetchNow} disabled={loading} className={styles.button}>{loading ? "Loading…" : "Fetch"}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ ...container, marginTop: 12, marginBottom: 32 }}>
                {error && <div style={{ ...card, borderColor: "#f5c0c0", background: "#fff5f5", padding: 12, color: "#8a1f1f", fontSize: 14 }}><strong>Error:</strong> {error}</div>}

                {data !== null && !error && (
                    <div style={{ ...card }}>
                        {items.length > 0 ? (
                            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                {items.map((item, idx) => {
                                    const title = toTitle(item);
                                    const price = toPrice(item);
                                    const link = isRecord(item) && item.url ? String(item.url) : undefined;
                                    const deliveryTime = isRecord(item) && (item.deliveryTime ?? item.delivery_time ?? item.estimatedDeliveryTime);
                                    const subbits: string[] = [];
                                    if (isRecord(item)) {
                                        const carrier = item.carrier ?? item.company ?? item.vendor;
                                        const svc = item.service ?? item.serviceType;
                                        const region = item.region ?? item.zone;
                                        const weight = item.weight ?? item.maxWeight;
                                        if (carrier) subbits.push(String(carrier));
                                        if (svc) subbits.push(String(svc));
                                        if (region) subbits.push(String(region));
                                        if (weight !== undefined) subbits.push(`${weight}g`);
                                        if (deliveryTime) subbits.push(`배송 ${deliveryTime}`);
                                    }
                                    return (
                                        <li key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, borderTop: idx === 0 ? undefined : "1px solid #f2f2f2" }}>
                                            <div style={{ width: 22, textAlign: "right", color: "#999", fontSize: 13, paddingTop: 3 }}>{idx + 1}.</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                                                    {link ? (
                                                        <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: "#004499", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</a>
                                                    ) : (
                                                        <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
                                                    )}
                                                    {price !== undefined && <span style={pill}>₩ {price}</span>}
                                                </div>
                                                {subbits.length > 0 && <div style={{ marginTop: 4, fontSize: 12, color: "#666" }}>{subbits.join(" · ")}</div>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : (
                            <div style={{ padding: 16, fontSize: 14, color: "#666" }}>No items found.</div>
                        )}
                    </div>
                )}

                {data === null && !error && (
                    <div style={{ ...card, borderStyle: "dashed", padding: 24, textAlign: "center", color: "#666", fontSize: 14 }}>
                        Select options and click <b>Fetch</b>.
                    </div>
                )}
            </div>
        </div>
    );
}
