// main.js - File xử lý giỏ hàng chung

// 1. CẤU HÌNH THÔNG TIN CHỦ SHOP
const PHONE_NUMBER = "0912345678"; // Thay số Zalo của bạn vào đây (bỏ số 0 đầu nếu cần theo format quốc tế)

// 2. HÀM THÊM VÀO GIỎ HÀNG (Lưu vào LocalStorage)
function addToCart(product) {
    // Lấy giỏ hàng cũ từ bộ nhớ (nếu có)
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    
    // Kiểm tra xem món này đã có trong giỏ chưa
    let existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1; // Nếu có rồi thì tăng số lượng
    } else {
        product.quantity = 1; // Nếu chưa có thì thêm mới với số lượng 1
        cart.push(product);
    }

    // Lưu ngược lại vào bộ nhớ
    localStorage.setItem('shop_giohang', JSON.stringify(cart));
    
    // Hiển thị thông báo (Toast)
    showToast(`✅ Đã thêm ${product.name} vào giỏ!`);
    
    // Cập nhật số lượng trên icon giỏ hàng (nếu bạn có làm icon giỏ hàng trên menu)
    updateCartCount();
}

// 3. HÀM MUA NGAY (Chuyển hướng sang Zalo với nội dung soạn sẵn)
function buyNow(productName) {
    // Tạo nội dung tin nhắn mẫu
    const message = `Chào Shop, tôi muốn đặt mua ngay món: ${productName}. Tư vấn giúp tôi nhé!`;
    
    // Tạo link Zalo (Mở app hoặc web)
    // Lưu ý: Zalo Web đôi khi chặn deep link, nhưng mobile thì OK.
    const zaloUrl = `https://zalo.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Mở tab mới
    window.open(zaloUrl, '_blank');
}

// 4. HÀM HIỂN THỊ THÔNG BÁO (Toast)
function showToast(message) {
    // Tạo thẻ div thông báo nếu chưa có
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    
    toast.innerText = message;
    toast.className = "show";
    
    // Ẩn sau 3 giây
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// 5. CẬP NHẬT SỐ LƯỢNG (Để hiển thị chấm đỏ trên icon giỏ hàng - Nâng cao)
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shop_giohang')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log("Tổng số lượng trong giỏ:", total);
    // Sau này bạn có thể gán số này vào một thẻ span trên header
}
