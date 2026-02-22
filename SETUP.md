# Commerce Web - Setup & Fix Guide

## ⚠️ FIRST: Install Missing Dependencies

### Backend (REQUIRED - fixes the helmet crash)
Open a terminal, navigate to the backend folder, and run:

```bash
cd backend
npm install
```

This installs all packages listed in package.json including `helmet` and `express-rate-limit`.

### Frontend
```bash
cd frontend
npm install
```

---

## 🚀 Running the App

### Start Backend (Terminal 1):
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:9000

### Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## ✅ All Bugs Fixed

### Backend Fixes
1. **`orderRoutes.js`** - GET `/:id` never sent a response when order was found (request hung forever)
2. **`orderRoutes.js`** - Stale unused import `{ create }` from Checkout model removed
3. **`adminOrderRoutes.js`** - `order.findById()` (undefined variable) → `Order.findById()` — would crash on delete
4. **`productRoutes.js`** - Stale import `{ collection }` from User model removed
5. **`productRoutes.js`** - `req.status(400)` typo → `res.status(404)` in PUT route
6. **`productRoutes.js`** - `res.status(500)` without `.json()` hung requests on error
7. **`productRoutes.js`** - Typo "product not fiund" → "product not found"
8. **`authMiddleware.js`** - Three typos: `messege` → `message`, "no token provied" → "no token provided"
9. **`productAdminRoutes.js`** - Missing PUT, DELETE, POST routes (admin couldn't edit/delete/create products!)
10. **`Order.js`** model - Registered as `"order"` (lowercase) → `"Order"` (consistent capitalization)
11. **`subscriberRoute.js`** - Typo "eamil is required" → "email is required"

### Frontend Fixes (from previous session)
1. **`OrderManagement.jsx`** - Wrong Redux selector `state.auth.user` → `state.auth` (crash)
2. **`adminProductSlice.js`** - Stale auth token captured at module load time → `getToken()` function; wrong delete endpoint `/api/products/` → `/api/admin/products/`
3. **`adminOrderSlice.js`** - Stale token + missing `await` on delete
4. All Redux `.rejected` handlers - `action.payload.message` without null check → optional chaining
5. **`FilterSideBar.jsx`** - Color buttons used wrong event handler signature
6. **`FilterSideBar.jsx`** - Missing space in className `text-gray-800mb-4`
7. **`App.jsx`** - `v7_relationSplatPath` typo → `v7_relativeSplatPath`
8. **`CartDrawer.jsx`** - `user._id` → nested structure fallback
9. **`ProductDetails.jsx`** - `md:w1/2` → `md:w-1/2`
10. **`Profile.jsx`** - `md:w2/3 lg:3/4` → `md:w-2/3 lg:w-3/4`
11. **`Header.jsx`** - `border-b-1` → `border-b`
12. **`Register.jsx`** - Wrong page text, wrong link text, layout typo
13. **`UserManagement.jsx`** - Title typo + unsafe role check
14. **`Hero.jsx`** - Shop Now linked to `#` → `/collections/all`
15. **`NewArrivals.jsx`** - `$product.price` → `formattedRupee(product.price)`
16. **`Topbar.jsx`** - "Realiable Shoping" → "Reliable Shipping"
17. **`Footer.jsx`** - Newsletter form had no submit handler
18. **`AdminHomePage.jsx`** - `order.user.name` null crash + status display fix
19. **`CollectionPage.jsx`** - Unstable `useEffect` dependency on searchParams object
20. **`EditProductPage.jsx`** - Missing `originalPrice` field
