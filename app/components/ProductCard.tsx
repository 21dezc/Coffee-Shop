"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: "Coffee" | "Tea" | "Bakery" | "Dessert";
  image: string;
};

export const DEFAULT_PRODUCT_PRICE = 50;

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

function ProductCard({
  product,
  onAddToCart,
}: 
ProductCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{
          height: 220,
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
            variant="h6"
            sx={{
            fontWeight: "bold"
        }}
        >
          {product.name}
        </Typography>

        <Typography color="text.secondary">
          {product.category}
        </Typography>

        <Typography
          variant="h6"
          color="primary"
          sx={{ mt: 1 }}
        >
          ฿{product.price}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: "auto" }}
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
} 
export default memo(ProductCard);