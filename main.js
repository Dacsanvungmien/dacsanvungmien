// main.js - PHIÊN BẢN V4.0 (ĐỒNG BỘ HÓA NỘI DUNG TUYỆT ĐỐI)

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

// Hàm hỗ trợ: Copy nội dung (Code chuẩn)
function copyToClipboard(text) {
    try {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px"; // Giấu textarea đi
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error('Lỗi copy:', err);
        return false;
    }
}

// --- 2. CÁC HÀM XỬ LÝ CHÍNH ---

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

// --- HÀM MUA NGAY (Trang chi tiết) ---
function buyNow(productName, productPrice) {
    try {
        // BƯỚC 1: SOẠN TIN NHẮN (CHỈ 1 LẦN DUY NHẤT TẠI ĐÂY)
        var finalMsg = "Chào Shop, tôi muốn mua nhanh:\n";
        finalMsg += "- " + productName + " (SL: 1)\n";
        
        // Kiểm tra nếu có giá tiền thì thêm vào
        if (productPrice && productPrice > 0) {
            finalMsg += "\n💰 Tổng: " + productPrice.toLocaleString('vi-VN') + "đ.\n";
        }
        finalMsg += "📍 Tư vấn và giao hàng giúp tôi nhé!";

        // BƯỚC 2: COPY NỘI DUNG VỪA SOẠN
        copyToClipboard(finalMsg);

        // BƯỚC 3: MỞ ZALO VỚI CÙNG NỘI DUNG ĐÓ
        var confirmText = "✅ Đã chép đơn hàng!\n\n👉 Trên ĐIỆN THOẠI: Vui lòng nhấn giữ ô chat và chọn DÁN (PASTE).\n👉 Trên MÁY TÍNH: Nội dung sẽ tự điền.\n\nBấm ĐỒNG Ý để mở Zalo ngay!";
        
        if (confirm(confirmText)) {
            var finalPhone = formatZaloPhone(PHONE_NUMBER);
            // Dùng encodeURIComponent để đảm bảo nội dung trên PC hiển thị đúng y hệt
            var zaloUrl = "https://zalo.me/" + finalPhone + "?text=" + encodeURIComponent(finalMsg);
            
            // Chuyển hướng
            window.location.href = zaloUrl;
        }

    } catch (e) {
        alert("Lỗi: " + e.message);
    }
}

// --- HÀM CHỐT ĐƠN (Trang giỏ hàng) ---
function checkoutZalo() {
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];

    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    try {
        // BƯỚC 1: SOẠN TIN NHẮN (CHỈ 1 LẦN DUY NHẤT TẠI ĐÂY)
        var finalMsg = "Chào Shop, tôi muốn đặt đơn hàng:\n";
        let total = 0;

        cart.forEach(item => {
            // Xử lý giá tiền cẩn thận
            let price = Number(item.price);
            let qty = Number(item.quantity);
            if (isNaN(price)) price = 0;
            if (isNaN(qty)) qty = 1;

            finalMsg += `- ${item.name} (SL: ${qty})\n`;
            total += price * qty;
        });

        finalMsg += `\n💰 Tổng: ${total.toLocaleString('vi-VN')}đ.\n📍 Giao giúp tôi nhé!`;

        // BƯỚC 2: COPY NỘI DUNG VỪA SOẠN
        copyToClipboard(finalMsg);

        // BƯỚC 3: MỞ ZALO VỚI CÙNG NỘI DUNG ĐÓ
        var confirmText = "✅ Đã chép đơn hàng!\n\n👉 Trên ĐIỆN THOẠI: Vui lòng nhấn giữ ô chat và chọn DÁN (PASTE).\n👉 Trên MÁY TÍNH: Nội dung sẽ tự điền.\n\nBấm ĐỒNG Ý để mở Zalo ngay!";

        if (confirm(confirmText)) {
            var finalPhone = formatZaloPhone(PHONE_NUMBER);
            // Dùng encodeURIComponent để đảm bảo nội dung trên PC hiển thị đúng y hệt
            var zaloUrl = "https://zalo.me/" + finalPhone + "?text=" + encodeURIComponent(finalMsg);
            
            window.location.href = zaloUrl;
        }

    } catch (e) {
        alert("Lỗi: " + e.message);
    }
}

// Hàm hiển thị thông báo nhỏ
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

// --- 3. CÁC CẢM BIẾN TỰ ĐỘNG ---
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let badge = document.getElementById("cart-count");
    if (badge) {
        badge.innerText = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
window.addEventListener("pageshow", updateCartCount);
window.addEventListener("focus", updateCartCount);
