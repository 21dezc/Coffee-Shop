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
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  Divider,
} from "@mui/material";
import { Product } from "./ProductCard";
import { CartOptions, Sweetness, Temperature } from "../reducers/cartReducer";

type ProductOptionsDialogProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, options: CartOptions) => void;
};

const SWEETNESS_LEVELS: Sweetness[] = ["0%", "25%", "50%", "100%", "125%"];
const BLEND_PRICE = 15;

export default function ProductOptionsDialog({
  product,
  open,
  onClose,
  onConfirm,
}: ProductOptionsDialogProps) {
  const [temperature, setTemperature] = useState<Temperature>("ร้อน");
  const [blended, setBlended] = useState(false);
  const [sweetness, setSweetness] = useState<Sweetness>("100%");

  if (!product) return null;

  const finalPrice = product.price + (blended ? BLEND_PRICE : 0);

  const handleConfirm = () => {
    onConfirm(product, { temperature, blended, sweetness });
    // รีเซ็ตค่ากลับเป็นค่าเริ่มต้นสำหรับครั้งถัดไป
    setTemperature("ร้อน");
    setBlended(false);
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
          <ToggleButton value="ร้อน">ร้อน</ToggleButton>
          <ToggleButton value="เย็น">เย็น</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={blended}
                onChange={(e) => setBlended(e.target.checked)}
              />
            }
            label={`ปั่น +${BLEND_PRICE}`}
          />
        </Box>

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
              label={
                level === "0%"
                  ? "ไม่หวาน 0%"
                  : level === "25%"
                  ? "หวานน้อย 25%"
                  : level
              }
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
