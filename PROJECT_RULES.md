# Antigravity Project Architecture & Technology Rules

## Strict Technology Stack Directive
When developing and generating code for this E-commerce / POD project, the AI assistant MUST strictly adhere to the following approved technology stack. Do NOT suggest, introduce, or use alternative frameworks, libraries, or database systems unless explicitly requested by the user.

---

### 🛠️ Approved Tech Stack Specification

| Category | Technology | Usage Rule & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (React - App Router)** | Must use for client & server rendering (SSR/SSG/ISR), SEO optimization, and image optimization (`next/image`). |
| **Styling & UI Kit** | **Tailwind CSS + Shadcn UI** | All UI components and layout styling must strictly use Tailwind utility classes and Shadcn UI primitives. |
| **Animation & Motion** | **Framer Motion** | Use for UI animations (Cart Side Drawer slide, Variant Selector Pop-up, smooth hover effects). |
| **State Management** | **Zustand** | Use for lightweight client-side state management (Shopping Cart, Wishlist, User UI session). |
| **Data Fetching** | **TanStack Query (React Query)** | All API communications between Next.js FE and Node.js BE must use TanStack Query for caching & revalidation. |
| **Backend Framework** | **Node.js (Express / NestJS)** | Must use Node.js for RESTful API services, authentication, order processing, and payment integration. |
| **Database ORM** | **Prisma ORM** | All PostgreSQL database interactions MUST be handled via Prisma ORM schema (`schema.prisma`) & Prisma Client. |
| **Database (CSDL)** | **PostgreSQL** | Primary relational database for Products, Variants, Categories, Orders, Users, and Coupons. |

---

## 🚫 Restricted / Forbidden Technologies
Unless explicitly allowed by the user, DO NOT use:
- Pure Vanilla JS custom routers or jQuery.
- Redux, MobX, or Context API for complex cart state (Use Zustand instead).
- Bootstrap, Material-UI (MUI), or Chakra UI (Use Tailwind CSS + Shadcn UI instead).
- Raw SQL queries or other ORMs like TypeORM / Sequelize (Use Prisma ORM instead).
- MongoDB or MySQL (Use PostgreSQL instead).

---

## 📋 Coding Best Practices & Directives
1. **TypeScript First:** Write 100% strongly typed TypeScript for both Next.js Frontend and Node.js Backend.
2. **Component Structure:** Keep React components modular, reusable, and placed inside `components/ui/` or `components/features/`.
3. **Database Security:** Ensure all PostgreSQL database migrations are managed via `npx prisma migrate`.
4. **Server vs Client Components:** Keep Server Components (RSC) by default; only use `'use client'` where interactivity, state (Zustand), or Framer Motion is required.
5. **🎨 Color System & Dark/Light Mode Strict Standard:**
   - AI MUST strictly adhere to `COLOR_SYSTEM.md` for all color palettes, contrast ratios, and badges.
   - **No broken Unicode symbols:** Always use inline SVG vector for payment/brand logos (e.g. Apple Pay SVG, never use raw `` which causes `□` on Windows).
   - **Sale Badges:** Modern athletic red `bg-red-600` with clean `text-white font-extrabold` (NEVER use dark maroon with yellow text).
   - **Wishlist Buttons:** Use clean translucent glassmorphism `bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/10`.
   - **Text Contrast:** Ensure 4.5:1 WCAG contrast in both Light (`#0F172A` text on `#FFF`/`#F8FAFC`) and Dark (`#FCF7FA` text on `#0B0B0B`/`#141414`).
6. **🌐 Strict Language Directive (100% English Only):**
   - The customer storefront is strictly for international English-speaking audiences.
   - Every single component, page, button, modal, alert, toast, placeholder, and form label MUST be created in **100% English**.
   - Absolutely **NO Vietnamese** characters or words are allowed in the storefront codebase. Build it right the first time; do not write Vietnamese and fix it later. Refer to [LANGUAGE_GUIDELINES.md](file:///D:/WebUs/LANGUAGE_GUIDELINES.md).
7. **🛡️ Client-Side Security & Data Privacy:**
   - NEVER store customer PII, addresses, or order history in `localStorage` or `sessionStorage`.
   - Never expose backend secrets via `NEXT_PUBLIC_` prefixes.
   - Never trust client-side prices during checkout; backend calculates all totals. Refer to [SECURITY_GUIDELINES.md](file:///D:/WebUs/SECURITY_GUIDELINES.md).

---

## 🤖 Bộ Prompt Tối Ưu Cho AI (Optimal AI Master Prompts)

Dưới đây là các prompt mẫu chuẩn hóa để phát triển dự án Velora Store tối ưu nhất:

### 1. 🎯 Master System Prompt (Ngữ cảnh mặc định cho AI)
```markdown
Bạn là một Senior Fullstack Developer chuyên về Next.js (App Router), TypeScript và E-Commerce POD.
Nhiệm vụ của bạn là phát triển dự án "Velora Store" (sales-website-fe) tuân thủ 100% các quy tắc trong PROJECT_RULES.md & COLOR_SYSTEM.md:
- Frontend: Next.js 13+ (App Router), TypeScript 100% strict type.
- Styling: Tailwind CSS + Shadcn UI primitives + Lucide Icons + COLOR_SYSTEM.md (Chuẩn màu 2 chế độ Light & Dark).
- Client State: Zustand (`store/useCartStore.ts`, `store/useUIStore.ts`). Không dùng Redux/Context cho Cart.
- Data Fetching: TanStack Query (React Query v5) + Custom hooks.
- Animation: Framer Motion cho Cart Side Drawer, Modals, Sliders.
- Backend Target: Node.js (Express/NestJS) + PostgreSQL + Prisma ORM.
- Tách biệt Server Component (RSC) và Client Component ('use client') hợp lý.
- Luôn kiểm tra type-safe, không dùng `any`, tối ưu SEO & Performance (CLS=0, LCP tối ưu với next/image).
```

### 2. ⚡ Prompt Phát Triển Tính Năng Mới
```markdown
[TÍNH NĂNG]: <Mô tả tính năng>
1. Tạo component tại vị trí thư mục chuẩn (`components/features/` hoặc `components/ui/`).
2. Tương tác State: Dùng Zustand stores trong `store/`.
3. Type-Safety: Định nghĩa đầy đủ interface/type trong `types/`. Không dùng `any`.
4. Responsive & Colors: Tailwind CSS chuẩn Light/Dark mode theo COLOR_SYSTEM.md cho tất cả breakpoints (sm, md, lg, xl).
```

### 3. 🔄 Prompt Kết Nối API & TanStack Query
```markdown
[API / DỮ LIỆU]: <Mô tả kết nối API>
1. Định nghĩa Type cho Request Payload và Response Data trong `types/`.
2. Viết custom hook TanStack Query v5 (`useQuery`/`useMutation`) trong `lib/hooks/`.
3. Xử lý đủ 3 trạng thái: Loading (Skeleton), Error (Toast/Alert), Data.
```

### 4. 🛠️ Prompt Sửa Lỗi & Refactor (Fix Bug)
```markdown
[SỬA LỖI]: <Mô tả hoặc dán log lỗi>
1. Phân tích nguyên nhân gốc rễ (Root Cause), đặc biệt chú ý Hydration Mismatch giữa SSR và Zustand localStorage, kiểm tra hiển thị cả 2 chế độ Dark & Light.
2. Sửa lỗi triệt để, đảm bảo type-safe và không làm vỡ kiến trúc dự án.
```
