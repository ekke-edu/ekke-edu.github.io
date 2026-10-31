import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");

test("homepage loads external styles and a deferred application script", () => {
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(html, /<script src="app\.js" defer><\/script>/);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i);
});

test("all translatable homepage copy has both Hungarian and English values", () => {
  const translatedElements = [...html.matchAll(/<[^>]+data-hu="[^"]*"[^>]*>/g)];
  assert.ok(translatedElements.length > 25);
  for (const [element] of translatedElements) {
    assert.match(element, /\bdata-en="[^"]*"/, `Missing English text: ${element}`);
  }
});

test("chat launchers target the accessible dialog and keep a separate-tab fallback", () => {
  assert.match(html, /class="chat-launcher"[^>]*aria-haspopup="dialog"[^>]*aria-controls="ekke-chat-dialog"/);
  assert.match(html, /<dialog[^>]*id="ekke-chat-dialog"[^>]*aria-labelledby="chat-dialog-title"/);
  assert.match(html, /class="chat-open-full" href="https:\/\/ekke-mcp-chat\.onrender\.com\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(app, /chatFrame\.src = chatUrl/);
});

test("external links opened in new tabs use noopener protections", () => {
  const externalLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)];
  assert.ok(externalLinks.length > 5);
  for (const [link] of externalLinks) {
    assert.match(link, /rel="noopener noreferrer"/, `Unsafe external link: ${link}`);
  }
});

test("language switching updates document language, text and accessible labels", () => {
  assert.match(app, /document\.documentElement\.lang = language/);
  assert.match(app, /data-hu-aria-label/);
  assert.match(app, /localStorage\.setItem\("ekke-language", language\)/);
});
