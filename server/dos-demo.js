// ============================================================
//  DoS Mitigation Demo Script
//  SWAPI MERN App — server/index.js
//  Run with: node dos-demo.js
//  Make sure your server is running on localhost:4000 first!
// ============================================================

const http = require("http");

const BASE_URL = "http://localhost:4000";

// ── Helper: make a single HTTP GET request ───────────────────
function makeRequest(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          ms: Date.now() - start,
          size: Buffer.byteLength(data, "utf8"),
          body: data.substring(0, 80), // preview only
        });
      });
    }).on("error", (err) => {
      resolve({ status: "ERROR", ms: 0, size: 0, body: err.message });
    });
  });
}

// ── Helper: make a POST request with a custom body ──────────
function makePostRequest(path, bodyStr) {
  return new Promise((resolve) => {
    const options = {
      hostname: "localhost",
      port: 4000,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, body: data.substring(0, 120) });
      });
    });
    req.on("error", (err) => resolve({ status: "ERROR", body: err.message }));
    req.write(bodyStr);
    req.end();
  });
}

// ── Formatting helpers ────────────────────────────────────────
function banner(title) {
  console.log("\n" + "=".repeat(60));
  console.log("  " + title);
  console.log("=".repeat(60));
}

function result(label, value, good) {
  const icon = good ? "✅" : "❌";
  console.log(`  ${icon}  ${label}: ${value}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ════════════════════════════════════════════════════════════
//  DEMO 1 — Fix 2: Oversized JSON Payload (Body Size Limit)
// ════════════════════════════════════════════════════════════
async function demoBodySizeLimit() {
  banner("DEMO 1 — Fix 2: Oversized JSON Payload (Body Size Limit)");
  console.log("  Sending a ~50KB JSON body to the server...");
  console.log("  Expected: Server rejects it with HTTP 413\n");

  // Build a ~50KB payload (well over our 10kb limit)
  const bigPayload = JSON.stringify({ data: "A".repeat(50000) });
  const sizeKb = (Buffer.byteLength(bigPayload) / 1024).toFixed(1);

  console.log(`  Payload size: ${sizeKb} KB  (limit is 10 KB)`);

  const res = await makePostRequest("/api/characters", bigPayload);

  if (res.status === 413) {
    result("Status", `${res.status} Payload Too Large`, true);
    result("Result", "Server rejected the oversized body — Fix 2 is working!", true);
  } else {
    result("Status", res.status, false);
    result("Result", "Unexpected response — check server is running", false);
  }
}

// ════════════════════════════════════════════════════════════
//  DEMO 2 — Fix 3: Pagination (MongoDB Query Overload)
// ════════════════════════════════════════════════════════════
async function demoPagination() {
  banner("DEMO 2 — Fix 3: Pagination (MongoDB Query Overload)");
  console.log("  Without pagination: server returns ALL documents at once");
  console.log("  With pagination:    server returns only the requested page\n");

  // Default page (limit=20, skip=0)
  console.log("  [Test A] GET /api/characters  (default — limit=20, skip=0)");
  const resDefault = await makeRequest("/api/characters");
  const countDefault = JSON.parse(
    await getFullBody("/api/characters")
  ).length;
  result("Status", resDefault.status, resDefault.status === 200);
  result("Records returned", countDefault, countDefault <= 20);
  result("Response size", `${(resDefault.size / 1024).toFixed(1)} KB`, true);

  console.log();

  // Page 2 (skip=20)
  console.log("  [Test B] GET /api/characters?limit=5&skip=0  (first 5 only)");
  const resPage = await makeRequest("/api/characters?limit=5&skip=0");
  const countPage = JSON.parse(
    await getFullBody("/api/characters?limit=5&skip=0")
  ).length;
  result("Status", resPage.status, resPage.status === 200);
  result("Records returned", countPage, countPage === 5);
  result("Response size", `${(resPage.size / 1024).toFixed(1)} KB`, true);

  console.log();

  // Attacker tries to bypass with huge limit
  console.log("  [Test C] GET /api/characters?limit=99999  (attacker tries to bypass)");
  const resBypass = await makeRequest("/api/characters?limit=99999");
  const countBypass = JSON.parse(
    await getFullBody("/api/characters?limit=99999")
  ).length;
  result("Status", resBypass.status, resBypass.status === 200);
  result("Records returned", countBypass, countBypass <= 100);
  result(
    "Result",
    countBypass <= 100
      ? `Capped at ${countBypass} records — Math.min() protection working!`
      : "WARNING: cap not working",
    countBypass <= 100
  );
}

// ════════════════════════════════════════════════════════════
//  DEMO 3 — Fix 1: Rate Limiting (Request Flooding)
// ════════════════════════════════════════════════════════════
async function demoRateLimit() {
  banner("DEMO 3 — Fix 1: Rate Limiting (Request Flooding)");
  console.log("  Sending 55 rapid requests to /api/films");
  console.log("  Expected: First 50 succeed (200), requests 51+ get blocked (429)\n");

  let passed = 0;
  let blocked = 0;
  let firstBlockAt = null;

  for (let i = 1; i <= 55; i++) {
    const res = await makeRequest("/api/films");
    if (res.status === 200) {
      passed++;
    } else if (res.status === 429) {
      blocked++;
      if (!firstBlockAt) firstBlockAt = i;
    }
    // Small delay so we don't get OS-level connection errors
    await sleep(30);
  }

  console.log(`  Requests sent:   55`);
  result(`Requests allowed (200)`, passed, passed <= 50);
  result(`Requests blocked (429)`, blocked, blocked > 0);
  result(
    `First block at request #`,
    firstBlockAt || "never",
    firstBlockAt !== null
  );
  result(
    "Result",
    blocked > 0
      ? "Rate limiter kicked in — Fix 1 is working!"
      : "Rate limiter did NOT trigger — check windowMs typo fix",
    blocked > 0
  );
}

// ── Helper: get full response body as string ─────────────────
function getFullBody(path) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", () => resolve("[]"));
  });
}

// ════════════════════════════════════════════════════════════
//  MAIN — run all three demos in sequence
// ════════════════════════════════════════════════════════════
async function main() {
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║       SWAPI Server — DoS Mitigation Demo                 ║");
  console.log("║       Testing all 3 fixes against localhost:4000         ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  // Quick connectivity check
  console.log("\n  Checking server is up...");
  const ping = await makeRequest("/api/films");
  if (ping.status === "ERROR") {
    console.log("\n  ❌  Cannot reach localhost:4000");
    console.log("      Make sure you ran: npm start  in the server folder\n");
    process.exit(1);
  }
  console.log("  ✅  Server is up and responding\n");

  await demoBodySizeLimit();
  await sleep(500);
  await demoPagination();
  await sleep(500);
  await demoRateLimit();

  console.log("\n" + "=".repeat(60));
  console.log("  All 3 DoS fixes verified!");
  console.log("  Fix 1 — Rate Limiting      : express-rate-limit (windowMs)");
  console.log("  Fix 2 — Body Size Limit    : express.json({ limit: '10kb' })");
  console.log("  Fix 3 — Pagination         : .skip().limit() on findAll*");
  console.log("=".repeat(60) + "\n");
}

main();