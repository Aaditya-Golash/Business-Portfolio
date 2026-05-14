const emailLinks = document.querySelectorAll(".contact-email");

for (const link of emailLinks) {
  const user = link.dataset.user;
  const domain = link.dataset.domain;

  if (!user || !domain) {
    continue;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `mailto:${user}@${domain}`;
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/assets/sw.js").catch(() => {});
  });
}
