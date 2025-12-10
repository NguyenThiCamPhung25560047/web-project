fetch("/api/products")
    .then(res => res.json())
    .then(products => {
        const container = document.querySelector(".cake-list");

        container.innerHTML = products.map(p => `
            <div class="cake-card">
                <img src="${p.img}">
                <h3>${p.name}</h3>
                <p>Delicious cake.</p>
                <div class="price">${p.price.toLocaleString()}đ</div>
                <button class="add-cart" data-item="${p.name}" data-price="${p.price}">Add</button>
            </div>
        `).join("");
    });
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ----------------------
// CART FUNCTIONS
// ----------------------

// Update navbar cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = count;
}
updateCartCount();

// Add item to cart (with quantity & animation)
document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", (event) => {
        const name = button.dataset.item;
        const price = parseFloat(button.dataset.price);

        let existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        // Bounce animation on cart count
        const count = document.getElementById("cart-count");
        if (count) {
            count.style.animation = "cartBounce 0.4s ease";
            setTimeout(() => count.style.animation = "", 400);
        }

        // Sparkle effect at cursor
        const sparkle = document.createElement("div");
        sparkle.textContent = "✨";
        sparkle.style.position = "fixed";
        sparkle.style.left = event.clientX + "px";
        sparkle.style.top = event.clientY + "px";
        sparkle.style.animation = "sparkle 0.8s ease";
        sparkle.style.pointerEvents = "none";
        sparkle.style.fontSize = "22px";
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    });
});

// Render cart page
function renderCart() {
    const tbody = document.getElementById("cart-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const lineTotal = item.price * item.quantity;
        grandTotal += lineTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toLocaleString()}đ</td>
            <td class="qty-controls">
                <button class="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="increase">+</button>
            </td>
            <td>${lineTotal.toLocaleString()}đ</td>
            <td><button class="remove-btn">✕</button></td>
        `;
        tbody.appendChild(row);

        // Attach event listeners dynamically
        row.querySelector(".decrease").addEventListener("click", () => changeQty(index, -1));
        row.querySelector(".increase").addEventListener("click", () => changeQty(index, 1));
        row.querySelector(".remove-btn").addEventListener("click", () => removeItem(index));
    });

    document.getElementById("grand-total").textContent = `${grandTotal.toLocaleString()}đ`;
}
// Change quantity
function changeQty(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Clear entire cart
const clearBtn = document.getElementById("clear-cart");
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCart();
    });
}

// Initial render if on cart page
renderCart();

/* ------------ DARK MODE ------------ */
const toggle = document.getElementById("theme-toggle");
toggle.onclick = () => {
    document.body.classList.toggle("dark");

    // thay icon
    toggle.textContent = document.body.classList.contains("dark")
        ? "☀️" : "🌙";
};

document.getElementById("recommend-btn").onclick = () => {
    const checked = [...document.querySelectorAll("input:checked")].map(i => i.value);

    fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: checked })
    })
    .then(res => res.json())
    .then(result =>
        document.getElementById("recommendation-result").innerText =
            "You can make: " + result
    );
};
/* ------------ RECOMMENDATION ENGINE ------------ */
document.getElementById("recommend-btn").onclick = () => {
    let selected = Array.from(document.querySelectorAll(".ingredient-checkboxes input:checked"))
        .map(i => i.value);

    let result = document.getElementById("recommendation-result");

    // Các công thức bánh với nguyên liệu
    let recipes = {
        cheesecake: ["flour", "milk", "eggs", "sugar", "butter"],
        brownies: ["chocolate", "eggs", "sugar", "flour", "butter"],
        cookies: ["flour", "sugar", "butter", "eggs"],
        macaron: ["eggs", "sugar", "flour", "butter", "almond"],
        cupcake: ["flour", "sugar", "butter", "eggs", "milk"],
        matcha_cake: ["flour", "eggs", "sugar", "milk", "matcha"],
        red_velvet: ["flour", "butter", "sugar", "eggs", "cocoa powder", "milk", "cream cheese"],
        tiramisu: ["eggs", "sugar", "coffee", "mascarpone", "ladyfingers"],
        lemon_tart: ["flour", "butter", "sugar", "eggs", "lemon"],
        apple_pie: ["flour", "butter", "sugar", "apples", "cinnamon"],
        matcha_roll: ["flour", "eggs", "sugar", "milk", "matcha"],
        croissant: ["flour", "butter", "yeast", "sugar", "salt"]
    };

    let recommended = [];
    let maxMatchCount = 0;
    let closestCake = null;

    // Tìm các bánh có thể làm được với nguyên liệu đã chọn
    for (let cake in recipes) {
        let matchCount = recipes[cake].filter(x => selected.includes(x)).length;
        if (matchCount === recipes[cake].length) {
            recommended.push(cake); // Nếu tất cả nguyên liệu của bánh đều trùng khớp
        }

        // Kiểm tra bánh gần nhất nếu không có bánh nào trùng khớp hoàn toàn
        if (matchCount > maxMatchCount) {
            maxMatchCount = matchCount;
            closestCake = cake;
        }
    }

    // Hiển thị kết quả
    if (recommended.length > 0) {
        result.innerHTML = `<h3>You can make: ${recommended.join(", ").replace(/_/g, " ")} 🎉</h3>`;
    } else {
        if (closestCake) {
            result.innerHTML = `
                <p>No cakes match your ingredients 😢</p>
                <p>However, you can make something close! You might be able to try: <strong>${closestCake.replace(/_/g, " ")}</strong> 🍰</p>
            `;
        } else {
            result.innerHTML = "<p>No cakes can be made with the selected ingredients 😢</p>";
        }
    }
};

/* ------------ PRODUCT DETAILS PAGE ------------ */
document.querySelectorAll(".detail-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let product = btn.getAttribute("data-product");
        window.location.href = "product-detail.html?item=" + product;
    });
});
// JavaScript để hiển thị chi tiết của từng bánh
function showCakeDetail(cakeName) {
    // Ẩn tất cả các phần chi tiết bánh
    let allDetails = document.querySelectorAll('.cake-detail');
    allDetails.forEach(detail => {
        detail.style.display = 'none';
    });

    // Hiển thị phần chi tiết của bánh được chọn
    let cakeDetail = document.getElementById(cakeName + '-detail');
    if (cakeDetail) {
        cakeDetail.style.display = 'block';
    }
}
