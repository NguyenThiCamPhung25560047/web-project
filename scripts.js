
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
