# REVER IT ASSET MANAGEMENT - FRONTEND
## HƯỚNG DẪN XÂY DỰNG FRONTEND HOÀN CHỈNH

**Project**: rever-website-manage-asset-it  
**Frontend**: React.js + Vite + TailwindCSS  
**Date**: 13/01/2026

---

## 📋 MỤC LỤC

1. [Setup Project](#1-setup-project)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [Dependencies](#3-dependencies)
4. [Configuration Files](#4-configuration-files)
5. [Base Components](#5-base-components)
6. [Layout Components](#6-layout-components)
7. [Authentication](#7-authentication)
8. [Pages & Features](#8-pages--features)
9. [Services & API](#9-services--api)
10. [State Management](#10-state-management)
11. [Build & Deploy](#11-build--deploy)

---

## 1. SETUP PROJECT

### 1.1. Khởi Tạo Project

```bash
# Tạo project với Vite
npm create vite@latest rever-assets-web -- --template react

# Di chuyển vào thư mục
cd rever-assets-web

# Cài đặt dependencies
npm install
```

### 1.2. Cài Đặt TailwindCSS

```bash
# Cài TailwindCSS
npm install -D tailwindcss postcss autoprefixer

# Khởi tạo config
npx tailwindcss init -p
```

### 1.3. Cài Đặt Dependencies Chính

```bash
# Core
npm install react-router-dom
npm install @supabase/supabase-js

# State Management
npm install zustand
npm install @tanstack/react-query

# Forms & Validation
npm install react-hook-form
npm install zod
npm install @hookform/resolvers

# UI & Components
npm install lucide-react
npm install sonner
npm install date-fns
npm install clsx
npm install tailwind-merge

# Charts
npm install recharts

# File Upload & Preview
npm install react-dropzone
npm install react-pdf

# PDF Generation (client-side)
npm install jspdf
npm install html2canvas
```

---

## 2. CẤU TRÚC THƯ MỤC

```
rever-assets-web/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── assets/              # Images, fonts
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/          # Reusable components
│   │   ├── common/          # Basic components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorMessage.jsx
│   │   │
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Breadcrumb.jsx
│   │   │
│   │   ├── users/           # User components
│   │   │   ├── UsersList.jsx
│   │   │   ├── UserFilters.jsx
│   │   │   ├── AddUserModal.jsx
│   │   │   ├── EditUserModal.jsx
│   │   │   ├── DeleteUserDialog.jsx
│   │   │   ├── BulkActionsBar.jsx
│   │   │   └── UserHistoryModal.jsx
│   │   │
│   │   ├── assets/          # Asset components
│   │   │   ├── AssetsList.jsx
│   │   │   ├── AssetCard.jsx
│   │   │   ├── AssetFilters.jsx
│   │   │   ├── AddAssetModal.jsx
│   │   │   ├── EditAssetModal.jsx
│   │   │   ├── AssignAssetModal.jsx
│   │   │   ├── ReturnAssetModal.jsx
│   │   │   ├── TransferAssetModal.jsx
│   │   │   ├── DisposeAssetModal.jsx
│   │   │   ├── AssetHistory.jsx
│   │   │   ├── AssetImages.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── invoices/        # Invoice components
│   │   │   ├── InvoicesList.jsx
│   │   │   ├── UploadInvoiceModal.jsx
│   │   │   ├── InvoiceDetailModal.jsx
│   │   │   ├── FileViewer.jsx
│   │   │   └── InvoiceSelector.jsx
│   │   │
│   │   ├── slips/           # Phiếu bàn giao components
│   │   │   ├── AllocationSlipsList.jsx
│   │   │   ├── AllocationSlipViewer.jsx
│   │   │   ├── ReturnSlipsList.jsx
│   │   │   ├── ImportReturnSlipModal.jsx
│   │   │   └── SlipPDFPreview.jsx
│   │   │
│   │   ├── maintenance/     # Maintenance components
│   │   │   ├── MaintenanceList.jsx
│   │   │   ├── ReportIssueModal.jsx
│   │   │   ├── UpdateMaintenanceModal.jsx
│   │   │   └── MaintenanceHistory.jsx
│   │   │
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── StatCard.jsx
│   │   │   ├── CustomizableChart.jsx
│   │   │   ├── ChartTypeSelector.jsx
│   │   │   ├── ExpiringWarrantyWidget.jsx
│   │   │   └── BrokenAssetsWidget.jsx
│   │   │
│   │   └── reports/         # Report components
│   │       ├── ReportGenerator.jsx
│   │       ├── ReportPreview.jsx
│   │       └── ReportFilters.jsx
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useUsers.js
│   │   ├── useAssets.js
│   │   ├── useInvoices.js
│   │   ├── useMaintenance.js
│   │   ├── useSlips.js
│   │   ├── useFileUpload.js
│   │   ├── useDebounce.js
│   │   └── usePermission.js
│   │
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UsersPage.jsx
│   │   ├── AssetsPage.jsx
│   │   ├── AssetDetailPage.jsx
│   │   ├── InvoicesPage.jsx
│   │   ├── MaintenancePage.jsx
│   │   ├── SlipsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── UnauthorizedPage.jsx
│   │
│   ├── services/            # API services
│   │   ├── api.js           # Axios/Supabase client
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── assetService.js
│   │   ├── invoiceService.js
│   │   ├── maintenanceService.js
│   │   ├── slipService.js
│   │   ├── reportService.js
│   │   └── storageService.js
│   │
│   ├── stores/              # Zustand stores
│   │   ├── authStore.js
│   │   ├── uiStore.js
│   │   └── preferencesStore.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   ├── cn.js            # className utility
│   │   └── permissions.js
│   │
│   ├── styles/              # Global styles
│   │   └── index.css
│   │
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── router.jsx           # Route configuration
│
├── .env                     # Environment variables
├── .env.example             # Example env file
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 3. DEPENDENCIES

### 3.1. Package.json

```json
{
  "name": "rever-assets-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "@supabase/supabase-js": "^2.39.0",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.17.9",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.3",
    "lucide-react": "^0.303.0",
    "sonner": "^1.3.1",
    "date-fns": "^3.0.6",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "recharts": "^2.10.3",
    "react-dropzone": "^14.2.3",
    "react-pdf": "^7.6.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 4. CONFIGURATION FILES

### 4.1. vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', 'sonner'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
})
```

### 4.2. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        status: {
          available: '#10b981',
          'in-use': '#3b82f6',
          maintenance: '#f59e0b',
          broken: '#ef4444',
          disposed: '#78716c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
```

### 4.3. postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4.4. .env.example

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (optional - configured in Supabase)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# App Configuration
VITE_APP_NAME=Rever IT Assets
VITE_APP_URL=http://localhost:5173
```

### 4.5. .gitignore

```
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor
.vscode
.idea
*.swp
*.swo
*~

# Others
.vercel
.turbo
```

---

## 5. BASE COMPONENTS

### 5.1. Button Component

**File**: `src/components/common/Button.jsx`

```jsx
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className,
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  )
}

export default Button
```

### 5.2. Input Component

**File**: `src/components/common/Input.jsx`

```jsx
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  className,
  required,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
          'placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
```

### 5.3. Modal Component

**File**: `src/components/common/Modal.jsx`

```jsx
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
```

### 5.4. Table Component

**File**: `src/components/common/Table.jsx`

```jsx
import { cn } from '@/utils/cn'

const Table = ({ columns, data, onRowClick, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-12 text-center text-gray-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                  'transition-colors'
                )}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.cell 
                      ? column.cell(row) 
                      : row[column.accessor]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
```

### 5.5. Card Component

**File**: `src/components/common/Card.jsx`

```jsx
import { cn } from '@/utils/cn'

const Card = ({ children, className, title, actions }) => {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-custom border border-gray-200',
      className
    )}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export default Card
```

### 5.6. Loading Component

**File**: `src/components/common/Loading.jsx`

```jsx
import { Loader2 } from 'lucide-react'

const Loading = ({ fullScreen = false, text = 'Đang tải...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      </div>
    </div>
  )
}

export default Loading
```

### 5.7. FileUpload Component

**File**: `src/components/common/FileUpload.jsx`

```jsx
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File } from 'lucide-react'
import { cn } from '@/utils/cn'

const FileUpload = ({
  onFilesSelected,
  accept = {},
  maxSize = 10485760, // 10MB
  maxFiles = 5,
  files = [],
  onRemove,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesSelected?.(acceptedFiles)
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive 
            ? 'Thả file vào đây...' 
            : 'Kéo thả file hoặc click để chọn'
          }
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Max {maxFiles} files, {(maxSize / 1048576).toFixed(0)}MB mỗi file
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1048576).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove?.(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
```

Tôi sẽ tiếp tục với phần tiếp theo trong file kế tiếp. File này đã khá dài rồi!

---

**Phần này bao gồm:**
✅ Setup project từ đầu
✅ Cấu trúc thư mục chi tiết
✅ All dependencies
✅ Configuration files đầy đủ
✅ 7 Base components quan trọng nhất

**Tiếp theo tôi sẽ tạo:**
- Layout Components
- Authentication
- Pages & Features
- Services & API
- State Management
- Build instructions

Bạn có muốn tôi tiếp tục không?
