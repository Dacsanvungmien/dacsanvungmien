// main.js - Phiên bản Tự động đồng bộ Realtime

const PHONE_NUMBER = "0949161132"; // Thay số Zalo của bạn (bỏ số 0 đầu, ví dụ 849...)

function formatZaloPhone(phone) {
    // Xóa khoảng trắng, dấu gạch ngang nếu có
    let cleanPhone = phone.replace(/\D/g, '');
    // Nếu bắt đầu bằng 0, thay bằng 84
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '84' + cleanPhone.slice(1);
    }
    return cleanPhone;
}
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

// HÀM MUA NGAY (1 MÓN)
function buyNow(productName) {
    const message = `Chào Shop, tôi muốn mua nhanh món: ${productName}. Tư vấn giúp tôi nhé!`;
    
    // 1. Chuẩn hóa số điện thoại
    const zaloPhone = formatZaloPhone(PHONE_NUMBER);
    
    // 2. Mã hóa nội dung tin nhắn (quan trọng)
    const encodedMsg = encodeURIComponent(message);
    
    // 3. Tạo link
    const url = `https://zalo.me/${zaloPhone}?text=${encodedMsg}`;
    
    // 4. Mở tab mới
    window.open(url, '_blank');
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
