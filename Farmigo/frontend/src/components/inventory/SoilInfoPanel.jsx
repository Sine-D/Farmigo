import { useEffect, useState } from "react";
import {
    FaGlobeAsia,
    FaMapMarkerAlt,
    FaFlask,
    FaLeaf,
    FaMountain,
    FaWater,
    FaSyncAlt,
} from "react-icons/fa";


const LOCATIONS = {
    Kurunegala: { lat: 7.555, lon: 80.255 },
    Anuradhapura: { lat: 8.214, lon: 80.530 },
    Dambulla: { lat: 7.903, lon: 80.709 },
    Polonnaruwa: { lat: 7.940, lon: 81.018 },
    Hambantota: { lat: 6.200, lon: 81.120 },
    Monaragala: { lat: 6.872, lon: 81.350 },
    Batticaloa: { lat: 7.710, lon: 81.692 },
    Trincomalee: { lat: 8.587, lon: 81.215 },
    Vavuniya: { lat: 8.751, lon: 80.497 },
    Mannar: { lat: 8.981, lon: 79.904 },
    Puttalam: { lat: 8.036, lon: 79.828 },
    Ratnapura: { lat: 6.705, lon: 80.384 },
    Badulla: { lat: 6.993, lon: 81.055 },
    Matara: { lat: 5.954, lon: 80.555 },
    Kalutara: { lat: 6.585, lon: 79.960 },
};

const SoilInfoPanel = () => {
    const [selectedLocation, setSelectedLocation] = useState("Kurunegala");
    const [soilData, setSoilData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getLayerValue = (data, layerName) => {
        const layer = data?.properties?.layers?.find(
            (item) => item.name === layerName
        );
        return layer?.depths?.[0]?.values?.mean ?? "No soil data for this location";
    };

    const fetchSoilData = async (locationName) => {
        const coords = LOCATIONS[locationName];
        if (!coords) return;

        setLoading(true);
        setError("");
        setSoilData(null);

        try {
            const res = await fetch(
                `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${coords.lat}&lon=${coords.lon}&property=phh2o&property=soc&property=clay&property=sand&depth=0-5cm&value=mean`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch soil information.");
            }

            const data = await res.json();

            setSoilData({
                ph: getLayerValue(data, "phh2o"),
                organicCarbon: getLayerValue(data, "soc"),
                clay: getLayerValue(data, "clay"),
                sand: getLayerValue(data, "sand"),
            });
        } catch (err) {
            console.error("SoilGrids fetch failed:", err);
            setError("Unable to load soil information right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoilData(selectedLocation);
    }, [selectedLocation]);

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FaGlobeAsia />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                        Soil Insights
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Sri Lanka farm soil data
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Select Location
                </label>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-gray-700"
                >
                    {Object.keys(LOCATIONS).sort().map((place) => (
                        <option key={place} value={place}>
                            {place}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700 flex items-center gap-2">
                    <FaSyncAlt className="animate-spin" />
                    Loading soil data...
                </div>
            )}

            {error && !loading && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm font-bold text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && soilData && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <FaMapMarkerAlt className="text-emerald-600" />
                            <p className="text-sm font-black text-gray-900">
                                {selectedLocation}, Sri Lanka
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                            Surface soil layer (0–5 cm)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaFlask className="text-pink-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Soil pH
                                </p>
                                <p className="font-bold text-gray-800">
                                    {soilData.ph}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaLeaf className="text-emerald-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Organic Carbon
                                </p>
                                <p className="font-bold text-gray-800">
                                    {soilData.organicCarbon}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaMountain className="text-orange-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Clay
                                </p>
                                <p className="font-bold text-gray-800">
                                    {soilData.clay}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <FaWater className="text-blue-500" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Sand
                                </p>
                                <p className="font-bold text-gray-800">
                                    {soilData.sand}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">
                            Farmer Benefit
                        </p>
                        <p className="text-sm font-medium text-amber-900 leading-relaxed">
                            This helps farmers understand soil quality and suitability for
                            crop planning in selected Sri Lankan locations.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SoilInfoPanel;