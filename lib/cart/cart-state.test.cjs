/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { cartReducer, getCartItemCount, initialCartState, isPositiveInteger, resolvePreviewCartProduct } = require("./cart-state.ts");

const eligiblePreviews = [
  { routeKey: "charcoal-soap", name: "Charcoal Soap", detailPageStatus: "development-preview-eligible", images: [] },
  { routeKey: "excluded-item", name: "Excluded Item", detailPageStatus: "blocked", images: [] },
];

test("resolves only explicitly eligible preview products", () => {
  assert.deepEqual(resolvePreviewCartProduct("charcoal-soap", eligiblePreviews), {
    id: "charcoal-soap",
    name: "Charcoal Soap",
    href: "/products/charcoal-soap",
    image: null,
  });
  assert.equal(resolvePreviewCartProduct("excluded-item", eligiblePreviews), null);
  assert.equal(resolvePreviewCartProduct("unknown", eligiblePreviews), null);
});

test("adds an eligible item and merges duplicate additions", () => {
  const product = resolvePreviewCartProduct("charcoal-soap", eligiblePreviews);
  const once = cartReducer(initialCartState, { type: "add", product });
  const twice = cartReducer(once, { type: "add", product });
  assert.equal(twice.items.length, 1);
  assert.equal(twice.items[0]?.quantity, 2);
  assert.equal(getCartItemCount(twice), 2);
});

test("rejects unresolved additions", () => {
  const state = cartReducer(initialCartState, { type: "add", product: null });
  assert.strictEqual(state, initialCartState);
});

test("increases and decreases quantity while preserving the minimum of one", () => {
  const product = resolvePreviewCartProduct("charcoal-soap", eligiblePreviews);
  const added = cartReducer(initialCartState, { type: "add", product });
  const increased = cartReducer(added, { type: "increase", productId: "charcoal-soap" });
  assert.equal(increased.items[0]?.quantity, 2);
  const decreased = cartReducer(increased, { type: "decrease", productId: "charcoal-soap" });
  assert.equal(decreased.items[0]?.quantity, 1);
  const stillOne = cartReducer(decreased, { type: "decrease", productId: "charcoal-soap" });
  assert.equal(stillOne.items[0]?.quantity, 1);
});

test("removes an item and clears all items", () => {
  const product = resolvePreviewCartProduct("charcoal-soap", eligiblePreviews);
  const added = cartReducer(initialCartState, { type: "add", product });
  assert.deepEqual(cartReducer(added, { type: "remove", productId: "charcoal-soap" }), initialCartState);
  assert.deepEqual(cartReducer(added, { type: "clear" }), initialCartState);
});

test("validates positive integer quantities and excludes invalid values from the count", () => {
  assert.equal(isPositiveInteger(1), true);
  assert.equal(isPositiveInteger(0), false);
  assert.equal(isPositiveInteger(-1), false);
  assert.equal(isPositiveInteger(1.5), false);
  assert.equal(getCartItemCount({ items: [{ id: "bad", name: "Bad", href: "/products/bad", image: null, quantity: 0 }] }), 0);
});
