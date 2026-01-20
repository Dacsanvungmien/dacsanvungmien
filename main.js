// main.js - PHIÊN BẢN HOÀN CHỈNH (V3.0)

// 1. CẤU HÌNH SỐ ĐIỆN THOẠI
const PHONE_NUMBER = "0949161132"; // Số Zalo của bạn

// Hàm hỗ trợ: Chuyển đổi số 09xx -> 849xx
function formatZaloPhone(phone) {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '84' + cleanPhone.slice(1);
    }
    return cleanPhone;
}

// Hàm hỗ trợ: Copy nội dung an toàn
function copyToClipboard(text) {
    try {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    } catch (err) {
        console.error('Lỗi copy:', err);
        return false;
    }
}

// --- 2. CÁC HÀM XỬ LÝ CHÍNH ---

// Hàm 1: Thêm vào giỏ hàng
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
    updateCartCount();
}

// Hàm 2: MUA NGAY (Dùng cho nút ở trang chi tiết sản phẩm)
function buyNow(productName) {
    try {
        // Soạn tin
        var msg = "Chào Shop, tôi muốn mua nhanh món: " + productName + ". Tư vấn giúp tôi nhé!";
        
        // Copy
        copyToClipboard(msg);

        // Xác nhận và mở Zalo
        if (confirm("✅ Đã chép nội dung mua hàng!\n\n👉 Bấm OK để mở Zalo.\n👉 Sau đó bạn nhớ DÁN (PASTE) vào ô chat nhé!")) {
            var finalPhone = formatZaloPhone(PHONE_NUMBER);
            window.location.href = "https://zalo.me/" + finalPhone;
        }
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
}

// Hàm 3: CHỐT ĐƠN (Dùng cho nút ở trang Giỏ Hàng)
function checkoutZalo() {
    // Phải lấy giỏ hàng từ bộ nhớ TẠI ĐÂY để tránh lỗi "cart is not defined"
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];

    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    try {
        // Soạn tin nhắn tổng hợp
        let msg = "Chào Shop, tôi muốn đặt đơn hàng:\n";
        let total = 0;
        cart.forEach(item => {
            msg += `- ${item.name} (SL: ${item.quantity})\n`;
            total += item.price * item.quantity;
        });
        msg += `\n💰 Tổng: ${total.toLocaleString()}đ.\n📍 Giao giúp tôi nhé!`;
        
        // Copy
        copyToClipboard(msg);

        // Xác nhận và mở Zalo
        if (confirm("✅ Đã chép nội dung đơn hàng!\n\n👉 Bấm OK để mở Zalo.\n👉 Sau đó bạn nhớ DÁN (PASTE) vào ô chat nhé!")) {
            var finalPhone = formatZaloPhone(PHONE_NUMBER);
            window.location.href = "https://zalo.me/" + finalPhone;
        }

    } catch (e) {
        alert("Lỗi: " + e.message);
    }
}

// Hàm 4: Hiển thị thông báo nhỏ (Toast)
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

// --- 3. TỰ ĐỘNG CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG ---
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let badge = document.getElementById("cart-count");
    if (badge) {
        badge.innerText = total;
        if (total > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// CÁC CẢM BIẾN TỰ ĐỘNG CHẠY
document.addEventListener("DOMContentLoaded", updateCartCount);
window.addEventListener("pageshow", updateCartCount);
window.addEventListener("visibilitychange", function() {
    if (!document.hidden) updateCartCount();
});
window.addEventListener("focus", updateCartCount);
