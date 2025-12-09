/* ------------ ADD TO CART ------------ */
let cartCount = 0;

document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
        cartCount++;
        document.getElementById("cart-count").textContent = cartCount;

        btn.textContent = "Added!";
        setTimeout(() => btn.textContent = "Add", 800);
    });
});


/* ------------ DARK MODE ------------ */
const toggle = document.getElementById("theme-toggle");
toggle.onclick = () => {
    document.body.classList.toggle("dark");

    // thay icon
    toggle.textContent = document.body.classList.contains("dark")
        ? "☀️" : "🌙";
};


/* ------------ RECOMMENDATION ENGINE ------------ */
document.getElementById("recommend-btn").onclick = () => {
    let selected = Array.from(document.querySelectorAll(".ingredient-checkboxes input:checked"))
        .map(i => i.value);

    let result = document.getElementById("recommendation-result");

    let recipes = {
        cheesecake: ["flour", "milk", "eggs"],
        brownies: ["chocolate", "eggs", "sugar"],
        cookies: ["flour", "sugar"],
        macaron: ["eggs", "sugar"]
    };

    let recommended = [];

    for (let cake in recipes) {
        if (recipes[cake].every(x => selected.includes(x))) {
            recommended.push(cake);
        }
    }

    result.innerHTML =
        recommended.length ?
        `<h3>You can make: ${recommended.join(", ")} 🎉</h3>` :
        "<p>No cakes match your ingredients 😢</p>";
};


/* ------------ PRODUCT DETAILS PAGE ------------ */
document.querySelectorAll(".detail-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let product = btn.getAttribute("data-product");
        window.location.href = "product-detail.html?item=" + product;
    });
});
