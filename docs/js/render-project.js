document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  if (!projectId) {
    showError("Project ID not specified in URL.");
    return;
  }

  try {
    const response = await fetch(`../data/projects/${projectId}.json`);
    if (!response.ok) throw new Error("Project data not found.");
    const project = await response.json();
    renderProject(project);
  } catch (err) {
    showError(`Error loading project: ${err.message}`);
  }
});

function updateHead(project) {
  // Title
  document.title = `${project.title} — Createx Construction`;

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", project.description[0]);
  }

  // Open Graph title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", project.title);
  }

  // Open Graph description
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute("content", project.description[0]);
  }

  // Open Graph URL
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    const currentUrl = window.location.href;
    ogUrl.setAttribute("content", currentUrl);
  }
}

function showError(message) {
  const container = document.querySelector(".project");
  container.innerHTML = `<p class="error-message">${message}</p>`;
}

function renderProject(project) {
  updateHead(project);
  document.querySelector(".project__title").textContent = project.title;

  renderGallery(project.gallery);
  renderThumbnails(project.thumbnails);
  renderDescription(project.description);
  renderDetailsTable(project.details);
}

function renderGallery(images) {
  const galleryWrapper = document.querySelector(
    ".project-slider-big .swiper-wrapper"
  );
  galleryWrapper.innerHTML = "";

  const projectId = new URLSearchParams(window.location.search).get("id");

  images.forEach((image) => {
    galleryWrapper.innerHTML += `
      <div class="swiper-slide">
        <div class="project__cover-big">
          <picture>
            <source type="image/avif" srcset="
              ../images/projects/${projectId}/${image.src}@1x.avif 1x,
              ../images/projects/${projectId}/${image.src}@2x.avif 2x">
            <source type="image/webp" srcset="
              ../images/projects/${projectId}/${image.src}@1x.webp 1x,
              ../images/projects/${projectId}/${image.src}@2x.webp 2x">
            <img class="project__img"
              src="../images/projects/${projectId}/${image.src}@1x.jpg"
              loading="lazy" decoding="async" alt="${image.alt}">
          </picture>
        </div>
      </div>`;
  });
}

function renderThumbnails(thumbnails) {
  const thumbWrapper = document.querySelector(
    "[data-thumbs-slider] .swiper-wrapper"
  );
  thumbWrapper.innerHTML = "";

  const projectId = new URLSearchParams(window.location.search).get("id");

  thumbnails.forEach((image) => {
    thumbWrapper.innerHTML += `
      <div class="swiper-slide">
        <div class="project__cover-small">
          <picture>
            <source type="image/avif" srcset="
              ../images/projects/${projectId}/${image.src}@1x.avif 1x,
              ../images/projects/${projectId}/${image.src}@2x.avif 2x">
            <source type="image/webp" srcset="
              ../images/projects/${projectId}/${image.src}@1x.webp 1x,
              ../images/projects/${projectId}/${image.src}@2x.webp 2x">
            <img class="project__img project__img--small"
              src="../images/projects/${projectId}/${image.src}@1x.jpg"
              loading="lazy" decoding="async" alt="${image.alt}">
          </picture>
        </div>
      </div>`;
  });
}

function renderDescription(paragraphs) {
  const container = document.querySelector(".project-goal__content");
  const subtitle = container.querySelector(".project-goal__subtitle");
  container.innerHTML = "";
  container.appendChild(subtitle);

  paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.className = "project-goal__descr";
    p.innerHTML = text;
    container.appendChild(p);
  });
}

function renderDetailsTable(details) {
  const table = document.querySelector(".project-goal__table");
  table.innerHTML = "";

  const fields = {
    location: "LOCATION",
    client: "CLIENT",
    architect: "ARCHITECT",
    size: "SIZE",
    value: "VALUE",
    completed: "COMPLETED",
  };

  for (const key in fields) {
    if (details[key]) {
      table.innerHTML += `
        <tr>
          <td class="project-goal__table-name">${fields[key]}</td>
          <td class="project-goal__table-value">${details[key]}</td>
        </tr>`;
    }
  }
}
