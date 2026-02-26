# 🎯 Mission Control 可视化管理平台
为 OpenClaw 开发的集中式多智能体协同与任务调度平台。

由于我主要用于管理我的小龙虾自媒体运营平台，这里定制了内容分发、数据分析等核心功能，但底层架构灵活通用，可轻松扩展至其他业务场景！

## ✨ 主要功能

* **🤖 智能体管理**：实时监控各角色（如内容创作者、数据分析师等）的状态、心跳及任务负载情况。
* **📋 任务调度中心**：分优先级、带截止时间的自动化任务派发与进度跟踪系统。
* **📊 可视化仪表盘**：通过 ECharts 与平台性能监控组件，获取实时的系统处理指标与执行效率。
* **📁 本地化结果存储**：文章、方案或深度分析产出物（Markdown/JSON），将大规模实体内容按约定存入独立 `outputs/` 目录中，在保持轻量级 SQLite 调度的同时优化存储资源。
* **📈 社交媒体管理与多维热点探测**：提供强大的热点与爆款搜集记录工具。
* **🔔 微消息系统**：支持内部智能体协同通信日志记录。

## 🛠️ 技术栈

* **前端 (Frontend)**：Vanilla JavaScript (原生JS) + HTML5 + CSS3 (基于 Tailwind CSS v4)
* **打包与构建**：Vite 
* **图表库**：ECharts
* **后端 (Backend)**：Python 3 + FastAPI
* **数据库**：SQLite3 (自包含，零配置)
* **前后端通信**：RESTful APIs, JSON Web Tokens (JWT) 鉴权

## 🚀 快速启动指南

### 1️⃣ 后端启动服务

1. 配置 Python 环境 (推荐使用 3.8+版本)
2. 安装依赖项：
   ```bash
   pip install fastapi uvicorn
   ```
3. 在项目根目录运行初始化迁移（仅初次配置需要）：
   ```bash
   python backend/migrate_db.py
   ```
   *注意：系统会为您设置一个初始管理员账号（用户名为 `admin`，密码为 `admin`）。*
4. 启动 FastAPI 服务端守护进程：
   ```bash
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2️⃣ 前端环境与预览

1. 进入项目根目录执行：
   ```bash
   npm install
   ```
2. 启动 Vite 本地开发服务器：
   ```bash
   npm run dev
   ```
3. 打开浏览器访问 `http://localhost:3000` 并通过默认账户 `admin / admin` 登录系统。

## 🛡️ 安全与生产部署配置

本系统在进入服务器时建议遵循以下安全生产操作：
* **⚠️ 修改 JWT_SECRET**：生产环境务必前往服务器终端中设置环境变量 `JWT_SECRET`，并使其异于默认值以防止 Token 绕过风险！
* **🔗 跨域代理与端口保护**：建议为平台加入 Nginx 反向代理绑定你的正式域名至前端端口。 
* `.env` 与 `database/*.db` 以及 `outputs/` 中的重要业务输出将被强制 `.gitignore` 化，绝不会错误泄漏至公共仓库之中。

## 👨‍💻 开源与许可

MIT License
欢迎任何感兴趣的开发者提出 Issue 寻求功能迭代，或者提交 Pull Request 一起优化本项目！
