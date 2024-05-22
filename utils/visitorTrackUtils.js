const fs = require("fs");
const path = require("path");

// Resolve the root directory path
const rootDirPath = path.resolve(__dirname, "..");

// Combine the root directory path with the "data" directory
const dataDirPath = path.join(rootDirPath, "data");

// Function to preload visitor count from file
function preloadVisitorCount() {
  try {
    const data = fs.readFileSync(
      path.resolve(dataDirPath, "visitor_count.json")
    );
    const visitorCount = JSON.parse(data);
    if (isNaN(visitorCount)) {
      throw new Error("visitor count is not an integer type.");
    }
    return visitorCount;
  } catch (error) {
    console.error("Error preloading visitor count:", error);
    return 0;
  }
}

// Function to preload user IPs from file
function preloadUserIPs() {
  try {
    const data = fs.readFileSync(path.resolve(dataDirPath, "user_ips.json"));
    const userIPs = JSON.parse(data);
    if (!Array.isArray(userIPs)) {
      throw new Error("User IPs data is not an array.");
    }
    return userIPs;
  } catch (error) {
    console.error("Error preloading user IPs:", error);
    return [];
  }
}

// Function to preload user agents from file
function preloadUserAgents() {
  try {
    const data = fs.readFileSync(
      path.resolve(dataDirPath, "user_agents.json")
    );
    const userAgents = JSON.parse(data);
    if (!Array.isArray(userAgents)) {
      throw new Error("User agents data is not an array.");
    }
    return userAgents;
  } catch (error) {
    console.error("Error preloading user agents:", error);
    return [];
  }
}

module.exports = {
  preloadVisitorCount,
  preloadUserAgents,
  preloadUserIPs,
};
