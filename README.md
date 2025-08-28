# Interactive Portfolio Website

An immersive full-stack portfolio experience that transforms traditional resume-style designs into a "tech adventure journey" with interactive 3D elements, real-time features, and engaging storytelling.

## 🚀 Features

- **Interactive 3D Homepage**: Globe with skill points and particle systems using React Three Fiber
- **Adventure Map**: Project showcase as interactive islands with real-time demos
- **Time Machine Blog**: Interactive timeline with code sandboxes and challenges
- **Personal Universe**: Galaxy-themed about page with 3D skill planets
- **Contact Portal**: Futuristic interface with AI-powered chatbot
- **Real-time Features**: WebSocket connections for live interactions
- **External Integrations**: GitHub API, AI services, and code execution

## 🛠 Tech Stack

### Frontend (journeyAdventure)
- **Framework**: Next.js 14 with App Router
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: Framer Motion
- **Data Visualization**: D3.js
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO Client

### Backend (node-express-mysql)
- **Framework**: Express.js + Socket.IO
- **Databases**: MySQL + MongoDB + Redis
- **External APIs**: GitHub, xAI, CodeSandbox
- **Authentication**: JWT
- **File Processing**: Multer + Sharp

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL
- MongoDB
- Redis (optional, for caching)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd journeyAdventure
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../node-express-mysql
   npm install
   ```

4. **Configure Environment Variables**
   
   **Frontend (.env.local)**:
   ```bash
   cd journeyAdventure
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
   
   **Backend (.env)**:
   ```bash
   cd node-express-mysql
   cp .env.example .env
   # Edit .env with your database and API configurations
   ```

5. **Setup Databases**
   - Ensure MySQL is running and create the database
   - Ensure MongoDB is running
   - (Optional) Ensure Redis is running for caching

## 🚀 Development

### Start the Backend Server
```bash
cd node-express-mysql
npm run dev:portfolio
```
The backend will run on `http://localhost:3001`

### Start the Frontend Development Server
```bash
cd journeyAdventure
npm run dev
```
The frontend will run on `http://localhost:3000`

### Available Scripts

**Frontend (journeyAdventure)**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

**Backend (node-express-mysql)**:
- `npm run dev:portfolio` - Start portfolio server with hot reload
- `npm start` - Start production server
- `npm run dev` - Start original development server

## 🌐 API Endpoints

### Portfolio API
- `GET /api/portfolio/skills` - Get skills data
- `GET /api/portfolio/achievements` - Get achievements
- `POST /api/portfolio/unlock-achievement` - Unlock achievement
- `GET /api/portfolio/particle-data` - Get particle animation data

### Blog API
- `GET /api/blog/posts` - Get blog posts
- `GET /api/blog/posts/:slug` - Get specific blog post
- `POST /api/blog/challenge/validate` - Validate challenge answer
- `POST /api/blog/code-execution` - Execute code snippet

### Projects API
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects/:id/demo-interaction` - Handle demo interactions
- `GET /api/projects/map/islands` - Get project islands for map

### GitHub Integration
- `GET /api/github/repositories/:username` - Get GitHub repositories
- `GET /api/github/profile/:username` - Get GitHub profile
- `GET /api/github/stats/:username/:repo` - Get repository statistics

### AI Services
- `POST /api/ai/code-suggestion` - Get AI code suggestions
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/project-recommendation` - Get project recommendations

## 🔧 Configuration

### External API Keys
To enable full functionality, configure these API keys in your `.env` files:

- **GitHub Token**: For repository data and statistics
- **xAI API Key**: For AI-powered features (when available)
- **CodeSandbox API Key**: For code execution features

### Database Setup
The application uses three databases:
- **MySQL**: User data and structured content (existing)
- **MongoDB**: Blog posts and dynamic content
- **Redis**: Caching and session management (optional)

## 🎯 Project Structure

```
├── journeyAdventure/          # Frontend Next.js application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities and configurations
│   ├── public/               # Static assets
│   └── package.json
│
├── node-express-mysql/        # Backend Express application
│   ├── config/               # Database configurations
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # External service integrations
│   ├── socket/               # WebSocket handlers
│   └── portfolio-server.js   # Main server file
│
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd journeyAdventure
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend
Configure your production environment variables and deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎨 Design Philosophy

This portfolio website is designed around the concept of "interaction + storytelling" to create an engaging experience that showcases technical skills through immersive, interactive elements rather than traditional static presentations.




### 1. 主导航栏 (Navigation.tsx)
- 在主导航中添加了 "Tech Blog" 选项 (📚) 导航到 `/blog` 页面

### 2. 主页面 (InteractiveHomepage.tsx)
- **左侧导航按钮**: 添加了 "📚 Tech Blog & Timeline" 按钮
- **右侧导航菜单**: 在导航菜单中添加了 "📚 Tech Blog" 选项
- **特色博客卡片**: 在右侧添加了一个显示最新博客文章的卡片

### 3. 项目页面 (ProjectsPage.tsx)
- 在页面头部导航中添加了blog入口
- 使用了新的 `QuickNavigation` 组件

### 4. Blog页面 (blog/page.tsx)
- 添加了顶部导航栏，包含返回主页和项目页面的链接
- 使用了 `QuickNavigation` 组件保持导航一致性

## 新创建的组件

### 1. BlogEntryCard.tsx
- 可重用的blog入口卡片组件
- 支持 `compact` 和 `featured` 两种变体
- 包含动画效果和悬停状态

### 2. QuickNavigation.tsx
- 统一的快速导航组件
- 在所有页面间提供一致的导航体验
- 支持当前页面高亮显示
- 响应式设计，在小屏幕上隐藏描述文本

## 视觉设计特点

- **颜色主题**: Blog入口使用绿色/青色渐变 (green-600 to teal-600)
- **图标**: 统一使用 📚 图标表示blog
- **动画**: 包含悬停动画和过渡效果
- **一致性**: 所有入口点保持视觉风格一致

## 用户体验改进

1. **多重入口**: 用户可以从任何页面轻松访问blog
2. **清晰标识**: 使用直观的图标和标签
3. **上下文感知**: 在不同页面提供相应的导航选项
4. **响应式**: 在不同设备上都能良好显示

## 技术实现

- 使用 Framer Motion 实现流畅动画
- TypeScript 类型安全
- 组件化设计，便于维护和复用
- 遵循现有的设计系统和代码规范

现在用户可以通过多种方式访问你的技术博客，提升了整体的用户体验和内容可发现性。

## 新增功能：博客创建和编辑系统

### 后端API端点 (node-express-mysql/routes/blog.js)
- **POST /api/blog/posts** - 创建新博客文章
- **PUT /api/blog/posts/:id** - 更新现有博客文章
- **DELETE /api/blog/posts/:id** - 删除博客文章
- **GET /api/blog/posts/:id/edit** - 获取文章编辑数据（包括草稿）
- **GET /api/blog/drafts** - 获取所有草稿文章

### 前端页面和组件
1. **创建文章页面** (`/blog/create`)
   - 完整的博客编辑器界面
   - 支持标题、内容、摘要、标签编辑
   - 代码示例添加功能
   - 交互式挑战创建
   - 草稿/发布状态选择

2. **编辑文章页面** (`/blog/edit/[id]`)
   - 加载现有文章数据进行编辑
   - 支持删除文章功能
   - 保持所有创建页面的编辑功能

3. **管理页面** (`/blog/manage`)
   - 显示所有已发布文章和草稿
   - 分标签页管理不同状态的文章
   - 快速编辑、查看、删除操作
   - 文章统计信息显示

4. **博客编辑器组件** (`BlogEditor.tsx`)
   - 富文本编辑界面
   - 标签管理系统
   - 代码示例编辑器（支持多种语言）
   - 交互式挑战编辑器
   - 实时预览功能

### 新增入口点
1. **博客主页** - 添加了"📝 Manage"和"✍️ New Post"按钮
2. **主页左侧导航** - 在博客按钮下方添加了创建和管理按钮
3. **主页右侧菜单** - 添加了紧凑的创建和管理入口

### 功能特性
- **完整的CRUD操作** - 创建、读取、更新、删除博客文章
- **草稿系统** - 支持保存草稿，稍后发布
- **标签管理** - 动态添加和删除标签
- **代码示例** - 支持多种编程语言的代码片段
- **交互式挑战** - 为文章添加问答挑战
- **特色文章** - 标记重要文章为特色内容
- **响应式设计** - 在所有设备上都能良好工作
- **实时反馈** - 操作成功/失败的即时反馈

### API集成
- 前端通过Next.js API路由与后端Express服务器通信
- 支持环境变量配置API基础URL
- 完整的错误处理和用户反馈


---

**Built with ❤️ using modern web technologies**