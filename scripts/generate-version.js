import { execSync } from "child_process";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer package.json como texto
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const version = packageJson.version;
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const buildDate = new Date().toISOString();

const data = `
Version: ${version}
Git Commit: ${commitHash}
Build Date: ${buildDate}
`;

const outputDir = path.resolve(__dirname, "../dist"); // o '../public'
mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "version.txt"), data);

console.log("✅ version.txt generado con éxito");
