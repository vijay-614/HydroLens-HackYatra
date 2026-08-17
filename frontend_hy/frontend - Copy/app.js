/* ==========================================================================
   GVMC Vizag Smart Water Pipeline Monitoring System - Application Logic
   ========================================================================== */

// 1. DATA STRUCTURES

// GVMC Pipeline Networks Data
const gvmcNetworks = [
    {
        id: "NET-01",
        name: "Yeleru Canal Trunk Main Network",
        zone: "Zone 1 (Industrial & South Vizag)",
        color: "#ef4444", // Red
        diameter: "1400 mm",
        material: "Mild Steel / Ductile Iron",
        coverage: "Gajuwaka, Steel Plant, Sheela Nagar, Auto Nagar",
        lengthKm: 128,
        capacityMld: 180,
        maintCycleDays: 30,
        lastInspected: "2026-07-28",
        maintHealth: "88%",
        status: "Maintenance Needed",
        statusClass: "maintenance",
        tankName: "Yeleru Balancing Reservoir (YBR)",
        tankCapacityKl: 12000,
        tankLevelPct: 88,
        tankVolumeKl: 10560,
        inflowLs: 2400,
        outflowLs: 2350,
        tankStatus: "Optimal",
        avgPressureBar: 4.8,
        flowRateLs: 2350
    },
    {
        id: "NET-02",
        name: "Raiwada Water Supply Trunk Main",
        zone: "Zone 2 (West Vizag & Suburbs)",
        color: "#38bdf8", // Light Blue
        diameter: "1200 mm",
        material: "Ductile Iron (DI)",
        coverage: "Gopalapatnam, Pendurthi, NAD Junction, Marripalem",
        lengthKm: 84,
        capacityMld: 110,
        maintCycleDays: 45,
        lastInspected: "2026-07-29",
        maintHealth: "94%",
        status: "Optimal",
        statusClass: "optimal",
        tankName: "Raiwada Headworks Reservoir",
        tankCapacityKl: 8500,
        tankLevelPct: 74,
        tankVolumeKl: 6290,
        inflowLs: 1800,
        outflowLs: 1790,
        tankStatus: "Optimal",
        avgPressureBar: 4.2,
        flowRateLs: 1790
    },
    {
        id: "NET-03",
        name: "Mudasarlova Distribution Network",
        zone: "Zone 3 (Core Central Vizag)",
        color: "#f59e0b", // Gold / Amber
        diameter: "800 mm",
        material: "Cast Iron / Ductile Iron",
        coverage: "MVP Colony, Dwaraka Nagar, Siripuram, Asilmetta",
        lengthKm: 62,
        capacityMld: 45,
        maintCycleDays: 20,
        lastInspected: "2026-07-31",
        maintHealth: "96%",
        status: "Optimal",
        statusClass: "optimal",
        tankName: "Mudasarlova Reservoir & GLSR",
        tankCapacityKl: 4200,
        tankLevelPct: 92,
        tankVolumeKl: 3864,
        inflowLs: 720,
        outflowLs: 715,
        tankStatus: "High Level Alert",
        avgPressureBar: 3.6,
        flowRateLs: 715
    },
    {
        id: "NET-04",
        name: "Meghadrigedda North-West Trunk Line",
        zone: "Zone 4 (Airport & Industrial Zone)",
        color: "#10b981", // Emerald Green
        diameter: "1000 mm",
        material: "Pre-stressed Concrete (PSC)",
        coverage: "Airport Area, BHPV, Narava, Kancharapalem",
        lengthKm: 48,
        capacityMld: 60,
        maintCycleDays: 30,
        lastInspected: "2026-07-25",
        maintHealth: "82%",
        status: "Optimal",
        statusClass: "optimal",
        tankName: "Meghadrigedda ELSR Hub",
        tankCapacityKl: 6000,
        tankLevelPct: 65,
        tankVolumeKl: 3900,
        inflowLs: 1050,
        outflowLs: 1050,
        tankStatus: "Optimal",
        avgPressureBar: 4.0,
        flowRateLs: 1050
    },
    {
        id: "NET-05",
        name: "Gambheeram & Gosthani Coastal Network",
        zone: "Zone 5 (North Coastal Vizag)",
        color: "#a855f7", // Purple
        diameter: "900 mm",
        material: "HDPE / Ductile Iron",
        coverage: "Madhurawada, Rushikonda, IT Hill, Bheemunipatnam",
        lengthKm: 95,
        capacityMld: 55,
        maintCycleDays: 30,
        lastInspected: "2026-07-30",
        maintHealth: "76%",
        status: "Low Pressure Warning",
        statusClass: "critical",
        tankName: "Gambheeram High-Level Storage",
        tankCapacityKl: 5100,
        tankLevelPct: 48,
        tankVolumeKl: 2448,
        inflowLs: 680,
        outflowLs: 720,
        tankStatus: "Low Level Warning",
        avgPressureBar: 2.9,
        flowRateLs: 720
    },
    {
        id: "NET-06",
        name: "Kanithi Balancing Reservoir (KBR) Network",
        zone: "Zone 6 (Vizag Port & South Coast)",
        color: "#ec4899", // Pink
        diameter: "1100 mm",
        material: "Mild Steel",
        coverage: "Vizag Port Trust, Vadlapudi, Kurmannapalem",
        lengthKm: 42,
        capacityMld: 70,
        maintCycleDays: 40,
        lastInspected: "2026-07-27",
        maintHealth: "91%",
        status: "Optimal",
        statusClass: "optimal",
        tankName: "Kanithi Industrial Reservoir",
        tankCapacityKl: 9800,
        tankLevelPct: 81,
        tankVolumeKl: 7938,
        inflowLs: 1450,
        outflowLs: 1420,
        tankStatus: "Optimal",
        avgPressureBar: 4.5,
        flowRateLs: 1420
    }
];

// Top 13 Online/Google Citizen Complaints for GVMC Vizag (Condition 1)
const citizenComplaintsData = [
    {
        id: "CMP-2026-8901",
        title: "Low Water Pressure in MVP Colony Sector 4",
        category: "Pressure Issue",
        ward: "Ward 18 (MVP Area)",
        citizen: "K. Satyanarayana",
        date: "2026-07-31 08:30 IST",
        status: "In Progress",
        statusClass: "warning",
        priority: "High",
        desc: "Water pressure has dropped significantly for past 2 days in Sector 4 residential apartments. Upper floors not receiving water without booster pumps."
    },
    {
        id: "CMP-2026-8902",
        title: "Major Pipeline Burst near Gajuwaka High School Road",
        category: "Major Leakage",
        ward: "Ward 62 (Gajuwaka)",
        citizen: "M. Appa Rao",
        date: "2026-07-31 09:15 IST",
        status: "Dispatched Team",
        statusClass: "critical",
        priority: "Critical",
        desc: "Heavy water gushing out on main road near High School junction. Road flooding occurring and water wasted rapidly."
    },
    {
        id: "CMP-2026-8903",
        title: "Contaminated Muddy Water in Madhurawada Sector 2",
        category: "Water Quality",
        ward: "Ward 6 (Madhurawada)",
        citizen: "Smt. V. Lakshmi",
        date: "2026-07-31 07:45 IST",
        status: "Inspection Scheduled",
        statusClass: "critical",
        priority: "Critical",
        desc: "Tap water coming out brownish and muddy since morning supply. Suspected drainage line seepage into drinking pipe."
    },
    {
        id: "CMP-2026-8904",
        title: "Supply Disruption at Gopalapatnam Railway Colony",
        category: "Supply Interruption",
        ward: "Ward 45 (Gopalapatnam)",
        citizen: "B. Suresh Kumar",
        date: "2026-07-31 06:00 IST",
        status: "Resolved",
        statusClass: "success",
        priority: "High",
        desc: "No morning water supply received in Railway Colony area. Valve lock cleared by GVMC team at 08:00 AM."
    },
    {
        id: "CMP-2026-8905",
        title: "Air Lock in Distribution Pipe at Dwaraka Nagar 3rd Lane",
        category: "Distribution Air Lock",
        ward: "Ward 24 (Dwaraka Nagar)",
        citizen: "P. Ranganatham",
        date: "2026-07-31 07:10 IST",
        status: "In Progress",
        statusClass: "warning",
        priority: "Medium",
        desc: "Pipe sputtering air with low flow. Needs air release valve venting near 3rd Lane main valve box."
    },
    {
        id: "CMP-2026-8906",
        title: "Damaged Sluice Valve Flooding Road in Siripuram",
        category: "Valve Failure",
        ward: "Ward 20 (Siripuram)",
        citizen: "Dr. A. Srinivas",
        date: "2026-07-31 09:40 IST",
        status: "Work in Progress",
        statusClass: "critical",
        priority: "Critical",
        desc: "Old sluice valve gland packing leaked under heavy pressure near Siripuram Circle. Crew replacing valve seal."
    },
    {
        id: "CMP-2026-8907",
        title: "Irregular Water Timing in Pendurthi Anandapuram Belt",
        category: "Timing Issue",
        ward: "Ward 51 (Pendurthi)",
        citizen: "G. Simhachalam",
        date: "2026-07-31 05:30 IST",
        status: "Open",
        statusClass: "warning",
        priority: "Low",
        desc: "Water released at 4:00 AM instead of scheduled 6:00 AM. Residents missing water collection schedule."
    },
    {
        id: "CMP-2026-8908",
        title: "Pipeline Burst near Rushikonda IT Hill Gate No. 2",
        category: "Burst Pipe",
        ward: "Ward 4 (Rushikonda)",
        citizen: "N. Tarun (IT Park Admin)",
        date: "2026-07-31 09:55 IST",
        status: "Emergency Team On-site",
        statusClass: "critical",
        priority: "Critical",
        desc: "Road excavation damaged 300mm distribution feeder pipe. IT Park water supply isolated."
    },
    {
        id: "CMP-2026-8909",
        title: "Low Chlorine Smell Complaint in Akkayyapalem",
        category: "Water Quality",
        ward: "Ward 31 (Akkayyapalem)",
        citizen: "Ch. Venkat",
        date: "2026-07-31 06:45 IST",
        status: "Testing Lab Sampled",
        statusClass: "warning",
        priority: "High",
        desc: "Water lacks standard residual chlorine treatment odor. Water lab sampling team dispatched."
    },
    {
        id: "CMP-2026-8910",
        title: "Underground Leakage in Seethammadhara North Ext",
        category: "Underground Leak",
        ward: "Ward 15 (Seethammadhara)",
        citizen: "T. Ramesh",
        date: "2026-07-30 18:20 IST",
        status: "Scheduled for Repair",
        statusClass: "warning",
        priority: "Medium",
        desc: "Water seeping through tar road surface near Flat 402. Acoustic leak detector confirmed line defect."
    },
    {
        id: "CMP-2026-8911",
        title: "No Water Supply for 2 Days in Arilova Colony Phase 3",
        category: "No Water Supply",
        ward: "Ward 11 (Arilova)",
        citizen: "Smt. K. Parvathi",
        date: "2026-07-30 20:00 IST",
        status: "Tanker Dispatched",
        statusClass: "critical",
        priority: "Critical",
        desc: "Phase 3 elevated area receiving zero water due to booster pump failure. Emergency GVMC tankers dispatched."
    },
    {
        id: "CMP-2026-8912",
        title: "Commercial Connection Pipe Leak at Jagadamba Junction",
        category: "Commercial Leak",
        ward: "Ward 28 (Jagadamba)",
        citizen: "S. K. Mohammad",
        date: "2026-07-30 14:10 IST",
        status: "Valve Isolated",
        statusClass: "success",
        priority: "Medium",
        desc: "Leakage at commercial meter manifold. Isolated valve and meter replacement completed."
    },
    {
        id: "CMP-2026-8913",
        title: "Booster Pump Noise & Vibration at Steel Plant GLSR",
        category: "Pump Failure",
        ward: "Ward 68 (Steel Plant Township)",
        citizen: "V. R. K. Prasad",
        date: "2026-07-30 11:30 IST",
        status: "Maintenance Assigned",
        statusClass: "success",
        priority: "High",
        desc: "Heavy bearing noise in 150 HP booster pump #2. Bearing assembly replacement completed."
    }
];

// Top & Critical Issue Notifications (Condition 3)
const topCriticalNotifications = [
    {
        id: "NTF-101",
        severity: "critical",
        title: "Pipe Burst on Yeleru 1400mm Trunk Line",
        location: "Gajuwaka Junction (Zone 1)",
        time: "15 mins ago",
        desc: "High volume flow drop detected. Emergency isolation valve activated automatically. Maintenance crew dispatched."
    },
    {
        id: "NTF-102",
        severity: "critical",
        title: "Low Reservoir Level Warning (48%)",
        location: "Gambheeram High Storage (Zone 5)",
        time: "40 mins ago",
        desc: "Storage level dipped below 50% safety threshold due to high summer draw. Inflow booster pump speed increased by 15%."
    },
    {
        id: "NTF-103",
        severity: "warning",
        title: "Turbidity Anomaly Detected",
        location: "Madhurawada Distribution Sector 2",
        time: "2 Hours ago",
        desc: "Inline optical sensor registered 6.8 NTU turbidity. Water filtration unit backwash triggered."
    },
    {
        id: "NTF-104",
        severity: "warning",
        title: "Telemetry Sensor Signal Interruption",
        location: "Arilova Pumping Substation #4",
        time: "3 Hours ago",
        desc: "IoT RTU gateway offline. Field technician assigned for RS485 communication link verification."
    }
];

// 2. DOM LOAD & INITIALIZATION

let mapObj = null;
let flowChartObj = null;
let pressureChartObj = null;
let dailyFlowChartObj = null;
let weeklyChartObj = null;
let monthlyChartObj = null;

document.addEventListener("DOMContentLoaded", () => {
    initClock();
    initNavigation();
    initNotifications();
    initLeafletMap();
    renderMaintenancePage();
    renderTankLevelsPage();
    renderPipelineMonitoringPage();
    renderCitizenComplaintsPage();
    renderDailyPerformancePage();
    renderWeeklyPerformancePage();
    renderMonthlyPerformancePage();
    initSensorsModule();
    initAiChat();
});

// Live Clock
function initClock() {
    const clockEl = document.getElementById("live-clock");
    setInterval(() => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
    }, 1000);
}

// 3. TAB NAVIGATION SYSTEM
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item, .dropdown-item");
    const sections = document.querySelectorAll(".page-section");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const targetTab = item.getAttribute("data-tab");
            if (!targetTab) return;

            // Highlight top nav active state
            document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
            
            // If dropdown item clicked, highlight parent dropdown btn
            if (item.classList.contains("dropdown-item") || item.id === "perf-dropdown-btn") {
                document.getElementById("perf-dropdown-btn").classList.add("active");
            } else {
                item.classList.add("active");
            }

            // Switch page section
            sections.forEach(sec => {
                if (sec.id === targetTab) {
                    sec.classList.add("active");
                } else {
                    sec.classList.remove("active");
                }
            });

            // Trigger Leaflet map invalidateSize if map tab opened
            if (targetTab === "map-dashboard" && mapObj) {
                setTimeout(() => mapObj.invalidateSize(), 150);
            }

            // Smooth dynamic chart resizing for Performance Updates
            if (targetTab === "perf-daily") {
                setTimeout(() => {
                    if (dailyFlowChartObj) dailyFlowChartObj.resize();
                    else renderDailyPerformancePage();
                }, 100);
            } else if (targetTab === "perf-weekly") {
                setTimeout(() => {
                    if (weeklyChartObj) weeklyChartObj.resize();
                    else renderWeeklyPerformancePage();
                }, 100);
            } else if (targetTab === "perf-monthly") {
                setTimeout(() => {
                    if (monthlyChartObj) monthlyChartObj.resize();
                    else renderMonthlyPerformancePage();
                }, 100);
            } else if (targetTab === "sensors") {
                renderSensorsPage();
            }
        });
    });
}

// 4. NOTIFICATIONS DRAWER (Condition 3: Top & Critical Issues)
function initNotifications() {
    const notifBtn = document.getElementById("notif-toggle-btn");
    const notifDrawer = document.getElementById("notif-drawer");
    const overlay = document.getElementById("notif-drawer-overlay");
    const closeBtn = document.getElementById("close-notif-btn");
    const listContainer = document.getElementById("notif-list-container");
    const acknowledgeBtn = document.getElementById("acknowledge-all-btn");

    function renderNotifs(filter = "all") {
        listContainer.innerHTML = "";
        const filtered = topCriticalNotifications.filter(n => filter === "all" || n.severity === filter);
        
        filtered.forEach(n => {
            const card = document.createElement("div");
            card.className = `notif-card ${n.severity}`;
            card.innerHTML = `
                <div class="notif-head">
                    <span class="sev-badge ${n.severity}">${n.severity}</span>
                    <span class="notif-time">${n.time}</span>
                </div>
                <h4>${n.title}</h4>
                <p>${n.desc}</p>
                <div class="notif-location">
                    <i class="fa-solid fa-location-dot"></i> ${n.location}
                </div>
            `;
            listContainer.appendChild(card);
        });
    }

    renderNotifs();

    notifBtn.addEventListener("click", () => {
        notifDrawer.classList.add("open");
        overlay.classList.add("active");
    });

    const closeDrawer = () => {
        notifDrawer.classList.remove("open");
        overlay.classList.remove("active");
    };

    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    // Filter Chips
    const filterChips = document.querySelectorAll(".notif-filter-bar .filter-chip");
    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            renderNotifs(chip.getAttribute("data-filter"));
        });
    });

    acknowledgeBtn.addEventListener("click", () => {
        document.getElementById("notif-count").textContent = "0";
        document.getElementById("system-status-chip").className = "system-status-chip optimal";
        document.getElementById("system-status-chip").innerHTML = `<span class="pulse-dot green"></span> <span class="status-lbl">SYSTEM STATUS: ALL OPTIMAL</span>`;
        alert("All critical alerts acknowledged by GVMC Operator.");
        closeDrawer();
    });
}

// 5. GEOGRAPHICAL MAP (Condition 6: Preserve Map Appearance for Vizag)
function initLeafletMap() {
    const mapContainer = document.getElementById("gvmc-map");
    if (!mapContainer) return;

    // Visakhapatnam Coordinates: 17.6868° N, 83.2185° E
    mapObj = L.map("gvmc-map", {
        center: [17.728, 83.270],
        zoom: 11,
        zoomControl: true
    });

    // CartoDB Dark Matter Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; GVMC Vizag GIS | CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapObj);

    // Key Locations in Visakhapatnam
    const vizagLocations = [
        { name: "Yeleru Canal Intake Headworks", lat: 17.612, lng: 83.050, type: "source", net: "Yeleru Line" },
        { name: "Gajuwaka Industrial Trunk Node", lat: 17.690, lng: 83.200, type: "junction", net: "Yeleru Line" },
        { name: "Raiwada Reservoir Headworks", lat: 17.820, lng: 83.120, type: "source", net: "Raiwada Line" },
        { name: "Gopalapatnam Pumping Station", lat: 17.745, lng: 83.220, type: "station", net: "Raiwada Line" },
        { name: "Mudasarlova Reservoir & GLSR", lat: 17.765, lng: 83.295, type: "source", net: "Mudasarlova Line" },
        { name: "Siripuram ELSR Tower", lat: 17.720, lng: 83.315, type: "elsr", net: "Mudasarlova Line" },
        { name: "MVP Colony Distribution Hub", lat: 17.742, lng: 83.330, type: "station", net: "Mudasarlova Line" },
        { name: "Meghadrigedda Reservoir", lat: 17.760, lng: 83.180, type: "source", net: "Meghadrigedda Line" },
        { name: "Gambheeram High Storage", lat: 17.825, lng: 83.360, type: "elsr", net: "Gambheeram Line" },
        { name: "Madhurawada Distribution Node", lat: 17.800, lng: 83.350, type: "station", net: "Gambheeram Line" },
        { name: "Kanithi Balancing Reservoir (KBR)", lat: 17.650, lng: 83.170, type: "source", net: "KBR Line" }
    ];

    // Expanded Pipeline Network Polyline Routes across Vizag (Requirement 1)
    const pipelineRoutes = [
        // 1. Yeleru Route (Red - Critical Issue)
        { coords: [[17.612, 83.050], [17.650, 83.120], [17.690, 83.200], [17.650, 83.170]], color: "#ef4444", name: "Yeleru 1400mm Trunk Main (Zone 1 - Gajuwaka)", status: "critical", desc: "Trunk overhaul & valve repair underway" },
        // 2. Raiwada Route (Cyan)
        { coords: [[17.820, 83.120], [17.780, 83.180], [17.745, 83.220], [17.720, 83.315]], color: "#38bdf8", name: "Raiwada 1200mm Trunk (Zone 2 - Gopalapatnam)", status: "optimal", desc: "Optimal pressure 4.2 Bar" },
        // 3. Mudasarlova Route (Gold)
        { coords: [[17.765, 83.295], [17.742, 83.330], [17.720, 83.315]], color: "#f59e0b", name: "Mudasarlova 800mm Network (Zone 3 - Core Central Vizag)", status: "optimal", desc: "Normal distribution active" },
        // 4. Meghadrigedda Route (Emerald Green)
        { coords: [[17.760, 83.180], [17.745, 83.220]], color: "#10b981", name: "Meghadrigedda 1000mm North-West Trunk (Zone 4 - Airport)", status: "optimal", desc: "Steady supply 1050 L/s" },
        // 5. Gambheeram Coastal Line (Purple - Low Pressure Warning)
        { coords: [[17.825, 83.360], [17.800, 83.350], [17.742, 83.330]], color: "#a855f7", name: "Gambheeram 900mm Coastal Line (Zone 5 - Madhurawada)", status: "critical", desc: "Low pressure warning (2.9 Bar)" },
        // 6. KBR Industrial Feeder (Pink)
        { coords: [[17.650, 83.170], [17.680, 83.220], [17.700, 83.280]], color: "#ec4899", name: "Kanithi 1100mm Industrial Feeder (Zone 6 - Vizag Port)", status: "optimal", desc: "Optimal supply 1420 L/s" },
        // 7. MVP-Siripuram Interconnect Loop (Amber)
        { coords: [[17.742, 83.330], [17.730, 83.325], [17.720, 83.315]], color: "#f59e0b", name: "MVP - Siripuram 600mm Interconnect Loop (Ward 18 & 20)", status: "optimal", desc: "Balanced grid flow" },
        // 8. Steel Plant Industrial Line (Red - Maintenance Needed)
        { coords: [[17.690, 83.200], [17.660, 83.180], [17.650, 83.170]], color: "#ef4444", name: "Steel Plant 900mm High-Pressure Main (Ward 68)", status: "critical", desc: "Booster pump vibration alert" },
        // 9. Pendurthi-Anandapuram Trunk (Sky Blue)
        { coords: [[17.780, 83.180], [17.800, 83.220], [17.830, 83.260]], color: "#0284c7", name: "Pendurthi - Anandapuram 750mm Sub-Trunk", status: "optimal", desc: "Normal scheduled supply" },
        // 10. Arilova-Health City Feeder (Orange - Warning)
        { coords: [[17.765, 83.295], [17.775, 83.320], [17.785, 83.340]], color: "#f97316", name: "Arilova - Health City 500mm Feeder Spur (Ward 11)", status: "warning", desc: "Booster pump pressure drop" },
        // 11. Jagadamba Heritage Grid (Indigo)
        { coords: [[17.720, 83.315], [17.710, 83.300], [17.695, 83.290]], color: "#6366f1", name: "Jagadamba - Port Commercial 600mm Loop (Ward 28)", status: "optimal", desc: "Isolated valve repair verified" },
        // 12. Rushikonda IT Hill Dedicated Main (Crimson Red - Burst Pipe)
        { coords: [[17.800, 83.350], [17.810, 83.375], [17.825, 83.385]], color: "#dc2626", name: "Rushikonda IT Park 450mm Dedicated Main (Ward 4)", status: "critical", desc: "Excavation pipe damage & leak isolation" },
        // 13. Seethammadhara North Distribution Line (Teal)
        { coords: [[17.736, 83.312], [17.750, 83.320], [17.760, 83.325]], color: "#14b8a6", name: "Seethammadhara North 550mm Feeder (Ward 15 & 22)", status: "optimal", desc: "Acoustic leak detector verified" }
    ];

    // Draw Polylines with Dynamic Hover Tooltips & Red Pulse Animations for Critical Issue Areas
    pipelineRoutes.forEach(route => {
        const isCritical = route.status === "critical" || route.status === "warning";
        const lineOptions = {
            color: route.color,
            weight: isCritical ? 6 : 4.5,
            opacity: 0.9,
            dashArray: route.name.includes("Mudasarlova") ? "4, 8" : null,
            className: route.status === "critical" ? "pulse-critical-line" : ""
        };

        const polyline = L.polyline(route.coords, lineOptions).addTo(mapObj);

        // Hover-Only Interactive Tooltip (Requirement 1 - Preserved Hover/Pointer Behavior)
        polyline.bindTooltip(`
            <div style="font-size:12px;">
                <strong style="color:${isCritical ? '#f87171' : '#38bdf8'}">${route.name}</strong><br>
                <span>Status: <strong style="color:${isCritical ? '#f87171' : '#34d399'}">${isCritical ? '⚠️ ' + route.status.toUpperCase() + ' / ATTENTION NEEDED' : '✓ OPTIMAL'}</strong></span><br>
                <small style="color:#94a3b8;">${route.desc}</small>
            </div>
        `, {
            permanent: false,
            sticky: true,
            direction: "top",
            className: "map-zone-label"
        });

        polyline.bindPopup(`<strong>GVMC Trunk: ${route.name}</strong><p>${route.desc}</p>`);
    });

    // Draw Markers with Hover Tooltips & Critical Pulsing Glow Animations (Requirement 1 & 2)
    vizagLocations.forEach(loc => {
        const isCriticalNode = loc.name.includes("Gajuwaka") || loc.name.includes("Gambheeram");

        // Add Red Pulsing Glow Animation for Critical Nodes
        if (isCriticalNode) {
            L.circleMarker([loc.lat, loc.lng], {
                radius: 16,
                fillColor: "#ef4444",
                color: "#ef4444",
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3,
                className: "pulse-critical-glow"
            }).addTo(mapObj);
        }

        const marker = L.circleMarker([loc.lat, loc.lng], {
            radius: isCriticalNode ? 9 : 7,
            fillColor: isCriticalNode ? "#ef4444" : (loc.type === "source" ? "#38bdf8" : (loc.type === "elsr" ? "#10b981" : "#f59e0b")),
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95
        }).addTo(mapObj);

        // Hover-Only Interactive Tooltip (Requirement 1 - Preserved Hover/Pointer Behavior)
        marker.bindTooltip(`
            <div style="font-size:12px;">
                <strong>${loc.name}</strong><br>
                <span style="color:#94a3b8;">Network: ${loc.net}</span><br>
                <span style="color:${isCriticalNode ? '#f87171' : '#34d399'}; font-weight:bold;">${isCriticalNode ? 'CRITICAL ALERT' : 'ACTIVE TELEMETRY'}</span>
            </div>
        `, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'map-zone-label'
        });

        marker.bindPopup(`
            <div style="color:#000; font-family:sans-serif;">
                <h4 style="margin:0 0 4px; color:#0b2545;">${loc.name}</h4>
                <p style="margin:0; font-size:12px;">Network: <strong>${loc.net}</strong></p>
                <p style="margin:0; font-size:12px;">Type: ${loc.type.toUpperCase()}</p>
                <span style="display:inline-block; margin-top:4px; padding:2px 6px; background:${isCriticalNode ? '#ef4444' : '#10b981'}; color:#fff; font-size:10px; border-radius:3px;">
                    ${isCriticalNode ? 'CRITICAL ISSUE DETECTED' : 'ACTIVE TELEMETRY'}
                </span>
            </div>
        `);
    });

    // Populate Sidebar Legend - Exclusively Displays Issued Areas (Requirement 2)
    const legendEl = document.getElementById("network-legend");
    if (legendEl) {
        const issuedNetworks = gvmcNetworks.filter(n => n.statusClass === "critical" || n.statusClass === "maintenance" || n.status !== "Optimal");
        
        if (issuedNetworks.length === 0) {
            legendEl.innerHTML = `<div style="padding:16px; text-align:center; color:#94a3b8; font-size:0.85rem;"><i class="fa-solid fa-circle-check text-emerald"></i> All Vizag Networks Operating Optimally</div>`;
        } else {
            legendEl.innerHTML = issuedNetworks.map(n => `
                <div class="legend-item">
                    <div class="legend-left">
                        <span class="color-dot" style="background:${n.color}"></span>
                        <div>
                            <span class="legend-name">${n.name}</span>
                            <span class="legend-sub">${n.zone}</span>
                        </div>
                    </div>
                    <span class="status-badge ${n.statusClass}">${n.status}</span>
                </div>
            `).join("");
        }
    }
}

// 6. RENDER MAINTENANCE PAGE (Condition 1)
function renderMaintenancePage() {
    const tableBody = document.getElementById("maint-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = gvmcNetworks.map(net => `
        <tr>
            <td>
                <strong style="color:#fff;">${net.name}</strong><br>
                <small class="text-muted">${net.zone}</small>
            </td>
            <td>${net.diameter} | ${net.material}</td>
            <td>${net.coverage}</td>
            <td>Every ${net.maintCycleDays} Days</td>
            <td>${net.lastInspected}</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="flex:1; background:rgba(255,255,255,0.1); height:6px; border-radius:3px;">
                        <div style="width:${net.maintHealth}; background:${net.maintHealth > '85%' ? '#10b981' : '#f59e0b'}; height:100%; border-radius:3px;"></div>
                    </div>
                    <span>${net.maintHealth}</span>
                </div>
            </td>
            <td><span class="status-badge ${net.statusClass}">${net.status}</span></td>
            <td><button class="btn btn-sm btn-outline"><i class="fa-solid fa-wrench"></i> Log Maint</button></td>
        </tr>
    `).join("");
}

// 7. RENDER TANK LEVELS PAGE (Condition 1)
function renderTankLevelsPage() {
    const gridContainer = document.getElementById("tank-grid-container");
    const tableBody = document.getElementById("tank-table-body");
    if (!gridContainer || !tableBody) return;

    // Render Tank Cards
    gridContainer.innerHTML = gvmcNetworks.map(net => `
        <div class="tank-card">
            <div class="tank-header">
                <div>
                    <h4 class="tank-name">${net.tankName}</h4>
                    <span class="tank-sub">${net.name}</span>
                </div>
                <span class="status-badge ${net.tankLevelPct < 50 ? 'critical' : 'optimal'}">${net.tankStatus}</span>
            </div>

            <div class="tank-visual-row">
                <div class="tank-cylinder-meter">
                    <div class="tank-water-fill" style="height:${net.tankLevelPct}%">
                        <div class="water-wave"></div>
                    </div>
                </div>
                <div class="tank-metrics">
                    <span class="tank-val-big">${net.tankLevelPct}%</span>
                    <span class="text-muted" style="font-size:0.8rem;">Current Storage Volume:</span>
                    <strong style="color:#fff; font-size:1rem;">${net.tankVolumeKl.toLocaleString()} KL / ${net.tankCapacityKl.toLocaleString()} KL</strong>
                </div>
            </div>

            <div class="tank-flow-info">
                <span><i class="fa-solid fa-arrow-down-long text-emerald"></i> Inflow: <strong>${net.inflowLs} L/s</strong></span>
                <span><i class="fa-solid fa-arrow-up-long text-cyan"></i> Outflow: <strong>${net.outflowLs} L/s</strong></span>
            </div>
        </div>
    `).join("");

    // Render Integrated Table
    tableBody.innerHTML = gvmcNetworks.map(net => `
        <tr>
            <td><strong>${net.name}</strong><br><small class="text-muted">${net.zone}</small></td>
            <td>${net.tankName}</td>
            <td>${net.tankCapacityKl.toLocaleString()} KL</td>
            <td><strong class="text-cyan">${net.tankLevelPct}%</strong></td>
            <td>${net.tankVolumeKl.toLocaleString()} KL</td>
            <td><span class="text-emerald">${net.inflowLs} L/s</span></td>
            <td><span class="text-gold">${net.outflowLs} L/s</span></td>
            <td><span class="status-badge ${net.tankLevelPct < 50 ? 'critical' : 'optimal'}">${net.tankStatus}</span></td>
        </tr>
    `).join("");
}

// 8. RENDER PIPELINE MONITORING PAGE & CHARTS (Condition 1)
function renderPipelineMonitoringPage() {
    // Flow Rate Chart
    const flowCtx = document.getElementById("flowRateChart");
    if (flowCtx) {
        flowChartObj = new Chart(flowCtx, {
            type: "bar",
            data: {
                labels: gvmcNetworks.map(n => n.id),
                datasets: [{
                    label: "Live Flow Rate (L/s)",
                    data: gvmcNetworks.map(n => n.flowRateLs),
                    backgroundColor: gvmcNetworks.map(n => n.color),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    x: { ticks: { color: "#94a3b8" }, grid: { display: false } }
                }
            }
        });
    }

    // Pressure Chart
    const pressCtx = document.getElementById("pressureChart");
    if (pressCtx) {
        pressureChartObj = new Chart(pressCtx, {
            type: "line",
            data: {
                labels: gvmcNetworks.map(n => n.id),
                datasets: [{
                    label: "Network Pressure (Bar)",
                    data: gvmcNetworks.map(n => n.avgPressureBar),
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.15)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 7, ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                    x: { ticks: { color: "#94a3b8" }, grid: { display: false } }
                }
            }
        });
    }

    // Render Topology Nodes
    const topoContainer = document.getElementById("topology-container");
    if (topoContainer) {
        topoContainer.innerHTML = `
            <div class="topo-node source">
                <i class="fa-solid fa-water-ladder topo-icon text-cyan"></i>
                <h4>Yeleru / Raiwada Reservoirs</h4>
                <p>Primary Raw Water Sources</p>
            </div>
            <i class="fa-solid fa-arrow-right topo-arrow"></i>
            <div class="topo-node trunk">
                <i class="fa-solid fa-gears topo-icon text-gold"></i>
                <h4>Water Treatment Plants (WTP)</h4>
                <p>Filtration & Chlorination</p>
            </div>
            <i class="fa-solid fa-arrow-right topo-arrow"></i>
            <div class="topo-node elsr">
                <i class="fa-solid fa-building-flag topo-icon text-emerald"></i>
                <h4>GVMC GLSR / ELSR Towers</h4>
                <p>98 Wards Storage Balancing</p>
            </div>
            <i class="fa-solid fa-arrow-right topo-arrow"></i>
            <div class="topo-node source">
                <i class="fa-solid fa-house-signal topo-icon text-purple"></i>
                <h4>Citizen Connections</h4>
                <p>Domestic & Industrial Supply</p>
            </div>
        `;
    }
}

// 9. RENDER CITIZEN COMPLAINTS PAGE (Condition 1: Top 13 Complaints)
function renderCitizenComplaintsPage() {
    const grid = document.getElementById("complaints-grid");
    const searchInput = document.getElementById("complaint-search");
    const filterSelect = document.getElementById("complaint-status-filter");
    if (!grid) return;

    function renderList(list) {
        grid.innerHTML = list.map(c => `
            <div class="complaint-card">
                <div>
                    <div class="complaint-card-header">
                        <span class="complaint-id">${c.id}</span>
                        <span class="status-badge ${c.statusClass}">${c.status}</span>
                    </div>
                    <h4>${c.title}</h4>
                    <p>${c.desc}</p>
                </div>
                <div class="complaint-meta">
                    <span><i class="fa-solid fa-location-dot text-gold"></i> ${c.ward}</span>
                    <span><i class="fa-solid fa-user text-cyan"></i> Citizen: ${c.citizen}</span>
                    <span><i class="fa-solid fa-clock"></i> ${c.date} | Priority: <strong>${c.priority}</strong></span>
                </div>
            </div>
        `).join("");
    }

    renderList(citizenComplaintsData);

    // Search and Filter Events
    const filterData = () => {
        const q = searchInput.value.toLowerCase();
        const status = filterSelect.value;
        const filtered = citizenComplaintsData.filter(c => {
            const matchesQ = c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.ward.toLowerCase().includes(q);
            const matchesStatus = status === "all" || c.status.toLowerCase().includes(status.toLowerCase());
            return matchesQ && matchesStatus;
        });
        renderList(filtered);
    };

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (filterSelect) filterSelect.addEventListener("change", filterData);
}

// 10. PERFORMANCE UPDATES PAGES (Condition 2: Separate Pages for Daily, Weekly, Monthly)

function renderDailyPerformancePage() {
    const ctx = document.getElementById("dailyFlowChart");
    if (!ctx) return;

    dailyFlowChartObj = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
            datasets: [
                {
                    label: "Target Supply Flow (MLD)",
                    data: [15, 12, 48, 52, 28, 22, 42, 25],
                    borderColor: "#38bdf8",
                    borderDash: [5, 5],
                    tension: 0.4
                },
                {
                    label: "Actual Delivered Flow (MLD)",
                    data: [14.8, 11.9, 49.2, 51.5, 27.8, 21.9, 41.8, 24.6],
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                x: { ticks: { color: "#94a3b8" }, grid: { display: false } }
            }
        }
    });
}

function renderWeeklyPerformancePage() {
    const ctx = document.getElementById("weeklyChart");
    if (!ctx) return;

    weeklyChartObj = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Zone 1 (Yeleru)",
                    data: [180, 182, 179, 181, 180, 184, 180],
                    backgroundColor: "#ef4444"
                },
                {
                    label: "Zone 2 (Raiwada)",
                    data: [110, 108, 112, 110, 109, 111, 110],
                    backgroundColor: "#38bdf8"
                },
                {
                    label: "Zone 3 (Mudasarlova)",
                    data: [45, 46, 44, 45, 45, 46, 45],
                    backgroundColor: "#f59e0b"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { stacked: true, ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                x: { stacked: true, ticks: { color: "#94a3b8" }, grid: { display: false } }
            }
        }
    });
}

function renderMonthlyPerformancePage() {
    const ctx = document.getElementById("monthlyChart");
    if (!ctx) return;

    monthlyChartObj = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
                {
                    label: "Total Water Supplied (Million Liters)",
                    data: [3080, 3110, 3094, 3120],
                    borderColor: "#a855f7",
                    backgroundColor: "rgba(168, 85, 247, 0.15)",
                    fill: true,
                    tension: 0.3
                },
                {
                    label: "Non-Revenue Water Loss %",
                    data: [17.1, 16.4, 15.2, 14.8],
                    borderColor: "#ef4444",
                    yAxisID: "y1",
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                y1: { position: "right", ticks: { color: "#ef4444" }, grid: { display: false } },
                x: { ticks: { color: "#94a3b8" }, grid: { display: false } }
            }
        }
    });
}

// 11. AI ASSISTANT CHAT SIMULATION
function initAiChat() {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-chat-btn");
    const messages = document.getElementById("chat-messages");
    if (!input || !sendBtn || !messages) return;

    const sendMessage = () => {
        const text = input.value.trim();
        if (!text) return;

        // Add User Msg
        const userMsg = document.createElement("div");
        userMsg.className = "chat-msg user";
        userMsg.innerHTML = `<div class="msg-content">${text}</div>`;
        messages.appendChild(userMsg);
        input.value = "";

        // Scroll
        messages.scrollTop = messages.scrollHeight;

        // Bot Response
        setTimeout(() => {
            let botText = "I have queried the GVMC Smart Water Database. System operations are running at 94.2% overall efficiency across Vizag.";
            const q = text.toLowerCase();

            if (q.includes("yeleru") || q.includes("gajuwaka")) {
                botText = "The Yeleru Canal Trunk line is delivering 180 MLD. Current maintenance work is ongoing at Gajuwaka junction with expected completion by 22:00 IST.";
            } else if (q.includes("tank") || q.includes("level")) {
                botText = "Mudasarlova Reservoir is currently at 92% high level capacity (3,864 KL), while Gambheeram High Storage is at 48% (2,448 KL).";
            } else if (q.includes("complaint") || q.includes("leak")) {
                botText = "There are currently 13 active citizen complaints. 3 critical leaks in Gajuwaka, Madhurawada, and Siripuram are being attended by emergency crews.";
            }

            const botMsg = document.createElement("div");
            botMsg.className = "chat-msg bot";
            botMsg.innerHTML = `
                <i class="fa-solid fa-robot avatar"></i>
                <div class="msg-content">${botText}</div>
            `;
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 600);
    };

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
}

// 12. SENSORS MANAGEMENT CONTROLLER
let gvmcSensorsData = [];
let currentSensorTypeFilter = "all";
let currentSensorStatusFilter = "all";
let sensorSearchQuery = "";

async function initSensorsModule() {
    try {
        gvmcSensorsData = await HydroAPI.getSensors();
    } catch (e) {
        // Default sensors array if fetch fails
        gvmcSensorsData = [
            { id: "PS-101", name: "Yeleru Main Pressure Sensor", type: "Pressure Sensors", zone: "Zone 1 (Industrial & South Vizag)", ward: "Ward 62 (Gajuwaka)", value: 4.8, unit: "Bar", minThreshold: 3.0, maxThreshold: 6.0, status: "optimal", battery: 98, signal: "Strong (95%)", lastCalibrated: "2026-07-20" },
            { id: "PS-102", name: "Raiwada Trunk Pressure Sensor", type: "Pressure Sensors", zone: "Zone 2 (West Vizag & Suburbs)", ward: "Ward 45 (Gopalapatnam)", value: 4.2, unit: "Bar", minThreshold: 3.0, maxThreshold: 5.5, status: "optimal", battery: 92, signal: "Strong (90%)", lastCalibrated: "2026-07-18" },
            { id: "PS-103", name: "MVP Colony Pressure Telemetry", type: "Pressure Sensors", zone: "Zone 3 (Core Central Vizag)", ward: "Ward 18 (MVP Colony)", value: 3.1, unit: "Bar", minThreshold: 3.5, maxThreshold: 5.0, status: "warning", battery: 85, signal: "Medium (75%)", lastCalibrated: "2026-07-15" },
            { id: "PS-104", name: "Gambheeram Coastal Line Pressure", type: "Pressure Sensors", zone: "Zone 5 (North Coastal Vizag)", ward: "Ward 6 (Madhurawada)", value: 2.9, unit: "Bar", minThreshold: 3.5, maxThreshold: 5.5, status: "critical", battery: 78, signal: "Weak (60%)", lastCalibrated: "2026-07-10" },
            { id: "FS-201", name: "Yeleru Canal Electromagnetic Flowmeter", type: "Flow Sensors", zone: "Zone 1 (Industrial & South Vizag)", ward: "Ward 62 (Gajuwaka)", value: 2350, unit: "L/s", minThreshold: 1800, maxThreshold: 2800, status: "optimal", battery: 100, signal: "Strong (98%)", lastCalibrated: "2026-07-25" },
            { id: "FS-202", name: "Mudasarlova Headworks Flowmeter", type: "Flow Sensors", zone: "Zone 3 (Core Central Vizag)", ward: "Ward 20 (Siripuram)", value: 715, unit: "L/s", minThreshold: 500, maxThreshold: 900, status: "optimal", battery: 94, signal: "Strong (92%)", lastCalibrated: "2026-07-22" },
            { id: "FS-203", name: "Meghadrigedda Trunk Flow Sensor", type: "Flow Sensors", zone: "Zone 4 (Airport & Industrial)", ward: "Ward 31 (Kancharapalem)", value: 1050, unit: "L/s", minThreshold: 800, maxThreshold: 1400, status: "optimal", battery: 91, signal: "Strong (88%)", lastCalibrated: "2026-07-19" },
            { id: "FS-204", name: "Gambheeram Coastal Flow Sensor", type: "Flow Sensors", zone: "Zone 5 (North Coastal Vizag)", ward: "Ward 4 (Rushikonda)", value: 720, unit: "L/s", minThreshold: 600, maxThreshold: 800, status: "warning", battery: 82, signal: "Medium (70%)", lastCalibrated: "2026-07-12" },
            { id: "VS-301", name: "Mudasarlova Booster Pump #1 Vibration", type: "Vibration Sensors", zone: "Zone 3 (Core Central Vizag)", ward: "Ward 20 (Siripuram)", value: 1.4, unit: "mm/s", minThreshold: 0.0, maxThreshold: 4.5, status: "optimal", battery: 96, signal: "Strong (94%)", lastCalibrated: "2026-07-26" },
            { id: "VS-302", name: "Gopalapatnam Intake Pump Vibration", type: "Vibration Sensors", zone: "Zone 2 (West Vizag & Suburbs)", ward: "Ward 45 (Gopalapatnam)", value: 5.8, unit: "mm/s", minThreshold: 0.0, maxThreshold: 4.5, status: "warning", battery: 88, signal: "Medium (78%)", lastCalibrated: "2026-07-14" },
            { id: "VS-303", name: "Steel Plant GLSR Pump #2 Vibration", type: "Vibration Sensors", zone: "Zone 6 (Vizag Port & South Coast)", ward: "Ward 68 (Steel Plant)", value: 7.2, unit: "mm/s", minThreshold: 0.0, maxThreshold: 4.5, status: "critical", battery: 80, signal: "Strong (85%)", lastCalibrated: "2026-07-11" },
            { id: "VS-304", name: "Kanithi Booster Station Vibration", type: "Vibration Sensors", zone: "Zone 6 (Vizag Port & South Coast)", ward: "Ward 68 (Steel Plant)", value: 2.1, unit: "mm/s", minThreshold: 0.0, maxThreshold: 4.5, status: "optimal", battery: 95, signal: "Strong (91%)", lastCalibrated: "2026-07-21" },
            { id: "US-401", name: "Yeleru Reservoir Ultrasonic Level Sensor", type: "Ultrasonic Sensors", zone: "Zone 1 (Industrial & South Vizag)", ward: "Yeleru Headworks", value: 88.0, unit: "% Level", minThreshold: 20.0, maxThreshold: 95.0, status: "optimal", battery: 99, signal: "Strong (97%)", lastCalibrated: "2026-07-28" },
            { id: "US-402", name: "Gambheeram High Storage Level Sensor", type: "Ultrasonic Sensors", zone: "Zone 5 (North Coastal Vizag)", ward: "Ward 6 (Madhurawada)", value: 48.0, unit: "% Level", minThreshold: 50.0, maxThreshold: 95.0, status: "warning", battery: 86, signal: "Medium (76%)", lastCalibrated: "2026-07-17" },
            { id: "US-403", name: "Mudasarlova GLSR Acoustic/Ultrasonic Flow", type: "Ultrasonic Sensors", zone: "Zone 3 (Core Central Vizag)", ward: "Ward 20 (Siripuram)", value: 2.1, unit: "m/s", minThreshold: 0.5, maxThreshold: 3.5, status: "optimal", battery: 97, signal: "Strong (93%)", lastCalibrated: "2026-07-24" },
            { id: "US-404", name: "Siripuram ELSR Tower Level Telemetry", type: "Ultrasonic Sensors", zone: "Zone 3 (Core Central Vizag)", ward: "Ward 20 (Siripuram)", value: 92.0, unit: "% Level", minThreshold: 25.0, maxThreshold: 90.0, status: "warning", battery: 93, signal: "Strong (90%)", lastCalibrated: "2026-07-23" }
        ];
    }
    setupSensorEventListeners();
    renderSensorsPage();
}

function setupSensorEventListeners() {
    const navBtns = document.querySelectorAll(".sensor-type-btn");
    const searchInput = document.getElementById("sensor-search");
    const statusSelect = document.getElementById("sensor-status-filter");
    const recalBtn = document.getElementById("trigger-recal-btn");

    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            navBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentSensorTypeFilter = btn.getAttribute("data-sensortype");
            renderSensorsPage();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            sensorSearchQuery = e.target.value.toLowerCase();
            renderSensorsPage();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", (e) => {
            currentSensorStatusFilter = e.target.value;
            renderSensorsPage();
        });
    }

    if (recalBtn) {
        recalBtn.addEventListener("click", () => {
            alert("Recalibration command broadcasted to all 16 IoT field RTU sensors. Calibration sync complete.");
            gvmcSensorsData.forEach(s => s.lastCalibrated = new Date().toISOString().split("T")[0]);
            renderSensorsPage();
        });
    }
}

function renderSensorsPage() {
    const tableBody = document.getElementById("sensor-table-body");
    const totalCountEl = document.getElementById("total-sensors-count");
    const warningCountEl = document.getElementById("warning-sensors-count");
    if (!tableBody) return;

    // Filter sensors
    const filtered = gvmcSensorsData.filter(s => {
        const matchesType = currentSensorTypeFilter === "all" || s.type === currentSensorTypeFilter;
        const matchesStatus = currentSensorStatusFilter === "all" || s.status.toLowerCase() === currentSensorStatusFilter.toLowerCase();
        const matchesSearch = !sensorSearchQuery || 
            s.id.toLowerCase().includes(sensorSearchQuery) || 
            s.name.toLowerCase().includes(sensorSearchQuery) || 
            s.zone.toLowerCase().includes(sensorSearchQuery) || 
            s.ward.toLowerCase().includes(sensorSearchQuery);
        return matchesType && matchesStatus && matchesSearch;
    });

    if (totalCountEl) totalCountEl.textContent = `${gvmcSensorsData.length} Devices`;
    const warnCount = gvmcSensorsData.filter(x => x.status === "warning").length;
    const critCount = gvmcSensorsData.filter(x => x.status === "critical").length;
    if (warningCountEl) warningCountEl.textContent = `${warnCount} Warning / ${critCount} Critical`;

    // Render Table Rows
    tableBody.innerHTML = filtered.map(s => `
        <tr>
            <td>
                <strong style="color:#fff;">${s.id}</strong><br>
                <small class="text-muted">${s.name}</small>
            </td>
            <td><span class="pill outline" style="font-size:0.75rem;">${s.type}</span></td>
            <td><strong>${s.zone}</strong><br><small class="text-muted">${s.ward}</small></td>
            <td><strong class="${s.status === 'critical' ? 'text-danger' : (s.status === 'warning' ? 'text-warning' : 'text-cyan')}" style="font-size:1.05rem;">${s.value} ${s.unit}</strong></td>
            <td><small class="text-muted">${s.minThreshold} - ${s.maxThreshold} ${s.unit}</small></td>
            <td><span class="status-badge ${s.status}">${s.status.toUpperCase()}</span></td>
            <td>
                <div style="font-size:0.8rem;">
                    <i class="fa-solid fa-battery-three-quarters text-emerald"></i> ${s.battery}% | ${s.signal}
                </div>
            </td>
            <td><small class="text-muted">${s.lastCalibrated}</small></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="recalibrateSingleSensor('${s.id}')">
                    <i class="fa-solid fa-gear"></i> Config / Sync
                </button>
            </td>
        </tr>
    `).join("");

    // Show/Hide specific detail cards based on selected filter
    const pressureCard = document.getElementById("pressure-sensor-card");
    const flowCard = document.getElementById("flow-sensor-card");
    const vibrationCard = document.getElementById("vibration-sensor-card");
    const ultrasonicCard = document.getElementById("ultrasonic-sensor-card");

    if (pressureCard) pressureCard.style.display = (currentSensorTypeFilter === "all" || currentSensorTypeFilter === "Pressure Sensors") ? "block" : "none";
    if (flowCard) flowCard.style.display = (currentSensorTypeFilter === "all" || currentSensorTypeFilter === "Flow Sensors") ? "block" : "none";
    if (vibrationCard) vibrationCard.style.display = (currentSensorTypeFilter === "all" || currentSensorTypeFilter === "Vibration Sensors") ? "block" : "none";
    if (ultrasonicCard) ultrasonicCard.style.display = (currentSensorTypeFilter === "all" || currentSensorTypeFilter === "Ultrasonic Sensors") ? "block" : "none";
}

function recalibrateSingleSensor(sensorId) {
    const s = gvmcSensorsData.find(x => x.id === sensorId);
    if (!s) return;
    const newThresh = prompt(`Configure Max Threshold for ${s.name} (${s.id}):`, s.maxThreshold);
    if (newThresh !== null && !isNaN(newThresh)) {
        s.maxThreshold = parseFloat(newThresh);
        s.lastCalibrated = new Date().toISOString().split("T")[0];
        alert(`Sensor ${s.id} updated successfully. New Max Limit: ${s.maxThreshold} ${s.unit}`);
        renderSensorsPage();
    }
}
