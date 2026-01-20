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

// --- HÀM CHỐT ĐƠN (PHIÊN BẢN COPY-PASTE) ---
function checkoutZalo() {
    if (cart.length === 0) return;

    // 1. Soạn tin nhắn
    let msg = "Chào Shop, tôi muốn đặt đơn hàng:\n";
    let total = 0;
    cart.forEach(item => {
        msg += `- ${item.name} (SL: ${item.quantity})\n`;
        total += item.price * item.quantity;
    });
    msg += `\n💰 Tổng: ${total.toLocaleString()}đ.\n📍 Giao giúp tôi nhé!`;
    
    // 2. COPY VÀO BỘ NHỚ (Chìa khóa của vấn đề)
    // Gọi hàm copyToClipboard (đảm bảo hàm này có trong main.js hoặc viết lại ở đây)
    if (typeof copyToClipboard === "function") {
        copyToClipboard(msg);
    } else {
        // Nếu chưa có hàm trong main.js thì chạy code copy thủ công tại chỗ
        navigator.clipboard.writeText(msg).catch(err => console.log('Lỗi copy', err));
    }

    // 3. Xử lý số điện thoại
    let phone = (typeof PHONE_NUMBER !== 'undefined') ? PHONE_NUMBER : '0912345678';
    phone = phone.replace(/\D/g, ''); 
    if (phone.startsWith('0')) phone = '84' + phone.slice(1);

    // 4. Mở Zalo (Ưu tiên Deep Link trên Mobile)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Thử mở App trực tiếp
        window.location.href = `zalo://conversation?phone=${phone}&message=${encodeURIComponent(msg)}`;
    } else {
        // Mở Web
        window.open(`https://zalo.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    // 5. THÔNG BÁO NHẮC KHÁCH (Cực kỳ quan trọng)
    // Dùng setTimeout để thông báo hiện ra sau khi chuyển trang một chút
    setTimeout(function() {
        alert("✅ Đã copy đơn hàng!\n\n👉 Do chính sách Zalo, nếu bạn không thấy tin nhắn điền sẵn, vui lòng nhấn giữ ô chat và chọn DÁN (PASTE) nhé!");
    }, 500);
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
