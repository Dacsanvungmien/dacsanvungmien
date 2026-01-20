// main.js - Phiên bản Tự động đồng bộ Realtime

const PHONE_NUMBER = "84949161132"; // Thay số Zalo của bạn (bỏ số 0 đầu, ví dụ 849...)

// --- 1. CÁC HÀM XỬ LÝ CHÍNH ---

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    let existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('shop_giohang', JSON.stringify(cart));
    showToast(`✅ Đã thêm ${product.name} vào giỏ!`);
    updateCartCount(); // Cập nhật ngay
}

function buyNow(productName) {
    const message = `Chào Shop, tôi muốn mua nhanh món: ${productName}. Tư vấn giúp tôi nhé!`;
    window.open(`https://zalo.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- 2. HÀM CẬP NHẬT SỐ LƯỢNG (QUAN TRỌNG NHẤT) ---
function updateCartCount() {
    // Luôn đọc dữ liệu mới nhất từ bộ nhớ
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Tìm icon giỏ hàng
    let badge = document.getElementById("cart-count");
    if (badge) {
        badge.innerText = total;
        // Logic ẩn/hiện: Nếu 0 thì ẩn, lớn hơn 0 thì hiện
        if (total > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none'; // Ẩn đi nếu giỏ trống
        }
    }
}

// --- 3. CÁC "CẢM BIẾN" TỰ ĐỘNG CHẠY ---

// Cảm biến 1: Khi trang vừa tải xong
document.addEventListener("DOMContentLoaded", updateCartCount);

// Cảm biến 2: Khi người dùng bấm nút BACK (Quay lại từ trang khác)
window.addEventListener("pageshow", function(event) {
    updateCartCount();
});

// Cảm biến 3: Khi người dùng chuyển Tab rồi quay lại (Tab Focus)
window.addEventListener("visibilitychange", function() {
    if (!document.hidden) {
        updateCartCount();
    }
});

// Cảm biến 4: Đồng bộ giữa các Tab (Ví dụ mở 2 tab cùng lúc)
window.addEventListener('storage', function(event) {
    if (event.key === 'shop_giohang') {
        updateCartCount();
    }
});

// Cảm biến 5: Khi cửa sổ được active lại (An toàn tuyệt đối)
window.addEventListener("focus", updateCartCount);
