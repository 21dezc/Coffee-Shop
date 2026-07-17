"use client";

import { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import ProductCard, { Product } from "./components/ProductCard";
import ProductOptionsDialog from "./components/ProductOptionsDialog";
import CartDrawer from "./components/CartDrawer";
import { useCartContext } from "./context/CartContext";
import { CartOptions } from "./reducers/cartReducer";

const products: Product[] = [
  { id: 1, name: "Cappuccino", price: 65, category: "Coffee", image: "cappu.jpg" },
  { id: 2, name: "Latte", price: 75, category: "Coffee", image: "lattee.jpg" },
  { id: 3, name: "Green Tea", price: 60, category: "Tea", image: "Gtea.jpg" },
  { id: 4, name: "Thai Tea", price: 65, category: "Tea", image: "thaitea.jpg" },
  { id: 5, name: "Croissant", price: 55, category: "Bakery", image: "cs.jpg" },
  { id: 6, name: "Cheesecake", price: 95, category: "Dessert", image: "cheesecake.jpg" },
];

// หมวดที่ต้องเลือกตัวเลือกก่อนเพิ่มลงตะกร้า (เครื่องดื่ม)
const CUSTOMIZABLE_CATEGORIES = ["Coffee", "Tea"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [optionsProduct, setOptionsProduct] = useState<Product | null>(null);

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
    totalCount,
    warning,
    dismissWarning,
  } = useCartContext();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "All" || product.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category]);

  // กด Add to Cart: เครื่องดื่มต้องเลือกตัวเลือกก่อน ส่วนขนม/เบเกอรี่เพิ่มเข้าตะกร้าได้เลย
  const handleAddToCart = (product: Product) => {
    if (CUSTOMIZABLE_CATEGORIES.includes(product.category)) {
      setOptionsProduct(product);
    } else {
      addToCart(product);
    }
  };

  const handleConfirmOptions = (product: Product, options: CartOptions) => {
    addToCart(product, options);
  };

  return (
    <Container sx={{ py: 5, pb: 12 }}>
      <Typography
        variant="h3"
        sx={{
        fontWeight: "bold",
        textAlign: "center",
        mb: 3,
      }}
      >
        ☕ Coffee Shop
      </Typography>

      <TextField
        fullWidth
        label="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="ล้างช่องค้นหา"
                  size="small"
                  onClick={() => setSearch("")}
                >
                  ✕
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />

      <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
        {["All", "Coffee", "Tea", "Bakery", "Dessert"].map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            color={category === item ? "primary" : "default"}
            onClick={() => setCategory(item)}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
      <Grid
        key={product.id}
        size={{ xs: 12, sm: 6, md: 4 }}
      >
        <ProductCard
          product={product}
          onAddToCart={handleAddToCart}
       />
      </Grid>
    ))}
    </Grid>

      <ProductOptionsDialog
        product={optionsProduct}
        open={optionsProduct !== null}
        onClose={() => setOptionsProduct(null)}
        onConfirm={handleConfirmOptions}
      />

      <CartDrawer
        open={cartOpen}
        onOpen={() => setCartOpen(true)}
        onClose={() => setCartOpen(false)}
        cart={cart}
        totalPrice={totalPrice}
        totalCount={totalCount}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
      />

      <Snackbar
        open={warning !== null}
        autoHideDuration={3000}
        onClose={dismissWarning}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={dismissWarning} severity="warning" sx={{ width: "100%" }}>
          {warning}
        </Alert>
      </Snackbar>
    </Container>
  );
}
