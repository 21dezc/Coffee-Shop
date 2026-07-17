"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Divider,
} from "@mui/material";
import { Product, DEFAULT_PRODUCT_PRICE } from "./ProductCard";
import {
  BLEND_SURCHARGE,
  CartOptions,
  Sweetness,
  Temperature,
} from "../reducers/cartReducer";

type ProductOptionsDialogProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, options: CartOptions) => void;
};

const TEMPERATURE_OPTIONS: Temperature[] = ["ร้อน", "เย็น", "ปั่น"];
const SWEETNESS_LEVELS: Sweetness[] = ["0%", "25%", "50%", "75%", "100%"];
const SWEETNESS_LABELS: Record<Sweetness, string> = {
  "0%": "ไม่หวาน 0%",
  "25%": "หวานน้อย 25%",
  "50%": "หวานปานกลาง 50%",
  "75%": "หวานมาก 75%",
  "100%": "หวานมากที่สุด 100%",
};

export default function ProductOptionsDialog({
  product,
  open,
  onClose,
  onConfirm,
}: ProductOptionsDialogProps) {
  const [temperature, setTemperature] = useState<Temperature>("ร้อน");
  const [sweetness, setSweetness] = useState<Sweetness>("100%");

  if (!product) return null;

  const basePrice = product.price ?? DEFAULT_PRODUCT_PRICE;
  const finalPrice = basePrice + (temperature === "ปั่น" ? BLEND_SURCHARGE : 0);

  const handleConfirm = () => {
    onConfirm(product, { temperature, sweetness });
    // รีเซ็ตค่ากลับเป็นค่าเริ่มต้นสำหรับครั้งถัดไป
    setTemperature("ร้อน");
    setSweetness("100%");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {product.name}{" "}
        <Typography component="span" color="primary">
          ฿{finalPrice}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>อุณหภูมิ</Typography>
        <ToggleButtonGroup
          exclusive
          value={temperature}
          onChange={(_, value) => value && setTemperature(value)}
          sx={{ mb: 2 }}
        >
          {TEMPERATURE_OPTIONS.map((option) => (
            <ToggleButton key={option} value={option}>
              {option === "ปั่น" ? `ปั่น +${BLEND_SURCHARGE}` : option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ fontWeight: "bold", mb: 1 }}>
          ระดับความหวาน
        </Typography>
        <RadioGroup
          value={sweetness}
          onChange={(e) => setSweetness(e.target.value as Sweetness)}
        >
          {SWEETNESS_LEVELS.map((level) => (
            <FormControlLabel
              key={level}
              value={level}
              control={<Radio />}
              label={SWEETNESS_LABELS[level]}
            />
          ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button variant="contained" onClick={handleConfirm}>
          เพิ่มลงตะกร้า ฿{finalPrice}
        </Button>
      </DialogActions>
    </Dialog>
  );
}