# Mission Control 可视化管理平台 - 部署说明书

> **项目名称**: MC Visual Platform (Mission Control 可视化管理平台)  
> **版本**: v2.0.0  
> **编写日期**: 2026-02-23  
> **部署目标路径**: `/home/admin/mc-web/`  
> **面向**: OpenClaw 部署工程师

---

## 一、项目概述

Mission Control 可视化管理平台是一套 **AI 智能体集中式任务调度系统的前端监控面板**，用于可视化管理和监控以下模块：

| 模块 | 功能 | 对应页面文件 |
|------|------|-------------|
| 仪表盘 (Dashboard) | 系统整体概览、关键指标、Agent 状态一览 | `dashboard.js` |
| 智能体管理 (Agents) | 6 个 AI Agent 的状态监控与管理 | `agents.js` |
| 任务管理 (Tasks) | 任务看板/列表、任务提交（统一交由 Mission Control 管理） | `tasks.js` |
| 热点监控 (Hotspots) | 热点话题发现与评分展示 | `hotspots.js` |
| 内容管理 (Articles) | 文章创作与内容质量评分 | `articles.js` |
| 模板管理 (Templates) | AI Prompt 模板管理（支持内联编辑） | `templates.js` |
| 社媒管理 (Social) | 多平台社交媒体发布管理 | `social.js` |
| 消息中心 (Messages) | Agent 间通信消息记录 | `messages.js` |
| 系统监控 (Monitoring) | 系统日志、性能指标、ECharts 图表 | `monitoring.js` |
| 系统设置 (Settings) | 系统配置项管理 | `settings.js` |

### 系统架构

```
用户浏览器 ──→ Nginx (反向代理 / 静态文件托管) ──→ 静态资源 (HTML/JS/CSS)
                                                      │
                                                      ├── 当前: 前端 Mock 数据 (mock-data.js)
                                                      └── 未来: RESTful API → SQLite 数据库
```

### SPA 单页应用架构

本项目采用 **SPA (Single Page Application)** 架构。源代码中的 `src/pages/*.js`（如 `agents.js`, `tasks.js` 等）在构建阶段已通过 Vite 进行打包、代码压缩和合并。

**这意味着：**
- 您在 `dist/assets/` 目录下看到的单个 `.js` 文件已经包含了所有页面的逻辑。
- 部署时**不需要**寻找独立的 `agents.js` 文件，只需将 `dist/` 目录完整上传即可。
- 浏览器加载 `index.html` 后，会根据 URL 的 **Hash (#)** 自动在客户端切换显示不同的页面。

### 当前状态说明

> **⚠️ 重要**：当前版本为**纯前端应用**，所有数据来自前端内置的 mock 数据（`src/data/mock-data.js`），尚未对接后端 API。  
> 数据库脚本（`database/` 目录）已准备就绪，待后端 API 开发完成后接入。

---

## 二、技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vite | 6.x | 构建工具 |
| HTML / JS / CSS | 原生 | 核心开发 |
| Tailwind CSS | 4.x | 样式辅助（实际以自定义 CSS 设计系统为主） |
| ECharts | 5.6 | 数据可视化图表（系统监控页面） |
| SQLite 3 | - | 数据库（数据库脚本已备，待后端接入） |

**构建产物为纯静态文件（HTML + JS + CSS），不依赖 Node.js 运行时，使用 Nginx 直接托管即可。**

---

## 三、环境要求

### 3.1 服务器最低配置

- **操作系统**: Linux (CentOS 7+ / Ubuntu 20.04+ / Debian 11+)
- **CPU**: 1 核
- **内存**: 512 MB
- **磁盘**: 10 MB（静态文件占用极小）
- **Nginx**: 1.18+
- **SQLite3**: 3.31+（仅数据库初始化时需要）

### 3.2 端口需求

| 端口 | 用途 |
|------|------|
| 80 | HTTP 访问（可选） |
| 443 | HTTPS 访问（推荐） |

---

## 四、项目文件结构

```
MC_visual_platform/
├── dist/                          # ← 构建产物，部署此目录
│   ├── index.html                 # 入口 HTML
│   └── assets/
│       ├── index-CszRL9jn.css     # 合并压缩后的样式表 (~33KB)
│       └── index-DBMjE6GK.js     # 合并压缩后的脚本 (~106KB, 含 ECharts)
├── database/                      # ← 数据库相关脚本
│   ├── init_database.sql          # 数据库建表脚本（12 张表 + 索引 + 视图 + 触发器）
│   ├── register_agents.sql        # 注册 6 个 AI Agent
│   ├── populate_sample_data.sql   # 填充示例数据
│   ├── mission_control.db         # 开发用的 SQLite 数据库文件
│   └── migrations/
│       ├── backups/               # 数据库备份
│       └── migrate_from_old_db.js # 数据迁移脚本
├── src/                           # 源代码（仅部署时参考，不需要上传到生产环境）
├── index.html                     # 开发入口
├── vite.config.js                 # Vite 配置
├── package.json                   # 依赖配置
└── DEPLOYMENT.md                  # 本文件
```

---

## 五、部署步骤

### 步骤 1：准备目录结构

```bash
# 创建部署目录
sudo mkdir -p /home/admin/mc-web/www

sudo mkdir -p /home/admin/mc-web/logs
sudo mkdir -p /home/admin/mc-web/backups
sudo mkdir -p /home/admin/.openclaw/workspace/projects/mission_control/database
# 设置目录归属
sudo chown -R admin:admin /home/admin/mc-web
```

### 步骤 2：上传文件

将以下文件/目录上传到服务器：

| 本地路径 | 服务器目标路径 | 说明 |
|---------|-------------|------|
| `dist/` 目录下的所有文件 | `/home/admin/mc-web/www/` | **前端静态文件，核心部署文件** |
| `database/init_database.sql` | `/home/admin/.openclaw/workspace/projects/mission_control/database/` | 数据库初始化脚本 |
| `database/register_agents.sql` | `/home/admin/.openclaw/workspace/projects/mission_control/database/` | Agent 注册脚本 |
| `database/populate_sample_data.sql` | `/home/admin/.openclaw/workspace/projects/mission_control/database/` | 示例数据脚本 |

```bash
# 示例：使用 scp 上传
scp -r dist/* admin@118.31.127.116:/home/admin/mc-web/www/
scp database/*.sql admin@118.31.127.116:/home/admin/.openclaw/workspace/projects/mission_control/database/
```

上传完成后的目录结构应为：

```
/home/admin/mc-web/
├── www/                # ← 对应本地的 dist/ 目录内容
│   ├── index.html      # 入口文件（由它加载所有 JS 逻辑）
│   └── assets/
│       ├── index-CszRL9jn.css  # 包含所有页面的样式
│       └── index-DBMjE6GK.js   # 包含所有页面（如 agents, tasks 等）的打包后代码
├── logs/
└── backups/

/home/admin/.openclaw/workspace/projects/mission_control/database/
├── init_database.sql
├── register_agents.sql
├── populate_sample_data.sql
├── mission_control.db
```

### 步骤 3：初始化数据库

```bash
cd /home/admin/.openclaw/workspace/projects/mission_control/database/

# 初始化数据库结构（创建 12 张表 + 索引 + 视图 + 触发器）
sqlite3 mission_control.db < init_database.sql

# 注册 AI 智能体（6 个 Agent）
sqlite3 mission_control.db < register_agents.sql

# [可选] 填充示例数据（用于验证 and 演示）
sqlite3 mission_control.db < populate_sample_data.sql

# 验证数据库
sqlite3 mission_control.db "SELECT COUNT(*) FROM agents;"
# 应该输出: 6

# 设置数据库文件权限
chmod 664 mission_control.db
```

### 步骤 4：配置 Nginx

创建 Nginx 配置文件：

```bash
sudo vi /etc/nginx/conf.d/mc-web.conf
```

写入以下配置：

```nginx
server {
    listen 80;
    server_name mc.yourdomain.com;      # ← 替换为实际域名或 IP

    root /home/admin/mc-web/www;
    index index.html;

    # 访问日志
    access_log /home/admin/mc-web/logs/access.log;
    error_log  /home/admin/mc-web/logs/error.log;

    # 静态资源缓存策略
    location /assets/ {
        expires 1y;                      # 带 hash 的静态资源长期缓存
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # SPA 路由回退（Hash 路由模式，实际不需要 try_files 回退，但保留以防万一）
    location / {
        try_files $uri $uri/ /index.html;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 禁止访问数据库文件（安全防护）
    location ~* \.(db|sqlite|sql)$ {
        deny all;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1024;
}
```

### 步骤 5：验证并启动

```bash
# 检查 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx

# 或如果 Nginx 未启动
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 步骤 6：验证部署

```bash
# 本地验证
curl -s -o /dev/null -w "%{http_code}" http://localhost/
# 应返回 200

# 检查静态资源
curl -s -o /dev/null -w "%{http_code}" http://localhost/assets/index-DBMjE6GK.js
# 应返回 200
```

在浏览器中访问 `http://mc.yourdomain.com`（或服务器 IP），应看到 Mission Control 可视化管理平台的界面。

---

## 六、数据库表结构参考

### 🔗 数据库连接信息 (正式环境)

```
数据库类型: SQLite
数据库路径: /home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db
公网IP: 118.31.127.116
端口: 5000 (Flask API) / 22 (SSH)
访问方式: 通过API或SSH隧道连接数据库
```

当前数据库包含以下 **12 张表**，供后端 API 开发时参考：

| 表名 | 用途 | 关键字段 |
|------|------|---------|
| `system_config` | 系统配置 | config_key, config_value |
| `agents` | 智能体注册 | agent_id, agent_name, status, last_heartbeat |
| `messages` | Agent 间通信 | sender_agent_id, receiver_agent_id, message_type, payload_json |
| `tasks` | 任务管理 | task_id, assigned_to, assigned_by, status, priority |
| `hotspots` | 热点数据 | hotspot_id, total_score, status |
| `articles` | 文章内容 | article_id, overall_score, status |
| `social_posts` | 社交媒体发布 | post_id, platform, status, views/likes/shares |
| `system_logs` | 系统日志 | level, agent_id, message |
| `performance_metrics` | 性能指标 | metric_type, metric_value |
| `analysis_results` | 分析结果 | analysis_type, insights_json |
| `maintenance_records` | 维护记录 | maintenance_type, status |
| `backup_records` | 备份记录 | backup_type, filename, checksum |

**视图 (Views)**:
- `v_agent_status` — 智能体状态实时视图（含心跳判断）
- `v_task_statistics` — 按 Agent 统计任务完成情况
- `v_hotspot_quality` — 热点质量评分统计
- `v_system_performance` — 系统性能日趋势汇总

**触发器 (Triggers)**:
- `trg_agents_update` — 自动更新 agents 表的 updated_at
- `trg_tasks_update` — 自动更新 tasks 表的 updated_at
- `trg_hotspots_update` — 自动更新 hotspots 表的 updated_at
- `trg_articles_update` — 自动更新 articles 表的 updated_at
- `trg_task_status_change` — 任务状态变更自动写入日志

---

## 七、AI 智能体注册清单

系统包含 6 个 AI Agent，全部由 Mission Control（管理员）统一调度：

| Agent ID | 名称 | 类型 | 职责 |
|----------|------|------|------|
| `mission_control` | 任务管理器 | central_controller | 核心控制：接收任务 → 规划拆分 → 分配调度 → 结果汇报 |
| `hotspot_scout` | 热点侦察兵 | hotspot_scout | 多渠道热点发现与评分 |
| `content_creator` | 内容创作者 | content_creator | 基于热点和模板创作文章 |
| `social_manager` | 社交媒体经理 | social_manager | 多平台内容发布与数据追踪 |
| `tech_specialist` | 技术专家 | tech_specialist | 系统维护、备份检查 |
| `data_analyst` | 数据分析师 | data_analyst | 数据统计与趋势分析 |

### 工作流说明

```
用户提交任务 → Mission Control (管理员) → 自动规划拆分 → 分配给 Agent 执行 → 结果汇报给管理员
```

所有任务统一提交给 `mission_control`，由管理员负责：
1. **任务规划** — 分析需求，拆分为子任务
2. **任务分配** — 匹配最合适的 Agent
3. **执行监控** — 跟踪任务进度
4. **结果汇报** — 汇总结果通知用户

---

## 八、外部依赖

构建后的静态文件引用了以下外部 CDN 资源（需要网络连通性）：

| 资源 | CDN 地址 | 用途 |
|------|---------|------|
| Google Fonts (Inter) | fonts.googleapis.com | 英文字体 |
| Google Fonts (Noto Sans SC) | fonts.gstatic.com | 中文字体 |

> **注意**：如果部署在内网环境无法访问外网，字体会回退到系统默认字体（不影响功能）。如需离线字体支持，可下载字体文件放置到 `/home/admin/mc-web/www/fonts/` 目录，并修改 `index.html` 中的字体引用。

---

## 九、常见问题排查

### Q1: 页面打开白屏
- 检查 Nginx root 路径是否指向 `/home/admin/mc-web/www`
- 检查 `index.html` 和 `assets/` 目录是否正确上传
- 检查文件权限：`chmod -R 755 /home/admin/mc-web/www`

### Q2: 静态资源 404
- 确认 `assets/` 目录是否在 `www/` 下
- 检查 Nginx 配置中 `root` 路径是否正确

### Q3: 页面能访问但样式错乱
- 清除浏览器缓存后重试
- 检查 CSS 文件是否完整上传（size 应约为 ~33KB）

### Q4: ECharts 图表不显示
- 系统监控页面使用 ECharts，已打包在 JS 文件中（无外部依赖）
- 检查浏览器控制台是否有 JS 报错

---

## 十、后续开发对接计划

当前版本为纯前端展示（Mock 数据），后续需要开发后端 API 并对接前端：

### 需要开发的 API 端点

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/agents` | 获取所有 Agent 状态 |
| GET | `/api/tasks` | 获取任务列表 |
| POST | `/api/tasks` | 创建新任务（提交给 Mission Control） |
| PATCH | `/api/tasks/:id` | 更新任务状态 |
| GET | `/api/hotspots` | 获取热点列表 |
| GET | `/api/articles` | 获取文章列表 |
| GET | `/api/social-posts` | 获取社交媒体发布记录 |
| GET | `/api/messages` | 获取通信消息 |
| GET | `/api/system/logs` | 获取系统日志 |
| GET | `/api/system/metrics` | 获取性能指标 |
| GET/PUT | `/api/system/config` | 读取/更新系统配置 |
| GET | `/api/templates` | 获取模板列表 |
| PUT | `/api/templates/:id` | 更新模板内容 |

### API 对接时的 Nginx 代理配置（参考）

```nginx
# 在 server 块中添加 API 反向代理
location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;    # ← 后端 API 服务地址
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 十一、维护建议

### 日志轮转

建议配置 logrotate 管理 Nginx 日志：

```bash
sudo vi /etc/logrotate.d/mc-web
```

```
/home/admin/mc-web/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 admin admin
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}
```

### 数据库备份建议

```bash
# 手动备份
cp /home/admin/mc-web/database/mission_control.db /home/admin/mc-web/backups/mission_control_$(date +%Y%m%d_%H%M%S).db

# 定时备份 (crontab)
# 每天凌晨 3 点自动备份
0 3 * * * cp /home/admin/mc-web/database/mission_control.db /home/admin/mc-web/backups/mission_control_$(date +\%Y\%m\%d).db
```

---

## 十二、部署检查清单 ✅

| # | 检查项 | 状态 |
|---|-------|------|
| 1 | 目录结构已创建 (`/home/admin/mc-web/www/`, `database/`, `logs/`, `backups/`) | ☐ |
| 2 | 静态文件已上传 (`index.html`, `assets/` 目录) | ☐ |
| 3 | 文件权限已设置 (www 目录 755, 文件 644) | ☐ |
| 4 | 数据库已初始化 (`init_database.sql` 已执行) | ☐ |
| 5 | Agent 已注册 (`register_agents.sql` 已执行) | ☐ |
| 6 | Nginx 配置文件已放置 (`/etc/nginx/conf.d/mc-web.conf`) | ☐ |
| 7 | Nginx 配置语法检查通过 (`nginx -t`) | ☐ |
| 8 | Nginx 已重载 (`systemctl reload nginx`) | ☐ |
| 9 | HTTP 访问正常（返回 200） | ☐ |
| 10 | 页面正常显示（仪表盘、侧边栏、主题切换均正常） | ☐ |
| 11 | 日志轮转已配置 | ☐ |
| 12 | 数据库备份计划已配置 | ☐ |

---

*Mission Control 可视化管理平台 v2.0.0 — 部署说明书完毕*
