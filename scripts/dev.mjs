import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  spawn(npm, ["run", "dev:server"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, PORT: process.env.PORT || "4000" }
  }),
  spawn(npm, ["run", "dev:client"], {
    stdio: "inherit",
    shell: process.platform === "win32"
  })
];

function stopAll(exitCode = 0) {
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
  process.exit(exitCode);
}

for (const child of processes) {
  child.on("exit", (code) => {
    if (code && code !== 0) stopAll(code);
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
