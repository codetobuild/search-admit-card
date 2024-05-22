const fs = require("fs");
const path = require("path");

// Resolve the root directory path
const rootDirPath = path.resolve(__dirname, "..");

// Combine the root directory path with the "data" directory
const dataDirPath = path.join(rootDirPath, "data");

const {
  preloadVisitorCount,
  preloadUserAgents,
  preloadUserIPs,
} = require("../utils/visitorTrackUtils");

let visitorCount = preloadVisitorCount();
let userIPs = preloadUserIPs();
let userAgents = preloadUserAgents();

function visitorTracker(req, res, next) {
  const clientIP = req.ip; // Get client IP address
  const userAgent = req.get("User-Agent"); // Get user agent
  visitorCount++; // Increment visitor count
  userIPs.push(clientIP);
  userAgents.push(userAgent);

  req.visitorCount = visitorCount;
  req.userAgent = userAgent;
  req.clientIP = clientIP;

  console.log({ visitorCount, clientIP, userAgent });

  // Write updated data to JSON files
  fs.writeFile(
    path.resolve(dataDirPath, "user_ips.json"),
    JSON.stringify(userIPs),
    (err) => {
      if (err) console.error("Error writing to user IPs file:", err);
    }
  );
  fs.writeFile(
    path.resolve(dataDirPath, "visitor_count.json"),
    JSON.stringify(visitorCount),
    (err) => {
      if (err) console.error("Error writing to visitor count file:", err);
    }
  );
  fs.writeFile(
    path.resolve(dataDirPath, "user_agents.json"),
    JSON.stringify(userAgents),
    (err) => {
      if (err) console.error("Error writing to user agents file:", err);
    }
  );

  next();
}

module.exports = { visitorTracker };
