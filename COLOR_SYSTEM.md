# 🎨 Velora Store - Color System & Theme Guidelines (Light & Dark Mode)

Tài liệu quy chuẩn toàn diện về mã màu (Design Tokens & Color Codes) cho 2 chế độ **Light Mode** và **Dark Mode** trong dự án Velora Store.

---

## 🎯 1. Nguyên Tắc Cốt Lõi (Core Principles)

1. **Độ tương phản chuẩn WCAG AAA/AA:** Text và Icon luôn phải đảm bảo độ tương phản tối thiểu 4.5:1 với nền ở cả 2 chế độ.
2. **Không pha trộn màu cẩu thả:** Không dùng text vàng trên nền đỏ (`#a80000` + text vàng), không dùng text mờ trên nền sáng/tối.
3. **Icon & Badge Cross-Platform Safe:** Tuyệt đối không dùng ký tự Unicode hệ điều hành (như `` bị vỡ font ô vuông `□` trên Windows/Android). Luôn dùng **SVG Vector** cho Payment Logos (Visa, Mastercard, Apple Pay, PayPal, Google Pay, Amex, Discover).
4. **Nhất quán Tone & Mood:**
   - **Dark Mode (Default):** Sang trọng, huyền bí, điểm nhấn High-Tech Orange (`#FF7700`) & Deep Dark UI.
   - **Light Mode:** Sạch sẽ, hiện đại, nền Slate siêu nhẹ (`#F8FAFC`), card trắng tinh khôi (`#FFFFFF`), viền sắc nét (`#E2E8F0`).

---

## 📊 2. Bảng Tra Cứu Màu Chuẩn Đối Chiếu (Light vs. Dark Matrix)

| Thành phần UI | Dark Mode (Mặc định) | Light Mode | Class Tailwind Khuyên Dùng |
| :--- | :--- | :--- | :--- |
| **Nền trang chính (Body/Page Background)** | `#0B0B0B` | `#F8FAFC` | `bg-[#0b0b0b]` / `html.light-mode: bg-[#f8fafc]` |
| **Card / Surface cấp 1** | `#141414` (Border: `#262626`) | `#FFFFFF` (Border: `#E2E8F0`) | `bg-[#141414] border-[#262626]` |
| **Card / Surface cấp 2 (Hover/Active)** | `#1A1A1A` | `#F1F5F9` | `hover:bg-[#1a1a1a]` |
| **Header & Navbar** | `#0C0C0C` (Border: `#1E1E1E`) | `#FFFFFF` (Border: `#E2E8F0`) | `bg-[#0c0c0c] border-[#1e1e1e]` |
| **Footer** | `#0A0A0A` (Border: `#1E1E1E`) | `#F8FAFC` (Border: `#E2E8F0`) | `bg-[#0a0a0a]` |
| **Tiêu đề chính (Headings H1-H6)** | `#FCF7FA` (`#FFFFFF`) | `#0F172A` (Slate 900) | `text-white` |
| **Văn bản phụ (Body / Description)** | `#9CA3AF` (Gray 400) | `#334155` (Slate 700) | `text-gray-400` |
| **Văn bản mờ (Muted / Captions / Specs)**| `#6B7280` (Gray 500) | `#64748B` (Slate 500) | `text-gray-500` |
| **Đường kẻ / Viền phân cách (Borders)**| `#262626` / `#333333` | `#E2E8F0` / `#CBD5E1` | `border-[#262626]` |
| **Input / Form Field nền** | `#161616` (Border: `#2A2A2A`) | `#FFFFFF` (Border: `#CBD5E1`) | `bg-[#161616] border-[#2a2a2a]` |
| **Input Text & Placeholder** | Text: `#FFF`, Holder: `#666` | Text: `#0F172A`, Holder: `#94A3B8` | `text-white placeholder:text-gray-500` |

---

## 🏷️ 3. Quy Chuẩn Màu Cho Badges, Buttons & Action Elements

### A. Badge Giảm Giá / Khuyến Mãi (SALE & Discount Badges)
- ❌ **Cấm tuyệt đối:** Dùng nền đỏ rượu thâm xì với chữ vàng chuối lòe loẹt (`bg-[#a80000] text-amber-300`).
- ✅ **Chuẩn quốc tế:**
  - **SALE Tag:** Nền đỏ tươi thể thao (`#DC2626` / `bg-red-600`) + Chữ trắng in hoa đậm (`text-white font-extrabold`).
  - **Discount % Pill:** Nền đen mờ (`bg-black/30`) hoặc trắng mờ (`bg-white/20`) + Chữ trắng (`text-white font-bold`).
  ```tsx
  {/* Code chuẩn */}
  <div className="bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
    <span>SALE</span>
    <span className="bg-black/25 px-1 py-0.2 rounded text-[9px] font-bold text-white">
      -30%
    </span>
  </div>
  ```

### B. Nút Yêu Thích (Wishlist Button trên Product Card)
- ❌ **Cấm:** Dùng nút đen đặc (`bg-[#000]`) trên ảnh sản phẩm nền sáng gây cảm giác một vết lồi đen xì bẩn mắt.
- ✅ **Chuẩn phong cách Apple / Modern Glassmorphism:**
  - **Trạng thái chưa lưu:** `bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-sm transition`
  - **Trạng thái đã lưu (Active):** `bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105` (Icon Heart: `fill-white text-white`)
  ```tsx
  {/* Code chuẩn */}
  <button className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-sm transition">
    <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : "text-white"} />
  </button>
  ```

### C. Nút Hành Động Chính (Primary CTA - Add to Cart / Checkout)
- **Primary Brand Color:** Cam neon Velora `#FF7700` (Hover: `#E66A00`)
  - Chữ trên nút: Đen tuyền `#000000` (Font đậm `font-black font-extrabold`) để độ tương phản tối đa.
- **Secondary CTA (Đỏ Brand / Buy Now):** `#DC2626` / `#E11D48` (Hover: `#B91C1C`)
  - Chữ trên nút: Trắng `#FFFFFF`.

---

## 🔒 4. Quy Chuẩn Trust Badges & Cổng Thanh Toán (Payment Icons)

### A. Dòng Tiêu Đề "GUARANTEED SAFE & SECURE CHECKOUT"
- **Dark Mode:** Text `#E5E7EB` (Gray 200) + Icon Lock `#10B981` (Emerald 500).
- **Light Mode:** Text `#1E293B` (Slate 800) + Icon Lock `#059669` (Emerald 600).
- ❌ Cấm để text màu xanh nhờ nhờ / teal xỉn lẫn với nền.

### B. Logo Cổng Thanh Toán (Payment Badges)
Mỗi logo thanh toán phải có khung nền rõ ràng, đồng đều kích thước (`h-7 min-w-[46px] rounded-md px-2 flex items-center justify-center`):
1. **Visa:** Nền trắng `#FFFFFF`, Border `#E2E8F0`, Logo Navy `#1A1F71`.
2. **Mastercard:** Nền trắng `#FFFFFF`, 2 vòng tròn `#EB001B` & `#F79E1B`.
3. **PayPal:** Nền trắng `#FFFFFF`, chữ xanh kép `#003087` & `#0079C1`.
4. **Apple Pay:** 
   - Không dùng ký tự Unicode ``!
   - Sử dụng SVG Apple Logo chuẩn + chữ "Pay" (Dark mode: Nền `#FFFFFF` chữ `#000000` hoặc Nền `#000000` viền `#333333` chữ `#FFFFFF`).
5. **Google Pay (GPay):** Nền trắng `#FFFFFF`, Chữ "G" màu `#4285F4`, "Pay" màu `#5F6368`.
6. **American Express (AMEX):** Nền xanh dương `#006FCF`, Chữ trắng in hoa `#FFFFFF`.
7. **Discover (DISC):** Nền cam `#FF6000`, Chữ trắng in hoa `#FFFFFF`.

---

## 🎨 5. Bảng Mã Màu Chi Tiết (Hex & HSL Reference)

```css
/* ====================================================
   VELORA DESIGN TOKENS
   ==================================================== */
:root {
  /* Brand Accent */
  --brand-orange: #FF7700;
  --brand-orange-hover: #E66A00;
  --brand-orange-light: #FFF7ED;
  --brand-orange-border: #FDBA74;

  --brand-red: #DC2626;
  --brand-red-dark: #991B1B;
  --brand-red-light: #FEF2F2;

  --brand-green: #10B981;
  --brand-green-dark: #059669;

  /* Dark Theme Surfaces */
  --dark-bg-body: #0B0B0B;
  --dark-surface-card: #141414;
  --dark-surface-elevated: #1A1A1A;
  --dark-surface-subtle: #222222;
  --dark-border-primary: #262626;
  --dark-border-focus: #FF7700;
  --dark-text-primary: #FCF7FA;
  --dark-text-secondary: #9CA3AF;
  --dark-text-muted: #6B7280;

  /* Light Theme Surfaces */
  --light-bg-body: #F8FAFC;
  --light-surface-card: #FFFFFF;
  --light-surface-elevated: #F1F5F9;
  --light-surface-subtle: #E2E8F0;
  --light-border-primary: #E2E8F0;
  --light-border-focus: #EA580C;
  --light-text-primary: #0F172A;
  --light-text-secondary: #334155;
  --light-text-muted: #64748B;
}
```

---

## 🚫 6. Danh Sách Lỗi Nghiêm Trọng Cần Kiểm Tra Trước Khi Deploy

1. ❌ **Lỗi White-on-White hoặc Dark-on-Dark khi Hover:** Kiểm tra mọi state `hover:bg-...` xem màu chữ bên trong có bị chìm vào màu nền không.
2. ❌ **Lỗi Icon Font Unicode bị vỡ:** Kiểm tra trên hệ điều hành Windows để đảm bảo không có icon nào bị biến thành ô vuông `□`.
3. ❌ **Lỗi viền cứng thô ráp trong Light Mode:** Trong Light Mode, không dùng viền đen `border-black` hay xám đậm `border-gray-800`. Luôn dùng `border-slate-200` (`#E2E8F0`).
4. ❌ **Lỗi đè chữ trong Tag Khuyến Mãi:** Luôn chừa khoảng cách padding chuẩn `px-2 py-0.5` cho Sale Badge.
