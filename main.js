// main.js - Phiên bản nâng cấp

const PHONE_NUMBER = "0912345678"; // <--- THAY SỐ ZALO CỦA BẠN VÀO ĐÂY

// 1. THÊM VÀO GIỎ
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
    
    // Hiển thị thông báo
    showToast(`✅ Đã thêm ${product.name} vào giỏ!`);
    
    // Cập nhật số trên icon ngay lập tức
    updateCartCount();
}

// 2. MUA NGAY (1 MÓN)
function buyNow(productName) {
    const message = `Chào Shop, tôi muốn mua nhanh món: ${productName}. Tư vấn giúp tôi nhé!`;
    window.open(`https://zalo.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// 3. CẬP NHẬT SỐ LƯỢNG TRÊN ICON GIỎ HÀNG
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Tìm cái icon giỏ hàng để sửa số
    let badge = document.getElementById("cart-count");
    if (badge) {
        badge.innerText = total;
        // Nếu giỏ hàng trống thì ẩn số 0 đi cho đẹp
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// 4. HIỂN THỊ THÔNG BÁO (TOAST)
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

// 1. Chạy khi trang tải xong (Lần đầu vào)
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
});

// 2. Chạy khi người dùng bấm nút Back/Forward (Xử lý Cache)
window.addEventListener("pageshow", function(event) {
    // Nếu trang được load từ cache (lịch sử duyệt web) thì cập nhật lại giỏ
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        updateCartCount();
    } else {
        // Cứ chạy cập nhật cho chắc ăn trong mọi trường hợp
        updateCartCount();
    }
});

// 3. (Nâng cao) Đồng bộ giữa các Tab 
// (Ví dụ: Mở 2 tab, tab này thêm giỏ thì tab kia tự nhảy số luôn không cần F5)
window.addEventListener('storage', function(event) {
    if (event.key === 'shop_giohang') {
        updateCartCount();
    }
});
