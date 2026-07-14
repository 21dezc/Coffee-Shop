"use client";

import {
  useState,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Chip,
  Button,
} from "@mui/material";
import ProductCard, { Product } from "./components/ProductCard";
import { cartReducer, CartItem } from "./reducers/cartReducer";
import Cart from "./components/Cart";
import Link from "next/link";

const products: Product[] = [
  {
    id: 1,
    name: "Cappuccino",
    price: 65,
    category: "Coffee",
    image: "coffee.jpg",
  },
  {
    id: 2,
    name: "Latte",
    price: 75,
    category: "Coffee",
    image: "coffee.jpg",
  },
  {
    id: 3,
    name: "Green Tea",
    price: 60,
    category: "Tea",
    image: "coffee.jpg",
  },
  {
    id: 4,
    name: "Thai Tea",
    price: 65,
    category: "Tea",
    image: "coffee.jpg",
  },
  {
    id: 5,
    name: "Croissant",
    price: 55,
    category: "Bakery",
    image: "coffee.jpg",
  },
  {
    id: 6,
    name: "Cheesecake",
    price: 95,
    category: "Dessert",
    image: "coffee.jpg",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [cart, dispatch] = useReducer(
  cartReducer,
  [] as CartItem[]
  );

  useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const items: CartItem[] = JSON.parse(savedCart);

    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({
          type: "ADD_TO_CART",
          payload: item,
        });
      }
    });
  }
}, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

  const addToCart = useCallback(
  (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
  },
  []
);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" || product.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <Container sx={{ py: 5 }}>
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
          onAddToCart={addToCart}
       />
      </Grid>
    ))}
    </Grid>
      <Cart
        cart={cart}
        dispatch={dispatch}
        />
        <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mt: 4,
    mb: 2,
  }}
  >
  <Button
    component={Link}
    href="/cart"
    variant="contained"
    color="success"
  >
    View Cart
  </Button>
</Box>
    </Container>
  );
}