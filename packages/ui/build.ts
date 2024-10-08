import fs from "node:fs";
import path from "node:path";

const srcDir = path.join(process.cwd(), "src");
const packageJsonPath = path.join(process.cwd(), "package.json");

function generateComponentMap(directory: string): Record<string, string> {
  const componentMap: Record<string, string> = {};

  function traverseDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverseDirectory(filePath);
      } else if (file.endsWith(".tsx")) {
        const filename = path.basename(file, ".tsx");
        const componentName = path.basename(file, ".tsx");
        componentMap[filename] = `comp("${componentName}")`;
      }
    }
  }

  traverseDirectory(directory);
  return componentMap;
}

const componentMap = generateComponentMap(srcDir);

const tsOutput = `
import path from "node:path";

const comp = (name: string) => path.resolve(__dirname, \`src/\${name}.tsx\`);

export function getComponentEntries(): Record<string, string> {
	return {
${Object.entries(componentMap)
  .map(([key, value]) => `		"${key}": ${value},`)
  .join("\n")}
	};
}
`;

fs.writeFileSync(path.join(process.cwd(), "component-entries.ts"), tsOutput);

// Update package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

packageJson.exports = {
  ...packageJson.exports,
  ...Object.keys(componentMap).reduce((acc, key) => {
    acc[`./${key}`] = {
      types: `./src/${key}.tsx`,
      default: `./dist/${key}.js`,
    };
    return acc;
  }, {}),
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));

console.log("Component entries file and package.json updated successfully.");
