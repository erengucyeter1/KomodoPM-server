# Komodo Project Management System - Server

## 🚀 Proje Hakkında

Komodo Project Management System Backend API'si, moderne römork ve treyler üretimi yapan şirketler için tasarlanmış güçlü bir RESTful API'dir. Bu sistem, NestJS framework'ü kullanarak geliştirilmiş olup, üretim süreçlerinin takibi, proje yönetimi, fatura işlemleri, KDV iade raporu otomasyonu, stok yönetimi ve müşteri ilişkileri gibi kritik iş süreçlerini destekler.

## 🎯 Ana Özellikler

### 🔐 Kimlik Doğrulama ve Yetkilendirme
- JWT tabanlı kimlik doğrulama sistemi
- Rol bazlı erişim kontrolü (RBAC)
- İzin bazlı yetkilendirme (Permission-based authorization)
- Güvenli şifreleme (bcrypt)
- Passport.js entegrasyonu

### 🏗️ Proje Yönetimi
- Treyler üretim projelerinin oluşturulması ve takibi
- Proje durumu yönetimi (Planned, In Progress, Completed, Canceled)
- Bütçe ve maliyet analizi
- Proje giderlerinin detaylı izlenmesi
- Proje bazlı raporlama

### 🚛 Treyler/Römork Yönetimi
- Treyler tipleri ve kategorileri
- Görsel malzeme yönetimi (Base64 image storage)
- Teknik özellik ve sınıflandırma sistemi
- Model bazlı proje atamaları

### 📦 Stok ve Envanter Yönetimi
- Ürün kayıt sistemi
- Stok seviyelerinin takibi
- Ölçü birimli miktar yönetimi
- Hizmet/malzeme kategorilendirmesi
- Proje bazlı malzeme kulımı

### 💰 Finansal Yönetim
- Fatura oluşturma ve takip sistemi
- Müşteri/Tedarikçi yönetimi
- KDV hesaplamaları ve muafiyet yönetimi
- Uluslararası ticaret desteği (Export/Import)
- Gümrük beyanname entegrasyonu

### 📊 KDV İade Raporu Otomasyonu
- Otomatik KDV iade raporu oluşturma
- En uygun faturaların seçimi
- PDF rapor üretimi (Puppeteer entegrasyonu)
- Proje bazlı iade hesaplamaları
- Yasal uyumluluk kontrolü

  ![image](https://github.com/user-attachments/assets/c3803da0-9c01-4ccd-b919-0004adb09df5)


### 💬 İletişim ve Bildirimler
- Dahili mesajlaşma sistemi
- Real-time bildirimler (Socket.io)
- Kullanıcı durumu takibi
- Proje bazlı iletişim

### 🔍 QR Kod Sistemi
- QR kod üretimi
- Logo entegrasyonlu QR kodlar
- Proje ve envanter takibi için QR kod desteği

### 📈 Raporlama ve Analiz
- Proje maliyet raporları
- KDV iade raporları
- PDF rapor üretimi
- Excel/CSV export özellikleri
- Finansal analiz raporları

## 🛠️ Teknoloji Stack

### Backend Framework
- **NestJS 11** - Progressive Node.js framework
- **TypeScript** - Tip güvenliği ve gelişmiş geliştirici deneyimi
- **Node.js** - Runtime environment

### Veritabanı ve ORM
- **PostgreSQL** - Ana veritabanı
- **Prisma ORM** - Modern database toolkit
- **Redis** - Caching ve session yönetimi

### Kimlik Doğrulama ve Güvenlik
- **Passport.js** - Kimlik doğrulama middleware
- **JWT (JSON Web Tokens)** - Token bazlı authentication
- **bcrypt** - Şifre hashleme

### API ve Dokümantasyon
- **Swagger/OpenAPI** - API dokümantasyonu
- **class-validator** - DTO validasyonu
- **class-transformer** - Veri dönüşümü

### Dosya ve Rapor İşleme
- **Puppeteer** - PDF üretimi
- **Canvas** - Görsel işleme
- **QRCode** - QR kod üretimi

### Deployment ve DevOps
- **Docker** - Konteynerizasyon
- **Docker Compose** - Çoklu servis yönetimi

## 📁 Proje Yapısı

```
server/
├── src/                          # Kaynak kod
│   ├── auth/                    # Kimlik doğrulama modülü
│   │   ├── dto/                # DTO'lar
│   │   ├── strategy/           # Passport stratejileri
│   │   └── entities/           # Auth entity'leri
│   ├── users/                  # Kullanıcı yönetimi
│   ├── authorization/          # Yetkilendirme sistemi
│   ├── projects/               # Proje yönetimi
│   ├── trailers/               # Treyler/römork yönetimi
│   ├── stock/                  # Stok yönetimi
│   ├── invoice/                # Fatura yönetimi
│   ├── invoice-detail/         # Fatura detayları
│   ├── customer-supplier/      # Müşteri/tedarikçi yönetimi
│   ├── project-expense/        # Proje giderleri
│   ├── report/                 # Raporlama sistemi
│   ├── bill/                   # Fatura işlemleri
│   ├── qrcode/                 # QR kod sistemi
│   ├── chat/                   # Mesajlaşma sistemi
│   ├── messages/               # Mesaj yönetimi
│   ├── permission_requests/    # İzin talepleri
│   ├── redis/                  # Redis entegrasyonu
│   ├── prisma/                 # Prisma servis
│   ├── common/                 # Ortak utilities
│   ├── app.module.ts           # Ana uygulama modülü
│   └── main.ts                 # Uygulama giriş noktası
├── prisma/                     # Veritabanı şemaları
│   ├── schema/                 # Prisma schema
│   │   ├── schema.prisma      # Ana schema dosyası
│   │   └── migrations/        # Veritabanı migrasyonları
│   ├── scripts/               # Veritabanı scriptleri
│   └── sql/                   # Raw SQL dosyaları
├── test/                      # Test dosyaları
├── scripts/                   # Yardımcı scriptler
├── storage/                   # Dosya depolama
├── dist/                      # Build çıktıları
├── docker-compose.yml         # Docker compose konfigürasyonu
├── tsconfig.json              # TypeScript konfigürasyonu
├── nest-cli.json              # NestJS CLI konfigürasyonu
└── package.json               # NPM bağımlılıkları
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18.0 veya üzeri
- PostgreSQL 13 veya üzeri
- Redis 6 veya üzeri
- npm, yarn veya pnpm

### Environment Variables
`.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/komodo"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/komodo"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Application
PORT=3000
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DEST="./storage/uploads"

# Report Generation
REPORT_OUTPUT_DIR="./storage/reports"
```

### Docker ile Hızlı Başlangıç (Önerilen)

```bash
# Repository'yi klonlayın
git clone [repository-url]
cd server

# Docker servisleri başlatın
docker-compose up -d

# Bağımlılıkları yükleyin
npm install

# Veritabanını kurulum
npm run db:setup

# Development server'ı başlatın
npm run start:dev
```

### Manuel Kurulum

```bash
# Repository'yi klonlayın
git clone [repository-url]
cd server

# Bağımlılıkları yükleyin
npm install

# PostgreSQL ve Redis'i başlatın (manuel kurulum gerekli)

# Prisma client'ı oluşturun
npm run prisma:generate

# Veritabanı migrasyonlarını çalıştırın
npm run prisma:migrate

# Trigger'ları uygulayın
npm run apply-triggers

# Seed verilerini yükleyin
npm run seed

# Development server'ı başlatın
npm run start:dev
```

## 🔧 NPM Scripts

### Development
```bash
npm run start:dev          # Development mode (watch mode)
npm run start:debug        # Debug mode
npm run start              # Normal start
npm run start:prod         # Production mode
```

### Database Operations
```bash
npm run prisma:generate    # Prisma client oluştur
npm run prisma:migrate     # Migrasyonları çalıştır
npm run db:setup          # Tam veritabanı kurulumu
npm run db:seed           # Sadece seed verilerini yükle
npm run seed              # Manuel seed çalıştır
npm run apply-triggers    # Database trigger'larını uygula
npm run permissionSeed    # İzin verilerini yükle
npm run rawQuery          # Raw SQL script çalıştır
```

### Build ve Production
```bash
npm run build             # Production build
npm run format            # Kod formatla
npm run lint             # Lint kontrolü
```

### Testing
```bash
npm run test             # Unit testler
npm run test:watch       # Watch mode testler
npm run test:cov         # Coverage raporu
npm run test:debug       # Debug mode testler
npm run test:e2e         # End-to-end testler
```

## 📚 API Dokümantasyonu

Uygulama çalıştırıldıktan sonra Swagger UI dokümantasyonuna erişebilirsiniz:

```
http://localhost:3000/api
```

### Ana Endpoint'ler

#### Authentication
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/register` - Kullanıcı kaydı
- `GET /auth/profile` - Kullanıcı profili

#### Projeler
- `GET /projects` - Tüm projeleri listele
- `POST /projects` - Yeni proje oluştur
- `GET /projects/:id` - Proje detayı
- `PUT /projects/:id` - Proje güncelle
- `DELETE /projects/:id` - Proje sil

#### Faturalar
- `GET /invoices` - Faturaları listele
- `POST /invoices` - Yeni fatura oluştur
- `GET /invoices/:id` - Fatura detayı

#### Raporlar
- `GET /reports/project/:id/kdv-iade` - KDV iade raporu

#### QR Kodlar
- `POST /qrcode/generate` - QR kod oluştur

## 🗄️ Veritabanı Şeması

### Ana Modeller

#### Kullanıcılar ve Yetkilendirme
- `user` - Kullanıcı bilgileri
- `role` - Roller
- `permission` - İzinler

#### Proje Yönetimi
- `treyler_project` - Projeler
- `treyler_type` - Treyler tipleri
- `project_expenses` - Proje giderleri

#### Finansal Modeller
- `Invoice` - Faturalar
- `InvoiceDetail` - Fatura detayları
- `CustomerSupplier` - Müşteri/Tedarikçi

#### Stok Yönetimi
- `Product` - Ürünler
- `measurement_units` - Ölçü birimleri

#### İletişim
- `message` - Mesajlar

## 🔐 Güvenlik Özellikleri

### Kimlik Doğrulama
- JWT token bazlı authentication
- Bcrypt ile şifre hashleme
- Token expiration yönetimi

### Yetkilendirme
- Rol bazlı erişim kontrolü (RBAC)
- İzin bazlı endpoint koruması
- Global JWT Guard

### Veri Koruması
- Input validation (class-validator)
- SQL injection koruması (Prisma ORM)
- XSS koruması
- CORS konfigürasyonu

### API Güvenliği
- Rate limiting (Redis ile)
- Request size limitleri
- Secure headers
