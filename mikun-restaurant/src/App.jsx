import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag, Search, User, Menu, X, Star, MapPin, Phone, Plus, Minus,
  Trash2, Package, TrendingUp, LogOut, Edit2, CheckCircle2, Clock,
  Bike, ChevronRight, ChevronLeft, LayoutGrid, ClipboardList, BarChart3,
  Flame, Mail, Lock, ArrowRight, AlertTriangle, PackageCheck,
  Eye, EyeOff, Home, MessageCircle, UtensilsCrossed, Sun, Moon
} from "lucide-react";

/* ---------------------------------------------------------------------
   MIKUN GOOD FOOD GOOD VIBE — functional front-end prototype
   Landing page + customer menu/ordering/account + admin dashboard.
   Data persists via window.storage (acts as the "database" for this demo).
--------------------------------------------------------------------- */

const CATEGORIES = [
  { id: "specials", name: "Today's Specials", icon: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "swallow", name: "Swallow & Soups", icon: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "rice", name: "Rice Dishes", icon: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "grill", name: "Grills & Proteins", icon: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "sides", name: "Sides & Small Chops", icon: "https://images.unsplash.com/photo-1628294895520-22c608f7f259?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "drinks", name: "Drinks & Smoothies", icon: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "desserts", name: "Desserts", icon: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=150&h=150&q=80" },
];

const SEED_MENU = [
  { id: "m1", name: "Mikun Signature Jollof Rice", category: "rice", price: 3500, unit: "1 plate", stock: 40, tag: "Best seller", spicy: 1, desc: "Smoky party-style jollof rice, Mikun's house recipe, served with fried plantain.", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=500&q=80" },
  { id: "m2", name: "Fried Rice & Grilled Chicken", category: "rice", price: 4200, unit: "1 plate", stock: 30, tag: "", spicy: 0, desc: "Vegetable fried rice paired with a quarter grilled chicken.", image: "https://images.unsplash.com/photo-1603133872878-6967b68270c6?auto=format&fit=crop&w=500&q=80" },
  { id: "m3", name: "Pounded Yam & Egusi Soup", category: "swallow", price: 3800, unit: "1 portion", stock: 25, tag: "", spicy: 1, desc: "Smooth pounded yam with rich egusi soup loaded with assorted meat.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80" },
  { id: "m4", name: "Amala & Ewedu with Gbegiri", category: "swallow", price: 3200, unit: "1 portion", stock: 20, tag: "Good Vibe pick", spicy: 1, desc: "Classic Ekiti-style amala combo with ewedu and gbegiri soup.", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=500&q=80" },
  { id: "m5", name: "Semo & Ogbono Soup", category: "swallow", price: 3200, unit: "1 portion", stock: 22, tag: "", spicy: 1, desc: "Smooth semovita with draw-rich ogbono soup and assorted meat.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80" },
  { id: "m6", name: "Grilled Turkey (Full)", category: "grill", price: 7500, unit: "full", stock: 15, tag: "", spicy: 1, desc: "Well-seasoned grilled turkey, chargrilled to order.", image: "https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?auto=format&fit=crop&w=500&q=80" },
  { id: "m7", name: "Suya Platter", category: "grill", price: 4500, unit: "platter", stock: 18, tag: "Popular", spicy: 2, desc: "Spicy skewered beef suya with onions and yaji spice.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80" },
  { id: "m8", name: "Peppered Gizzard", category: "grill", price: 3800, unit: "bowl", stock: 20, tag: "", spicy: 2, desc: "Diced gizzard tossed in Mikun's signature pepper sauce.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80" },
  { id: "m9", name: "Small Chops Combo", category: "sides", price: 5000, unit: "tray", stock: 16, tag: "", spicy: 0, desc: "Spring rolls, puff-puff, samosa and chicken lollipop assortment.", image: "https://images.unsplash.com/photo-1608270176050-12ecd0dad35a?auto=format&fit=crop&w=500&q=80" },
  { id: "m10", name: "Moi Moi (Special)", category: "sides", price: 1500, unit: "wrap", stock: 30, tag: "", spicy: 0, desc: "Steamed bean pudding with egg and fish.", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80" },
  { id: "m11", name: "Plantain (Dodo) Extra", category: "sides", price: 1200, unit: "portion", stock: 40, tag: "", spicy: 0, desc: "Sweet fried ripe plantain, made fresh to order.", image: "https://images.unsplash.com/photo-1628294895520-22c608f7f259?auto=format&fit=crop&w=500&q=80" },
  { id: "m12", name: "Chapman (Large)", category: "drinks", price: 2200, unit: "large glass", stock: 30, tag: "House favourite", spicy: 0, desc: "Mikun's house Chapman, fruity and refreshing.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80" },
  { id: "m13", name: "Fresh Watermelon Smoothie", category: "drinks", price: 2000, unit: "500ml", stock: 25, tag: "", spicy: 0, desc: "Blended fresh watermelon, chilled and lightly sweetened.", image: "https://images.unsplash.com/photo-1570942872619-0c3be40f6d58?auto=format&fit=crop&w=500&q=80" },
  { id: "m14", name: "Zobo (Chilled)", category: "drinks", price: 1000, unit: "500ml", stock: 35, tag: "", spicy: 0, desc: "House zobo drink infused with ginger and pineapple.", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=500&q=80" },
  { id: "m15", name: "Puff Puff Ice Cream Bowl", category: "desserts", price: 2500, unit: "bowl", stock: 12, tag: "", spicy: 0, desc: "Warm puff puff bites served with vanilla ice cream.", image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=500&q=80" },
  { id: "m16", name: "Chef's Special Combo Plate", category: "specials", price: 6000, unit: "1 plate", stock: 10, tag: "Limited", spicy: 1, desc: "Jollof rice, grilled chicken, moi moi and dodo — today's featured combo.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80" },
];

const REVIEWS = [
  { name: "Tolu A.", rating: 5, text: "Serene spot in the heart of Ekiti with genuinely tasty food — I keep coming back for the jollof rice and the grilled chicken combo.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&h=120&q=80" },
  { name: "Bisi O.", rating: 5, text: "Cheap and affordable for the portion sizes, and the vibe inside is relaxed. My go-to for amala whenever I'm in Ado-Ekiti.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
  { name: "Kunle E.", rating: 4, text: "Good food, good vibe, exactly as the name says. Suya platter is worth the wait and the staff are always friendly.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
];

const money = (n) => "₦" + Number(n).toLocaleString("en-NG");
const uid = () => Math.random().toString(36).slice(2, 10);
const WHATSAPP_NUMBER = "2348000000000";

async function loadShared(key, fallback) {
  try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
}
async function saveShared(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), true); } catch {}
}
async function loadPersonal(key, fallback) {
  try { const r = await window.storage.get(key, false); return r ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
}
async function savePersonal(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), false); } catch {}
}

export default function MikunRestaurant() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("home");
  const [adminView, setAdminView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const activeCssVars = useMemo(() => {
    if (theme === "light") {
      return {
        "--paper": "#F9FAF6",
        "--panel": "#FFFFFF",
        "--surface": "#F2F4ED",
        "--line": "#E2E5DC",
        "--line-soft": "#ECEFE6",
        "--ink": "#12140F",
        "--ink-soft": "#5C6053",
        "--green": "#72A328",
        "--green-deep": "#5A821E",
        "--jollof": "#E2792A",
        "--jollof-deep": "#5A821E",
        "--on-accent": "#FFFFFF",
        "--charcoal": "#ECEFE6",
        "--ember": "#5A821E",
        "--gold": "#72A328",
        "--cream": "#F9FAF6",
        "--text-secondary": "#5C6053",
        "--border": "#E2E5DC",
        "--font-display": "'Fraunces', serif",
        "--font-body": "'Work Sans', sans-serif",
        "--font-mono": "'IBM Plex Mono', monospace",
      };
    } else {
      return {
        "--paper": "#000000",
        "--panel": "#1B1D16",
        "--surface": "#1F2218",
        "--line": "#33362B",
        "--line-soft": "#3A3D32",
        "--ink": "#F3F1E7",
        "--ink-soft": "#A6A996",
        "--green": "#8BC53F",
        "--green-deep": "#6FA22E",
        "--jollof": "#E2792A",
        "--jollof-deep": "#F0934A",
        "--on-accent": "#12140F",
        "--charcoal": "#1B1D16",
        "--ember": "#E2792A",
        "--gold": "#F0934A",
        "--cream": "#000000",
        "--text-secondary": "#A6A996",
        "--border": "#33362B",
        "--font-display": "'Fraunces', serif",
        "--font-body": "'Work Sans', sans-serif",
        "--font-mono": "'IBM Plex Mono', monospace",
      };
    }
  }, [theme]);

  const [menu, setMenu] = useState(SEED_MENU);
  const [orders, setOrders] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [cartPop, setCartPop] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    (async () => {
      const m = await loadShared("mikun-menu", null);
      if (m && Array.isArray(m) && m.length) {
        const migrated = m.map((item) => {
          const seed = SEED_MENU.find((s) => s.id === item.id || s.name === item.name);
          return { ...item, image: item.image || seed?.image || "" };
        });
        setMenu(migrated);
        await saveShared("mikun-menu", migrated);
      } else {
        await saveShared("mikun-menu", SEED_MENU);
      }
      const o = await loadShared("mikun-orders", []);
      setOrders(o);
      const savedUser = await loadPersonal("mikun-current-user", null);
      if (savedUser) {
        setCurrentUser(savedUser);
        const c = await loadPersonal("mikun-cart-" + savedUser.email, []);
        setCart(c);
      }
      setReady(true);
    })();
  }, []);

  function flash(msg) { setToast(msg); setTimeout(() => setToast(null), 2200); }
  async function persistMenu(next) { setMenu(next); await saveShared("mikun-menu", next); }
  async function persistOrders(next) { setOrders(next); await saveShared("mikun-orders", next); }
  async function persistCart(next) { setCart(next); if (currentUser) await savePersonal("mikun-cart-" + currentUser.email, next); }

  function addToCart(item, qty = 1) {
    const existing = cart.find((c) => c.id === item.id);
    const next = existing
      ? cart.map((c) => c.id === item.id ? { ...c, qty: c.qty + qty } : c)
      : [...cart, { id: item.id, name: item.name, price: item.price, unit: item.unit, qty, image: item.image }];
    persistCart(next);
    flash(`${item.name} added to your order`);
    setCartPop(true);
    setTimeout(() => setCartPop(false), 400);
  }
  function updateQty(id, qty) {
    if (qty <= 0) { persistCart(cart.filter((c) => c.id !== id)); return; }
    persistCart(cart.map((c) => c.id === id ? { ...c, qty } : c));
  }
  function removeFromCart(id) { persistCart(cart.filter((c) => c.id !== id)); }
  const cartTotal = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  async function register({ name, email, password, phone, address }) {
    setAuthError("");
    const existing = await loadPersonal("mikun-user-" + email, null);
    if (existing) { setAuthError("An account with this email already exists. Try logging in."); return; }
    const user = { name, email, password, phone, address, joined: new Date().toISOString() };
    await savePersonal("mikun-user-" + email, user);
    await savePersonal("mikun-current-user", user);
    setCurrentUser(user); setCart([]); setView("account");
    flash("Welcome to Mikun, " + name.split(" ")[0] + "!");
  }
  async function login({ email, password }) {
    setAuthError("");
    if (email === "admin@mikun.com" && password === "admin123") {
      setAdminMode(true); setView("admin"); flash("Welcome back, Admin"); return;
    }
    const user = await loadPersonal("mikun-user-" + email, null);
    if (!user || user.password !== password) { setAuthError("Incorrect email or password."); return; }
    await savePersonal("mikun-current-user", user);
    setCurrentUser(user);
    const c = await loadPersonal("mikun-cart-" + user.email, []);
    setCart(c); setView("account");
    flash("Welcome back, " + user.name.split(" ")[0] + "!");
  }
  async function logout() {
    setCurrentUser(null); setAdminMode(false); setCart([]);
    await savePersonal("mikun-current-user", null);
    setView("home");
  }

  async function placeOrder(details) {
    if (!currentUser) { setView("login"); return; }
    const order = {
      id: "MIKUN-" + uid().toUpperCase(),
      customerEmail: currentUser.email,
      customerName: currentUser.name,
      items: cart,
      total: cartTotal,
      status: "Pending",
      fulfilment: details.fulfilment,
      payment: details.payment,
      address: details.address,
      phone: details.phone,
      placedAt: new Date().toISOString(),
    };
    const nextOrders = [order, ...orders];
    await persistOrders(nextOrders);
    await persistCart([]);
    setLastOrder(order);
    setView("order-success");
  }

  function whatsappOrderLink(order) {
    const lines = order.items.map((i) => `${i.qty}x ${i.name} — ${money(i.price * i.qty)}`).join("%0A");
    const msg = `Hi Mikun! I'd like to place an order (${order.id}):%0A${lines}%0A%0ATotal: ${money(order.total)}%0AFulfilment: ${order.fulfilment}%0AName: ${order.customerName}%0APhone: ${order.phone}%0AAddress: ${order.address || "N/A"}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }

  async function updateOrderStatus(orderId, status) {
    await persistOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
  }
  async function saveMenuItem(item) {
    const next = item.id
      ? menu.map((m) => m.id === item.id ? item : m)
      : [{ ...item, id: "m" + uid() }, ...menu];
    await persistMenu(next);
  }
  async function deleteMenuItem(id) { await persistMenu(menu.filter((m) => m.id !== id)); }

  const myOrders = useMemo(() => currentUser ? orders.filter((o) => o.customerEmail === currentUser.email) : [], [orders, currentUser]);
  const filteredMenu = useMemo(() => menu.filter((m) => {
    const catOk = activeCategory === "all" || m.category === activeCategory;
    const qOk = !query || m.name.toLowerCase().includes(query.toLowerCase());
    return catOk && qOk;
  }), [menu, activeCategory, query]);

  if (!ready) return <div style={{ padding: 60, textAlign: "center", color: "#E2542B" }}>Loading Mikun Good Food Good Vibe…</div>;

  return (
    <div style={{ ...styles.app, ...activeCssVars }}>
      <GlobalStyle />
      {toast && <div className="mk-toast" style={styles.toast}>{toast}</div>}

      {view !== "admin" && (
        <Nav view={view} setView={setView} menuOpen={menuOpen} setMenuOpen={setMenuOpen}
          cartCount={cartCount} currentUser={currentUser} query={query} setQuery={setQuery} cartPop={cartPop}
          setActiveCategory={setActiveCategory} theme={theme} setTheme={setTheme} />
      )}

      <main key={view} className="mk-view-enter">
        {view === "home" && (
          <HomePage setView={setView} setActiveCategory={setActiveCategory} menu={menu}
            addToCart={addToCart} setSelectedItem={setSelectedItem} />
        )}
        {view === "shop" && (
          <MenuPage items={filteredMenu} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            addToCart={addToCart} setSelectedItem={setSelectedItem} setView={setView} query={query} setQuery={setQuery} />
        )}
        {view === "product" && selectedItem && (
          <ItemPage item={selectedItem} addToCart={addToCart} setView={setView} />
        )}
        {view === "cart" && (
          <CartPage cart={cart} updateQty={updateQty} removeFromCart={removeFromCart}
            cartTotal={cartTotal} setView={setView} currentUser={currentUser} />
        )}
        {view === "checkout" && (
          <CheckoutPage cart={cart} cartTotal={cartTotal} currentUser={currentUser} placeOrder={placeOrder} setView={setView} />
        )}
        {view === "order-success" && lastOrder && (
          <OrderSuccessPage order={lastOrder} setView={setView} whatsappOrderLink={whatsappOrderLink} />
        )}
        {view === "login" && <AuthPage mode="login" onSubmit={login} error={authError} setView={setView} showPw={showPw} setShowPw={setShowPw} />}
        {view === "register" && <AuthPage mode="register" onSubmit={register} error={authError} setView={setView} showPw={showPw} setShowPw={setShowPw} />}
        {view === "account" && currentUser && (
          <AccountPage user={currentUser} myOrders={myOrders} logout={logout} setView={setView} whatsappOrderLink={whatsappOrderLink} />
        )}
        {view === "admin" && adminMode && (
          <AdminDashboard adminView={adminView} setAdminView={setAdminView}
            menu={menu} orders={orders} saveMenuItem={saveMenuItem} deleteMenuItem={deleteMenuItem}
            updateOrderStatus={updateOrderStatus} logout={logout} setView={setView} />
        )}
        {view === "admin" && !adminMode && (
          <AuthPage mode="login" onSubmit={login} error={authError} setView={setView} showPw={showPw} setShowPw={setShowPw} adminHint />
        )}
      </main>

      {view !== "admin" && <Footer setView={setView} />}
    </div>
  );
}

/* ============================== NAV ============================== */
function Nav({ view, setView, menuOpen, setMenuOpen, cartCount, currentUser, query, setQuery, cartPop, setActiveCategory, theme, setTheme }) {
  return (
    <header style={styles.header}>
      <div style={styles.headerTop}>
        <div className="mk-header-top-inner" style={styles.headerTopInner}>
          <span><MapPin size={13} style={{ marginRight: 4, verticalAlign: -2 }} />Ado-Ekiti, Ekiti State</span>
          <span><Phone size={13} style={{ marginRight: 4, verticalAlign: -2 }} />0800-MIKUN-EAT</span>
        </div>
      </div>
      <div style={styles.headerMain}>
        <div className="mk-header-main-inner" style={styles.headerMainInner}>
          <div style={styles.logoContainer} onClick={() => setView("home")}>
            <span style={styles.logoMark}>MIKUN</span>
            <span style={styles.logoWord}>GOOD FOOD · GOOD VIBE</span>
          </div>
          <div className="mk-search-wrap" style={styles.searchWrap}>
            <Search size={17} color="#8A7C6E" />
            <input placeholder="Search jollof, suya, amala…" value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setView("shop"); }}
              style={styles.searchInput} />
            <button style={styles.searchBtn} onClick={() => setView("shop")}>Search</button>
          </div>
          <div className="mk-header-actions" style={styles.headerActions}>
            <button className="mk-icon-link mk-theme-toggle" style={styles.iconLink} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === "dark" ? "Light View" : "Dark View"}</span>
            </button>
            <button className="mk-icon-link mk-user-link" style={styles.iconLink} onClick={() => setView(currentUser ? "account" : "login")}>
              <User size={20} /><span>{currentUser ? currentUser.name.split(" ")[0] : "Account"}</span>
            </button>
            <button className="mk-icon-link mk-cart-link" style={styles.cartLink} onClick={() => setView("cart")}>
              <ShoppingBag size={20} /><span>Order</span>
              {cartCount > 0 && <span className={cartPop ? "mk-badge-pop" : ""} style={styles.cartBadge}>{cartCount}</span>}
            </button>
            <button className="mk-menu-toggle" style={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </div>
      <div style={styles.subNav}>
        <div className="mk-subnav-inner" style={styles.subNavInner}>
          <button className="mk-nav-link" style={styles.subNavLink} onClick={() => setView("home")}>Home</button>
          <button className="mk-nav-link" style={styles.subNavLink} onClick={() => { setActiveCategory("all"); setView("shop"); }}>Full Menu</button>
          {CATEGORIES.slice(0, 5).map((c) => (
            <button key={c.id} className="mk-nav-link" style={styles.subNavLink} onClick={() => { setActiveCategory(c.id); setView("shop"); }}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="mk-mobile-drawer" style={styles.mobileDrawer}>
          <div style={styles.mobileDrawerBackdrop} onClick={() => setMenuOpen(false)} />
          <div style={styles.mobileDrawerContent}>
            <div style={styles.mobileDrawerHeader}>
              <span style={styles.logoMark}>MIKUN</span>
              <button style={styles.menuCloseBtn} onClick={() => setMenuOpen(false)}><X size={24} /></button>
            </div>
            
            {/* Mobile Search */}
            <div style={styles.mobileSearchWrap}>
              <Search size={18} color="#8A7C6E" />
              <input placeholder="Search jollof, suya, amala…" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setView("shop"); setMenuOpen(false); } }}
                style={styles.mobileSearchInput} />
              <button style={styles.mobileSearchBtn} onClick={() => { setView("shop"); setMenuOpen(false); }}>Search</button>
            </div>

            <nav style={styles.mobileNavLinks}>
              <button style={styles.mobileNavLink} onClick={() => { setView("home"); setMenuOpen(false); }}>Home</button>
              <button style={styles.mobileNavLink} onClick={() => { setActiveCategory("all"); setView("shop"); setMenuOpen(false); }}>Full Menu</button>
              <button style={styles.mobileNavLink} onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setMenuOpen(false); }}>
                {theme === "dark" ? <Sun size={16} style={{ marginRight: 8, verticalAlign: -2 }} /> : <Moon size={16} style={{ marginRight: 8, verticalAlign: -2 }} />}
                {theme === "dark" ? "Light View" : "Dark View"}
              </button>
              <div style={styles.mobileNavDivider} />
              <div style={styles.mobileNavSectionTitle}>Categories</div>
              {CATEGORIES.map((c) => (
                <button key={c.id} style={styles.mobileNavLink} onClick={() => { setActiveCategory(c.id); setView("shop"); setMenuOpen(false); }}>
                  <img src={c.icon} alt={c.name} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", marginRight: 8, verticalAlign: "middle", display: "inline-block" }} />
                  {c.name}
                </button>
              ))}
              <div style={styles.mobileNavDivider} />
              <button style={styles.mobileNavLink} onClick={() => { setView(currentUser ? "account" : "login"); setMenuOpen(false); }}>
                <User size={16} style={{ marginRight: 8, verticalAlign: -2 }} />
                {currentUser ? `Account (${currentUser.name.split(" ")[0]})` : "Sign In / Register"}
              </button>
            </nav>
            
            <div style={styles.mobileDrawerFooter}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4, display: "flex", alignItems: "center" }}><MapPin size={12} style={{ marginRight: 4 }} /> Ado-Ekiti, Ekiti State</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center" }}><Phone size={12} style={{ marginRight: 4 }} /> 0800-MIKUN-EAT</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ============================== HOME ============================== */
function HomePage({ setView, setActiveCategory, menu, addToCart, setSelectedItem }) {
  const featured = menu.slice(0, 4);
  const specials = menu.filter((m) => m.tag).slice(0, 5);

  return (
    <div>
      <section className="mk-section" style={styles.hero}>
        <div className="mk-hero-inner" style={styles.heroInner}>
          <div className="mk-fade-up" style={styles.heroText}>
            <span style={styles.eyebrow}><UtensilsCrossed size={14} /> Ado-Ekiti's own good food, good vibe</span>
            <h1 className="mk-hero-title" style={styles.heroTitle}>Good food.<br /><span style={{ color: "var(--green)" }}>Good vibe.</span></h1>
            <p style={styles.heroSub}>
              From smoky jollof rice to pepper-soaked suya — order online for pickup, delivery,
              or straight to WhatsApp, the same way you would at our Ado-Ekiti spot.
            </p>
            <div className="mk-hero-btns" style={styles.heroBtns}>
              <button className="mk-btn" style={{ ...styles.btnPrimary, background: "var(--green)" }} onClick={() => { setActiveCategory("all"); setView("shop"); }}>
                See the menu <ArrowRight size={16} />
              </button>
              <button className="mk-btn" style={styles.btnGhostLight} onClick={() => { setActiveCategory("specials"); setView("shop"); }}>Today's specials</button>
            </div>
            <div className="mk-hero-stats" style={styles.heroStats}>
              <div><strong>4.7★</strong><span>Customer rating</span></div>
              <div><strong>15 min</strong><span>Average kitchen time</span></div>
              <div><strong>2</strong><span>Ways to order</span></div>
            </div>
          </div>
          <div className="mk-fade-up mk-hero-panel" style={{ ...styles.heroPanel, animationDelay: ".15s" }}>
            <div className="mk-hero-image-frame" style={styles.heroImageFrame}>
              <div className="mk-hero-image-inner" style={styles.heroImageInner}>
                <img src="/jollof-plate.png" alt="Mikun Signature Jollof Rice & Grilled Chicken" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="mk-ticket" style={styles.ticket}>
                <div style={styles.ticketHead}>TODAY'S ORDER TICKET</div>
                {specials.slice(0, 5).map((d) => (
                  <div key={d.id} style={styles.ticketRow}>
                    <span>{d.name}</span>
                    <span style={styles.ticketPrice}>{money(d.price)}</span>
                  </div>
                ))}
                <div style={styles.ticketFoot}>Good food. Good vibe. Every plate.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mk-section" style={styles.section}>
        <SectionHead eyebrow="Menu" title="Explore by category" />
        <div className="mk-stagger" style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <button key={c.id} className="mk-cat-card" style={styles.categoryCard} onClick={() => { setActiveCategory(c.id); setView("shop"); }}>
              <span className="mk-cat-icon" style={styles.categoryIcon}>
                <img src={c.icon} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              </span>
              <span style={styles.categoryName}>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mk-section" style={{ ...styles.section, background: "var(--surface)" }}>
        <SectionHead eyebrow="Handpicked" title="Fan favourites" action={{ label: "View full menu", onClick: () => setView("shop") }} />
        <div className="mk-stagger" style={styles.productGrid}>
          {featured.map((p) => (
            <ProductCard key={p.id} item={p} addToCart={addToCart} onOpen={() => { setSelectedItem(p); setView("product"); }} />
          ))}
        </div>
      </section>

      <section className="mk-section" style={styles.section}>
        <SectionHead eyebrow="How it works" title="Order in three steps" />
        <div className="mk-feature-grid" style={styles.featureGrid}>
          <FeatureItem icon={<UtensilsCrossed size={22} />} title="1. Pick your plate" text="Browse the menu and add whatever you're craving to your order." />
          <FeatureItem icon={<Bike size={22} />} title="2. Choose pickup or delivery" text="Order for delivery across Ado-Ekiti, or pick up hot and fresh in-store." />
          <FeatureItem icon={<MessageCircle size={22} />} title="3. Confirm on WhatsApp" text="Finish your order in-app, or send it straight to our kitchen on WhatsApp." />
        </div>
      </section>

      <section className="mk-section" style={{ ...styles.section, background: "var(--charcoal)" }}>
        <SectionHead eyebrow="From our customers" title="What people are saying" light />
        <div className="mk-stagger mk-review-grid" style={styles.reviewGrid}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="mk-card" style={styles.reviewCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={r.avatar} alt={r.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{r.name}</div>
                  <div style={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={11} fill={s < r.rating ? "#E8A33D" : "none"} color="#E8A33D" />
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ ...styles.reviewText, margin: 0 }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mk-cta-band" style={styles.ctaBand}>
        <div className="mk-cta-band-inner" style={styles.ctaBandInner}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)" }}>Create your Mikun account</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>Save your delivery details and reorder your favourites in seconds.</p>
          </div>
          <button className="mk-btn" style={styles.btnPrimary} onClick={() => setView("register")}>Create account <ArrowRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ eyebrow, title, action, light }) {
  return (
    <div style={styles.sectionHead}>
      <div>
        <span style={{ ...styles.eyebrowSmall, color: "var(--ember)" }}>{eyebrow}</span>
        <h2 style={{ ...styles.sectionTitle, color: "var(--ink)" }}>{title}</h2>
      </div>
      {action && (
        <button onClick={action.onClick} style={{ ...styles.sectionAction, color: light ? "#E8A33D" : "var(--ember)" }}>
          {action.label} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function FeatureItem({ icon, title, text }) {
  return (
    <div style={styles.featureItem}>
      <div style={styles.featureIcon}>{icon}</div>
      <h4 style={{ margin: "12px 0 6px" }}>{title}</h4>
      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

/* ============================== MENU / SHOP ============================== */
function MenuPage({ items, activeCategory, setActiveCategory, addToCart, setSelectedItem, setView, query, setQuery }) {
  return (
    <div className="mk-shop-wrap" style={styles.shopWrap}>
      <aside className="mk-shop-sidebar" style={styles.shopSidebar}>
        <h4 className="mk-sidebar-title" style={styles.sidebarTitle}>Categories</h4>
        <button style={{ ...styles.sidebarItem, ...(activeCategory === "all" ? styles.sidebarItemActive : {}) }} onClick={() => setActiveCategory("all")}>Full menu</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} style={{ ...styles.sidebarItem, ...(activeCategory === c.id ? styles.sidebarItemActive : {}) }} onClick={() => setActiveCategory(c.id)}>
            <img src={c.icon} alt={c.name} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", marginRight: 8, verticalAlign: "middle", display: "inline-block" }} />
            {c.name}
          </button>
        ))}
      </aside>
      <div style={styles.shopMain}>
        <div className="mk-shop-main-head" style={styles.shopMainHead}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
              {activeCategory === "all" ? "Full menu" : CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h2>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{items.length} dishes</span>
          </div>
          <input className="mk-search-input-alt" placeholder="Search this menu…" value={query} onChange={(e) => setQuery(e.target.value)} style={styles.searchInputAlt} />
        </div>
        {items.length === 0 ? (
          <div style={styles.emptyState}><Package size={32} color="var(--text-secondary)" /><p>No dishes match your search yet.</p></div>
        ) : (
          <div className="mk-stagger mk-product-grid" style={styles.productGrid}>
            {items.map((p) => (
              <ProductCard key={p.id} item={p} addToCart={addToCart} onOpen={() => { setSelectedItem(p); setView("product"); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ item, addToCart, onOpen }) {
  const cat = CATEGORIES.find((c) => c.id === item.category);
  const lowStock = item.stock <= 5;
  const [justAdded, setJustAdded] = useState(false);
  function handleAdd() {
    addToCart(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);
  }
  return (
    <div className="mk-card mk-product-card" style={styles.productCard}>
      <button style={styles.productImg} onClick={onOpen}>
        {item.image || cat?.icon ? (
          <img src={item.image || cat?.icon} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 42 }}>🍽️</span>
        )}
        {item.tag && <span style={styles.productTag}>{item.tag}</span>}
        {lowStock && <span style={styles.lowStockTag}>Almost gone</span>}
      </button>
      <div style={styles.productBody}>
        <button style={styles.productName} onClick={onOpen}>{item.name}</button>
        <span style={styles.productUnit}>
          {item.unit}{item.spicy > 0 && <> · {Array.from({ length: item.spicy }).map((_, i) => <Flame key={i} className="mk-flame" size={11} color="#E2542B" style={{ verticalAlign: -1, animationDelay: (i * .15) + "s" }} />)}</>}
        </span>
        <div className="mk-product-footer" style={styles.productFooter}>
          <span style={styles.productPrice}>{money(item.price)}</span>
          <button className={"mk-btn mk-add-btn" + (justAdded ? " mk-add-flash" : "")} style={styles.addBtn} onClick={handleAdd}><Plus size={15} /> Add</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== ITEM DETAIL ============================== */
function ItemPage({ item, addToCart, setView }) {
  const [qty, setQty] = useState(1);
  const cat = CATEGORIES.find((c) => c.id === item.category);
  return (
    <div style={styles.pageNarrow}>
      <button style={styles.backLink} onClick={() => setView("shop")}><ChevronLeft size={16} /> Back to menu</button>
      <div className="mk-product-detail" style={styles.productDetail}>
        <div style={styles.productDetailImg}>
          {item.image || cat?.icon ? (
            <img src={item.image || cat?.icon} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
          ) : (
            <span style={{ fontSize: 90 }}>🍽️</span>
          )}
        </div>
        <div style={styles.productDetailBody}>
          <span style={styles.catTagSmall}>{cat?.name}</span>
          <h1 style={{ margin: "8px 0 6px", fontFamily: "var(--font-display)", fontSize: 28 }}>{item.name}</h1>
          <p style={{ color: "var(--text-secondary)", margin: "0 0 16px" }}>{item.desc}</p>
          <div style={{ fontSize: 30, fontWeight: 700, color: "var(--ember)", marginBottom: 4 }}>{money(item.price)}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 20 }}>{item.unit} · {item.stock} portions left today</div>
          <div className="mk-qty-row" style={styles.qtyRow}>
            <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={15} /></button>
            <span style={styles.qtyVal}>{qty}</span>
            <button style={styles.qtyBtn} onClick={() => setQty(qty + 1)}><Plus size={15} /></button>
            <button className="mk-btn mk-qty-add-btn" style={{ ...styles.btnPrimary, marginLeft: 16 }} onClick={() => addToCart(item, qty)}><ShoppingBag size={16} /> Add to order</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== CART ============================== */
function CartPage({ cart, updateQty, removeFromCart, cartTotal, setView, currentUser }) {
  return (
    <div style={styles.pageNarrow}>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Your order</h1>
      {cart.length === 0 ? (
        <div style={styles.emptyState}>
          <ShoppingBag size={32} color="var(--text-secondary)" />
          <p>Your order is empty.</p>
          <button className="mk-btn" style={styles.btnPrimary} onClick={() => setView("shop")}>Browse the menu</button>
        </div>
      ) : (
        <div style={styles.cartLayout}>
          <div style={styles.cartList}>
            {cart.map((c) => (
              <div key={c.id} className="mk-cart-row" style={styles.cartRow}>
                <div className="mk-cart-row-img" style={styles.cartRowImg}>
                  {c.image ? (
                    <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  ) : (
                    "🍽️"
                  )}
                </div>
                <div className="mk-cart-row-info" style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.unit} · {money(c.price)}</div>
                </div>
                <div className="mk-cart-row-qty" style={styles.qtyRow}>
                  <button style={styles.qtyBtn} onClick={() => updateQty(c.id, c.qty - 1)}><Minus size={13} /></button>
                  <span style={styles.qtyVal}>{c.qty}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQty(c.id, c.qty + 1)}><Plus size={13} /></button>
                </div>
                <div className="mk-cart-row-total" style={{ width: 90, textAlign: "right", fontWeight: 700 }}>{money(c.price * c.qty)}</div>
                <button className="mk-cart-row-delete" style={styles.trashBtn} onClick={() => removeFromCart(c.id)}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <div className="mk-summary-card" style={styles.summaryCard}>
            <h4 style={{ marginTop: 0 }}>Order summary</h4>
            <div style={styles.summaryRow}><span>Subtotal</span><span>{money(cartTotal)}</span></div>
            <div style={styles.summaryRow}><span>Delivery</span><span>{cartTotal > 15000 ? "Free" : money(1000)}</span></div>
            <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 17, borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 6 }}>
              <span>Total</span><span>{money(cartTotal + (cartTotal > 15000 ? 0 : 1000))}</span>
            </div>
            <button className="mk-btn" style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center", marginTop: 14 }}
              onClick={() => setView(currentUser ? "checkout" : "login")}>
              Checkout <ArrowRight size={16} />
            </button>
            {!currentUser && <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>You'll be asked to sign in first.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== CHECKOUT ============================== */
function CheckoutPage({ cart, cartTotal, currentUser, placeOrder, setView }) {
  const [fulfilment, setFulfilment] = useState("delivery");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [payment, setPayment] = useState("whatsapp");
  const delivery = fulfilment === "pickup" ? 0 : (cartTotal > 15000 ? 0 : 1000);

  return (
    <div style={styles.pageNarrow}>
      <button style={styles.backLink} onClick={() => setView("cart")}><ChevronLeft size={16} /> Back to order</button>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Checkout</h1>
      <div className="mk-cart-layout" style={styles.cartLayout}>
        <div className="mk-form-card" style={styles.formCard}>
          <label style={styles.label}>Fulfilment</label>
          <div style={styles.paymentOptions}>
            {[{ id: "delivery", label: "Delivery" }, { id: "pickup", label: "Pickup in-store" }].map((opt) => (
              <button key={opt.id} style={{ ...styles.paymentOption, ...(fulfilment === opt.id ? styles.paymentOptionActive : {}) }} onClick={() => setFulfilment(opt.id)}>{opt.label}</button>
            ))}
          </div>
          {fulfilment === "delivery" && (
            <>
              <label style={styles.label}>Delivery address</label>
              <textarea className="mk-input" style={styles.textarea} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, city" />
            </>
          )}
          <label style={styles.label}>Phone number</label>
          <input className="mk-input" style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080..." />
          <label style={styles.label}>How would you like to pay</label>
          <div style={styles.paymentOptions}>
            {[
              { id: "whatsapp", label: "Send order to WhatsApp & pay on confirmation" },
              { id: "transfer", label: "Bank transfer" },
              { id: "delivery", label: "Pay on delivery / pickup" },
            ].map((opt) => (
              <button key={opt.id} style={{ ...styles.paymentOption, ...(payment === opt.id ? styles.paymentOptionActive : {}) }} onClick={() => setPayment(opt.id)}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div className="mk-summary-card" style={styles.summaryCard}>
          <h4 style={{ marginTop: 0 }}>Order summary</h4>
          {cart.map((c) => (<div key={c.id} style={styles.summaryRow}><span>{c.qty}× {c.name}</span><span>{money(c.price * c.qty)}</span></div>))}
          <div style={styles.summaryRow}><span>Delivery</span><span>{delivery === 0 ? "Free" : money(delivery)}</span></div>
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 17, borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 6 }}>
            <span>Total</span><span>{money(cartTotal + delivery)}</span>
          </div>
          <button className="mk-btn" style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center", marginTop: 14 }}
            disabled={!phone || (fulfilment === "delivery" && !address)}
            onClick={() => placeOrder({ address, phone, payment, fulfilment })}>
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderSuccessPage({ order, setView, whatsappOrderLink }) {
  return (
    <div style={{ ...styles.pageNarrow, textAlign: "center", padding: "60px 20px" }}>
      <CheckCircle2 size={56} color="var(--ember)" />
      <h1 style={{ fontFamily: "var(--font-display)" }}>Order sent to the kitchen!</h1>
      <p style={{ color: "var(--text-secondary)" }}>Order <strong>{order.id}</strong> has been received.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
        {order.payment === "whatsapp" && (
          <a href={whatsappOrderLink(order)} target="_blank" rel="noreferrer" className="mk-btn" style={{ ...styles.btnPrimary, textDecoration: "none" }}>
            <MessageCircle size={16} /> Confirm on WhatsApp
          </a>
        )}
        <button className="mk-btn" style={styles.btnGhost} onClick={() => setView("account")}>View my orders</button>
        <button className="mk-btn" style={styles.btnGhost} onClick={() => setView("shop")}>Order more</button>
      </div>
    </div>
  );
}

/* ============================== AUTH ============================== */
function AuthPage({ mode, onSubmit, error, setView, showPw, setShowPw, adminHint }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div style={styles.authWrap}>
      <div style={styles.authCard}>
        <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>{mode === "login" ? "Sign in to Mikun" : "Create your account"}</h2>
        {adminHint && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Admin access: admin@mikun.com / admin123</p>}
        {error && <div style={styles.errorBox}><AlertTriangle size={14} /> {error}</div>}
        {mode === "register" && (<><label style={styles.label}>Full name</label><input className="mk-input" style={styles.input} value={form.name} onChange={set("name")} placeholder="Ada Lovelace" /></>)}
        <label style={styles.label}>Email</label>
        <div className="mk-input" style={styles.inputIconWrap}><Mail size={15} color="#8A7C6E" /><input style={styles.inputIcon} type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></div>
        <label style={styles.label}>Password</label>
        <div className="mk-input" style={styles.inputIconWrap}><Lock size={15} color="#8A7C6E" />
          <input style={styles.inputIcon} type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••" />
          <button style={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
        </div>
        {mode === "register" && (<>
          <label style={styles.label}>Phone</label><input className="mk-input" style={styles.input} value={form.phone} onChange={set("phone")} placeholder="080..." />
          <label style={styles.label}>Delivery address</label><input className="mk-input" style={styles.input} value={form.address} onChange={set("address")} placeholder="Street, area, city" />
        </>)}
        <button className="mk-btn" style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => onSubmit(form)}>
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 16 }}>
          {mode === "login" ? (<>New to Mikun? <button style={styles.linkBtn} onClick={() => setView("register")}>Create an account</button></>)
            : (<>Already have an account? <button style={styles.linkBtn} onClick={() => setView("login")}>Sign in</button></>)}
        </p>
        <button style={styles.linkBtnMuted} onClick={() => setView("home")}><Home size={13} /> Back to home</button>
      </div>
    </div>
  );
}

/* ============================== ACCOUNT ============================== */
function AccountPage({ user, myOrders, logout, setView, whatsappOrderLink }) {
  const statusColor = { Pending: "#E8A33D", Preparing: "#378ADD", "Out for delivery": "#7F77DD", Delivered: "#3E8E5B", Cancelled: "#E24B4A" };
  return (
    <div style={styles.pageNarrow}>
      <div className="mk-account-head" style={styles.accountHead}>
        <div style={styles.avatarCircle}>{user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
        <div><h2 style={{ margin: "0 0 4px" }}>{user.name}</h2><span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{user.email}</span></div>
        <button className="mk-btn" style={styles.btnGhost} onClick={logout}><LogOut size={15} /> Sign out</button>
      </div>
      <div style={styles.accountGrid}>
        <div style={styles.formCard}>
          <h4 style={{ marginTop: 0 }}>Delivery details</h4>
          <p style={{ fontSize: 14, margin: "4px 0" }}><strong>Phone:</strong> {user.phone || "—"}</p>
          <p style={{ fontSize: 14, margin: "4px 0" }}><strong>Address:</strong> {user.address || "—"}</p>
          <button className="mk-btn" style={{ ...styles.btnGhost, marginTop: 10 }} onClick={() => setView("shop")}>Order again</button>
        </div>
        <div style={{ ...styles.formCard, flex: 2 }}>
          <h4 style={{ marginTop: 0 }}>Order history</h4>
          {myOrders.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>No orders yet — your future orders will show up here.</p>
          ) : (
            myOrders.map((o) => (
              <div key={o.id} className="mk-order-row" style={styles.orderRow}>
                <div className="mk-order-row-info">
                  <div style={{ fontWeight: 600 }}>{o.id}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{new Date(o.placedAt).toLocaleDateString()} · {o.items.length} items · {o.fulfilment}</div>
                </div>
                <div className="mk-order-row-price" style={{ fontWeight: 700 }}>{money(o.total)}</div>
                <span className="mk-order-row-status" style={{ ...styles.statusPill, background: (statusColor[o.status] || "#888") + "22", color: statusColor[o.status] || "#888" }}>{o.status}</span>
                {o.payment === "whatsapp" ? (
                  <a className="mk-order-row-actions" href={whatsappOrderLink(o)} target="_blank" rel="noreferrer" style={styles.iconBtnSm}><MessageCircle size={14} /></a>
                ) : (
                  <div className="mk-order-row-actions" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================== ADMIN ============================== */
function AdminDashboard({ adminView, setAdminView, menu, orders, saveMenuItem, deleteMenuItem, updateOrderStatus, logout, setView }) {
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = menu.filter((m) => m.stock <= 5);
  const pending = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="mk-admin-wrap" style={styles.adminWrap}>
      <aside className="mk-admin-sidebar" style={styles.adminSidebar}>
        <div className="mk-admin-logo" style={styles.adminLogo}><span style={styles.logoMark}>MIKUN</span><span style={{ fontSize: 11, color: "#E8C99B" }}>ADMIN</span></div>
        <button className="mk-admin-nav-item" style={{ ...styles.adminNavItem, ...(adminView === "dashboard" ? styles.adminNavActive : {}) }} onClick={() => setAdminView("dashboard")}><BarChart3 size={17} /> Dashboard</button>
        <button className="mk-admin-nav-item" style={{ ...styles.adminNavItem, ...(adminView === "products" ? styles.adminNavActive : {}) }} onClick={() => setAdminView("products")}><LayoutGrid size={17} /> Menu items</button>
        <button className="mk-admin-nav-item" style={{ ...styles.adminNavItem, ...(adminView === "orders" ? styles.adminNavActive : {}) }} onClick={() => setAdminView("orders")}><ClipboardList size={17} /> Orders</button>
        <div className="mk-admin-nav-spacer" style={{ flex: 1 }} />
        <button className="mk-admin-nav-item" style={styles.adminNavItem} onClick={() => setView("home")}><Home size={17} /> View storefront</button>
        <button className="mk-admin-nav-item" style={styles.adminNavItem} onClick={logout}><LogOut size={17} /> Log out</button>
      </aside>
      <div className="mk-admin-main" style={styles.adminMain}>
        {adminView === "dashboard" && (
          <div>
            <h2 style={{ fontFamily: "var(--font-display)" }}>Dashboard</h2>
            <div className="mk-stat-grid" style={styles.statGrid}>
              <StatCard icon={<TrendingUp size={18} />} label="Total revenue" value={money(revenue)} />
              <StatCard icon={<ClipboardList size={18} />} label="Total orders" value={orders.length} />
              <StatCard icon={<Clock size={18} />} label="Pending orders" value={pending} />
              <StatCard icon={<Package size={18} />} label="Menu items" value={menu.length} />
            </div>
            {lowStock.length > 0 && (
              <div style={styles.alertBox}>
                <AlertTriangle size={16} color="#B4691C" />
                <span>{lowStock.length} dish{lowStock.length > 1 ? "es are" : " is"} almost out for today: {lowStock.map((p) => p.name).join(", ")}.</span>
              </div>
            )}
            <h3 style={{ marginTop: 28 }}>Recent orders</h3>
            <OrderTable orders={orders.slice(0, 6)} updateOrderStatus={updateOrderStatus} compact />
          </div>
        )}
        {adminView === "products" && (
          <MenuAdmin menu={menu} saveMenuItem={saveMenuItem} deleteMenuItem={deleteMenuItem} />
        )}
        {adminView === "orders" && (
          <div><h2 style={{ fontFamily: "var(--font-display)" }}>Orders</h2><OrderTable orders={orders} updateOrderStatus={updateOrderStatus} /></div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div><div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div></div>
    </div>
  );
}

function OrderTable({ orders, updateOrderStatus, compact }) {
  const statuses = ["Pending", "Preparing", "Out for delivery", "Delivered", "Cancelled"];
  if (orders.length === 0) return <p style={{ color: "var(--text-secondary)" }}>No orders yet.</p>;
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th>{!compact && <th>Update Status</th>}</tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.customerName}</td><td>{o.items.length}</td><td>{money(o.total)}</td>
              <td><span style={styles.statusPillSm}>{o.status}</span></td>
              <td>
                {o.status === "Pending" ? (
                  <button className="mk-btn" style={{ ...styles.btnPrimary, background: "var(--green)", color: "var(--on-accent)", padding: "5px 10px", fontSize: 11, borderRadius: 6, fontWeight: 700 }} onClick={() => updateOrderStatus(o.id, "Preparing")}>
                    Approve Order
                  </button>
                ) : (
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Approved</span>
                )}
              </td>
              {!compact && (<td><select className="mk-input" style={{ ...styles.select, padding: "4px 8px", fontSize: 12 }} value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MenuAdmin({ menu, saveMenuItem, deleteMenuItem }) {
  const empty = { id: null, name: "", category: "rice", price: "", unit: "", stock: "", tag: "", spicy: 0, desc: "", image: "" };
  const [editing, setEditing] = useState(null);
  function startNew() { setEditing({ ...empty }); }
  function startEdit(p) { setEditing({ ...p }); }
  function submit() {
    if (!editing.name || !editing.price) return;
    saveMenuItem({ ...editing, price: Number(editing.price), stock: Number(editing.stock) || 0, spicy: Number(editing.spicy) || 0 });
    setEditing(null);
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Menu items</h2>
        <button className="mk-btn" style={styles.btnPrimary} onClick={startNew}><Plus size={16} /> Add dish</button>
      </div>
      {editing && (
        <div style={styles.formCard}>
          <h4 style={{ marginTop: 0 }}>{editing.id ? "Edit dish" : "New dish"}</h4>
          <div style={styles.formGrid}>
            <div><label style={styles.label}>Name</label><input className="mk-input" style={styles.input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label style={styles.label}>Category</label>
              <select className="mk-input" style={styles.select} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label style={styles.label}>Price (₦)</label><input className="mk-input" style={styles.input} type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
            <div><label style={styles.label}>Unit</label><input className="mk-input" style={styles.input} value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} placeholder="e.g. 1 plate, bowl" /></div>
            <div><label style={styles.label}>Portions today</label><input className="mk-input" style={styles.input} type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} /></div>
            <div><label style={styles.label}>Spice level (0-3)</label><input className="mk-input" style={styles.input} type="number" min="0" max="3" value={editing.spicy} onChange={(e) => setEditing({ ...editing, spicy: e.target.value })} /></div>
            <div><label style={styles.label}>Tag (optional)</label><input className="mk-input" style={styles.input} value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} placeholder="e.g. Best seller" /></div>
            <div><label style={styles.label}>Image URL</label><input className="mk-input" style={styles.input} value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://images.unsplash.com/..." /></div>
          </div>
          <label style={styles.label}>Description</label>
          <textarea className="mk-input" style={styles.textarea} rows={2} value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="mk-btn" style={styles.btnPrimary} onClick={submit}><PackageCheck size={16} /> Save dish</button>
            <button className="mk-btn" style={styles.btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr><th>Dish</th><th>Category</th><th>Price</th><th>Portions</th><th></th></tr></thead>
          <tbody>
            {menu.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{CATEGORIES.find((c) => c.id === p.category)?.name}</td><td>{money(p.price)}</td>
                <td style={{ color: p.stock <= 5 ? "#E24B4A" : "inherit" }}>{p.stock}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button style={styles.iconBtnSm} onClick={() => startEdit(p)}><Edit2 size={14} /></button>
                  <button style={styles.iconBtnSm} onClick={() => deleteMenuItem(p.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== FOOTER ============================== */
function Footer({ setView }) {
  return (
    <footer style={styles.footer}>
      <div className="mk-footer-inner" style={styles.footerInner}>
        <div>
          <div style={styles.logoMark}>MIKUN</div>
          <p style={{ color: "var(--ink-soft)", fontSize: 13, maxWidth: 260, marginTop: 8 }}>Good food, good vibe — Ado-Ekiti's home for real Nigerian flavour, cooked fresh and ordered online.</p>
        </div>
        <div>
          <h5 style={styles.footerHead}>Order</h5>
          <button style={styles.footerLink} onClick={() => setView("shop")}>Full menu</button>
          <button style={styles.footerLink} onClick={() => setView("cart")}>My order</button>
          <button style={styles.footerLink} onClick={() => setView("register")}>Create account</button>
        </div>
        <div>
          <h5 style={styles.footerHead}>Visit us</h5>
          <p style={styles.footerText}>Mikun Good Food Good Vibe, Ado-Ekiti, Ekiti State</p>
        </div>
        <div>
          <h5 style={styles.footerHead}>Contact</h5>
          <p style={styles.footerText}>0800-MIKUN-EAT</p>
          <p style={styles.footerText}>hello@mikungoodfood.com</p>
        </div>
      </div>
      <div style={styles.footerBottom}>© {new Date().getFullYear()} Mikun Good Food Good Vibe. All rights reserved.</div>
    </footer>
  );
}

/* ============================== STYLE TOKENS ============================== */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
      * { box-sizing: border-box; }
      button { font-family: inherit; cursor: pointer; }
      input, select, textarea { font-family: inherit; }
      table th, table td { text-align: left; padding: 10px 14px; border-bottom: 1px solid #3A2F26; }
      table th { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; color: #B8A692; }
      table tr:last-child td { border-bottom: none; }
      @media (max-width: 900px) {
        .mk-hero-inner, .mk-shop-wrap { grid-template-columns: 1fr !important; }
      }

      /* ---------------- animations ---------------- */
      @keyframes mk-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes mk-fade-in { from { opacity: 0; transform: translateY(8px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes mk-pop { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
      @keyframes mk-toast-in { from { opacity: 0; transform: translateY(-10px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes mk-flame-flicker { 0%,100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.12) rotate(-3deg); } }
      @keyframes mk-slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }

      .mk-view-enter { animation: mk-fade-in .5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .mk-fade-up { animation: mk-fade-up .6s cubic-bezier(.16,.8,.3,1) both; }
      .mk-stagger > * { animation: mk-fade-up .55s cubic-bezier(.16,.8,.3,1) both; }
      .mk-stagger > *:nth-child(1) { animation-delay: .03s; }
      .mk-stagger > *:nth-child(2) { animation-delay: .09s; }
      .mk-stagger > *:nth-child(3) { animation-delay: .15s; }
      .mk-stagger > *:nth-child(4) { animation-delay: .21s; }
      .mk-stagger > *:nth-child(5) { animation-delay: .27s; }
      .mk-stagger > *:nth-child(6) { animation-delay: .33s; }
      .mk-stagger > *:nth-child(7) { animation-delay: .39s; }
      .mk-stagger > *:nth-child(n+8) { animation-delay: .42s; }

      /* Jollof Image Zoom and Ticket reveal animations */
      .mk-hero-image-inner img {
        transition: transform 6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mk-hero-image-frame:hover .mk-hero-image-inner img {
        transform: scale(1.08);
      }
      .mk-ticket {
        opacity: 0;
        transform: translateY(12px) scale(0.95);
        pointer-events: none;
        transition: opacity .45s cubic-bezier(0.16, 1, 0.3, 1), transform .45s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mk-hero-image-frame:hover .mk-ticket {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .mk-card { transition: transform .28s cubic-bezier(.16,.8,.3,1), box-shadow .28s ease, border-color .28s ease, background .28s ease; }
      .mk-card:hover { transform: translateY(-5px); box-shadow: 0 14px 28px rgba(0,0,0,.5); border-color: #E2542B55; }
      .mk-card:active { transform: translateY(-1px) scale(.99); }

      .mk-product-card:hover {
        background: var(--green) !important;
        border-color: var(--green-deep) !important;
      }
      .mk-product-card:hover .mk-product-footer button {
        background: var(--charcoal) !important;
        color: #fff !important;
      }
      .mk-product-card:hover button {
        color: var(--on-accent) !important;
      }
      .mk-product-card:hover span {
        color: var(--on-accent) !important;
      }

      .mk-cat-card { transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease; }
      .mk-cat-card:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 10px 24px rgba(0,0,0,.5); background: var(--green) !important; border-color: var(--green-deep) !important; }
      .mk-cat-card .mk-cat-icon { display: inline-block; transition: transform .35s cubic-bezier(.34,1.56,.64,1); }
      .mk-cat-card:hover .mk-cat-icon { transform: scale(1.25) rotate(-6deg); }

      .mk-btn { transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease, filter .18s ease; }
      .mk-btn:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 8px 18px rgba(226,84,43,.28); }
      .mk-btn:active { transform: translateY(0) scale(.96); }

      .mk-badge-pop { animation: mk-pop .35s cubic-bezier(.34,1.56,.64,1); }
      .mk-toast { animation: mk-toast-in .3s cubic-bezier(.34,1.56,.64,1) both; }
      .mk-flame { display: inline-block; animation: mk-flame-flicker 1.1s ease-in-out infinite; }
      .mk-add-flash { animation: mk-pop .4s cubic-bezier(.34,1.56,.64,1); }

      .mk-nav-link { position: relative; transition: color .2s ease; }
      .mk-nav-link::after { content: ""; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 2px; background: var(--green); transform: scaleX(0); transform-origin: left; transition: transform .25s ease; }
      .mk-nav-link:hover::after { transform: scaleX(1); }

      .mk-input:focus, .mk-input:focus-within { outline: none; border-color: var(--green) !important; box-shadow: 0 0 0 3px rgba(139,197,63,.16); transition: box-shadow .2s ease, border-color .2s ease; }

      .mk-icon-link { transition: transform .2s ease, color .2s ease; }
      .mk-icon-link:hover { transform: translateY(-2px); color: var(--green); }

      .mk-admin-nav { transition: background .2s ease, padding-left .2s ease; }
      .mk-admin-nav:hover { padding-left: 16px; }

      @media (prefers-reduced-motion: reduce) {
        .mk-fade-up, .mk-stagger > *, .mk-view-enter, .mk-toast, .mk-badge-pop, .mk-flame { animation: none !important; }
        .mk-card, .mk-cat-card, .mk-btn { transition: none !important; }
      }

      /* ---------------- responsive mobile styles ---------------- */
      @media (max-width: 960px) {
        /* Reset and layout overrides */
        .mk-hero-inner,
        .mk-shop-wrap,
        .mk-cart-layout,
        .mk-product-detail,
        .mk-form-grid,
        .mk-footer-inner {
          grid-template-columns: 1fr !important;
          gap: 24px !important;
        }

        /* Clean Header for Mobile */
        header .mk-header-main-inner {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 10px 16px !important;
          gap: 12px !important;
        }
        header .mk-search-wrap {
          display: none !important; /* hide search bar on mobile header main, accessible in drawer */
        }
        header .mk-header-actions {
          margin-left: auto !important;
          gap: 14px !important;
        }
        header .mk-header-actions .mk-user-link span,
        header .mk-header-actions .mk-cart-link span,
        header .mk-header-actions .mk-theme-toggle span {
          display: none !important; /* Hide labels for icons to save space */
        }
        header .mk-menu-toggle {
          display: inline-flex !important;
          color: var(--ink);
        }
        
        /* Hide Top bar or make it wrap nicely */
        header .mk-header-top-inner {
          padding: 6px 16px !important;
          justify-content: space-between !important;
        }

        /* Hide Desktop SubNav Categories scroll */
        header .mk-subnav-inner {
          display: none !important;
        }

        /* Hero text and styling */
        .mk-hero-inner {
          padding: 40px 16px !important;
          text-align: center !important;
        }
        .mk-hero-title {
          font-size: 32px !important;
          margin: 12px 0 !important;
        }
        .mk-hero-sub {
          margin: 0 auto 20px !important;
          font-size: 15px !important;
        }
        .mk-hero-btns {
          justify-content: center !important;
        }
        .mk-hero-stats {
          justify-content: center !important;
          gap: 20px !important;
          margin-top: 24px !important;
        }
        
        /* Unoverlap ticket and image frame */
        .mk-ticket {
          position: static !important;
          width: 100% !important;
          margin-top: 20px !important;
          left: auto !important;
          bottom: auto !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
          opacity: 1 !important;
          transform: none !important;
          pointer-events: auto !important;
        }
        .mk-hero-image-frame {
          width: 100% !important;
        }
        .mk-hero-image-inner {
          aspect-ratio: 4 / 3 !important;
          min-height: 200px !important;
        }

        /* Product grid -> 2 Columns */
        .mk-product-grid {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
          gap: 12px !important;
        }
        .mk-product-card {
          border-radius: 10px !important;
        }
        .mk-product-card button span {
          font-size: 32px !important;
        }
        .mk-product-card button {
          height: 100px !important;
        }
        .mk-product-card .mk-product-footer {
          margin-top: 6px !important;
        }
        
        /* Swipeable Sticky Category Filter on Shop Page */
        .mk-shop-wrap {
          padding: 0 !important;
          gap: 0 !important;
        }
        .mk-shop-sidebar {
          display: flex !important;
          flex-direction: row !important;
          overflow-x: auto !important;
          white-space: nowrap !important;
          position: sticky !important;
          top: 61px !important; /* right below sticky header */
          z-index: 40 !important;
          padding: 10px 16px !important;
          background: var(--surface) !important;
          border-radius: 0 !important;
          border-left: none !important;
          border-right: none !important;
          gap: 8px !important;
          scrollbar-width: none; /* Hide scrollbar for clean look */
        }
        .mk-shop-sidebar::-webkit-scrollbar {
          display: none;
        }
        .mk-shop-sidebar .mk-sidebar-title {
          display: none !important;
        }
        .mk-shop-sidebar button {
          display: inline-block !important;
          width: auto !important;
          padding: 6px 12px !important;
          white-space: nowrap !important;
          margin: 0 !important;
        }
        .mk-shop-main {
          padding: 16px !important;
        }
        .mk-shop-main-head {
          margin-bottom: 14px !important;
          flex-direction: column !important;
          align-items: stretch !important;
        }
        .mk-search-input-alt {
          min-width: 0 !important;
          width: 100% !important;
          margin-top: 10px !important;
        }

        /* Feature items and reviews */
        .mk-feature-grid,
        .mk-review-grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
        .mk-section {
          padding: 32px 16px !important;
        }

        /* Product Detail View */
        .mk-product-detail {
          padding: 16px !important;
          gap: 16px !important;
        }
        .mk-qty-row {
          flex-wrap: wrap !important;
        }
        .mk-qty-add-btn {
          margin-left: 0 !important;
          margin-top: 12px !important;
          width: 100% !important;
          justify-content: center !important;
        }

        /* Responsive Cart Rows */
        .mk-cart-row {
          display: grid !important;
          grid-template-columns: auto 1fr auto !important;
          grid-template-rows: auto auto !important;
          gap: 8px 12px !important;
          align-items: center !important;
          padding: 10px !important;
        }
        .mk-cart-row-img {
          grid-column: 1 !important;
          grid-row: 1 / span 2 !important;
        }
        .mk-cart-row-info {
          grid-column: 2 !important;
          grid-row: 1 !important;
        }
        .mk-cart-row-qty {
          grid-column: 2 !important;
          grid-row: 2 !important;
          margin-top: 2px !important;
        }
        .mk-cart-row-total {
          grid-column: 3 !important;
          grid-row: 1 !important;
          text-align: right !important;
          font-weight: 700 !important;
        }
        .mk-cart-row-delete {
          grid-column: 3 !important;
          grid-row: 2 !important;
          text-align: right !important;
        }
        
        .mk-summary-card,
        .mk-form-card {
          width: 100% !important;
        }

        /* Account / Profile Page responsiveness */
        .mk-account-head {
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          gap: 12px !important;
        }
        .mk-account-head button {
          width: 100% !important;
          justify-content: center !important;
        }
        .mk-order-row {
          display: grid !important;
          grid-template-columns: 1fr auto !important;
          grid-template-rows: auto auto !important;
          gap: 6px 10px !important;
          align-items: center !important;
          padding: 10px 0 !important;
        }
        .mk-order-row-info {
          grid-column: 1 !important;
          grid-row: 1 !important;
        }
        .mk-order-row-price {
          grid-column: 2 !important;
          grid-row: 1 !important;
          text-align: right !important;
        }
        .mk-order-row-status {
          grid-column: 1 !important;
          grid-row: 2 !important;
          justify-self: start !important;
        }
        .mk-order-row-actions {
          grid-column: 2 !important;
          grid-row: 2 !important;
          display: flex !important;
          justify-content: flex-end !important;
        }

        /* Footer styling */
        .mk-footer-inner {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
          padding: 30px 16px 20px !important;
        }
        .mk-cta-band-inner {
          flex-direction: column !important;
          text-align: center !important;
          padding: 30px 16px !important;
        }
        .mk-cta-band-inner button {
          width: 100% !important;
          justify-content: center !important;
        }

        /* Admin Responsive Styles */
        .mk-admin-wrap {
          flex-direction: column !important;
        }
        .mk-admin-sidebar {
          width: 100% !important;
          flex-direction: row !important;
          overflow-x: auto !important;
          white-space: nowrap !important;
          padding: 10px 16px !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 50 !important;
          border-bottom: 1px solid var(--border) !important;
          scrollbar-width: none;
        }
        .mk-admin-sidebar::-webkit-scrollbar {
          display: none;
        }
        .mk-admin-logo,
        .mk-admin-nav-spacer {
          display: none !important;
        }
        .mk-admin-nav-item {
          display: inline-flex !important;
          padding: 8px 12px !important;
          font-size: 13px !important;
          width: auto !important;
        }
        .mk-admin-main {
          padding: 16px !important;
        }
        .mk-stat-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
        }
      }

      /* Extra styling for very small mobiles */
      @media (max-width: 400px) {
        .mk-product-footer {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 6px !important;
        }
        .mk-add-btn {
          width: 100% !important;
          justify-content: center !important;
        }
        .mk-stat-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}

const cssVars = {
  "--paper": "#000000",
  "--panel": "#1B1D16",
  "--surface": "#1F2218",
  "--line": "#33362B",
  "--line-soft": "#3A3D32",
  "--ink": "#F3F1E7",
  "--ink-soft": "#A6A996",
  "--green": "#8BC53F",
  "--green-deep": "#6FA22E",
  "--jollof": "#E2792A",
  "--jollof-deep": "#F0934A",
  "--on-accent": "#12140F",
  /* legacy aliases so existing component code keeps working */
  "--charcoal": "#1B1D16",
  "--ember": "#E2792A",
  "--gold": "#F0934A",
  "--cream": "#000000",
  "--text-secondary": "#A6A996",
  "--border": "#33362B",
  "--font-display": "'Fraunces', serif",
  "--font-body": "'Work Sans', sans-serif",
  "--font-mono": "'IBM Plex Mono', monospace",
};

const styles = {
  app: { ...cssVars, fontFamily: "var(--font-body)", background: "var(--cream)", color: "var(--ink)", minHeight: "100%", lineHeight: 1.5 },
  toast: { position: "fixed", top: 16, right: 16, zIndex: 999, background: "var(--panel)", color: "var(--ink)", padding: "10px 18px", borderRadius: 8, fontSize: 14, boxShadow: "0 6px 20px rgba(0,0,0,.3)" },
  
  mobileDrawer: { position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" },
  mobileDrawerBackdrop: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" },
  mobileDrawerContent: { position: "relative", width: "min(85%, 320px)", height: "100%", background: "var(--panel)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: 20, zIndex: 101, animation: "mk-slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) both" },
  mobileDrawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  menuCloseBtn: { background: "none", border: "none", color: "var(--ink)", padding: 4 },
  mobileSearchWrap: { display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", marginBottom: 20 },
  mobileSearchInput: { border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent", color: "var(--ink)" },
  mobileSearchBtn: { background: "var(--green)", color: "var(--on-accent)", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600 },
  mobileNavLinks: { display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1 },
  mobileNavLink: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: "var(--ink)", padding: "10px 12px", borderRadius: 8, fontSize: 14.5, textDecoration: "none" },
  mobileNavDivider: { height: 1, background: "var(--border)", margin: "10px 0" },
  mobileNavSectionTitle: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-secondary)", padding: "0 12px 6px" },
  mobileDrawerFooter: { marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: 16 },

  header: { position: "sticky", top: 0, zIndex: 50, background: "var(--cream)" },
  headerTop: { background: "var(--charcoal)", color: "var(--ink-soft)", fontSize: 12 },
  headerTopInner: { maxWidth: 1180, margin: "0 auto", padding: "6px 20px", display: "flex", gap: 20, flexWrap: "wrap" },
  headerMain: { borderBottom: "1px solid var(--border)" },
  headerMainInner: { maxWidth: 1180, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 24 },
  logoContainer: { display: "flex", alignItems: "baseline", gap: 8, background: "none", border: "none", padding: 0, cursor: "pointer" },
  logoMark: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--on-accent)", background: "var(--green)", padding: "2px 8px", borderRadius: 6 },
  logoWord: { fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 1.5, color: "var(--charcoal)", display: "none" },
  searchWrap: { flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", maxWidth: 560 },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" },
  searchBtn: { background: "var(--green)", color: "var(--on-accent)", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600 },
  headerActions: { display: "flex", alignItems: "center", gap: 18, marginLeft: "auto" },
  iconLink: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", fontSize: 11, color: "var(--ink)" },
  cartLink: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", fontSize: 11, color: "var(--ink)" },
  cartBadge: { position: "absolute", top: -4, right: -8, background: "var(--jollof)", color: "var(--on-accent)", fontSize: 10, borderRadius: 10, padding: "1px 6px", fontWeight: 700 },
  menuToggle: { display: "none", background: "none", border: "none" },
  subNav: { background: "var(--charcoal)" },
  subNavInner: { maxWidth: 1180, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" },
  subNavLink: { background: "none", border: "none", color: "var(--ink)", fontSize: 13, padding: "10px 12px", whiteSpace: "nowrap" },

  hero: { background: "linear-gradient(180deg, var(--panel), var(--paper))", color: "var(--ink)" },
  heroInner: { maxWidth: 1180, margin: "0 auto", padding: "56px 20px 64px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" },
  heroText: {},
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,197,63,.16)", color: "var(--green)", padding: "5px 12px", borderRadius: 20, fontSize: 12, letterSpacing: .5 },
  heroTitle: { fontFamily: "var(--font-display)", fontSize: 42, lineHeight: 1.15, margin: "18px 0 16px" },
  heroSub: { fontSize: 16, color: "var(--ink-soft)", maxWidth: 480, margin: "0 0 26px" },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap" },
  heroStats: { display: "flex", gap: 28, marginTop: 34 },
  ticket: { position: "absolute", left: -18, bottom: -22, width: "min(78%, 280px)", background: "var(--panel)", border: "2px dashed var(--line-soft)", borderRadius: 12, padding: "16px 18px", fontFamily: "var(--font-mono)", boxShadow: "0 20px 45px rgba(0,0,0,.7)", zIndex: 2 },
  ticketHead: { color: "var(--gold)", fontSize: 12, letterSpacing: 2, marginBottom: 12 },
  ticketRow: { display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px dashed var(--line)", fontSize: 13, color: "var(--ink)" },
  ticketPrice: { color: "var(--jollof-deep)", fontWeight: 600 },
  ticketFoot: { textAlign: "center", fontSize: 11, color: "var(--ink-soft)", marginTop: 12, letterSpacing: .5 },
  heroPanel: { position: "relative" },
  heroImageFrame: { position: "relative", overflow: "visible" },
  heroImageInner: { borderRadius: 22, overflow: "hidden", aspectRatio: "5 / 4", background: "linear-gradient(145deg, var(--panel), #000000)", boxShadow: "0 24px 60px rgba(0,0,0,.65)" },

  section: { maxWidth: 1180, margin: "0 auto", padding: "52px 20px" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26, flexWrap: "wrap", gap: 10 },
  eyebrowSmall: { fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: 26, margin: "4px 0 0" },
  sectionAction: { background: "none", border: "none", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600 },

  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 },
  categoryCard: { background: "#1F2218", border: "1px solid #33362B", borderRadius: 12, padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, textAlign: "left", color: "#FFFFFF" },
  categoryIcon: { width: 50, height: 50, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "4px 0" },
  categoryName: { fontSize: 14, fontWeight: 600 },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 },
  productCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
  productImg: { position: "relative", background: "var(--panel)", border: "none", height: 130, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", overflow: "hidden", padding: 0 },
  productTag: { position: "absolute", top: 8, left: 8, background: "var(--gold)", color: "#3A2600", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 },
  lowStockTag: { position: "absolute", top: 8, right: 8, background: "#E24B4A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 },
  productBody: { padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 4 },
  productName: { background: "none", border: "none", textAlign: "left", padding: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 },
  productUnit: { fontSize: 12, color: "var(--text-secondary)" },
  productFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  productPrice: { fontWeight: 700, color: "var(--jollof-deep)", fontSize: 15 },
  addBtn: { display: "flex", alignItems: "center", gap: 4, background: "var(--green)", color: "var(--on-accent)", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 12, fontWeight: 600 },

  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 },
  featureItem: { padding: "10px 4px" },
  featureIcon: { width: 44, height: 44, borderRadius: 10, background: "var(--panel)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" },

  reviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 },
  reviewCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 },
  reviewStars: { display: "flex", gap: 2, marginBottom: 0 },
  reviewText: { color: "var(--ink)", fontSize: 13.5, lineHeight: 1.6, margin: 0 },
  reviewName: { color: "var(--green)", fontSize: 13, fontWeight: 600 },

  ctaBand: { background: "var(--surface)" },
  ctaBandInner: { maxWidth: 1180, margin: "0 auto", padding: "40px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 },

  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--jollof)", color: "var(--on-accent)", border: "none", borderRadius: 8, padding: "12px 20px", fontWeight: 700, fontSize: 14 },
  btnGhost: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 20px", fontWeight: 600, fontSize: 14 },
  btnGhostLight: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 20px", fontWeight: 600, fontSize: 14 },

  shopWrap: { maxWidth: 1180, margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 30, alignItems: "start" },
  shopSidebar: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, position: "sticky", top: 140 },
  sidebarTitle: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-secondary)", margin: "4px 0 10px" },
  sidebarItem: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "9px 10px", borderRadius: 7, fontSize: 13.5, color: "var(--ink)" },
  sidebarItemActive: { background: "var(--green)", fontWeight: 700, color: "var(--on-accent)" },
  shopMain: {},
  shopMainHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 },
  searchInputAlt: { border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, minWidth: 220, background: "var(--surface)", color: "var(--ink)" },

  emptyState: { textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "var(--text-secondary)" },

  pageNarrow: { maxWidth: 900, margin: "0 auto", padding: "36px 20px" },
  backLink: { display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--ember)", fontWeight: 600, fontSize: 13, marginBottom: 16 },
  productDetail: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 36, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 30 },
  productDetailImg: { background: "var(--panel)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220, overflow: "hidden", padding: 0 },
  productDetailBody: {},
  qtyRow: { display: "flex", alignItems: "center", gap: 12 },
  qtyBtn: { width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" },
  qtyVal: { minWidth: 20, textAlign: "center", fontWeight: 700 },
  catTagSmall: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ember)", fontWeight: 600 },
 
  cartLayout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 26, alignItems: "start" },
  cartList: { display: "flex", flexDirection: "column", gap: 10 },
  cartRow: { display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" },
  cartRowImg: { width: 44, height: 44, borderRadius: 8, background: "var(--panel)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden", padding: 0 },
  trashBtn: { background: "none", border: "none", color: "#E24B4A" },
  summaryCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 14, padding: "5px 0" },

  formCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "12px 0 6px" },
  input: { width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, background: "var(--surface)", color: "var(--ink)" },
  textarea: { width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, resize: "vertical", background: "var(--surface)", color: "var(--ink)" },
  select: { width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", fontSize: 13, background: "var(--surface)", color: "var(--ink)" },
  paymentOptions: { display: "flex", flexDirection: "column", gap: 8 },
  paymentOption: { textAlign: "left", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13.5 },
  paymentOptionActive: { borderColor: "var(--jollof)", background: "var(--panel)", color: "var(--jollof-deep)", fontWeight: 700 },

  authWrap: { display: "flex", justifyContent: "center", padding: "50px 20px" },
  authCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 32, width: "100%", maxWidth: 400 },
  inputIconWrap: { display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", background: "var(--surface)" },
  inputIcon: { border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent", color: "var(--ink)" },
  eyeBtn: { background: "none", border: "none", display: "flex" },
  errorBox: { display: "flex", alignItems: "center", gap: 6, background: "rgba(226,75,74,.14)", color: "#FF8F7A", fontSize: 13, padding: "9px 12px", borderRadius: 8, margin: "10px 0" },
  linkBtn: { background: "none", border: "none", color: "var(--ember)", fontWeight: 700, padding: 0 },
  linkBtnMuted: { display: "flex", alignItems: "center", gap: 4, justifyContent: "center", width: "100%", background: "none", border: "none", color: "var(--text-secondary)", fontSize: 12, marginTop: 10 },

  accountHead: { display: "flex", alignItems: "center", gap: 16, marginBottom: 26 },
  avatarCircle: { width: 54, height: 54, borderRadius: "50%", background: "var(--jollof)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  accountGrid: { display: "flex", gap: 20, flexWrap: "wrap" },
  orderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid var(--border)" },
  statusPill: { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 },
  statusPillSm: { fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "var(--panel)", color: "var(--ink)" },

  adminWrap: { display: "flex", minHeight: "100vh" },
  adminSidebar: { width: 220, background: "var(--panel)", color: "var(--ink)", display: "flex", flexDirection: "column", padding: 16, gap: 4 },
  adminLogo: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 20, padding: "4px 6px" },
  adminNavItem: { display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "var(--ink-soft)", padding: "10px 12px", borderRadius: 8, fontSize: 14, textAlign: "left" },
  adminNavActive: { background: "rgba(139,197,63,.16)", color: "var(--green)", fontWeight: 700 },
  adminMain: { flex: 1, padding: "30px 34px", background: "var(--cream)" },

  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, margin: "20px 0" },
  statCard: { display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 },
  statIcon: { width: 38, height: 38, borderRadius: 9, background: "var(--panel)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" },
  alertBox: { display: "flex", alignItems: "center", gap: 8, background: "rgba(226,121,42,.14)", color: "var(--jollof-deep)", fontSize: 13.5, padding: "12px 16px", borderRadius: 10, marginTop: 10 },

  tableWrap: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "auto", marginTop: 12 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13.5 },
  iconBtnSm: { width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "var(--ink)" },

  footer: { background: "var(--panel)", color: "var(--ink)", marginTop: 40 },
  footerInner: { maxWidth: 1180, margin: "0 auto", padding: "44px 20px 20px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 1fr", gap: 30 },
  footerHead: { fontSize: 13, letterSpacing: 1, color: "#E8A33D", marginBottom: 10 },
  footerLink: { display: "block", background: "none", border: "none", color: "var(--ink-soft)", fontSize: 13.5, padding: "4px 0", textAlign: "left" },
  footerText: { color: "var(--ink-soft)", fontSize: 13.5, margin: "4px 0" },
  footerBottom: { borderTop: "1px solid var(--border)", textAlign: "center", padding: "14px 20px", fontSize: 12, color: "var(--ink-soft)" },
};
