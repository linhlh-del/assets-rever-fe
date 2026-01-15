# REVER IT ASSET MANAGEMENT SYSTEM
## KẾ HOẠCH TRIỂN KHAI DỰ ÁN

**Project Name**: rever-website-manage-asset-it  
**Version**: 1.0  
**Timeline**: 6-8 tuần  
**Team Size**: 2-3 developers  

---

## 📋 MỤC LỤC

1. [Tổng Quan Timeline](#1-tổng-quan-timeline)
2. [Phase 0: Setup](#2-phase-0-setup-week-1)
3. [Phase 1: Core Features](#3-phase-1-core-features-week-2-3)
4. [Phase 2: Advanced Features](#4-phase-2-advanced-features-week-4-5)
5. [Phase 3: Testing & Polish](#5-phase-3-testing--polish-week-6)
6. [Phase 4: Deployment](#6-phase-4-deployment-week-7-8)
7. [Dependencies](#7-dependencies)
8. [Risk Management](#8-risk-management)
9. [Success Criteria](#9-success-criteria)

---

## 1. TỔNG QUAN TIMELINE

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT TIMELINE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Phase 0: Setup & Foundation        Week 1        ████      │
│ Phase 1: Core Features             Week 2-3      ████████  │
│ Phase 2: Advanced Features         Week 4-5      ████████  │
│ Phase 3: Testing & Polish          Week 6        ████      │
│ Phase 4: Deployment & Launch       Week 7-8      ████      │
│                                                             │
│ Total: 6-8 tuần                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.1. Milestones

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 1 | Setup Complete | Database + Auth working |
| 2-3 | Core Complete | Users + Assets + Dashboard |
| 4-5 | Advanced Complete | Invoices + Maintenance + Phiếu |
| 6 | Testing Complete | All tests passed |
| 7-8 | Launch | Production ready |

---

## 2. PHASE 0: SETUP (Week 1)

### Sprint 0.1: Infrastructure Setup (2 days)

#### **Database Tasks (Backend Dev)**

**Checklist:**
```
□ Tạo Supabase project (Singapore region)
□ Run schema SQL:
  - 9 core tables
  - Indexes
  - Views
  - Functions
□ Import 59 users
□ Create Storage buckets:
  - invoice-files (public)
  - asset-images (public)
  - allocation-slips (private)
  - return-slips (private)
  - disposal-documents (private)
  - evidence-photos (private)
□ Configure RLS policies cho tables
□ Configure RLS policies cho storage
□ Test database connections
□ Setup backup schedule
```

**Output:** 
- ✅ Database ready với 59 users
- ✅ Storage buckets configured
- ✅ RLS policies working

---

#### **Backend Tasks (Backend Dev)**

**Checklist:**
```
□ Init Node.js project:
  mkdir rever-assets-api
  npm init -y
□ Install core dependencies:
  - express
  - @supabase/supabase-js
  - multer (file upload)
  - pdfkit (PDF generation)
  - cors
  - dotenv
□ Setup folder structure:
  /src
    /config      - Database, Supabase
    /controllers - Route handlers
    /middleware  - Auth, validation
    /routes      - API routes
    /services    - Business logic
    /utils       - Helpers
    /templates   - PDF templates
□ Configure Supabase client
□ Setup error handling middleware
□ Configure CORS
□ Setup file upload handling
□ Create base API structure
```

**Folder Structure:**
```
rever-assets-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usersController.js
│   │   ├── assetsController.js
│   │   ├── invoicesController.js
│   │   ├── maintenanceController.js
│   │   └── slipsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── assets.js
│   │   ├── invoices.js
│   │   ├── maintenance.js
│   │   └── slips.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── assetService.js
│   │   ├── pdfService.js
│   │   └── storageService.js
│   ├── templates/
│   │   ├── allocationSlip.js
│   │   └── returnSlip.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**Output:**
- ✅ Backend boilerplate ready
- ✅ API structure set up
- ✅ File upload working

---

#### **Frontend Tasks (Frontend Dev)**

**Checklist:**
```
□ Init React project:
  npm create vite@latest rever-assets-web -- --template react
□ Install dependencies:
  - react-router-dom
  - @supabase/supabase-js
  - @tanstack/react-query
  - zustand
  - react-hook-form
  - zod
  - tailwindcss
  - date-fns
  - lucide-react (icons)
  - recharts (charts)
  - react-dropzone (file upload)
  - react-pdf (PDF preview)
  - sonner (toast notifications)
□ Setup TailwindCSS
□ Configure routing
□ Setup folder structure
□ Create base layout
□ Setup environment variables
```

**Folder Structure:**
```
rever-assets-web/
├── public/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   └── Card.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── users/
│   │   ├── assets/
│   │   ├── invoices/
│   │   ├── maintenance/
│   │   └── slips/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUsers.js
│   │   └── useAssets.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UsersPage.jsx
│   │   ├── AssetsPage.jsx
│   │   └── ...
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── assetService.js
│   ├── stores/
│   │   └── authStore.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

**Output:**
- ✅ React app ready
- ✅ Routing configured
- ✅ Base components created

---

### Sprint 0.2: Authentication (3 days)

#### **Backend Tasks**

**Checklist:**
```
□ Configure Google OAuth trong Supabase Dashboard
□ Restrict domain to @rever.vn
□ Create custom JWT hook function:
  - Add role to JWT
  - Add employee_code to JWT
□ Test authentication flow
□ Implement session management
□ Create auth middleware cho API
```

**Custom JWT Hook:**
```sql
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  claims jsonb;
  user_role text;
  emp_code text;
BEGIN
  claims := event->'claims';
  
  SELECT role, employee_code INTO user_role, emp_code
  FROM public.users
  WHERE email = (claims->>'email');
  
  claims := jsonb_set(claims, '{role}', to_jsonb(COALESCE(user_role, 'user')));
  claims := jsonb_set(claims, '{employee_code}', to_jsonb(emp_code));
  
  event := jsonb_set(event, '{claims}', claims);
  
  RETURN event;
END;
$$;
```

**Auth Middleware:**
```javascript
// middleware/auth.js
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    req.role = user.user_metadata.role;
    req.employee_code = user.user_metadata.employee_code;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

**Output:**
- ✅ OAuth configured
- ✅ JWT hook working
- ✅ Auth middleware ready

---

#### **Frontend Tasks**

**Checklist:**
```
□ Create AuthContext
□ Implement Google OAuth login
□ Create LoginPage UI
□ Implement protected routes
□ Handle JWT tokens
□ Create AuthGuard component
□ Implement logout
□ Handle session expiry
```

**Components:**
```jsx
// contexts/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { hd: 'rever.vn' }
      }
    });
    if (error) throw error;
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// pages/LoginPage.jsx
const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <h1>Rever IT Assets</h1>
        <Button onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
};

// components/ProtectedRoute.jsx
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.user_metadata.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

**Output:**
- ✅ Users can login with Google
- ✅ Protected routes working
- ✅ JWT tokens handled

---

## 3. PHASE 1: CORE FEATURES (Week 2-3)

### Sprint 1.1: Users Management (Week 2 - 3 days)

#### **Backend Tasks**

**APIs to build:**
```javascript
GET    /api/users                    // List with filters
GET    /api/users/:employee_code     // Get single
POST   /api/users                    // Create
PUT    /api/users/:employee_code     // Update
DELETE /api/users/:employee_code     // Delete (soft)
POST   /api/users/bulk-update        // Bulk actions
GET    /api/users/:code/asset-history  // User's assets timeline
```

**Checklist:**
```
□ Create users controller
□ Implement CRUD operations
□ Add search/filter logic
□ Implement pagination
□ Add validation (Zod schemas)
□ Implement soft delete
□ Create bulk update endpoint
□ Add asset history endpoint
□ Write unit tests
```

**Output:**
- ✅ Users CRUD APIs working
- ✅ Tests passing

---

#### **Frontend Tasks**

**Pages & Components:**
```
UsersPage.jsx
├── UsersList.jsx
├── UserFilters.jsx
├── AddUserModal.jsx
├── EditUserModal.jsx
├── DeleteConfirmDialog.jsx
├── BulkActionsBar.jsx
└── UserHistoryModal.jsx
```

**Checklist:**
```
□ Create UsersPage layout
□ Build UsersList table component
  - Pagination
  - Search bar
  - Filters (dept, role, status)
  - Sort columns
□ Create AddUserModal
  - Form with validation
  - Handle submit
□ Create EditUserModal
  - Pre-fill data
  - Disable code/email
  - Role change confirmation
□ Create DeleteConfirmDialog
  - Check assets
  - Soft delete
□ Implement bulk actions
  - Bulk select
  - Bulk update role/dept
□ Create UserHistoryModal
  - Timeline view
  - Show all assets
□ Integrate with APIs
□ Add loading states
□ Add error handling
```

**Output:**
- ✅ Full CRUD users working
- ✅ All validations working

---

### Sprint 1.2: Assets Management - Part 1 (Week 2 - 3 days)

#### **Backend Tasks**

**APIs to build:**
```javascript
GET    /api/assets                   // List with filters
GET    /api/assets/:asset_code       // Get single
POST   /api/assets                   // Create (requires invoice_id)
PUT    /api/assets/:asset_code       // Update
DELETE /api/assets/:asset_code       // Delete
POST   /api/assets/:code/images      // Upload images
GET    /api/assets/:code/images      // List images
DELETE /api/assets/:code/images/:id  // Delete image
```

**Checklist:**
```
□ Create assets controller
□ Implement CRUD operations
□ Add invoice validation (invoice_id required)
□ Add search/filter logic
□ Implement image upload
  - Multiple files
  - Validate types (JPG, PNG, WEBP, HEIC)
  - Upload to Storage
  - Save URLs to DB
□ Add constraint: 1 asset = 1 invoice
□ Write tests
```

**Output:**
- ✅ Assets CRUD working
- ✅ Image upload working

---

#### **Frontend Tasks**

**Pages & Components:**
```
AssetsPage.jsx
├── AssetsList.jsx
├── AssetFilters.jsx
├── AddAssetModal.jsx
├── EditAssetModal.jsx
├── AssetDetailPage.jsx
└── ImageGallery.jsx
```

**Checklist:**
```
□ Create AssetsPage layout
□ Build AssetsList component
  - Table view
  - Status badges
  - Search & filters
  - Infinite scroll
□ Create AddAssetModal
  - Invoice dropdown (required)
  - Image upload (drag & drop)
  - Form validation
□ Create EditAssetModal
□ Create AssetDetailPage
  - All sections (info, warranty, images, history)
  - Image gallery
  - Action buttons
□ Implement ImageGallery
  - Thumbnails
  - Lightbox view
  - Upload new images
  - Delete images
□ Integrate APIs
```

**Output:**
- ✅ Assets list & detail working
- ✅ Image gallery working

---

### Sprint 1.3: Assets Assignment & Phiếu Bàn Giao (Week 3 - 4 days)

#### **Backend Tasks**

**APIs to build:**
```javascript
POST /api/assets/:code/assign     // Assign + Generate slip
POST /api/assets/:code/return     // Return
POST /api/assets/:code/transfer   // Transfer
GET  /api/assets/:code/history    // Usage history
GET  /api/assets/:code/user-history  // User timeline

GET  /api/allocation-slips        // List slips
GET  /api/allocation-slips/:number  // Get slip
GET  /api/allocation-slips/:number/download  // PDF
```

**Checklist:**
```
□ Implement assign endpoint:
  - Validate asset available
  - Validate not assigned to other user
  - Update asset status
  - Insert asset_history
  - Generate slip number
  - Generate PDF from template
  - Upload PDF to Storage
  - Insert allocation_slip record
  - Upload evidence photos
  - Return slip info
□ Implement return endpoint
  - Update asset
  - Close asset_history
  - Insert return_slip
  - Upload photos
□ Implement transfer endpoint
  - Close old history
  - Create new history
  - Generate new slip
□ Create PDF generation service
  - Use pdfkit
  - Template based on Word file
  - Fill dynamic data
□ Write tests
```

**PDF Template Code:**
```javascript
// services/pdfService.js
import PDFDocument from 'pdfkit';

export const generateAllocationSlip = async (data) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  // Header
  doc.fontSize(20).text('CÔNG TY CỔ PHẦN REVER', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text('PHIẾU BÀN GIAO TRANG THIẾT BỊ', { align: 'center' });
  doc.moveDown();
  
  // Slip info
  doc.fontSize(10);
  doc.text(`Số hiệu: HCNS/FORM`);
  doc.text(`Lần thứ: ${data.slip_number}`);
  doc.text(`Ngày phát hành: ${formatDate(data.allocation_date)}`);
  doc.moveDown();
  
  // Date
  const date = new Date(data.allocation_date);
  doc.fontSize(12).text(
    `Hôm nay Ngày ${date.getDate()} Tháng ${date.getMonth() + 1} Năm ${date.getFullYear()}`
  );
  doc.moveDown();
  
  // Bên giao
  doc.text('Bên giao:');
  doc.text(`Họ và tên:  ${data.issued_by_name}`);
  doc.text(`Bộ phận:    ${data.issued_by_department}`);
  doc.moveDown();
  
  // Bên nhận
  doc.text('Bên nhận:');
  doc.text(`Họ và tên:  ${data.user_name}`);
  doc.text(`Bộ phận:    ${data.user_department}`);
  doc.moveDown(2);
  
  // Table
  const tableTop = doc.y;
  const col1X = 50;
  const col2X = 200;
  const col3X = 400;
  
  // Headers
  doc.fontSize(10).text('TÊN THIẾT BỊ', col1X, tableTop);
  doc.text('CHI TIẾT/CẤU HÌNH', col2X, tableTop);
  doc.text('TÌNH TRẠNG', col3X, tableTop);
  
  // Line
  doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
  
  // Data
  const dataTop = tableTop + 30;
  doc.text(`1/ ${data.asset_category}`, col1X, dataTop);
  doc.text(data.asset_name, col2X, dataTop);
  doc.text(data.asset_model || '', col2X, dataTop + 15);
  doc.text(`Serial: ${data.asset_serial || 'N/A'}`, col2X, dataTop + 30);
  doc.text(data.condition || 'New box', col3X, dataTop);
  
  if (data.notes) {
    doc.moveDown(3);
    doc.text(`Ghi chú: ${data.notes}`);
  }
  
  // Signature
  doc.moveDown(3);
  const signY = doc.y;
  doc.text('Ký nhận bên giao', 100, signY);
  doc.text('Ký nhận bên nhận', 400, signY);
  doc.moveDown(3);
  doc.text('_________________', 100, doc.y);
  doc.text('_________________', 400, doc.y - 12);
  
  doc.end();
  
  return doc;
};
```

**Output:**
- ✅ Assignment working
- ✅ PDF generation working
- ✅ Phiếu bàn giao auto-created

---

#### **Frontend Tasks**

**Components:**
```
AssignAssetModal.jsx
ReturnAssetModal.jsx
TransferAssetModal.jsx
AssetHistory.jsx
AllocationSlipViewer.jsx
```

**Checklist:**
```
□ Create AssignAssetModal
  - User search/select
  - Date picker
  - Notes field
  - Evidence photo upload
  - Handle submit
  - Show success with slip download
□ Create ReturnAssetModal
  - Condition dropdown
  - Photo upload
  - Option to import file
□ Create TransferAssetModal
  - From/to users
  - Date & reason
□ Create AssetHistory component
  - Timeline view
  - Show user names
  - Link to slips
□ Create AllocationSlipViewer
  - View slip details
  - Download PDF
  - View evidence photos
□ Handle validation error:
  "Asset already assigned to X"
  Show [Thu hồi] button
```

**Output:**
- ✅ Assignment flow complete
- ✅ Slip viewer working
- ✅ PDF download working

---

### Sprint 1.4: Dashboard (Week 3 - 2 days)

#### **Backend Tasks**

**APIs:**
```javascript
GET /api/dashboard                  // Dashboard stats
GET /api/users/:code/preferences    // Get preferences
PUT /api/users/:code/preferences    // Save preferences
```

**Checklist:**
```
□ Create dashboard endpoint
  - Calculate stats (total, by status, by dept, etc.)
  - Get expiring warranty assets
  - Get broken assets pending
  - Optimize queries
□ Create preferences endpoints
□ Add caching (5 minutes)
```

**Output:**
- ✅ Dashboard API ready
- ✅ Preferences working

---

#### **Frontend Tasks**

**Components:**
```
DashboardPage.jsx
├── StatCard.jsx
├── CustomizableChart.jsx
├── ChartTypeSelector.jsx
├── ExpiringWarrantyWidget.jsx
└── BrokenAssetsWidget.jsx
```

**Checklist:**
```
□ Create DashboardPage layout
□ Build StatCard component (6 cards)
□ Create CustomizableChart component
  - Support Bar/Pie/Line
  - Interactive
  - Responsive
□ Create ChartTypeSelector
  - Radio buttons for type
  - Save to preferences
□ Build widgets:
  - Expiring warranty (30 days)
  - Broken assets needing action
□ Integrate Recharts
□ Load user preferences
□ Auto-save chart type changes
```

**Output:**
- ✅ Dashboard working
- ✅ Charts customizable
- ✅ Preferences saved

---

## 4. PHASE 2: ADVANCED FEATURES (Week 4-5)

### Sprint 2.1: Invoices Management (Week 4 - 3 days)

#### **Backend Tasks**

**APIs:**
```javascript
GET    /api/invoices                 // List
POST   /api/invoices                 // Create with files
PUT    /api/invoices/:number         // Update
DELETE /api/invoices/:number         // Delete
GET    /api/invoices?format=dropdown // For asset form
```

**Checklist:**
```
□ Create invoices controller
□ Implement file upload:
  - Support PDF, Excel, Word, Images
  - Validate file types & sizes
  - Upload to Storage (invoice-files bucket)
  - Save file URLs array
□ Implement CRUD
□ Add dropdown endpoint (simplified)
□ Write tests
```

**Output:**
- ✅ Invoice CRUD working
- ✅ File upload working (all types)

---

#### **Frontend Tasks**

**Components:**
```
InvoicesPage.jsx
├── InvoicesList.jsx
├── UploadInvoiceModal.jsx
├── InvoiceDetailModal.jsx
└── FileViewer.jsx
```

**Checklist:**
```
□ Create InvoicesPage
□ Build InvoicesList table
□ Create UploadInvoiceModal
  - Form fields
  - Multi-file upload (drag & drop)
  - Preview uploads
  - Progress indicators
□ Create InvoiceDetailModal
  - Show info
  - List attached files with icons
  - Preview PDFs
  - Download files
□ Create FileViewer component
  - PDF preview (react-pdf)
  - Image preview (lightbox)
  - Download button
□ Update AddAssetModal
  - Invoice dropdown
  - Link to add invoice
```

**Output:**
- ✅ Invoice management working
- ✅ File upload/preview working
- ✅ Linked to assets

---

### Sprint 2.2: Maintenance (Week 4 - 2 days)

#### **Backend Tasks**

**APIs:**
```javascript
GET   /api/maintenance              // List
POST  /api/maintenance              // Report issue
PUT   /api/maintenance/:id          // Update
PATCH /api/maintenance/:id/status   // Update status
```

**Checklist:**
```
□ Create maintenance controller
□ Implement report issue:
  - Create maintenance record
  - Set asset status = 'broken' (if high priority)
  - Upload evidence photos
  - Send notification
□ Implement update status:
  - in_progress
  - completed → asset status = 'available'
  - cannot_fix → suggest disposal
□ Upload before/after photos
□ Write tests
```

**Output:**
- ✅ Maintenance APIs working

---

#### **Frontend Tasks**

**Components:**
```
MaintenancePage.jsx
├── MaintenanceList.jsx
├── ReportIssueModal.jsx
└── UpdateMaintenanceModal.jsx
```

**Checklist:**
```
□ Create MaintenancePage
□ Build MaintenanceList
  - Filter by status
  - Show photos thumbnail
□ Create ReportIssueModal
  - Asset selector
  - Issue description
  - Priority
  - Photo upload (required)
□ Create UpdateMaintenanceModal
  - Status radio buttons
  - Solution textarea
  - Before/after photo viewer
  - If "Cannot Fix" → Show disposal button
□ Add to AssetDetailPage
  - Maintenance history section
```

**Output:**
- ✅ Maintenance flow working
- ✅ Photos working

---

### Sprint 2.3: Thanh Lý (Week 5 - 2 days)

#### **Backend Tasks**

**APIs:**
```javascript
POST /api/assets/:code/dispose     // Dispose asset
```

**Checklist:**
```
□ Create dispose endpoint:
  - Update asset status = 'disposed'
  - Set disposal fields
  - Upload documents
  - Insert asset_history (disposed)
  - current_user = NULL
□ Add disposal filter to assets list
□ Write tests
```

**Output:**
- ✅ Disposal working

---

#### **Frontend Tasks**

**Components:**
```
DisposeAssetModal.jsx
DisposedAssetsPage.jsx
```

**Checklist:**
```
□ Create DisposeAssetModal
  - Date
  - Reason (radio buttons)
  - Description
  - Price (if sold)
  - Document upload
  - Confirmation
□ Create DisposedAssetsPage
  - List disposed assets
  - Show disposal info
□ Add to AssetDetailPage
  - Disposal info section (if disposed)
□ Link from UpdateMaintenanceModal
  - If "Cannot Fix" → Disposal button
```

**Output:**
- ✅ Disposal flow complete

---

### Sprint 2.4: Return Slips Import (Week 5 - 2 days)

#### **Backend Tasks**

**APIs:**
```javascript
POST /api/return-slips/import      // Import file
GET  /api/return-slips             // List
```

**Checklist:**
```
□ Create import endpoint:
  - Accept file upload
  - Save file to Storage
  - Create return_slip record
  - Parse data (manual confirmation)
□ Write tests
```

**Output:**
- ✅ Import working

---

#### **Frontend Tasks**

**Components:**
```
ImportReturnSlipModal.jsx
ReturnSlipsPage.jsx
```

**Checklist:**
```
□ Add tab to ReturnAssetModal:
  - "Nhập thủ công"
  - "Import phiếu"
□ Create ImportReturnSlipModal
  - File upload
  - Confirm data
  - Submit
□ Create ReturnSlipsPage
  - List all return slips
  - Download PDFs
```

**Output:**
- ✅ Import working
- ✅ Return slips page working

---

### Sprint 2.5: Reports (Week 5 - 2 days)

#### **Backend Tasks**

**APIs:**
```javascript
POST /api/reports/generate         // Generate report
GET  /api/reports/:id/download     // Download
```

**Checklist:**
```
□ Implement 8 report types:
  1. Assets by department
  2. Assets by user
  3. Assets by status
  4. Expiring warranty
  5. Broken assets
  6. Disposed assets
  7. Maintenance history
  8. Allocation slips
□ Generate Excel (exceljs)
□ Generate PDF (pdfkit)
□ Write tests
```

**Output:**
- ✅ Reports working

---

#### **Frontend Tasks**

**Components:**
```
ReportsPage.jsx
├── ReportGenerator.jsx
└── ReportPreview.jsx
```

**Checklist:**
```
□ Create ReportsPage
□ Build ReportGenerator
  - Report type selector
  - Date range
  - Filters
  - Format (Excel/PDF/CSV)
□ Create ReportPreview
  - Chart preview
  - Table preview
□ Download functionality
```

**Output:**
- ✅ Reports working

---

## 5. PHASE 3: TESTING & POLISH (Week 6)

### Sprint 3.1: Testing (3 days)

#### **Backend Testing**

**Checklist:**
```
□ Write unit tests:
  - All controllers
  - All services
  - PDF generation
  - File upload
□ Write integration tests:
  - API endpoints
  - Database operations
  - RLS policies
□ Test edge cases:
  - Invalid inputs
  - Duplicate entries
  - File size limits
  - Concurrent requests
□ Security testing:
  - SQL injection
  - XSS
  - CSRF
  - Unauthorized access
□ Performance testing:
  - Load test (100 concurrent users)
  - Query optimization
□ Target: 80% code coverage
```

**Tools:**
- Jest (unit tests)
- Supertest (API tests)
- K6 or Artillery (load tests)

**Output:**
- ✅ All tests passing
- ✅ Coverage > 80%

---

#### **Frontend Testing**

**Checklist:**
```
□ Write unit tests:
  - Components
  - Hooks
  - Services
  - Utilities
□ Write integration tests:
  - User flows
  - Form submissions
  - API calls
□ E2E tests (critical flows):
  - Login
  - Create user
  - Add asset
  - Assign asset + slip generation
  - Upload invoice
  - Report maintenance
  - Generate report
□ Browser compatibility:
  - Chrome
  - Firefox
  - Safari
  - Edge
□ Responsive testing:
  - Mobile
  - Tablet
  - Desktop
□ Target: 70% coverage
```

**Tools:**
- Jest + React Testing Library (unit)
- Playwright or Cypress (E2E)

**Output:**
- ✅ All tests passing
- ✅ Coverage > 70%
- ✅ Cross-browser working

---

### Sprint 3.2: UI/UX Polish (2 days)

**Checklist:**
```
□ Refine all layouts
□ Add loading skeletons
□ Add empty states
□ Add error states
□ Toast notifications (sonner)
□ Confirmation dialogs
□ Form validation messages
□ Keyboard shortcuts
□ Accessibility (a11y):
  - ARIA labels
  - Focus management
  - Screen reader support
□ Mobile responsiveness
□ Image optimization
□ Icon consistency
□ Color consistency
□ Typography consistency
```

**Output:**
- ✅ UI polished
- ✅ UX smooth
- ✅ Accessible

---

### Sprint 3.3: Performance Optimization (1 day)

**Backend:**
```
□ Add missing indexes
□ Optimize slow queries
□ Add caching (React Query)
□ Compress responses
□ Rate limiting
```

**Frontend:**
```
□ Code splitting
□ Lazy loading routes
□ Image lazy loading
□ Bundle size optimization
□ Optimize re-renders
□ Virtual scrolling (long lists)
```

**Targets:**
- FCP < 1.5s
- TTI < 3s
- API < 200ms (P95)
- Lighthouse > 90

**Output:**
- ✅ Performance targets met

---

## 6. PHASE 4: DEPLOYMENT (Week 7-8)

### Sprint 4.1: Staging Deployment (Week 7 - 2 days)

**Checklist:**
```
□ Setup Vercel project
□ Configure environment variables
□ Setup custom domain (staging)
□ Deploy frontend to staging
□ Test full flow in staging
□ Fix bugs
```

**Output:**
- ✅ Staging ready
- ✅ staging.rever-assets.vercel.app working

---

### Sprint 4.2: UAT (Week 7 - 3 days)

**Checklist:**
```
□ Invite stakeholders:
  - IT team
  - Accountant
  - Dev leads
  - Sample users
□ Prepare test scenarios
□ Conduct UAT sessions
□ Collect feedback
□ Prioritize bugs/issues
□ Fix critical bugs
□ Re-test
```

**Test Scenarios:**
1. Admin adds new user
2. User logs in and sees own assets
3. Admin adds invoice with files
4. Admin adds asset linked to invoice
5. Admin assigns asset → PDF generated
6. User reports broken asset with photos
7. Admin updates maintenance
8. Admin disposes asset
9. Generate reports
10. Customize dashboard charts

**Output:**
- ✅ UAT passed
- ✅ Critical bugs fixed

---

### Sprint 4.3: Production Deployment (Week 8 - 2 days)

**Checklist:**
```
□ Prepare production database:
  - Run migrations
  - Import production users (59)
  - Verify data
□ Create Storage buckets in production
□ Configure RLS policies
□ Setup monitoring:
  - Sentry (error tracking)
  - Vercel Analytics
  - Supabase logs
□ Setup alerts:
  - Error rate > 5%
  - API latency > 1s
  - Site down
□ Deploy to production
□ Smoke tests:
  - Login
  - Create asset
  - Assign asset + slip
  - Upload invoice
  - Generate report
□ Monitor for 24 hours
```

**Output:**
- ✅ Production live at assets.rever.vn
- ✅ Monitoring active

---

### Sprint 4.4: Training & Launch (Week 8 - 3 days)

**Checklist:**
```
□ Prepare training materials:
  - User guide PDF
  - Admin guide PDF
  - Video tutorials
□ Conduct training sessions:
  - Admin/IT (full system)
  - Accountant (invoices focus)
  - Users (basic usage)
□ Q&A sessions
□ Launch announcement:
  - Company email
  - Slack channel
  - Demo video
□ Provide support:
  - Slack channel for questions
  - Email support
□ Monitor usage:
  - First 48 hours closely
  - Fix urgent issues
□ Collect feedback
```

**Output:**
- ✅ System launched
- ✅ Users trained
- ✅ Support available

---

## 7. DEPENDENCIES

### 7.1. Critical Path

```
Database Setup
     ↓
Authentication
     ↓
Users Management
     ↓
Invoices Management (must come before Assets)
     ↓
Assets Management
     ↓
Assignment + Phiếu Bàn Giao ← CRITICAL
     ↓
Dashboard
     ↓
Maintenance → Disposal
     ↓
Reports
     ↓
Testing → Deployment
```

### 7.2. Parallel Tasks

**Can be done in parallel:**
- Frontend + Backend development
- Dashboard + Maintenance
- Reports + Return slips import
- Testing + UI polish

**Must be sequential:**
- Database → Auth
- Auth → Any protected features
- Invoices → Assets (dependency)
- Assets → Assignment → Phiếu

---

## 8. RISK MANAGEMENT

### 8.1. Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PDF generation complexity | High | Medium | Use proven library (pdfkit), test early |
| File upload performance | High | Medium | Compress files, chunk upload, limits |
| Storage quota limits | Medium | Low | Monitor usage, implement cleanup |
| RLS complexity | High | Medium | Test thoroughly, document policies |
| Chart rendering performance | Medium | Medium | Optimize queries, lazy loading |

### 8.2. Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Scope creep | High | High | Strict requirements, change control |
| Timeline delays | Medium | Medium | Buffer time, daily standups |
| Key person unavailable | High | Medium | Knowledge sharing, documentation |
| UAT feedback major changes | High | Low | Frequent demos, early feedback |

### 8.3. Contingency Plans

**If timeline slips by 1 week:**
- Cut non-essential features (dark mode, advanced charts)
- Reduce scope of reports
- Extend to Week 9

**If PDF generation issues:**
- Use alternative library (jsPDF)
- Simplify template
- Manual workaround initially

**If performance issues:**
- Add database indexes
- Implement Redis caching
- Optimize queries
- CDN for static files

---

## 9. SUCCESS CRITERIA

### 9.1. Launch Criteria

```
✓ All core features working:
  - Users CRUD
  - Assets CRUD with invoice link
  - Assignment + Phiếu bàn giao
  - File uploads (all types)
  - Dashboard with charts
  - Maintenance workflow
  - Disposal workflow
  - Reports (8 types)
  
✓ 59 users imported
✓ All P1 bugs fixed
✓ Security audit passed
✓ Performance targets met
✓ UAT completed
✓ Training conducted
✓ Documentation complete
✓ Monitoring setup
```

### 9.2. Success Metrics (3 months)

**Adoption:**
- ✓ 90%+ users logged in
- ✓ 100+ assets in system
- ✓ 50+ phiếu bàn giao generated

**Quality:**
- ✓ < 5 critical bugs
- ✓ 95%+ uptime
- ✓ Average page load < 2s

**Usage:**
- ✓ 20+ invoices uploaded
- ✓ 10+ maintenance reports
- ✓ 5+ reports generated/week

**Satisfaction:**
- ✓ User rating > 4/5
- ✓ Positive feedback
- ✓ < 10 support tickets/week

---

## 10. POST-LAUNCH PLAN

### 10.1. Week 1-2

```
□ Monitor system 24/7
□ Fix urgent bugs
□ Collect user feedback
□ Adjust documentation
□ Provide active support
```

### 10.2. Month 1-3 (Iteration 2)

**Enhancements:**
```
□ Email notifications
□ QR code for assets
□ Advanced search
□ Batch import from Excel
□ Mobile app (React Native)
□ Integration with Slack
□ Auto-reminder warranty expiry
□ Purchase requests workflow (add back)
```

### 10.3. Maintenance

**Weekly:**
- Review error logs
- Check performance metrics
- Update dependencies (security)

**Monthly:**
- Database cleanup
- Performance review
- User feedback review
- Security audit

---

## APPENDIX A: TEAM ROLES

### Recommended Team

```
Product Owner (1):
  - Requirements
  - Prioritization
  - UAT
  - User communication

Backend Dev (1):
  - Database
  - APIs
  - PDF generation
  - File upload
  - DevOps

Frontend Dev (1):
  - UI/UX
  - React components
  - State management
  - Integration

Full-stack Dev (optional):
  - Support both
```

### Communication

- **Daily standup**: 15 min (9am)
- **Sprint planning**: Monday
- **Demo**: Friday
- **Retro**: Friday
- **Tools**: Slack, Jira, GitHub

---

## APPENDIX B: FOLDER STRUCTURE SUMMARY

### Backend
```
rever-assets-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── templates/
│   └── utils/
└── tests/
```

### Frontend
```
rever-assets-web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── stores/
│   └── utils/
└── tests/
```

---

**END OF ROADMAP**

Version: 1.0 Final  
Date: 13/01/2026  
Timeline: 6-8 tuần  
Status: Ready to Start
