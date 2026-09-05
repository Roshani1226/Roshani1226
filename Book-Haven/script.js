
    const books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Classic",
        price: 12.99,
        icon: "🍸",
        color: "#b7d7ec",
        description: "A story about ambition, wealth, love and the American Dream."
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genre: "Classic",
        price: 14.50,
        icon: "🐦",
        color: "#e8c48d",
        description: "A coming-of-age story about empathy, justice and courage."
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian",
        price: 11.25,
        icon: "👁️",
        color: "#e59a88",
        description: "A warning about surveillance, authoritarianism and freedom."
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
        genre: "Romance",
        price: 10.99,
        icon: "🌸",
        color: "#ecb6c8",
        description: "A witty love story about first impressions and family."
      },
      {
        id: 5,
        title: "The Midnight Library",
        author: "Matt Haig",
        year: 2020,
        genre: "Fiction",
        price: 16.99,
        icon: "🌙",
        color: "#7a91c9",
        description: "A woman explores the many lives she could have lived."
      },
      {
        id: 6,
        title: "Project Hail Mary",
        author: "Andy Weir",
        year: 2021,
        genre: "Science Fiction",
        price: 18.00,
        icon: "🚀",
        color: "#78b7c7",
        description: "A lone astronaut must save humanity from disaster."
      }
    ];

    const state = {
      cart: JSON.parse(localStorage.getItem("bookHavenCart") || "{}"),
      favorites: JSON.parse(localStorage.getItem("bookHavenFavorites") || "[]")
    };

    const $ = (selector) => document.querySelector(selector);

    function saveData() {
      localStorage.setItem("bookHavenCart", JSON.stringify(state.cart));
      localStorage.setItem(
        "bookHavenFavorites",
        JSON.stringify(state.favorites)
      );
    }

    function formatMoney(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value);
    }

    function showToast(message) {
      const toast = $("#toast");
      toast.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 2500);
    }

    function renderBooks() {
      const searchText = $("#search").value.toLowerCase();
      const selectedGenre = $("#genre").value;
      const selectedSort = $("#sort").value;

      let filteredBooks = books.filter((book) => {
        const searchableText = `${book.title} ${book.author}`.toLowerCase();

        return (
          searchableText.includes(searchText) &&
          (selectedGenre === "all" || book.genre === selectedGenre)
        );
      });

      if (selectedSort === "year-desc") {
        filteredBooks.sort((a, b) => b.year - a.year);
      }

      if (selectedSort === "year-asc") {
        filteredBooks.sort((a, b) => a.year - b.year);
      }

      if (selectedSort === "title") {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      }

      $("#results").textContent = `${filteredBooks.length} books found`;

      $("#bookGrid").innerHTML = filteredBooks
        .map(
          (book) => `
          <article class="card">
            <div class="cover" style="--cover:${book.color}">
              ${book.icon}
            </div>

            <span class="genre">${book.genre}</span>
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
            <p class="meta">${book.year} · ${formatMoney(book.price)}</p>

            <div class="card-actions">
              <button data-details="${book.id}">Details</button>

              <button data-fav="${book.id}">
                ${
                  state.favorites.includes(book.id)
                    ? "♥ Saved"
                    : "♡ Save"
                }
              </button>

              <button data-add="${book.id}">Add</button>
            </div>
          </article>
        `
        )
        .join("");
    }

    function updateCart() {
      let count = 0;
      let total = 0;

      Object.entries(state.cart).forEach(([id, quantity]) => {
        const book = books.find((item) => item.id === Number(id));

        count += quantity;
        total += book.price * quantity;
      });

      $("#cartCount").textContent = count;
      $("#cartTotal").textContent = `Total: ${formatMoney(total)}`;

      saveData();
    }

    function showCart() {
      const entries = Object.entries(state.cart);

      $("#cartItems").innerHTML = entries.length
        ? entries
            .map(([id, quantity]) => {
              const book = books.find((item) => item.id === Number(id));

              return `
                <div class="cart-item">
                  <div>
                    <strong>${book.title}</strong>
                    <p>${formatMoney(book.price)} each</p>
                  </div>

                  <div class="quantity">
                    <button data-qty="${id}" data-change="-1">−</button>
                    <span>${quantity}</span>
                    <button data-qty="${id}" data-change="1">+</button>
                  </div>
                </div>
              `;
            })
            .join("")
        : "<p>Your cart is empty. Add a book to get started.</p>";

      updateCart();

      if (!$("#cartDialog").open) {
        $("#cartDialog").showModal();
      }
    }

    books.forEach((book) => {
      const alreadyAdded = [...$("#genre").options].some(
        (option) => option.value === book.genre
      );

      if (!alreadyAdded) {
        const option = document.createElement("option");
        option.value = book.genre;
        option.textContent = book.genre;
        $("#genre").append(option);
      }
    });

    document.addEventListener("click", (event) => {
      const addId = Number(event.target.dataset.add);
      const favoriteId = Number(event.target.dataset.fav);
      const detailsId = Number(event.target.dataset.details);

      if (event.target.dataset.add) {
        state.cart[addId] = (state.cart[addId] || 0) + 1;
        updateCart();
        showToast("Added to cart");
      }

      if (event.target.dataset.fav) {
        if (state.favorites.includes(favoriteId)) {
          state.favorites = state.favorites.filter(
            (id) => id !== favoriteId
          );
          showToast("Removed from wishlist");
        } else {
          state.favorites.push(favoriteId);
          showToast("Saved to wishlist");
        }

        saveData();
        renderBooks();
      }

      if (event.target.dataset.details) {
        const book = books.find((item) => item.id === detailsId);

        $("#detailsContent").innerHTML = `
          <div class="detail-cover" style="--cover:${book.color}">
            ${book.icon}
          </div>

          <h2>${book.title}</h2>
          <p>${book.author} · ${book.year} · ${book.genre}</p>
          <p>${book.description}</p>
          <p><strong>${formatMoney(book.price)}</strong></p>

          <button class="primary" type="button" data-add="${book.id}">
            Add to cart
          </button>
        `;

        $("#detailsDialog").showModal();
      }

      if (event.target.dataset.qty) {
        const id = event.target.dataset.qty;
        const change = Number(event.target.dataset.change);

        state.cart[id] += change;

        if (state.cart[id] <= 0) {
          delete state.cart[id];
        }

        showCart();
      }

      if (event.target.id === "cartButton") {
        showCart();
      }

      if (event.target.id === "checkout") {
        if (Object.keys(state.cart).length > 0) {
          state.cart = {};
          updateCart();
          $("#cartDialog").close();
          showToast("Demo order placed — thank you!");
        } else {
          showToast("Your cart is empty.");
        }
      }
    });

    document.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest("dialog").close();
      });
    });

    document.querySelectorAll("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      });
    });

    ["search", "genre", "sort"].forEach((id) => {
      $("#" + id).addEventListener(
        id === "search" ? "input" : "change",
        renderBooks
      );
    });

    $("#themeToggle").addEventListener("click", () => {
      const isDark = document.documentElement.dataset.theme !== "dark";

      document.documentElement.dataset.theme = isDark ? "dark" : "";

      localStorage.setItem(
        "bookHavenTheme",
        isDark ? "dark" : "light"
      );
    });

    if (localStorage.getItem("bookHavenTheme") === "dark") {
      document.documentElement.dataset.theme = "dark";
    }

    renderBooks();
    updateCart();