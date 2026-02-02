async function loadPartial(id, url) {
  const container = document.getElementById(id);
  if (!container) return;

  const res = await fetch(url);
  container.innerHTML = await res.text();
}

(async () => {
  await loadPartial("app-header", "partials/header.html");
  await loadPartial("app-footer", "partials/footer.html");

  // año automático
  const year = document.getElementById("nxYear");
  if (year) year.textContent = new Date().getFullYear();
})();