# Student Manager — Next.js + Supabase

Wireframe asosida qilingan: guruhlar va talabalarni boshqarish uchun ilova.
Guruh kartochkalari (tumbler bilan tanlash), guruh nomi bo'yicha qidiruv,
talabalar jadvali (№, Fullname, Age, Email, Active checkbox, Actions —
delete/edit) — barchasi mavjud.

## 1. Supabase loyihasini sozlash

1. [supabase.com](https://supabase.com) da yangi loyiha oching.
2. **SQL Editor** ga o'tib, `supabase/schema.sql` faylidagi kodni to'liq
   nusxalab, ishga tushiring (`groups` va `students` jadvallarini,
   trigger va RLS policy'larni yaratadi, shuningdek 2 ta namuna guruh
   qo'shadi).
3. **Project Settings → API** bo'limidan quyidagilarni oling:
   - `Project URL`
   - `anon public` key

## 2. Loyihani ishga tushirish

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` faylini ochib, Supabase'dan olgan qiymatlarni qo'ying:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Keyin:

```bash
npm run dev
```

`http://localhost:3000` ni oching.

## Funksiyalar

- **Add group** — yangi guruh qo'shish.
- **Guruh kartasi / tumbler** — bosilganda o'sha guruh "tanlangan" bo'ladi
  (faqat bitta guruh bir vaqtda tanlangan bo'lishi mumkin — bu DB
  trigger orqali ta'minlangan) va pastdagi jadval shu guruh talabalarini
  ko'rsatadi.
- **Search by group name** — guruhlar ro'yxatini nom bo'yicha filtrlaydi.
- **Add student** — tanlangan guruhga (yoki tanlab) talaba qo'shadi.
- **Active checkbox** — har bir talaba qatorida, masalan davomat/holat
  belgisi sifatida ishlatish mumkin.
- **Edit / Delete** — qalam va savat ikonkalari orqali talabani
  tahrirlash yoki o'chirish.

## Eslatma — xavfsizlik

`supabase/schema.sql` ichidagi RLS policy'lar demo uchun **ochiq**
qilingan (har kim anon key bilan o'qiy/yoza oladi), chunki wireframe'da
login/auth ko'rsatilmagan. Buni real loyihada ishlatishdan oldin:

- Supabase Auth qo'shing,
- policy'larni `auth.uid()` asosida cheklang.

## Texnologiyalar

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase JS ·
lucide-react ikonkalar.

## Fayllar tuzilishi

```
app/
  layout.tsx        — shrift va global stillar
  page.tsx           — asosiy sahifa, data fetching va state
  globals.css
components/
  Header.tsx          — logo, qidiruv, add group/add student
  GroupsRail.tsx       — guruh kartalari qatori
  GroupCard.tsx
  StudentsTable.tsx    — talabalar jadvali
  AddGroupDialog.tsx
  StudentFormDialog.tsx — add/edit talaba uchun umumiy forma
  ConfirmDialog.tsx     — o'chirishni tasdiqlash
  Switch.tsx / Checkbox.tsx / Modal.tsx — kichik UI elementlar
lib/
  supabase/client.ts   — Supabase browser client
  types.ts             — TypeScript turlari
supabase/
  schema.sql           — jadvallar, trigger, RLS policy, namuna data
```
