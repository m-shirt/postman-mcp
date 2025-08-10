import Ajv from "ajv";
import addFormats from "ajv-formats";
import { discoverTools } from "./lib/tools.js";

const ajv = new Ajv({ strict: true, allErrors: true, validateSchema: true });
addFormats(ajv);

// Utility function to recursively check all array types have 'items'
function checkArrayItems(schema) {
  if (!schema || typeof schema !== "object") return true;

  if (schema.type === "array" && !schema.hasOwnProperty("items")) {
    return false;
  }

  if (schema.properties) {
    for (const key in schema.properties) {
      if (!checkArrayItems(schema.properties[key])) {
        return false;
      }
    }
  }

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      for (const itemSchema of schema.items) {
        if (!checkArrayItems(itemSchema)) return false;
      }
    } else {
      if (!checkArrayItems(schema.items)) return false;
    }
  }

  return true;
}

console.log("🔍 Validating MCP tool schemas...\n");

const tools = await discoverTools();
let hasError = false;

for (const tool of tools) {
  const { name, parameters } = tool.definition.function;

  // 0. Check arrays have 'items'
  if (!checkArrayItems(parameters)) {
    hasError = true;
    console.error(`❌ Invalid JSON Schema in: ${name}`);
    console.error([
      {
        message: "Array type missing required 'items' property",
      },
    ]);
    continue;
  }

  // 1. Validate schema with AJV
  const validSchema = ajv.validateSchema(parameters);
  if (!validSchema) {
    hasError = true;
    console.error(`❌ Invalid JSON Schema in: ${name}`);
    console.error(ajv.errors, "\n");
    continue;
  }

  // 2. Compile & dummy validate
  try {
    const validate = ajv.compile(parameters);
    validate({}); // dummy run
    console.log(`✅ ${name} is valid`);
  } catch (err) {
    hasError = true;
    console.error(`❌ Schema compilation failed for: ${name}`);
    console.error(err.message, "\n");
  }
}

if (!hasError) {
  console.log("\n🎉 All tool schemas are valid!");
} else {
  console.log("\n⚠️ Some tool schemas are invalid — fix them before deploying.");
  process.exit(1);
}
