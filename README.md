# HOOK ที่รับผิดชอบ

โปรเจกต์ Coffee Shop Ordering System มีการใช้งาน React Hooks หลายชนิด โดย Hook ที่รับผิดชอบคือ `useState`, `useEffect` และ `useReducer`

---

# 1. useState

## หลักการทำงาน

useState เป็น React Hook ที่ใช้สำหรับเก็บและจัดการข้อมูล (State) ภายใน Function Component เมื่อ State เปลี่ยนแปลง React จะ Render Component ใหม่เพื่อแสดงข้อมูลล่าสุด

โดย useState จะคืนค่ากลับมาเป็นอาร์เรย์ที่ประกอบด้วยค่าปัจจุบันของ State และฟังก์ชันสำหรับอัปเดตค่า

---

## ตัวอย่างโค้ด

```tsx
const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");
```

เมื่อผู้ใช้พิมพ์ข้อความในช่องค้นหา

```tsx
<TextField
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

---

## เหตุผลที่เลือกใช้

ใช้สำหรับเก็บข้อมูลที่เปลี่ยนแปลงตลอดเวลา เช่น คำค้นหา และหมวดหมู่สินค้า เนื่องจากเป็นข้อมูลที่มีความซับซ้อนไม่มาก จึงเหมาะกับ useState

---

## ข้อดี

- ใช้งานง่าย
- เหมาะกับ State ขนาดเล็ก
- React Render อัตโนมัติเมื่อข้อมูลเปลี่ยน

---

## ข้อจำกัด

- หากมี State หลายตัวและมีเงื่อนไขจำนวนมาก โค้ดจะซับซ้อน
- ไม่เหมาะกับการจัดการข้อมูลที่มีหลาย Action


---

# 2. useEffect

## หลักการทำงาน

useEffect ใช้สำหรับทำงานหลังจาก Component Render เช่น โหลดข้อมูลจาก Local Storage ติดต่อ API หรือบันทึกข้อมูลเมื่อ State เปลี่ยน

โดยสามารถกำหนด Dependency เพื่อควบคุมว่าจะให้ Effect ทำงานเมื่อใด

---

## ตัวอย่างโค้ด

### โหลดข้อมูลจาก Local Storage

```tsx
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    // โหลดข้อมูล
  }
}, []);
```

### บันทึกข้อมูล

```tsx
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

---

## เหตุผลที่เลือกใช้

ใช้สำหรับโหลดข้อมูลตะกร้าสินค้าเมื่อเปิดเว็บ และบันทึกข้อมูลเมื่อมีการเปลี่ยนแปลงของตะกร้าสินค้า

---

## ข้อดี

- ใช้งานกับ Local Storage และ API ได้
- ควบคุมช่วงเวลาการทำงานได้ด้วย Dependency

---

## ข้อจำกัด

- หากกำหนด Dependency ไม่ถูกต้อง อาจเกิดการ Render ซ้ำหรือทำงานวนลูป


---

# 3. useReducer

## หลักการทำงาน

useReducer ใช้จัดการ State ที่มีหลายการทำงาน โดยใช้ Reducer เป็นตัวกำหนดการเปลี่ยนแปลงของข้อมูลผ่าน Action ต่าง ๆ

เมื่อเรียก dispatch() Reducer จะคำนวณและคืนค่า State ใหม่

---

## ตัวอย่างโค้ด

### ประกาศ Reducer

```tsx
const [cart, dispatch] = useReducer(cartReducer, []);
```

### เพิ่มสินค้า

```tsx
dispatch({
  type: "ADD_TO_CART",
  payload: product,
});
```

### Reducer

```tsx
case "ADD_TO_CART":
  ...
```

---

## เหตุผลที่เลือกใช้

ตะกร้าสินค้ามีหลาย Action เช่น เพิ่มสินค้า ลบสินค้า เพิ่มจำนวน และลดจำนวน จึงเหมาะกับ useReducer

---

## ข้อดี

- โค้ดเป็นระเบียบ
- แยก Logic ออกจาก UI
- เพิ่ม Action ใหม่ได้ง่าย

---

## ข้อจำกัด

- เขียนโค้ดมากกว่า useState
- ผู้เริ่มต้นอาจเข้าใจยากกว่า
