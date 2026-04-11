import { useState } from "react";
import {
    FaSeedling,
    FaSearch,
    FaTint,
    FaSun,
    FaLeaf,
    FaAppleAlt,
    FaInfoCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

const cropAdvice = {
    onion: {
        wikiTitle: "Onion",
        type: "Vegetable",
        watering: "Moderate",
        sunlight: "Full Sun",
        soil: "Well-drained fertile soil",
        cycle: "Annual",
    },
    tomato: {
        wikiTitle: "Tomato",
        type: "Vegetable",
        watering: "Regular",
        sunlight: "Full Sun",
        soil: "Rich, well-drained soil",
        cycle: "Annual",
    },
    potato: {
        wikiTitle: "Potato",
        type: "Vegetable",
        watering: "Medium",
        sunlight: "Full Sun",
        soil: "Loose fertile soil",
        cycle: "Annual",
    },
    banana: {
        wikiTitle: "Banana",
        type: "Fruit",
        watering: "High",
        sunlight: "Full Sun",
        soil: "Moist rich soil",
        cycle: "Perennial",
    },
    mango: {
        wikiTitle: "Mango",
        type: "Fruit",
        watering: "Moderate",
        sunlight: "Full Sun",
        soil: "Well-drained soil",
        cycle: "Perennial",
    },
    apple: {
        wikiTitle: "Apple",
        type: "Fruit",
        watering: "Moderate",
        sunlight: "Full Sun",
        soil: "Loamy soil",
        cycle: "Perennial",
    },
};

const CropInfoPanel = () => {
    const [search, setSearch] = useState("");
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        const key = search.toLowerCase().trim();

        if (!key) return;

        const advice = cropAdvice[key];

        if (!advice) {
            setCrop(null);
            setError("Search a supported crop: onion, tomato, potato, banana, mango, or apple.");
            return;
        }

        setLoading(true);
        setError("");
        setCrop(null);

        try {
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(advice.wikiTitle)}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch crop details from Wikipedia.");
            }

            const data = await res.json();

            setCrop({
                name: data.title || advice.wikiTitle,
                scientific:
                    data.description && data.description !== "Wikimedia disambiguation page"
                        ? data.description
                        : `${advice.wikiTitle} crop`,
                summary: data.extract || "No summary available.",
                image:
                    data.originalimage?.source ||
                    data.thumbnail?.source ||
                    "",
                type: advice.type,
                watering: advice.watering,
                sunlight: advice.sunlight,
                soil: advice.soil,
                cycle: advice.cycle,
            });
        } catch (err) {
            console.error("Wikipedia fetch failed:", err);
            setError(err.message || "Failed to load crop information.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FaSeedling className="text-lg" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-[1.65rem] leading-none font-black text-gray-900 uppercase tracking-tight">
                        Crop Information
                    </h3>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mt-2">
                        Search Crop Guidance
                    </p>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <input
                    type="text"
                    placeholder="Search (onion, tomato, potato...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-gray-700 placeholder-gray-400"
                />

                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full md:w-auto h-14 px-6 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <FaSearch />
                    {loading ? "LOADING..." : "SEARCH"}
                </button>
            </div>

            {!loading && error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm font-bold text-red-600 flex items-start gap-3">
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {loading && (
                <div className="rounded-2xl bg-emerald-50/60 p-4 text-sm font-bold text-emerald-700">
                    Loading crop details...
                </div>
            )}

            {!loading && crop && (
                <div className="space-y-5">
                    {crop.image && (
                        <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-52 object-cover rounded-[1.5rem] border border-gray-100"
                        />
                    )}

                    <div>
                        <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <FaAppleAlt className="text-emerald-500" />
                            {crop.name}
                        </h4>
                        <p className="text-sm text-gray-500 font-medium capitalize">
                            {crop.scientific}
                        </p>
                        <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mt-1">
                            {crop.type}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaTint className="text-blue-500 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Watering
                                </p>
                                <p className="font-bold text-gray-800">{crop.watering}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaSun className="text-yellow-500 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Sunlight
                                </p>
                                <p className="font-bold text-gray-800">{crop.sunlight}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaLeaf className="text-emerald-500 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Soil
                                </p>
                                <p className="font-bold text-gray-800">{crop.soil}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                            Growth Cycle
                        </p>
                        <p className="font-bold text-emerald-900">{crop.cycle}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <FaInfoCircle className="text-slate-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                API Summary
                            </p>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {crop.summary}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropInfoPanel;