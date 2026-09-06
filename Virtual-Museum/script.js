
    const artifacts = [
      {
        id: 1,
        name: "Rosetta Stone",
        culture: "Ancient Egypt",
        period: "196 BCE",
        material: "Granodiorite",
        category: "Writing",
        image: "https://images.unsplash.com/photo-1590147477515-298d85e2f5b2?auto=format&fit=crop&w=800&q=80",
        description: "A trilingual decree that gave scholars the key to decipher Egyptian hieroglyphs."
      },
      {
        id: 2,
        name: "Terracotta Warrior",
        culture: "Qin Dynasty, China",
        period: "210 BCE",
        material: "Terracotta",
        category: "Sculpture",
        image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=80",
        description: "One of thousands of life-sized figures created to guard the first emperor of China."
      },
      {
        id: 3,
        name: "Venus of Willendorf",
        culture: "Paleolithic Europe",
        period: "25,000 BCE",
        material: "Limestone",
        category: "Sculpture",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",
        description: "A small carved figure and an important example of prehistoric art."
      },
      {
        id: 4,
        name: "Benin Bronze Plaque",
        culture: "Kingdom of Benin",
        period: "16th Century",
        material: "Brass",
        category: "Metalwork",
        image: "https://images.unsplash.com/photo-1561214115-64ca6d4f4c7e?auto=format&fit=crop&w=800&q=80",
        description: "A detailed courtly relief panel created using traditional brass-casting methods."
      }
    ];

    const content = document.getElementById("content");
    let favorites = JSON.parse(localStorage.getItem("museumFavorites")) || [];
    let sortDirection = 1;

    function updateFavoriteCount() {
      document.getElementById("favoriteCount").textContent = favorites.length;
    }

    function showToast(message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function navigate(page, button) {
      document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
      if (button) button.classList.add("active");

      if (page === "home") showHome();
      if (page === "collection") showCollection();
      if (page === "compare") showCompare();
      if (page === "feedback") showFeedback();
    }

    function showHome() {
      content.innerHTML = `
        <section class="hero">
          <h1>Stories preserved through objects.</h1>
          <p>Explore historical artifacts from different cultures, compare their information, and save your favourites.</p>
          <button class="primary" onclick="showCollection()">Explore Collection</button>
        </section>

        <section class="stats">
          <div class="card"><span class="stat-number">${artifacts.length}</span> Featured Artifacts</div>
          <div class="card"><span class="stat-number">4</span> World Cultures</div>
          <div class="card"><span class="stat-number">${favorites.length}</span> Saved Artifacts</div>
        </section>
      `;
    }

    function artifactCard(artifact) {
      const saved = favorites.includes(artifact.id);

      return `
        <article class="card artifact-card">
          <img src="${artifact.image}" alt="${artifact.name}">
          <div class="artifact-content">
            <div class="small">${artifact.category}</div>
            <h3>${artifact.name}</h3>
            <div class="small">${artifact.culture} · ${artifact.period}</div>

            <div class="actions">
              <button class="text-btn" onclick="showDetails(${artifact.id})">View Details</button>
              <button class="text-btn favorite" onclick="toggleFavorite(${artifact.id})">
                ${saved ? "♥" : "♡"}
              </button>
            </div>
          </div>
        </article>
      `;
    }

    function showCollection() {
      content.innerHTML = `
        <h1>Explore Collection</h1>
        <p>Search artifacts by name, origin, material, or category.</p>

        <div class="toolbar">
          <input id="searchInput" oninput="filterArtifacts()" placeholder="Search artifacts...">
          <select id="categoryFilter" onchange="filterArtifacts()">
            <option value="all">All Categories</option>
            <option value="Writing">Writing</option>
            <option value="Sculpture">Sculpture</option>
            <option value="Metalwork">Metalwork</option>
          </select>
        </div>

        <p id="resultText" class="small"></p>
        <section id="artifactGrid" class="artifact-grid"></section>
      `;

      filterArtifacts();
    }

    function filterArtifacts() {
      const search = document.getElementById("searchInput").value.toLowerCase();
      const category = document.getElementById("categoryFilter").value;

      const result = artifacts.filter(artifact => {
        const searchableText = Object.values(artifact).join(" ").toLowerCase();

        return searchableText.includes(search) &&
          (category === "all" || artifact.category === category);
      });

      document.getElementById("resultText").textContent =
        `${result.length} artifact(s) found`;

      document.getElementById("artifactGrid").innerHTML =
        result.length
          ? result.map(artifactCard).join("")
          : "<p>No artifacts found.</p>";
    }

    function toggleFavorite(id) {
      if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
        showToast("Removed from saved artifacts");
      } else {
        favorites.push(id);
        showToast("Artifact saved successfully");
      }

      localStorage.setItem("museumFavorites", JSON.stringify(favorites));
      updateFavoriteCount();
      showCollection();
    }

    function showFavorites() {
      const savedArtifacts = artifacts.filter(artifact => favorites.includes(artifact.id));

      content.innerHTML = `
        <h1>Saved Artifacts</h1>
        <p>Your saved collection is stored in this browser.</p>
        <section class="artifact-grid">
          ${
            savedArtifacts.length
              ? savedArtifacts.map(artifactCard).join("")
              : "<p>You have not saved any artifacts yet.</p>"
          }
        </section>
      `;
    }

    function showDetails(id) {
      const artifact = artifacts.find(item => item.id === id);
      const dialog = document.getElementById("artifactDialog");

      dialog.innerHTML = `
        <button class="close" onclick="artifactDialog.close()">×</button>
        <img src="${artifact.image}" alt="${artifact.name}">
        <h2>${artifact.name}</h2>
        <p>${artifact.description}</p>
        <p><strong>Culture:</strong> ${artifact.culture}</p>
        <p><strong>Period:</strong> ${artifact.period}</p>
        <p><strong>Material:</strong> ${artifact.material}</p>
      `;

      dialog.showModal();
    }

    function showCompare() {
      const sorted = [...artifacts].sort((a, b) =>
        a.name.localeCompare(b.name) * sortDirection
      );

      content.innerHTML = `
        <h1>Compare Artifacts</h1>
        <p>Click “Artifact” to sort the table.</p>

        <table>
          <thead>
            <tr>
              <th onclick="sortTable()">Artifact ↕</th>
              <th>Culture</th>
              <th>Period</th>
              <th>Material</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map(artifact => `
              <tr>
                <td>${artifact.name}</td>
                <td>${artifact.culture}</td>
                <td>${artifact.period}</td>
                <td>${artifact.material}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    function sortTable() {
      sortDirection *= -1;
      showCompare();
    }

    function showFeedback() {
      content.innerHTML = `
        <h1>Visitor Feedback</h1>
        <p>Your feedback is saved in the browser for this demo.</p>

        <form onsubmit="submitFeedback(event)">
          <label>Name</label>
          <input id="name" required>

          <label>Email</label>
          <input id="email" type="email" required>

          <label>Rating</label>
          <select id="rating">
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
          </select>

          <label>Feedback</label>
          <textarea id="message" rows="5" required></textarea>

          <br>
          <button class="primary" type="submit">Submit Feedback</button>
          <p id="feedbackResult"></p>
        </form>
      `;
    }

    function submitFeedback(event) {
      event.preventDefault();

      const feedback = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        rating: document.getElementById("rating").value,
        message: document.getElementById("message").value,
        date: new Date().toLocaleString()
      };

      const allFeedback =
        JSON.parse(localStorage.getItem("museumFeedback")) || [];

      allFeedback.push(feedback);
      localStorage.setItem("museumFeedback", JSON.stringify(allFeedback));

      document.getElementById("feedbackResult").textContent =
        "Thank you! Your feedback has been saved.";

      event.target.reset();
    }

    function toggleTheme() {
      document.body.classList.toggle("dark");

      localStorage.setItem(
        "museumTheme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    }

    if (localStorage.getItem("museumTheme") === "dark") {
      document.body.classList.add("dark");
    }

    updateFavoriteCount();
    showHome();
