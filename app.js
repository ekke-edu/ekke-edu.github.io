// Lazy-load the assistant only when a visitor opens the chat panel.
const chatDialog = document.querySelector("#ekke-chat-dialog");
const chatFrame = document.querySelector(".chat-frame");
const chatUrl = "https://ekke-mcp-chat.onrender.com/?embed=1";
let chatLoaded = false;

function openEkkeChat() {
  if (!chatLoaded) {
    chatFrame.src = chatUrl;
    chatLoaded = true;
  }
  chatDialog.showModal();
}

document.querySelector(".chat-launcher").addEventListener("click", openEkkeChat);
document.querySelector(".open-chat").addEventListener("click", openEkkeChat);
document.querySelector(".chat-close").addEventListener("click", () => chatDialog.close());
chatDialog.addEventListener("click", (event) => {
  if (event.target === chatDialog) chatDialog.close();
});

// Apply the selected language to visible copy and accessibility labels.
const languageButtons = document.querySelectorAll("[data-language]");

function setLanguage(language) {
  if (!["hu", "en"].includes(language)) return;

  document.documentElement.lang = language;
  document.querySelectorAll("[data-hu][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  document.querySelectorAll("[data-hu-aria-label][data-en-aria-label]").forEach((element) => {
    const key = language === "hu" ? "huAriaLabel" : "enAriaLabel";
    element.setAttribute("aria-label", element.dataset[key]);
  });

  try {
    localStorage.setItem("ekke-language", language);
  } catch {
    // Language switching still works when browser storage is disabled.
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

let preferredLanguage = "hu";
try {
  preferredLanguage = localStorage.getItem("ekke-language") || "hu";
} catch {
  // Use Hungarian as the default when browser storage is disabled.
}
setLanguage(preferredLanguage);

// Copy the recommended MCP client configuration to the clipboard.
const copyButton = document.querySelector(".copy");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector("#mcp-config").textContent);
    copyButton.textContent = document.documentElement.lang === "hu" ? "Kimásolva ✓" : "Copied ✓";
  } catch {
    copyButton.textContent =
      document.documentElement.lang === "hu" ? "Jelöld ki és másold" : "Select and copy";
  }

  window.setTimeout(() => {
    copyButton.textContent = document.documentElement.lang === "hu" ? "Másolás" : "Copy";
  }, 1800);
});
