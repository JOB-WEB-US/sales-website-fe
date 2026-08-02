# 🛍️ Velora Store - E-Commerce POD Platform Frontend

Trang web thương mại điện tử chuyên về thời trang Print-On-Demand (Áo thun Graphic Tees, Hoodies, Quà tặng cá nhân hóa)

---

## 🛠️ Bộ Công Nghệ Sử Dụng (Tech Stack)

Dự án được xây dựng hoàn toàn theo bộ quy tắc công nghệ **Frontend hiện đại & tối ưu SEO**:

| Công nghệ                        | Vai trò & Mục đích                                                                                        |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Next.js (App Router)**         | Framework React hỗ trợ Server-Side Rendering (SSR/SSG), chuẩn SEO Google, tự động nén & nạp ảnh siêu tốc. |
| **TypeScript**                   | Ngôn ngữ gõ tĩnh giúp mã nguồn an toàn, dễ bảo trì và hạn chế lỗi runtime.                                |
| **Tailwind CSS + Shadcn UI**     | Hệ thống CSS utility & UI components hiện đại, nhất quán, dễ tùy biến giao diện.                          |
| **Framer Motion**                | Thư viện làm hiệu ứng trượt giỏ hàng (Cart Drawer), hiệu ứng Banner Slider & Pop-up mượt mà.              |
| **Zustand**                      | Quản lý Client State giỏ hàng (Cart State) và trạng thái giao diện UI nhẹ, không bị giật lag.             |
| **TanStack Query (React Query)** | Quản lý gọi API từ Backend, tự động caching & làm mới dữ liệu thông minh.                                 |

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
sales-website-fe/
├── app/                        # 🚀 Next.js App Router (Trang & Định tuyến)
│   ├── (shop)/                 # Group Route các trang bán hàng chính
│   │   ├── page.tsx            # 🏠 Trang chủ (Homepage)
│   │   ├── shop/page.tsx       # 🛍️ Trang Shop All & Bộ lọc sản phẩm
│   │   └── products/[slug]/    # 👕 Trang Chi tiết sản phẩm & chọn Variant
│   │       └── page.tsx
│   ├── layout.tsx              # Root Layout (Font Plus Jakarta Sans/Inter, Providers)
│   └── globals.css             # Tailwind CSS & Biến Design System
│
├── components/                 # 🎨 Các Component Giao Diện
│   ├── ui/                     # UI components cơ bản (Button, Dialog, Drawer, Badge)
│   ├── common/                 # Component dùng chung toàn ứng dụng
│   │   ├── header.tsx          # Header 2 tầng + Top Announcement Marquee Bar
│   │   └── footer.tsx          # Footer & Form đăng ký Newsletter
│   ├── features/               # Components phân theo chức năng thương mại điện tử
│   │   ├── home/               # Components riêng cho Trang chủ
│   │   │   ├── hero-slider.tsx # Banner Slider (Framer Motion)
│   │   │   ├── halloween-showcase.tsx # Section cuộn ngang HALLOWEEN TIME
│   │   │   └── trending-tabs.tsx      # Section lọc các Tab chủ đề HOT
│   │   ├── products/           # Components sản phẩm
│   │   │   ├── product-card.tsx    # Thẻ sản phẩm (Hover đổi mặt ảnh, Badge SALE)
│   │   │   └── variant-selector-modal.tsx # Pop-up chọn Size/Màu/Kiểu áo
│   │   └── cart/               # Components giỏ hàng
│   │       └── cart-drawer.tsx # Giỏ hàng trượt bên phải (Drawer + Framer Motion)
│   └── providers/              # React Context Providers
│       └── query-provider.tsx  # TanStack Query Provider
│
├── store/                      # 🧠 Zustand Stores (Client State Management)
│   ├── useCartStore.ts         # Quản lý Giỏ hàng (Thêm, Xóa, Đổi số lượng, Tính tiền)
│   └── useUIStore.ts           # Điều khiển Ẩn/Hiện Cart Drawer & Pop-up chọn Variant
│
├── types/                      # 📐 TypeScript Interfaces & Types
│   ├── product.ts              # Type cho Product, ProductVariant, Category
│   └── cart.ts                 # Type cho CartItem
│
├── lib/                        # 🧰 Utilities & Helper Functions
│   ├── mock-data.ts            # Dữ liệu sản phẩm mẫu POD chuẩn hóa
│   ├── formatters.ts           # Định dạng tiền tệ ($ USD)
│   └── utils.ts                # Hàm `cn()` hợp nhất Tailwind class
│
├── public/                     # 🖼️ Static Assets (Ảnh tĩnh, Icons, Banner)
│   ├── images/
│   └── mockup_data/
│
├── PROJECT_RULES.md            # Quy tắc Tech Stack cố định cho AI Assistant
├── .geminirules                # System Prompt Rules cho AI
├── tailwind.config.ts          # Cấu hình hệ màu & typography Tailwind
├── tsconfig.json               # Cấu hình TypeScript
└── package.json                # Danh sách thư viện dependencies
```

---

## 🌟 Các Tính Năng Nổi Bật (Key Features)

1. **Header 2 Tầng & Announcement Marquee Bar:** Thanh chạy chữ thông báo khuyến mãi, Logo, Search Bar, Icon Wishlist, Account & Badge Giỏ hàng.
2. **Hero Banner Slider:** Chuyển đổi Banner mượt mà với Framer Motion.
3. **Section Halloween Time:** Thanh cuộn ngang bằng nút điều hướng xem sản phẩm sự kiện.
4. **Section Trending Now Tabs:** Lọc danh sách sản phẩm động theo từng chủ đề HOT (_Ella Langley, Car & Truck, Halloween, Horror, Morgan Wallen, Vintage_).
5. **Product Card Đỉnh Cao:** Ảnh có hiệu ứng Hover đổi mặt trước/sau, hiển thị khoảng giá (`$19.99 - $53.99`), số sao đánh giá & nút chọn mua nhanh.
6. **Pop-up Modal Chọn Biến Thể (Variant Selector):** Cho phép người dùng chọn **Kiểu áo** (T-Shirt, Hoodie, Sweatshirt), **Màu sắc** (Black, Navy, White, Dark Heather) và **Size** (S đến 3XL) trước khi thêm vào giỏ.
7. **Cart Side Drawer:** Giỏ hàng trượt mượt bên phải màn hình không reload trang, hiển thị tổng tiền và nút checkout tức thì.

---

## 🚀 Hướng Dẫn Chạy Dự Án (Getting Started)

### 1. Cài đặt các gói phụ thuộc (Dependencies)

```bash
npm install
```

### 2. Chạy môi trường phát triển (Development Mode)

```bash
npm run dev
```

Mở trình duyệt tại địa chỉ: **[http://localhost:3000](http://localhost:3000)**

### 3. Biên dịch phiên bản sản xuất (Production Build)

```bash
npm run build
npm start
```
