# 🚀 Hostinger Deployment Guide – PESC Council Platform

इस गाइड में PESC Council प्लेटफ़ॉर्म को **Hostinger** पर लाइव चलाने के पूरे स्टेप्स आसान हिंदी और अंग्रेजी में दिए गए हैं।

---

## 📌 तरीके: Hostinger पर 2 मुख्य विकल्प होते हैं

1. **विकल्प 1: Hostinger Web / Cloud Hosting (hPanel Node.js Manager)**
2. **विकल्प 2: Hostinger VPS (Ubuntu Linux Server)**

---

## 🔹 विकल्प 1: Hostinger hPanel (Node.js Application Manager) पर सेटअप

### स्टेप 1: फ़ाइल अपलोड करें (Upload ZIP)
1. अपने **Hostinger hPanel** में लॉगिन करें।
2. **Websites** ➔ अपनी वेबसाइट के **Manage** पर क्लिक करें।
3. **Files** ➔ **File Manager** खोलें।
4. `public_html` फ़ोल्डर में जाएं।
5. यह `pesc-platform-hostinger.zip` फ़ाइल अपलोड करें।
6. राइट क्लिक करके **Extract** (अनज़िप) करें।

### स्टेप 2: Node.js Application Configure करें
1. hPanel के बायीं तरफ सर्च बार में **Node.js** सर्च करें या **Advanced ➔ Node.js** पर क्लिक करें।
2. **Create Application** बटन दबाएं:
   - **Node.js version**: `22.x` (या 22+)
   - **Application mode**: `Production`
   - **Application root**: `public_html` (या जिस फ़ोल्डर में कोड अनज़िप किया है)
   - **Application startup file**: `src/server.js`
   - **Application URL**: अपना डोमेन सेलेक्ट करें (जैसे `example.com` या `pescouncil.in`)
3. **Save** / **Create** पर क्लिक करें।

### स्टेप 3: Dependencies इनस्टॉल करें (NPM Install)
1. Node.js पेज पर ही नीचे **NPM Install** का बटन दिखाई देगा, उस पर क्लिक करें।
2. (या SSH Access / Terminal खोलकर `cd public_html && npm install --omit=dev` चलाएं)।

### स्टेप 4: `.env` फ़ाइल चेक करें
- `.env` फ़ाइल में अपना डोमेन नाम सेट कर लें:
  ```env
  PORT=3000
  NODE_ENV=production
  BASE_DOMAIN=yourdomain.com
  PUBLIC_URL=https://yourdomain.com
  COOKIE_SECRET=your_secret_key_here
  ```

### स्टेप 5: Start / Restart Application
- Node.js मैनेजर में **Start** या **Restart** बटन पर क्लिक करें।
- आपकी वेबसाइट लाइव हो जाएगी!

---

## 🔹 विकल्प 2: Hostinger VPS (Linux / Ubuntu) पर सेटअप

अगर आपके पास Hostinger का **VPS** है, तो यह सबसे फ़ास्ट और बेस्ट तरीका है:

1. **SSH के ज़रिए अपने VPS में लॉगिन करें**:
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Node.js 22 और Unzip इनस्टॉल करें**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt update && sudo apt install -y nodejs unzip
   ```

3. **प्रोजेक्ट फ़ोल्डर बनाएं और ZIP अनज़िप करें**:
   ```bash
   mkdir -p /var/www/pesc
   cd /var/www/pesc
   # फ़ाइल को /var/www/pesc में अपलोड करें
   unzip pesc-platform-hostinger.zip
   ```

4. **Dependencies इनस्टॉल करें**:
   ```bash
   npm install --omit=dev
   ```

5. **PM2 से बैकग्राउंड में 24x7 चलाएं**:
   ```bash
   sudo npm install -g pm2
   pm2 start src/server.js --name pesc
   pm2 save
   pm2 startup
   ```

6. **Nginx Reverse Proxy (Optional / Recommended for SSL)**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com *.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   निःशुल्क SSL सर्टिफिकेट के लिए:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com
   ```

---

## 🔑 डिफ़ॉल्ट लॉगिन क्रेडेंशियल्स (All Included Out-of-the-Box)

इस ज़िप फ़ाइल में डेटाबेस (`data/pesc.db`) पहले से पूरी तरह तैयार है जिसमें सभी 4 सेंटर और 40 छात्र पहले से मौजूद हैं:

| रोल (Role) | ईमेल / आईडी | पासवर्ड |
|---|---|---|
| **हेड ऑफिस एडमिन** | `admin@pescouncil.in` | `Admin#12345678` |
| **सेंटर 1 (Navya Institute)** | `owner@navya.test` या `PESC00001` | `OwnerPass#12345` |
| **सेंटर 2 (Apex Academy)** | `director@apexskills.com` या `PESC00002` | `OwnerPass#12345` |
| **राज्य समन्वयक (Coordinator)**| `coord@pescouncil.in` | `Coord#12345678` |
| **छात्र (Student 1)** | `rahul@student.pescouncil.in` | `Student@123` |
| **बाकी सभी छात्र** | छात्र कोड (e.g. `PESC00001-2026-00002`) | `Student@123` |

---
अगर किसी भी समय डेटा फिर से रीसेट करना हो, तो बस टर्मिनल में चलाएं:
```bash
npm run seed
```
