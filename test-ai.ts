import { analyzeSymptoms } from "./lib/ai";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function main() {
  try {
    console.log("Testing AI...");
    console.log("API Key loaded?", !!process.env.GEMINI_API_KEY);
    const res = await analyzeSymptoms(["fever", "headache"], "Adult");
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (e: any) {
    console.error("Top level error message:", e.message);
  }
}
main();
