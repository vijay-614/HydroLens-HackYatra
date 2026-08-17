/* =========================================================
   HYDROLENSE — map.js
   Renders the GVMC pipeline network map.

   Three modes, tried in this order:
   1) LEAFLET MODE (default, real geography) — plots the pipeline
      network as actual lat/lng markers + polylines on real
      OpenStreetMap/CartoDB map tiles. No API key required. This
      is what makes the map show the true Vizag/GVMC terrain, and
      it's what lets new areas (Vizianagaram, Bobbili, etc.) just
      appear correctly the moment their lat/lng is added to
      wards.json — the view auto-fits to whatever nodes exist.
   2) GOOGLE MAPS MODE — used automatically instead of Leaflet only
      if window.google.maps is already loaded (i.e. you set a real
      key in HydroConfig.GOOGLE_MAPS_API_KEY in app.js).
   3) FALLBACK MODE — a dependency-free custom SVG diagram (no real
      geography). Only used if Leaflet's tiles fail to load, as a
      last-resort so the dashboard never shows a blank map.
   ========================================================= */

const HydroMap = (() => {
  let mode = "fallback";        // "leaflet" | "google" | "fallback"
  let gMap = null;
  let gInfoWindow = null;
  const gMarkers = [];
  const gPolylines = [];

  let lMap = null;               // Leaflet map instance
  const lLayers = [];            // Leaflet markers/polylines, cleared on re-render

  let onMarkerClick = null;     // callback(nodeData) set by app.js

  /* ---------------------------------------------------------
     Pipeline network graph — nodes (wards/junctions) + edges.
     Coordinates are normalised 0-1 for the fallback SVG canvas
     and reused as lat/lng offsets for Google Maps mode.
     --------------------------------------------------------- */
  function buildNetwork(wards) {
    const nodes = wards.map(w => ({
      id: w.id, label: w.area, ward: w.ward, status: w.status,
      pressure: w.pressure, lat: w.lat, lng: w.lng
    }));
    // Simple ring + spokes topology so every ward connects to at least
    // one neighbour — enough to look like a real distribution network.
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const b = nodes[(i + 1) % nodes.length];
      edges.push({ from: a.id, to: b.id, leak: a.status === "critical" || b.status === "critical" });
    }
    // Add a couple of cross-links for visual density.
    if (nodes.length >= 4) {
      edges.push({ from: nodes[0].id, to: nodes[3 % nodes.length].id, leak: false });
    }
    return { nodes, edges };
  }

  /* ---------------------------------------------------------
     LEAFLET MODE — real geography, default map.
     Uses free CartoDB "Dark Matter" tiles (no key, no billing)
     so the basemap matches the dashboard's dark theme, with
     genuine Vizag/GVMC streets & terrain underneath the pipeline
     overlay. Any node's real lat/lng plots in its true location,
     so surrounding areas (Vizianagaram, Bobbili, etc.) work by
     simply adding them to wards.json with correct coordinates —
     the map auto-fits its view to whatever nodes are present.
     --------------------------------------------------------- */
  function initLeafletMap(container, network) {
    mode = "leaflet";

    // Clear any previous instance (e.g. on data refresh / re-render).
    if (lMap) { lMap.remove(); lMap = null; }
    lLayers.length = 0;
    container.innerHTML = "";

    lMap = L.map(container, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true
    }).setView([17.7231, 83.3012], 12); // GVMC, Visakhapatnam

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
    }).addTo(lMap);

    const byId = {};
    network.nodes.forEach(n => (byId[n.id] = n));
    const bounds = [];

    // Pipelines — drawn first so markers sit on top.
    network.edges.forEach(edge => {
      const a = byId[edge.from], b = byId[edge.to];
      if (!a || !b) return;
      const line = L.polyline(
        [[a.lat, a.lng], [b.lat, b.lng]],
        {
          color: edge.leak ? "#FF3D57" : "#00E5FF",
          weight: edge.leak ? 5 : 3,
          opacity: edge.leak ? 0.95 : 0.6,
          lineCap: "round"
        }
      ).addTo(lMap);
      lLayers.push(line);
    });

    // Ward / sensor nodes.
    network.nodes.forEach(n => {
      const color = n.status === "critical" ? "#FF3D57" : n.status === "warning" ? "#FFC107" : "#00C853";

      if (n.status === "critical") {
        const glow = L.circleMarker([n.lat, n.lng], {
          radius: 22, color: "transparent", fillColor: "#FF3D57", fillOpacity: 0.22
        }).addTo(lMap);
        lLayers.push(glow);
      }

      const marker = L.circleMarker([n.lat, n.lng], {
        radius: 8, color: "#07121D", weight: 2, fillColor: color, fillOpacity: 1
      }).addTo(lMap);
      marker.bindTooltip(n.label, { permanent: false, direction: "top", offset: [0, -8], className: "map-zone-label" });
      marker.bindPopup(infoWindowHTML(n, true));
      marker.on("click", () => { if (onMarkerClick) onMarkerClick(n); });
      lLayers.push(marker);
      bounds.push([n.lat, n.lng]);
    });

    // Scope the initial view tightly to the GVMC network so it never
    // opens zoomed out over the whole state — "only the pipeline areas".
    if (bounds.length) {
      lMap.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    }
  }

  /* ---------------------------------------------------------
     GOOGLE MAPS MODE
     --------------------------------------------------------- */
  function initGoogleMap(container, network) {
    mode = "google";
    const center = { lat: 17.7231, lng: 83.3012 }; // GVMC, Visakhapatnam

    gMap = new google.maps.Map(container, {
      center, zoom: 12.5, disableDefaultUI: false, mapTypeControl: true,
      streetViewControl: false, styles: darkMapStyles()
    });
    gInfoWindow = new google.maps.InfoWindow();

    const byId = {};
    network.nodes.forEach(n => (byId[n.id] = n));

    network.edges.forEach(edge => {
      const a = byId[edge.from], b = byId[edge.to];
      if (!a || !b) return;
      const line = new google.maps.Polyline({
        path: [{ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng }],
        strokeColor: edge.leak ? "#FF3D57" : "#00E5FF",
        strokeOpacity: edge.leak ? 0.95 : 0.6,
        strokeWeight: edge.leak ? 5 : 3,
        map: gMap
      });
      gPolylines.push(line);
    });

    network.nodes.forEach(n => {
      const marker = new google.maps.Marker({
        position: { lat: n.lat, lng: n.lng },
        map: gMap,
        title: n.label,
        icon: markerIcon(n.status)
      });
      marker.addListener("click", () => {
        gInfoWindow.setContent(infoWindowHTML(n));
        gInfoWindow.open(gMap, marker);
        if (onMarkerClick) onMarkerClick(n);
      });
      gMarkers.push(marker);
    });
  }

  function markerIcon(status) {
    const color = status === "critical" ? "#FF3D57" : status === "warning" ? "#FFC107" : "#00C853";
    return {
      path: "M0,0 a8,8 0 1,0 0.01,0",
      fillColor: color, fillOpacity: 1, strokeColor: "#07121D", strokeWeight: 2, scale: 1
    };
  }

  function darkMapStyles() {
    return [
      { elementType: "geometry", stylers: [{ color: "#0B1B2B" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#9FB7C8" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#07121D" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#0F2338" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#07161F" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] }
    ];
  }

  /* ---------------------------------------------------------
     FALLBACK MODE — custom SVG pipeline network
     --------------------------------------------------------- */
  function initFallbackMap(container, network) {
    mode = "fallback";
    container.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.style.cssText = "position:relative;width:100%;height:100%;";
    container.appendChild(wrap);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 800 420");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.cssText = "width:100%;height:100%;display:block;";

    // Pure pipeline canvas — no city grid / basemap texture, just a flat panel colour.
    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML = `
      <radialGradient id="hlLeakGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FF3D57" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#FF3D57" stop-opacity="0"/>
      </radialGradient>`;
    svg.appendChild(defs);

    const bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("width", "800"); bg.setAttribute("height", "420"); bg.setAttribute("fill", "#0B1B2B");
    svg.appendChild(bg);

    // Normalise lat/lng of nodes into 0..1 canvas space
    const lats = network.nodes.map(n => n.lat), lngs = network.nodes.map(n => n.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const pad = 70;
    const project = (n) => {
      const x = pad + ((n.lng - minLng) / (maxLng - minLng || 1)) * (800 - pad * 2);
      const y = 420 - (pad + ((n.lat - minLat) / (maxLat - minLat || 1)) * (420 - pad * 2));
      return { x, y };
    };

    const byId = {};
    network.nodes.forEach(n => (byId[n.id] = { ...n, ...project(n) }));

    // Edges (pipelines)
    network.edges.forEach(edge => {
      const a = byId[edge.from], b = byId[edge.to];
      if (!a || !b) return;
      const path = document.createElementNS(svgNS, "line");
      path.setAttribute("x1", a.x); path.setAttribute("y1", a.y);
      path.setAttribute("x2", b.x); path.setAttribute("y2", b.y);
      path.setAttribute("stroke", edge.leak ? "#FF3D57" : "#00C853");
      path.setAttribute("stroke-width", edge.leak ? "4" : "3");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("opacity", edge.leak ? "0.95" : "0.55");
      if (edge.leak) {
        path.setAttribute("class", "hl-leak-pipe");
        path.innerHTML = `<animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite"/>`;
      }
      svg.appendChild(path);
    });

    // Nodes (wards / sensors)
    Object.values(byId).forEach(n => {
      const color = n.status === "critical" ? "#FF3D57" : n.status === "warning" ? "#FFC107" : "#00C853";

      if (n.status === "critical") {
        const glow = document.createElementNS(svgNS, "circle");
        glow.setAttribute("cx", n.x); glow.setAttribute("cy", n.y); glow.setAttribute("r", "26");
        glow.setAttribute("fill", "url(#hlLeakGlow)");
        svg.appendChild(glow);
      }

      const g = document.createElementNS(svgNS, "g");
      g.style.cursor = "pointer";
      g.setAttribute("data-node-id", n.id);

      const ring = document.createElementNS(svgNS, "circle");
      ring.setAttribute("cx", n.x); ring.setAttribute("cy", n.y); ring.setAttribute("r", "10");
      ring.setAttribute("fill", "none"); ring.setAttribute("stroke", color); ring.setAttribute("stroke-width", "1.4"); ring.setAttribute("opacity", "0.5");
      g.appendChild(ring);

      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", n.x); dot.setAttribute("cy", n.y); dot.setAttribute("r", "6");
      dot.setAttribute("fill", color); dot.setAttribute("stroke", "#07121D"); dot.setAttribute("stroke-width", "2");
      g.appendChild(dot);

      const label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", n.x); label.setAttribute("y", n.y - 16);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", "#9FB7C8");
      label.setAttribute("font-size", "10.5");
      label.setAttribute("font-family", "JetBrains Mono, monospace");
      label.textContent = n.label;
      g.appendChild(label);

      g.addEventListener("click", () => {
        showFallbackPopup(wrap, n);
        if (onMarkerClick) onMarkerClick(n);
      });
      svg.appendChild(g);
    });

    wrap.appendChild(svg);
  }

  let activePopup = null;
  function showFallbackPopup(wrap, node) {
    if (activePopup) activePopup.remove();
    const popup = document.createElement("div");
    popup.className = "hl-infowindow glass";
    popup.style.cssText = `position:absolute;left:${(node.x / 800) * 100}%;top:${(node.y / 420) * 100}%;
      transform:translate(-50%,-115%);padding:10px 12px;border-radius:10px;background:rgba(15,35,56,0.96);
      color:#E8F6FB;border:1px solid rgba(0,229,255,0.3);z-index:10;pointer-events:auto;box-shadow:0 8px 24px rgba(0,0,0,0.4);`;
    popup.innerHTML = infoWindowHTML(node, true);
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = "position:absolute;top:4px;right:8px;background:none;border:none;color:#9FB7C8;font-size:14px;cursor:pointer;";
    closeBtn.onclick = () => popup.remove();
    popup.appendChild(closeBtn);
    wrap.appendChild(popup);
    activePopup = popup;
  }

  function infoWindowHTML(n, dark = false) {
    const statusColor = n.status === "critical" ? "#FF3D57" : n.status === "warning" ? "#FFC107" : "#00C853";
    const textColor = dark ? "#E8F6FB" : "#0b1b2b";
    return `<div class="hl-infowindow" style="color:${textColor}">
      <b>${n.label}</b>
      ${n.ward || ""}<br/>
      Pressure: <strong>${n.pressure ?? "--"} bar</strong><br/>
      Status: <span style="color:${statusColor};font-weight:700;text-transform:capitalize">${n.status}</span>
    </div>`;
  }

  /* ---------------------------------------------------------
     PUBLIC API
     --------------------------------------------------------- */

  /** Called by app.js once ward data is ready. Picks Google Maps mode if available, else fallback. */
  function renderMap(containerId, wards, opts = {}) {
    onMarkerClick = opts.onMarkerClick || null;
    const container = document.getElementById(containerId);
    if (!container) return;
    const network = buildNetwork(wards);

    if (window.L) {
      try {
        initLeafletMap(container, network);
        return;
      } catch (err) {
        console.warn("HydroLense: Leaflet init failed, trying Google/fallback map.", err);
      }
    }

    if (window.google && window.google.maps) {
      try {
        initGoogleMap(container, network);
        return;
      } catch (err) {
        console.warn("HydroLense: Google Maps init failed, using fallback map.", err);
      }
    }
    initFallbackMap(container, network);
  }

  /** window.initMap — Google Maps JS API callback (fired only if a real key is configured). */
  window.initMap = function initMap() {
    if (window.__hydroLastWards) {
      renderMap("mapContainer", window.__hydroLastWards, { onMarkerClick: window.__hydroMarkerClick });
    }
  };

  function currentMode() { return mode; }

  return { renderMap, currentMode };
})();
