// Generator intra: rysuje animację na <canvas>, koduje WebCodecs (H.264 + AAC) i muxuje do MP4 w przeglądarce.
// Wersja osadzona w /backoffice: zdjęcia prowadzących i dżingiel ładują się z atrybutów data-* kontenera #intro-generator,
// pola plików pozwalają je podmienić. Źródło pierwotne: ../pdd-intro-generator.html.
import { Mp4Muxer } from '../vendor/mp4-muxer.js';

(function () {
  "use strict";
  var LOGO = {"w":444.6,"h":302.2,"text":["M17.096 161.52V103.92000000000002H29.732Q37.004 103.92000000000002 40.226 106.90800000000002Q43.44799999999999 109.89600000000002 43.7 116.77200000000002Q43.80799999999999 120.26400000000001 43.80799999999999 123.162Q43.80799999999999 126.06 43.7 129.3Q43.44799999999999 136.17600000000002 40.208 139.18200000000002Q36.968 142.18800000000002 29.695999999999998 142.18800000000002H26.42V161.52ZM26.42 133.98000000000002H29.695999999999998Q32.036 133.98000000000002 33.17 132.90000000000003Q34.304 131.82000000000002 34.412 129.804Q34.519999999999996 127.75200000000001 34.556 125.394Q34.592 123.03600000000002 34.556 120.67800000000003Q34.519999999999996 118.32000000000002 34.412 116.30400000000002Q34.304 114.25200000000001 33.17 113.19000000000001Q32.036 112.12800000000001 29.732 112.12800000000001H26.42ZM45.428 161.52 52.952 103.92000000000002H67.928L75.452 161.52H65.91199999999999L64.616 148.30800000000002H56.263999999999996L54.967999999999996 161.52ZM57.128 140.10000000000002H63.751999999999995L62.492 127.42800000000001L61.44799999999999 112.12800000000001H59.431999999999995L58.388 127.42800000000001ZM80.20400000000001 161.52V103.92000000000002H92.84Q100.112 103.92000000000002 103.334 106.90800000000002Q106.556 109.89600000000002 106.808 116.77200000000002Q106.916 120.26400000000001 106.916 123.162Q106.916 126.06 106.808 129.3Q106.556 136.17600000000002 103.316 139.18200000000002Q100.07600000000001 142.18800000000002 92.804 142.18800000000002H89.528V161.52ZM89.528 133.98000000000002H92.804Q95.144 133.98000000000002 96.278 132.90000000000003Q97.412 131.82000000000002 97.52000000000001 129.804Q97.628 127.75200000000001 97.664 125.394Q97.7 123.03600000000002 97.664 120.67800000000003Q97.628 118.32000000000002 97.52000000000001 116.30400000000002Q97.412 114.25200000000001 96.278 113.19000000000001Q95.144 112.12800000000001 92.84 112.12800000000001H89.528ZM112.352 161.52V103.92000000000002H135.10399999999998V112.12800000000001H121.676V128.18400000000003H134.384V136.39200000000002H121.676V153.312H135.10399999999998V161.52ZM140.54 161.52V103.92000000000002H153.176Q160.44799999999998 103.92000000000002 163.67 106.90800000000002Q166.892 109.89600000000002 167.14399999999998 116.77200000000002Q167.21599999999998 119.07600000000002 167.25199999999998 120.93000000000002Q167.28799999999998 122.78400000000002 167.25199999999998 124.60200000000002Q167.21599999999998 126.42000000000002 167.14399999999998 128.58Q167.0 132.972 165.668 135.726Q164.33599999999998 138.48000000000002 161.492 139.88400000000001L168.00799999999998 161.52H158.14399999999998L152.744 141.43200000000002H149.86399999999998V161.52ZM149.86399999999998 133.22400000000002H153.14Q155.48 133.22400000000002 156.61399999999998 132.16200000000003Q157.748 131.10000000000002 157.856 129.048Q157.964 127.03200000000001 158.0 124.85400000000001Q158.036 122.67600000000002 158.0 120.49800000000002Q157.964 118.32000000000002 157.856 116.30400000000002Q157.748 114.25200000000001 156.61399999999998 113.19000000000001Q155.48 112.12800000000001 153.176 112.12800000000001H149.86399999999998Z","M17.096 223.44V165.84H30.38Q37.688 165.84 40.964 168.97199999999998Q44.239999999999995 172.10399999999998 44.348 179.304Q44.455999999999996 184.776 44.492 189.69Q44.528 194.60399999999998 44.492 199.51799999999997Q44.455999999999996 204.432 44.348 209.904Q44.239999999999995 217.14 40.964 220.29Q37.688 223.44 30.343999999999998 223.44ZM26.42 215.232H30.343999999999998Q32.684 215.232 33.854 214.152Q35.024 213.072 35.06 211.02Q35.168 206.88 35.221999999999994 202.79399999999998Q35.275999999999996 198.708 35.275999999999996 194.60399999999998Q35.275999999999996 190.5 35.221999999999994 186.39600000000002Q35.168 182.292 35.06 178.224Q35.024 176.172 33.854 175.11Q32.684 174.048 30.38 174.048H26.42ZM51.007999999999996 223.44V165.84H63.644Q70.916 165.84 74.138 168.828Q77.36 171.816 77.612 178.692Q77.684 180.996 77.72 182.85000000000002Q77.756 184.704 77.72 186.522Q77.684 188.34 77.612 190.5Q77.46799999999999 194.892 76.136 197.64600000000002Q74.804 200.4 71.96 201.804L78.476 223.44H68.612L63.211999999999996 203.352H60.332V223.44ZM60.332 195.144H63.608Q65.948 195.144 67.082 194.082Q68.216 193.02 68.324 190.96800000000002Q68.432 188.952 68.46799999999999 186.774Q68.50399999999999 184.596 68.46799999999999 182.418Q68.432 180.24 68.324 178.224Q68.216 176.172 67.082 175.11Q65.948 174.048 63.644 174.048H60.332ZM83.732 223.44V165.84H93.056V223.44ZM105.65599999999998 223.44 97.87999999999998 165.84H107.49199999999999L111.45199999999998 195.504L112.31599999999999 215.232H114.29599999999999L115.15999999999998 195.504L119.11999999999998 165.84H128.73199999999997L120.95599999999999 223.44ZM133.55599999999998 223.44V165.84H156.308V174.048H142.87999999999997V190.10399999999998H155.58799999999997V198.312H142.87999999999997V215.232H156.308V223.44ZM161.74399999999997 223.44V165.84H175.49599999999998L179.56399999999996 184.164L183.73999999999995 215.232H185.53999999999996L183.84799999999996 189.45600000000002L183.09199999999996 165.84H192.09199999999996V223.44H177.69199999999995L173.55199999999996 204.144L170.31199999999995 173.976H168.36799999999997L169.95199999999997 201.48L170.74399999999997 223.44Z","M17.096 285.36V227.76000000000002H30.38Q37.688 227.76000000000002 40.964 230.892Q44.239999999999995 234.024 44.348 241.22400000000002Q44.455999999999996 246.69600000000003 44.492 251.61Q44.528 256.524 44.492 261.438Q44.455999999999996 266.35200000000003 44.348 271.824Q44.239999999999995 279.06 40.964 282.21000000000004Q37.688 285.36 30.343999999999998 285.36ZM26.42 277.152H30.343999999999998Q32.684 277.152 33.854 276.072Q35.024 274.992 35.06 272.94Q35.168 268.8 35.221999999999994 264.71400000000006Q35.275999999999996 260.62800000000004 35.275999999999996 256.524Q35.275999999999996 252.42000000000002 35.221999999999994 248.31600000000003Q35.168 244.21200000000002 35.06 240.144Q35.024 238.092 33.854 237.03000000000003Q32.684 235.96800000000002 30.38 235.96800000000002H26.42ZM51.007999999999996 285.36V227.76000000000002H73.75999999999999V235.96800000000002H60.332V252.024H73.03999999999999V260.232H60.332V277.152H73.75999999999999V285.36ZM92.012 286.00800000000004Q84.848 286.00800000000004 81.788 282.94800000000004Q78.728 279.88800000000003 78.404 272.796Q78.368 271.392 78.368 269.88Q78.368 268.368 78.44 266.874Q78.512 265.38 78.65599999999999 263.94H87.404Q87.25999999999999 266.712 87.24199999999999 269.43Q87.22399999999999 272.148 87.404 274.488Q87.58399999999999 276.432 88.68199999999999 277.422Q89.78 278.41200000000003 92.012 278.41200000000003Q94.208 278.41200000000003 95.216 277.422Q96.22399999999999 276.432 96.404 274.488Q96.54799999999999 273.048 96.60199999999999 271.752Q96.65599999999999 270.456 96.60199999999999 269.124Q96.54799999999999 267.79200000000003 96.404 266.31600000000003Q96.29599999999999 264.516 95.52199999999999 263.148Q94.74799999999999 261.78000000000003 92.948 261.312L87.58399999999999 259.944Q84.092 259.04400000000004 82.076 257.33400000000006Q80.05999999999999 255.62400000000002 79.178 253.03200000000004Q78.29599999999999 250.44000000000003 78.18799999999999 246.912Q78.152 245.14800000000002 78.152 243.51000000000002Q78.152 241.872 78.18799999999999 240.252Q78.368 235.536 79.75399999999999 232.638Q81.14 229.74 84.11 228.42600000000002Q87.08 227.11200000000002 92.012 227.11200000000002Q98.96 227.11200000000002 102.07399999999998 230.15400000000002Q105.18799999999999 233.19600000000003 105.476 240.252Q105.54799999999999 241.90800000000002 105.512 244.32000000000002Q105.476 246.73200000000003 105.368 248.964H96.44Q96.54799999999999 246.372 96.58399999999999 243.762Q96.61999999999999 241.15200000000002 96.512 238.56Q96.44 236.65200000000002 95.27 235.68Q94.1 234.70800000000003 92.012 234.70800000000003Q89.78 234.70800000000003 88.73599999999999 235.68Q87.692 236.65200000000002 87.476 238.56Q87.29599999999999 240.64800000000002 87.29599999999999 242.73600000000002Q87.29599999999999 244.824 87.476 246.912Q87.65599999999999 248.78400000000002 88.42999999999999 250.08000000000004Q89.204 251.37600000000003 91.148 251.84400000000002L95.86399999999999 252.96Q99.57199999999999 253.86 101.696 255.64200000000002Q103.82 257.42400000000004 104.738 260.088Q105.65599999999999 262.752 105.764 266.31600000000003Q105.8 267.504 105.8 268.56600000000003Q105.8 269.62800000000004 105.782 270.654Q105.764 271.68 105.692 272.796Q105.404 279.88800000000003 102.326 282.94800000000004Q99.24799999999999 286.00800000000004 92.012 286.00800000000004ZM111.668 285.36V227.76000000000002H120.992V285.36ZM141.476 286.00800000000004Q136.57999999999998 286.00800000000004 133.60999999999999 284.67600000000004Q130.64 283.344 129.272 280.428Q127.904 277.512 127.72399999999999 272.796Q127.61599999999999 269.30400000000003 127.56199999999998 265.164Q127.508 261.024 127.508 256.722Q127.508 252.42000000000002 127.56199999999998 248.31600000000003Q127.61599999999999 244.21200000000002 127.72399999999999 240.79200000000003Q127.904 235.824 129.326 232.8Q130.748 229.776 133.7 228.44400000000002Q136.652 227.11200000000002 141.476 227.11200000000002Q148.316 227.11200000000002 151.466 230.15400000000002Q154.61599999999999 233.19600000000003 155.012 240.252Q155.12 242.19600000000003 155.12 244.59000000000003Q155.12 246.984 155.012 248.964H145.724Q145.832 246.69600000000003 145.832 243.74400000000003Q145.832 240.79200000000003 145.724 238.56Q145.61599999999999 236.65200000000002 144.536 235.68Q143.456 234.70800000000003 141.476 234.70800000000003Q139.316 234.70800000000003 138.21800000000002 235.68Q137.12 236.65200000000002 137.012 238.56Q136.832 242.70000000000002 136.742 247.27200000000002Q136.652 251.84400000000002 136.652 256.54200000000003Q136.652 261.24 136.742 265.794Q136.832 270.348 137.012 274.488Q137.12 276.432 138.21800000000002 277.422Q139.316 278.41200000000003 141.476 278.41200000000003Q143.636 278.41200000000003 144.86 277.422Q146.084 276.432 146.19199999999998 274.488Q146.26399999999998 273.372 146.28199999999998 271.87800000000004Q146.29999999999998 270.384 146.28199999999998 268.872Q146.26399999999998 267.36 146.19199999999998 266.28000000000003H142.052V258.18H155.26399999999998Q155.408 261.312 155.37199999999999 265.182Q155.33599999999998 269.052 155.19199999999998 272.796Q154.868 279.88800000000003 151.682 282.94800000000004Q148.49599999999998 286.00800000000004 141.476 286.00800000000004ZM161.528 285.36V227.76000000000002H175.27999999999997L179.34799999999998 246.084L183.524 277.152H185.32399999999998L183.63199999999998 251.37600000000003L182.87599999999998 227.76000000000002H191.87599999999998V285.36H177.476L173.33599999999998 266.064L170.09599999999998 235.89600000000002H168.152L169.736 263.40000000000003L170.528 285.36Z"],"trail":"M183.4 135.6C213.4 135.6 225.4 133.6 247.4 133.6A24 24 0 0 0 247.4 85.6A24 24 0 0 0 251.4 133.6C297.4 135.6 287.4 75.6 319.4 59.6","plane":"M321.4 59.6L430.6 18.0L376.0 96.0L357.8 67.4ZM357.8 67.4L430.6 18.0"};
  var THEMES = {
    night: { bg: "#1f1e1c", ink: "#f3f0e8", muted: "#b3ad9f", flight: "#6f9bff", sunk: "#2a2926" },
    paper: { bg: "#f8f6f1", ink: "#1f1e1c", muted: "#5f5a52", flight: "#2f6fed", sunk: "#efebe2" }
  };
  var $ = function (id) { return document.getElementById(id); };
  var cv = $("cv"), ctx = cv.getContext("2d");

  // ---------- geometry ----------
  var textPaths = LOGO.text.map(function (d) { return new Path2D(d); });
  var trailPath = new Path2D(LOGO.trail);
  var planePath = new Path2D(LOGO.plane);
  var svgNS = "http://www.w3.org/2000/svg";
  var probe = document.createElementNS(svgNS, "path"); probe.setAttribute("d", LOGO.trail);
  var probeSvg = document.createElementNS(svgNS, "svg"); probeSvg.style.position = "absolute"; probeSvg.style.width = "0"; probeSvg.style.height = "0";
  probeSvg.appendChild(probe); document.body.appendChild(probeSvg);
  var TRAIL_LEN = probe.getTotalLength();
  // plane bbox centre (for rotation)
  var planeNums = LOGO.plane.match(/-?\d+(\.\d+)?/g).map(Number);
  var px = [], py = [];
  for (var i = 0; i < planeNums.length; i += 2) { px.push(planeNums[i]); py.push(planeNums[i + 1]); }
  var PLANE_C = [(Math.min.apply(null, px) + Math.max.apply(null, px)) / 2, (Math.min.apply(null, py) + Math.max.apply(null, py)) / 2];

  // ---------- easing ----------
  function bezier(x1, y1, x2, y2) {
    function a(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function b(p1, p2) { return 3 * p2 - 6 * p1; }
    function c(p1) { return 3 * p1; }
    function calc(t, p1, p2) { return ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t; }
    function slope(t, p1, p2) { return 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1); }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x;
      for (var k = 0; k < 8; k++) { var s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (calc(t, x1, x2) - x) / s; }
      return calc(t, y1, y2);
    };
  }
  var EASE_IN = bezier(.2, .7, .2, 1), EASE_DOCK = bezier(.6, 0, .2, 1), EASE_DRAW = bezier(.45, 0, .25, 1);
  function prog(t, start, dur, ease) { return ease(Math.min(1, Math.max(0, (t - start) / dur))); }
  function lerp(a, b, p) { return a + (b - a) * p; }

  // ---------- settings ----------
  var photos = { h1: null, h2: null, g: null };
  var defaults = { h1: null, h2: null }; // zdjęcia z serwera; wracają, gdy użytkownik wyczyści pole pliku
  var defaultAudio = null; // ArrayBuffer dżingla z serwera
  var root = $("intro-generator"), assets = root ? root.dataset : {};
  function settings() {
    var sz = $("size").value.split("x").map(Number);
    var guestOn = $("guestOn").checked && $("gname").value.trim() !== "";
    return {
      w: sz[0], h: sz[1],
      fps: Number($("fps").value),
      dur: Math.max(10, Math.min(30, Number($("dur").value) || 14)),
      fade: $("fade").checked,
      theme: THEMES[$("theme").value],
      num: String(Math.max(0, Math.min(999, parseInt($("num").value, 10) || 0))).padStart(3, "0"),
      date: $("date").value.trim(),
      title: $("title").value.trim().toLocaleUpperCase("pl-PL") || "TYTUŁ ODCINKA",
      hosts: [
        { name: $("h1name").value.trim() || "Prowadzący 1", role: $("h1role").value.trim(), img: photos.h1 },
        { name: $("h2name").value.trim() || "Prowadzący 2", role: $("h2role").value.trim(), img: photos.h2 }
      ],
      guest: guestOn ? { name: $("gname").value.trim(), role: $("grole").value.trim(), img: photos.g } : null
    };
  }

  // scene plan: logo (0 to 3.2 s), hosts, optional guest, episode card, fade
  function plan(S) {
    var start = 3.2, avail = S.dur - start;
    var epLen = Math.max(4.2, avail * 0.42), mid = avail - epLen;
    var hostsLen = S.guest ? mid * 0.55 : mid, guestLen = S.guest ? mid - hostsLen : 0;
    return {
      hosts: [start, start + hostsLen],
      guest: S.guest ? [start + hostsLen, start + hostsLen + guestLen] : null,
      ep: [start + hostsLen + guestLen, S.dur]
    };
  }

  // ---------- photos: square crop, full colour ----------
  function loadPhoto(file) {
    return createImageBitmap(file).then(function (bmp) {
      var s = Math.min(bmp.width, bmp.height);
      var sx = (bmp.width - s) / 2, sy = bmp.height > bmp.width ? (bmp.height - s) * 0.22 : 0;
      var c = document.createElement("canvas"); c.width = c.height = 1024;
      var x = c.getContext("2d");
      x.drawImage(bmp, sx, sy, s, s, 0, 0, 1024, 1024);
      return c;
    });
  }
  [["h1photo", "h1"], ["h2photo", "h2"], ["gphoto", "g"]].forEach(function (pair) {
    $(pair[0]).addEventListener("change", function (e) {
      var f = e.target.files[0];
      if (!f) { photos[pair[1]] = defaults[pair[1]] || null; still(); return; }
      loadPhoto(f).then(function (c) { photos[pair[1]] = c; still(); }).catch(function () { setStatus("Nie udało się wczytać zdjęcia.", true); });
    });
  });
  // ---------- domyślne zasoby: zdjęcia prowadzących i dżingiel ----------
  function fetchOk(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status + " " + url); return r; }); }
  [["photoH1", "h1"], ["photoH2", "h2"]].forEach(function (pair) {
    var url = assets[pair[0]]; if (!url) return;
    fetchOk(url).then(function (r) { return r.blob(); }).then(loadPhoto).then(function (c) {
      defaults[pair[1]] = c;
      if (!photos[pair[1]]) { photos[pair[1]] = c; still(); }
    }).catch(function () { setStatus("Nie udało się wczytać domyślnego zdjęcia: " + url, true); });
  });
  if (assets.audio) {
    fetchOk(assets.audio).then(function (r) { return r.arrayBuffer(); }).then(function (b) { defaultAudio = b; })
      .catch(function () { setStatus("Nie udało się wczytać domyślnego dżingla: " + assets.audio, true); });
  }
  $("guestOn").addEventListener("change", function () {
    ["gname", "grole", "gphoto"].forEach(function (id) { $(id).disabled = !$("guestOn").checked; });
    still();
  });

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toLocaleUpperCase("pl-PL");
  }

  function wrap(text, maxW) {
    var words = text.split(/\s+/), lines = [], line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function setFont(weightFamily, size, track) {
    ctx.font = weightFamily.replace("{s}", size + "px");
    if ("letterSpacing" in ctx) ctx.letterSpacing = (track ? size * track : 0) + "px";
  }

  // ---------- one frame ----------
  function draw(t, S) {
    var W = S.w, H = S.h, th = S.theme, P = plan(S);
    var portrait = H > W * 1.05, square = !portrait && H > W * 0.8;
    var U = portrait ? W * 1.55 : (square ? W * 1.25 : W); // type scale reference
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);

    // ---- logo: centred, then docks top-left ----
    var startW = (portrait ? 0.78 : square ? 0.62 : 0.46) * W;
    var endW = (portrait ? 0.34 : square ? 0.28 : 0.17) * W;
    var mL = (portrait ? 0.08 : 0.06) * W, mT = (portrait ? 0.06 : 0.09) * H;
    var d = prog(t, 2.6, 0.7, EASE_DOCK);
    var lw = lerp(startW, endW, d), sc = lw / LOGO.w;
    var cx0 = (W - startW) / 2, cy0 = (H - LOGO.h * startW / LOGO.w) / 2 - (portrait ? H * 0.06 : 0);
    var lx = lerp(cx0, mL, d), ly = lerp(cy0, mT, d);
    ctx.save();
    ctx.translate(lx, ly); ctx.scale(sc, sc);
    for (var i = 0; i < 3; i++) {
      var p = prog(t, i * 0.12, 0.55, EASE_IN);
      if (p <= 0) continue;
      ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 18);
      ctx.fillStyle = th.ink; ctx.fill(textPaths[i]); ctx.restore();
    }
    var r = prog(t, 0.6, 1.2, EASE_DRAW);
    if (r > 0) {
      var L = TRAIL_LEN * r, pat = [], acc = 0, on = true;
      while (acc < L) { var seg = on ? 6.2 : 6.7; if (acc + seg > L) seg = L - acc; pat.push(seg); acc += seg; on = !on; }
      if (pat.length % 2 === 1) pat.push(TRAIL_LEN * 2); else pat[pat.length - 1] += TRAIL_LEN * 2;
      ctx.setLineDash(pat); ctx.strokeStyle = th.flight; ctx.lineWidth = 2.8; ctx.lineCap = "round";
      ctx.stroke(trailPath); ctx.setLineDash([]);
    }
    var f = prog(t, 1.6, 0.5, EASE_IN);
    if (f > 0) {
      ctx.save(); ctx.globalAlpha = f;
      ctx.translate(PLANE_C[0] + (1 - f) * -34, PLANE_C[1] + (1 - f) * 22);
      ctx.rotate((1 - f) * -10 * Math.PI / 180);
      ctx.translate(-PLANE_C[0], -PLANE_C[1]);
      ctx.strokeStyle = th.ink; ctx.lineWidth = 3.2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.stroke(planePath); ctx.restore();
    }
    ctx.restore();

    // helpers for scenes
    function sceneAlpha(range) {
      var inP = t >= range[0] ? 1 : 0;
      var out = prog(t, range[1] - 0.45, 0.45, EASE_DOCK);
      return { visible: t >= range[0] && t < range[1] + 0.01, a: inP * (1 - out), dy: -out * U * 0.02 };
    }
    function rise(start) { var p = prog(t, start, 0.6, EASE_IN); return { a: p, dy: (1 - p) * U * 0.022 }; }
    function dashedRule(x, y, w, g) {
      var rw = w * g, dw = U * 0.011, gw = U * 0.012, hh = Math.max(2, U * 0.0035);
      ctx.fillStyle = th.flight;
      for (var xx = 0; xx < rw; xx += dw + gw) ctx.fillRect(x + xx, y - hh, Math.min(dw, rw - xx), hh);
    }
    function photo(img, name, x, y, size, rev) {
      if (rev <= 0) return;
      ctx.save();
      ctx.beginPath(); ctx.rect(x, y + size * (1 - rev), size, size * rev); ctx.clip();
      if (img) {
        ctx.drawImage(img, x, y + (1 - rev) * size * 0.12, size, size);
      } else {
        ctx.fillStyle = th.sunk; ctx.fillRect(x, y, size, size);
        setFont("800 {s} 'Big Shoulders Display'", size * 0.34, 0.02);
        ctx.fillStyle = th.muted; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(initials(name), x + size / 2, y + size / 2);
      }
      ctx.restore();
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
    function label(text, x, y, start) {
      var m = rise(start);
      if (m.a <= 0) return;
      ctx.save(); ctx.globalAlpha *= m.a; ctx.fillStyle = th.muted;
      setFont("500 {s} 'IBM Plex Mono'", U * 0.015, 0.14);
      ctx.fillText(text, x, y + m.dy); ctx.restore();
    }

    // ---- scene: hosts ----
    var hs = sceneAlpha(P.hosts);
    if (hs.visible && hs.a > 0) {
      var t0 = P.hosts[0];
      var size = portrait ? 0.4 * W : square ? 0.3 * W : Math.min(0.36 * H, 0.2 * W);
      var gapX = (portrait ? 0.06 : 0.08) * W, total = size * 2 + gapX;
      var gx = (W - total) / 2 + (portrait || square ? 0 : 0.06 * W);
      var gy = portrait ? 0.4 * H : square ? 0.38 * H : 0.3 * H;
      ctx.save(); ctx.globalAlpha = hs.a; ctx.translate(0, hs.dy);
      label("PROWADZĄCY", gx, gy - U * 0.022, t0);
      S.hosts.forEach(function (h, k) {
        var x = gx + k * (size + gapX);
        photo(h.img, h.name, x, gy, size, prog(t, t0 + 0.15 + k * 0.18, 0.75, EASE_DOCK));
        var n = rise(t0 + 0.55 + k * 0.18);
        if (n.a > 0) {
          ctx.save(); ctx.globalAlpha *= n.a; ctx.fillStyle = th.ink;
          setFont("800 {s} 'Big Shoulders Display'", U * 0.034, 0.01);
          ctx.fillText(h.name.toLocaleUpperCase("pl-PL"), x, gy + size + U * 0.045 + n.dy);
          if (h.role) {
            ctx.fillStyle = th.muted; setFont("500 {s} 'IBM Plex Mono'", U * 0.014, 0.12);
            ctx.fillText(h.role.toLocaleUpperCase("pl-PL"), x, gy + size + U * 0.072 + n.dy);
          }
          ctx.restore();
        }
      });
      dashedRule(gx, gy + size + U * 0.098, total, prog(t, t0 + 1.0, 0.9, EASE_DRAW));
      ctx.restore();
    }

    // ---- scene: guest ----
    if (P.guest) {
      var gs = sceneAlpha(P.guest);
      if (gs.visible && gs.a > 0) {
        var s0 = P.guest[0], G = S.guest;
        var gsz = portrait ? 0.6 * W : square ? 0.4 * W : 0.46 * H;
        var px0 = portrait ? (W - gsz) / 2 : square ? 0.08 * W : 0.26 * W;
        var py0 = portrait ? 0.32 * H : square ? 0.34 * H : 0.3 * H;
        var tx = portrait ? px0 : px0 + gsz + 0.04 * W;
        var tw = portrait ? gsz : W - tx - 0.06 * W;
        ctx.save(); ctx.globalAlpha = gs.a; ctx.translate(0, gs.dy);
        photo(G.img, G.name, px0, py0, gsz, prog(t, s0 + 0.1, 0.8, EASE_DOCK));
        var nameSize = U * (portrait ? 0.05 : 0.058);
        setFont("800 {s} 'Big Shoulders Display'", nameSize, 0.01);
        var nl = wrap(G.name.toLocaleUpperCase("pl-PL"), tw);
        var blockH = U * 0.03 + nl.length * nameSize * 0.9 + (G.role ? U * 0.04 : 0);
        var ty = portrait ? py0 + gsz + U * 0.05 : py0 + (gsz - blockH) / 2 + U * 0.015;
        label("GOŚĆ ODCINKA", tx, ty, s0 + 0.35);
        var gn = rise(s0 + 0.5);
        if (gn.a > 0) {
          ctx.save(); ctx.globalAlpha *= gn.a; ctx.fillStyle = th.ink;
          setFont("800 {s} 'Big Shoulders Display'", nameSize, 0.01);
          nl.forEach(function (ln, k) { ctx.fillText(ln, tx, ty + U * 0.012 + nameSize * 0.78 + k * nameSize * 0.9 + gn.dy); });
          ctx.restore();
        }
        var lastY = ty + U * 0.012 + nameSize * 0.78 + (nl.length - 1) * nameSize * 0.9;
        if (G.role) {
          var gr = rise(s0 + 0.65);
          if (gr.a > 0) {
            ctx.save(); ctx.globalAlpha *= gr.a; ctx.fillStyle = th.muted;
            setFont("400 {s} 'Instrument Sans'", U * 0.022, 0);
            ctx.fillText(G.role, tx, lastY + U * 0.04 + gr.dy); ctx.restore();
          }
        }
        dashedRule(tx, lastY + U * (G.role ? 0.07 : 0.035), Math.min(tw, U * 0.3), prog(t, s0 + 0.9, 0.8, EASE_DRAW));
        ctx.restore();
      }
    }

    // ---- scene: episode card ----
    if (t >= P.ep[0]) {
      var e0 = P.ep[0];
      var left = mL, maxW = W - 2 * mL;
      var metaSize = U * 0.017, titleSize = U * 0.074, guestSize = U * 0.022, gap = U * 0.016;
      setFont("800 {s} 'Big Shoulders Display'", titleSize, 0.01);
      var lines = wrap(S.title, maxW * (portrait ? 1 : 0.8));
      var byline = S.guest ? "Gość: " + S.guest.name + (S.guest.role ? ", " + S.guest.role : "") : S.hosts.map(function (h) { return h.name; }).join(" i ");
      var y = H - (portrait ? 0.08 : 0.1) * H;
      var gY = y; y -= guestSize * 1.3 + gap;
      var rY = y - U * 0.0035; y -= U * 0.0035 + gap;
      var tY = y; y -= (lines.length - 1) * titleSize * 0.9 + titleSize * 0.74 + gap;
      var mY = y;
      var m = rise(e0);
      if (m.a > 0) {
        ctx.save(); ctx.globalAlpha = m.a; ctx.fillStyle = th.muted;
        setFont("500 {s} 'IBM Plex Mono'", metaSize, 0.12);
        ctx.fillText("ODC. " + S.num + (S.date ? " · " + S.date : ""), left, mY + m.dy); ctx.restore();
      }
      var tt = rise(e0 + 0.15);
      if (tt.a > 0) {
        ctx.save(); ctx.globalAlpha = tt.a; ctx.fillStyle = th.ink;
        setFont("800 {s} 'Big Shoulders Display'", titleSize, 0.01);
        for (var k = 0; k < lines.length; k++) ctx.fillText(lines[k], left, tY - (lines.length - 1 - k) * titleSize * 0.9 + tt.dy);
        ctx.restore();
      }
      dashedRule(left, rY, maxW * (portrait ? 0.6 : 0.34), prog(t, e0 + 0.4, 0.7, EASE_DRAW));
      var gg = rise(e0 + 0.35);
      if (gg.a > 0) {
        ctx.save(); ctx.globalAlpha = gg.a; ctx.fillStyle = th.muted;
        setFont("400 {s} 'Instrument Sans'", guestSize, 0);
        ctx.fillText(byline, left, gY + gg.dy); ctx.restore();
      }
    }
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    // ---- fade out ----
    if (S.fade) {
      var fo = prog(t, S.dur - 0.5, 0.5, function (x) { return x; });
      if (fo > 0) { ctx.globalAlpha = fo; ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    }
  }

  // ---------- preview ----------
  var playing = false, raf = 0;
  function resize(S) { if (cv.width !== S.w || cv.height !== S.h) { cv.width = S.w; cv.height = S.h; } }
  function still() { var S = settings(); resize(S); $("scrub").max = S.dur; draw(Math.min(Number($("scrub").value), S.dur), S); }
  function play() {
    if (playing) return;
    var S = settings(); resize(S); playing = true; $("play").textContent = "Zatrzymaj";
    var t0 = performance.now();
    (function loop(now) {
      var t = (now - t0) / 1000;
      if (!playing) return;
      if (t > S.dur) { stop(); $("scrub").value = S.dur - 0.6; still(); return; }
      $("scrub").value = t; draw(t, S); raf = requestAnimationFrame(loop);
    })(t0);
  }
  function stop() { playing = false; cancelAnimationFrame(raf); $("play").textContent = "Odtwórz podgląd"; }
  $("play").addEventListener("click", function () { playing ? stop() : play(); });
  $("scrub").addEventListener("input", function () { stop(); still(); });
  ["num", "date", "title", "h1name", "h1role", "h2name", "h2role", "gname", "grole", "theme", "size", "dur", "fade"].forEach(function (id) {
    $(id).addEventListener("input", function () { if (!playing) still(); });
  });
  $("png").addEventListener("click", function () {
    stop(); still();
    cv.toBlob(function (b) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "pdd-intro-" + settings().num + ".png"; a.click(); });
  });

  // ---------- encoding ----------
  function setStatus(msg, err) { var s = $("status"); s.textContent = msg; s.className = "status" + (err ? " err" : ""); }
  function setProg(p) { $("prog").style.width = (p * 100).toFixed(1) + "%"; }

  async function pickVideoCodec(S) {
    var cands = [
      { muxer: "avc", codec: S.w * S.h > 1920 * 1088 ? "avc1.640033" : "avc1.640028" },
      { muxer: "avc", codec: "avc1.4d0028" },
      { muxer: "avc", codec: "avc1.42e028" },
      { muxer: "vp9", codec: "vp09.00.40.08" }
    ];
    for (var i = 0; i < cands.length; i++) {
      var cfg = { codec: cands[i].codec, width: S.w, height: S.h, bitrate: Math.round(S.w * S.h * S.fps * 0.12), framerate: S.fps };
      if (cands[i].muxer === "avc") cfg.avc = { format: "avc" };
      try { var r = await VideoEncoder.isConfigSupported(cfg); if (r.supported) return { muxer: cands[i].muxer, config: r.config || cfg }; } catch (e) {}
    }
    return null;
  }

  async function loadAudio(S) {
    if (typeof AudioEncoder === "undefined") return null;
    var file = $("audio").files[0];
    // decodeAudioData odłącza bufor, więc domyślny dżingiel kopiujemy przy każdym renderze
    var buf = file ? await file.arrayBuffer() : defaultAudio && defaultAudio.slice(0);
    if (!buf) return null;
    var ac = new (window.AudioContext || window.webkitAudioContext)();
    var decoded = await ac.decodeAudioData(buf); ac.close();
    var rate = decoded.sampleRate, ch = Math.min(2, decoded.numberOfChannels);
    var cfg = { codec: "mp4a.40.2", sampleRate: rate, numberOfChannels: ch, bitrate: 192000 };
    var ok = await AudioEncoder.isConfigSupported(cfg).catch(function () { return { supported: false }; });
    if (!ok.supported) return { unsupported: true };
    var offset = Math.max(0, Number($("aoff").value) || 0);
    var total = Math.round(S.dur * rate), startAt = Math.round(offset * rate);
    var chans = [];
    for (var c = 0; c < ch; c++) {
      var src = decoded.getChannelData(c), out = new Float32Array(total);
      for (var n = startAt; n < total; n++) { var si = n - startAt; if (si < src.length) out[n] = src[si]; }
      var fadeN = Math.round(0.5 * rate);
      for (var q = 0; q < fadeN && q < total; q++) out[total - 1 - q] *= q / fadeN;
      chans.push(out);
    }
    return { cfg: cfg, rate: rate, ch: ch, chans: chans, total: total };
  }

  async function render() {
    stop();
    if (typeof VideoEncoder === "undefined") { setStatus("Ta przeglądarka nie ma WebCodecs. Użyj aktualnego Chrome, Edge albo Safari 17+.", true); return; }
    var S = settings(); resize(S);
    $("render").disabled = true; $("dl").hidden = true; setProg(0);
    try {
      await loadFonts();
      var vc = await pickVideoCodec(S);
      if (!vc) throw new Error("Przeglądarka nie potrafi zakodować wideo w tym rozmiarze. Spróbuj 1920 × 1080 albo innej przeglądarki.");
      setStatus("Przygotowuję…");
      var audio = null;
      try { audio = await loadAudio(S); } catch (e) { audio = null; setStatus("Nie udało się odczytać pliku dźwiękowego, generuję bez dźwięku."); }
      var muxOpts = { target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: vc.muxer, width: S.w, height: S.h, frameRate: S.fps }, fastStart: "in-memory", firstTimestampBehavior: "offset" };
      var useAudio = audio && !audio.unsupported;
      if (useAudio) muxOpts.audio = { codec: "aac", numberOfChannels: audio.ch, sampleRate: audio.rate };
      var muxer = new Mp4Muxer.Muxer(muxOpts);
      var failure = null;
      var venc = new VideoEncoder({ output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta); }, error: function (e) { failure = e; } });
      venc.configure(vc.config);
      var frames = Math.round(S.dur * S.fps);
      for (var i = 0; i < frames; i++) {
        if (failure) throw failure;
        draw(i / S.fps, S);
        var vf = new VideoFrame(cv, { timestamp: Math.round(i * 1e6 / S.fps), duration: Math.round(1e6 / S.fps) });
        venc.encode(vf, { keyFrame: i % (S.fps * 2) === 0 }); vf.close();
        while (venc.encodeQueueSize > 6) await new Promise(function (r) { setTimeout(r, 1); });
        if (i % 4 === 0) { setProg(i / frames * (useAudio ? 0.9 : 1)); setStatus("Koduję klatkę " + (i + 1) + " z " + frames + "…"); await new Promise(function (r) { setTimeout(r, 0); }); }
      }
      await venc.flush(); venc.close();
      if (useAudio) {
        setStatus("Koduję dźwięk…");
        var aenc = new AudioEncoder({ output: function (chunk, meta) { muxer.addAudioChunk(chunk, meta); }, error: function (e) { failure = e; } });
        aenc.configure(audio.cfg);
        var block = 1024;
        for (var s0 = 0; s0 < audio.total; s0 += block) {
          var n = Math.min(block, audio.total - s0), data = new Float32Array(n * audio.ch);
          for (var c = 0; c < audio.ch; c++) data.set(audio.chans[c].subarray(s0, s0 + n), c * n);
          var ad = new AudioData({ format: "f32-planar", sampleRate: audio.rate, numberOfFrames: n, numberOfChannels: audio.ch, timestamp: Math.round(s0 * 1e6 / audio.rate), data: data });
          aenc.encode(ad); ad.close();
        }
        await aenc.flush(); aenc.close();
        if (failure) throw failure;
      }
      muxer.finalize();
      var blob = new Blob([muxer.target.buffer], { type: "video/mp4" });
      var a = $("dl"); a.href = URL.createObjectURL(blob); a.download = "pdd-intro-odc-" + S.num + "-" + S.w + "x" + S.h + ".mp4"; a.hidden = false;
      a.textContent = "Pobierz MP4 (" + (blob.size / 1048576).toFixed(1) + " MB)";
      setProg(1);
      var note = vc.muxer === "vp9" ? " Uwaga: przeglądarka nie ma kodera H.264, plik MP4 ma wideo VP9." : "";
      if (audio && audio.unsupported) note += " Przeglądarka nie koduje AAC, plik jest bez dźwięku.";
      setStatus("Gotowe: " + frames + " klatek, " + S.dur + " s." + note);
      a.click();
    } catch (e) {
      setStatus("Błąd: " + (e && e.message ? e.message : e), true);
    } finally {
      $("render").disabled = false; still();
    }
  }
  $("render").addEventListener("click", render);

  // Google Fonts dzielą fonty na podzbiory (latin, latin-ext); canvas nie dociąga ich sam, więc prosimy o oba
  var SAMPLE = "ODCINEK 012 Zażółć gęślą jaźń";
  function loadFonts() {
    return document.fonts.ready.then(function () {
      return Promise.all([
        document.fonts.load("800 40px 'Big Shoulders Display'", SAMPLE),
        document.fonts.load("400 20px 'Instrument Sans'", SAMPLE),
        document.fonts.load("500 20px 'IBM Plex Mono'", SAMPLE)
      ]);
    });
  }
  if (!$("date").value) {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    $("date").value = p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + d.getFullYear();
  }
  loadFonts().then(still, still);
  still();
  window.__pdd = { draw: draw, settings: settings, render: render };
})();
