// js/home.js - Chạy an toàn cho cả trang dạng SPA / Router
(function() {
  function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide-clean');
    var dots = document.querySelectorAll('.dot');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');

    // Nếu trang hiện tại không có slideshow thì bỏ qua
    if (!slides || slides.length === 0) return;

    // Kiểm tra xem slide đã được gán sự kiện chưa để tránh bị lặp
    if (slides[0].dataset.sliderInitialized === "true") return;
    slides[0].dataset.sliderInitialized = "true";

    var index = 0;

    function showSlide(n) {
      if (n >= slides.length) index = 0;
      else if (n < 0) index = slides.length - 1;
      else index = n;

      slides.forEach(function(s) { s.classList.remove('active'); });
      dots.forEach(function(d) { d.classList.remove('active'); });

      if (slides[index]) slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
      showSlide(index + 1);
    }

    // Tự động chuyển slide mỗi 4 giây
    var timer = setInterval(nextSlide, 2000);

    // Sự kiện nút Next
    if (nextBtn) {
      nextBtn.onclick = function(e) {
        e.preventDefault();
        showSlide(index + 1);
      };
    }

    // Sự kiện nút Prev
    if (prevBtn) {
      prevBtn.onclick = function(e) {
        e.preventDefault();
        showSlide(index - 1);
      };
    }

    // Sự kiện click vào Dot
    dots.forEach(function(dot, idx) {
      dot.onclick = function(e) {
        e.preventDefault();
        showSlide(idx);
      };
    });

    // Chạy hiển thị lần đầu tiên
    showSlide(0);
  }

  // Chạy ngay khi tải xong hoặc khi chuyển trang qua Router
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initHeroSlider, 100);
  } else {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  }

  // Lắng nghe sự kiện click toàn cục để bắt trường hợp Router vừa đổi trang HTML xong
  window.addEventListener('click', function() {
    setTimeout(initHeroSlider, 200);
  });
  
  // Kiểm tra định kỳ nhẹ nhàng để chắc chắn slider lên hình là chạy
  setInterval(initHeroSlider, 1000);
})();
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".halloween-product-grid");
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  // Lắng nghe sự kiện mousedown trên toàn bộ khung chứa (bao gồm cả các item)
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  // Khi rê chuột ra ngoài khung slider thì ngắt trạng thái kéo
  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  // Khi nhả chuột ra
  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  // Khi di chuyển chuột để kéo trượt ngang
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Tốc độ trượt
    slider.scrollLeft = scrollLeft - walk;
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".halloween-product-grid");
  const prevBtn = document.querySelector(".halloween-prev-btn");
  const nextBtn = document.querySelector(".halloween-next-btn");

  if (!slider || !prevBtn || !nextBtn) return;

  // Khoảng cách trượt mỗi lần bấm (chiều rộng card + khoảng cách gap 20px)
  const scrollAmount = 320; 

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".halloween-product-grid");
  const prevBtn = document.querySelector(".halloween-prev-btn");
  const nextBtn = document.querySelector(".halloween-next-btn");

  if (!slider || !prevBtn || !nextBtn) return;

  nextBtn.addEventListener("click", () => {
    // Lấy chiều rộng của 1 card cộng với khoảng cách gap (20px) để trượt chính xác từng card một
    const card = slider.querySelector(".product-card");
    const cardWidth = card ? card.offsetWidth + 20 : 320;
    
    slider.scrollBy({
      left: cardWidth * 1, // Trượt qua 2 sản phẩm mỗi lần click (bạn có thể đổi số 2 thành 1 nếu muốn trượt từng sản phẩm)
      behavior: "smooth"
    });
  });

  prevBtn.addEventListener("click", () => {
    const card = slider.querySelector(".product-card");
    const cardWidth = card ? card.offsetWidth + 20 : 320;
    
    slider.scrollBy({
      left: -(cardWidth * 1), // Trượt ngược lại
      behavior: "smooth"
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".halloween-product-grid");
  const section = document.querySelector(".halloween-section");
  
  if (!slider || !section) return;

  const cards = slider.querySelectorAll(".product-card");
  if (cards.length === 0) return;

  // Tìm xem có thẻ dots chưa, nếu chưa có thì tự động tạo luôn
  let dotsContainer = document.querySelector(".halloween-dots");
  if (!dotsContainer) {
    dotsContainer = document.createElement("div");
    dotsContainer.classList.add("halloween-dots");
    section.appendChild(dotsContainer);
  }

  // Xóa nội dung cũ để tránh bị nhân đôi
  dotsContainer.innerHTML = "";

  // Tạo các dot tương ứng với số lượng card
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");

    // Click vào dot sẽ trượt đến card tương ứng
    dot.addEventListener("click", () => {
      cards[index].scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest"
      });
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  // Cập nhật trạng thái active khi cuộn
  slider.addEventListener("scroll", () => {
    let index = Math.round(slider.scrollLeft / (cards[0].offsetWidth + 20));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".trend-tab-btn");

  tabButtons.forEach(button => {
    // Thay sự kiện 'click' bằng 'mouseenter' nếu bạn muốn chỉ cần DI CHUỘT vào là đổi luôn
    button.addEventListener("mouseenter", function () {
      
      // 1. Gỡ bỏ trạng thái active của tất cả các nút và đổi màu nền về mặc định
      tabButtons.forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "rgba(255,255,255,0.15)";
        btn.style.fontWeight = "normal";
      });

      // 2. Thêm trạng thái active cho nút đang được di chuột vào và đổi sang màu đỏ nổi bật
      this.classList.add("active");
      this.style.backgroundColor = "#a80000";
      this.style.fontWeight = "bold";

      // 3. Lấy tên danh mục (category) từ thuộc tính data-category
      const category = this.getAttribute("data-category");

      // 4. Gọi hàm cập nhật danh sách sản phẩm ở đây (Ví dụ: fetch dữ liệu mới hoặc đổi HTML của lưới sản phẩm)
      updateProductGrid(category);
    });
  });

  function updateProductGrid(category) {
    const productGrid = document.querySelector(".trending-product-grid");
    
    // Hiệu ứng mờ dần khi chuyển đổi dữ liệu sản phẩm cho mượt mà
    productGrid.style.opacity = "0.3";

    setTimeout(() => {
      // 🟢 TẠI ĐÂY: Bạn có thể thay đổi innerHTML của productGrid bằng danh sách sản phẩm tương ứng của danh mục `category`
      // Hoặc nếu bạn dùng Ajax/API, hãy gọi dữ liệu sản phẩm của danh mục đó đổ vào đây.
      
      console.log("Đang tải sản phẩm cho danh mục: " + category);

      // Phục hồi lại độ sáng của lưới sau khi load xong dữ liệu giả lập
      productGrid.style.opacity = "1";
    }, 200);
  }
});