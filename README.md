# Smart Classroom Dashboard

เว็บภาษาไทยสำหรับ IoT 212 ใช้ HTML, CSS, Vanilla JavaScript ES Modules, Firebase Web SDK 11.6.0 และ Chart.js 4.4.8 ผ่าน CDN ไม่มี npm หรือขั้นตอน build

## เปิดในเครื่อง

เปิด Terminal ในโฟลเดอร์นี้ แล้วรัน Python ที่ติดตั้งในเครื่อง:

```powershell
py -m http.server 8080 --bind 127.0.0.1
```

เปิด http://localhost:8080 ในเบราว์เซอร์ อย่าเปิด index.html ด้วย file:// เพราะใช้ ES Modules ต้องเชื่อมอินเทอร์เน็ตเพื่อโหลด Firebase, Chart.js และ Google Fonts (มีฟอนต์สำรอง)

## ข้อมูลจริง

- อ่านอย่างเดียวจาก `https://iot-212-64025-default-rtdb.asia-southeast1.firebasedatabase.app`
- `onValue()` ติดตาม `lab/esp32-01/latest`
- `onValue(query(..., orderByKey(), limitToLast(50)))` ติดตาม `lab/esp32-01/history` ไม่โหลดประวัติทั้งหมด
- history ใช้ Push ID ที่ Firebase REST POST สร้าง จึงเลือก 50 key ล่าสุดก่อนเรียง timestamp ทางเว็บ ไม่ต้องเพิ่ม index ใน Rules เดิม
- ต้องมีสิทธิ์อ่านสอง path นี้ กฎที่อาจารย์ให้เปิด `/lab` รองรับอยู่แล้ว
- รองรับ `temp`, `humi`, `co2`, `pm25`, `light`, `noise`, `device_id`, `timestamp`
- timestamp เป็น Unix วินาที คูณ 1000 ก่อนแสดงเวลา `Asia/Bangkok`
- Online เมื่ออายุข้อมูลไม่เกิน 30 วินาที ใช้ Firebase serverTimeOffset ช่วยปรับนาฬิกาเว็บ; เวลาอนาคตเกิน 5 วินาทีระบุว่าคลาดเคลื่อน
- แยกสถานะบอร์ดจากการเชื่อมต่อฐานข้อมูล; เมื่อ Offline ค่ายังคงแสดงเป็นข้อมูลล่าสุดที่ได้รับ
- ข้อมูลขาด/ผิดรูปแบบแสดงขีด ไม่มีการสร้างข้อมูลจำลองในเว็บ
- กราฟใช้ Chart instance เดียว อัปเดตด้วย update และใช้แกนเวลาแบบตัวเลขให้ระยะห่างตรงกับเวลาจริง
- ตารางแสดง 10 รายการล่าสุด ส่วนปุ่ม CSV ส่งออกสูงสุด 50 รายการที่โหลดในหน้า

## คะแนนห้องเรียน

เป็นเกณฑ์สาธิตของโครงงานสำหรับเซ็นเซอร์จำลอง ไม่ใช่ AQI หรือมาตรฐานรับรองสุขภาพ คำแนะนำใช้กฎ ไม่ใช้บริการ AI/API เพิ่มเติม ดูเกณฑ์ได้ที่ปุ่ม i บนการ์ดคะแนน

แต่ละค่าได้ 100/75/45/15 ตามสีเขียว/เหลือง/ส้ม/แดง แล้วถ่วงน้ำหนัก CO₂ 30%, PM2.5 30%, อุณหภูมิ 15%, ความชื้น 10%, เสียง 15% ต้องมีครบห้าค่าจึงแสดงคะแนน ความสว่างไม่รวมคะแนน ขอบเขตการให้สีอยู่ใน `metrics` ของ app.js และแสดงใน dialog อัตโนมัติ

## เผยแพร่ GitHub Pages เมื่อพร้อม

1. สร้าง repository ชื่อ **freeboard** ใน GitHub ของคุณ (Public หากใช้ Pages บนบัญชีฟรี)
2. อัปโหลด **เนื้อหาในโฟลเดอร์นี้** ไป root ของ repository: index.html, styles.css, app.js, README.md และ .gitignore ไม่อัปโฟลเดอร์ครอบ
3. เปิด Settings → Pages → Build and deployment → Deploy from a branch
4. เลือก branch main และ /(root) แล้ว Save
5. รอการ deploy สำเร็จ เปิด `https://GITHUB_USERNAME.github.io/freeboard` โดยแทนชื่อบัญชีจริง GitHub อาจเปลี่ยน URL เป็น /freeboard/ อัตโนมัติ
6. ทดสอบจากมือถือและหน้าต่างส่วนตัว เห็นข้อมูลเปลี่ยนโดยไม่ refresh พร้อมเปิดบอร์ดระหว่างตรวจงาน

งานนี้ยังไม่ได้ push หรือเผยแพร่ให้ จะทำหลังผู้ใช้ยืนยัน

## ตรวจสอบก่อนส่ง

- ESPHome Log แสดง Latest HTTP status = 200 และ History HTTP status = 200
- latest มี timestamp และหกค่า history เพิ่ม Push ID ทุกรอบ
- เว็บมีค่าทั้งหก กราฟเปลี่ยนเซ็นเซอร์ได้ ตารางและ CSV มีข้อมูล
- ถอดไฟบอร์ดแล้วเกิน 30 วินาทีต้องเปลี่ยน Offline (เว็บไม่สร้างค่ามาทดแทน)
- หากไม่มี history ให้ตรวจ SNTP และการ POST บนบอร์ด
- หาก Permission denied ให้ตรวจ Rules ของ path /lab; ไม่จำเป็นต้องเปิดสิทธิ์ root
- กฎเปิดเขียน /lab ตามห้องทดลองอนุญาตบุคคลอื่นเขียนได้ ควรใช้ Authentication และ Rules จำกัดอุปกรณ์เมื่อใช้งานจริง
- Firebase web config เป็นค่าระบุโปรเจกต์ ไม่ใช่สิทธิ์ Admin; ห้ามอัปโหลด secrets.yaml, รหัส Wi-Fi, service account หรือ API encryption key ของ ESPHome
- ชื่อ Project ที่แสดงคือ iot-212 ส่วน Database instance คือ iot-212-64025-default-rtdb หากอาจารย์ต้องการชื่อ instance ตรง iot-212 ต้องยืนยันข้อกำหนดนี้กับอาจารย์

## แหล่งอ้างอิง

- Firebase realtime listeners และ query: https://firebase.google.com/docs/database/web/lists-of-data
- Chart.js การอัปเดต instance: https://www.chartjs.org/docs/latest/developers/updates.html
