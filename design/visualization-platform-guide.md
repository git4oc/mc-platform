# Mission Control 可视化管理平台开发指南

## 1. 系统概述

### 1.1 平台定位
Mission Control可视化管理平台是一个基于Web的监控和管理界面，用于实时监控和管理Mission Control多Agent系统的运行状态。

### 1.2 核心目标
1. **实时监控**：展示系统实时运行状态
2. **交互管理**：提供系统配置和任务管理功能
3. **数据分析**：提供系统性能分析和趋势预测
4. **友好体验**：直观、易用的用户界面

## 1.3 快速开始指南

### 1.3.1 第一步：了解数据源
1. **数据库位置**：`/home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db`
2. **文件系统位置**：`/home/admin/.openclaw/workspace/projects/mission_control/outputs/`
3. **核心表数量**：13个（详见第3章）
4. **Agent数量**：6个（详见第3.2.1节）

### 1.3.2 第二步：搭建开发环境
```bash
# 前端项目（Vite + TailwindCSS + ECharts）
cd d:\proJects\MC_visual_platform
npm install
npm run dev          # 启动开发服务器，端口 3000

# 后端API服务（Python FastAPI）
cd backend
conda activate py312
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 2. 系统架构

### 2.1 整体架构图
```
┌─────────────────────────────────────────────────────────────────┐
│                 可视化管理平台 (Web前端 + API)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ 仪表盘 │ │ 智能体 │ │任务管理│ │热点监控│ │内容管理│        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │模板管理│ │社媒管理│ │消息中心│ │系统监控│ │系统设置│        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  前端: 原生JS + Vite + TailwindCSS v4 + ECharts + Hash Router  │
├─────────────────────────────────────────────────────────────────┤
│  后端: Python FastAPI + SQLite3 + Uvicorn (端口8000)            │
├─────────────────────────────────────────────────────────────────┤
│  数据库: mission_control.db (13个核心表)                         │
│  文件系统: outputs/ (产出物存储)                                 │
├─────────────────────────────────────────────────────────────────┤
│  部署: GitHub Actions → SCP → Aliyun (/home/admin/mc-web/www)  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 实际采用的技术栈

#### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| **原生 JavaScript** | ES Module | 核心逻辑，无框架 |
| **Vite** | 6.2 | 构建工具 & 开发服务器 |
| **TailwindCSS** | v4 | 样式系统 |
| **ECharts** | 5.6 | 数据可视化图表 |
| **自实现 Hash Router** | - | 客户端路由 (`router.js`) |

#### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| **Python** | 3.12 (miniforge py312) | 运行时环境 |
| **FastAPI** | 0.109.2 | Web API 框架 |
| **Uvicorn** | 0.27.1 | ASGI 服务器 |
| **SQLite3** | 内置 | 数据库驱动 |

#### 部署
| 技术 | 说明 |
|------|------|
| **GitHub Actions** | CI/CD 自动化 |
| **SCP (appleboy/scp-action)** | 构建产物上传到阿里云 |
| **Nginx** | 静态文件服务 + API 反向代理 |

## 3. 数据库结构说明

### 3.1 数据库位置
```
/home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db
```

### 3.2 核心表结构（13个表）

#### 3.2.1 agents表 - 智能体状态管理
```sql
CREATE TABLE agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT UNIQUE NOT NULL,          -- 智能体ID: mission_control, content_creator等
    agent_name TEXT NOT NULL,               -- 智能体名称（中文）
    agent_type TEXT NOT NULL,               -- 智能体类型: mission_control, content_creator等
    version TEXT DEFAULT '1.0.0',           -- 版本号
    status TEXT DEFAULT 'standby',          -- 状态: active, standby, inactive, error
    last_heartbeat DATETIME,                -- 最后心跳时间
    config_json TEXT,                       -- 配置信息（JSON格式）
    performance_score INTEGER DEFAULT 70,   -- 性能评分 0-100
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_type ON agents(agent_type);
CREATE INDEX idx_agents_heartbeat ON agents(last_heartbeat);
```

**预置数据**：
```sql
INSERT INTO agents (agent_id, agent_name, agent_type, status) VALUES
('mission_control', '任务管理器', 'mission_control', 'active'),
('content_creator', '内容创作者', 'content_creator', 'active'),
('data_analyst', '数据分析师', 'data_analyst', 'active'),
('tech_specialist', '技术专家', 'tech_specialist', 'active'),
('social_manager', '社交媒体经理', 'social_manager', 'active'),
('hotspot_scout', '热点侦察兵', 'hotspot_scout', 'active');
```

#### 3.2.2 tasks表 - 任务定义和状态
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT UNIQUE NOT NULL,           -- 任务ID: task_YYYYMMDD_HHMMSS_xxx
    title TEXT NOT NULL,                    -- 任务标题
    description TEXT,                       -- 任务描述
    agent_id TEXT,                          -- 分配的智能体ID
    status TEXT DEFAULT 'pending',          -- 状态: pending, assigned, in_progress, completed, failed
    priority INTEGER DEFAULT 2,             -- 优先级: 0=紧急, 1=高, 2=中, 3=低
    progress INTEGER DEFAULT 0,             -- 进度 0-100
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME,                      -- 截止时间
    started_at DATETIME,                    -- 开始时间
    completed_at DATETIME,                  -- 完成时间
    error_message TEXT                      -- 错误信息（失败时）
);
```

#### 3.2.3 messages表 - 代理间通信记录
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT UNIQUE NOT NULL,        -- 消息ID: msg_YYYYMMDD_HHMMSS_xxx
    message_type TEXT NOT NULL,             -- 消息类型: task_assignment, task_update, result_submission等
    sender TEXT NOT NULL,                   -- 发送者ID
    receiver TEXT NOT NULL,                 -- 接收者ID
    subject TEXT,                           -- 消息主题
    content TEXT NOT NULL,                  -- 消息内容
    status TEXT DEFAULT 'unread',           -- 状态: unread, read, processed, failed
    metadata_json TEXT,                     -- 元数据（JSON格式）
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME                   -- 处理时间
);
```

#### 3.2.4 results表 - 任务结果存储
```sql
CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id TEXT UNIQUE NOT NULL,         -- 结果ID: result_YYYYMMDD_HHMMSS_xxx
    task_id TEXT NOT NULL,                  -- 关联的任务ID
    agent_id TEXT NOT NULL,                 -- 执行的智能体ID
    output_type TEXT NOT NULL,              -- 产出类型: article, report, solution等
    title TEXT NOT NULL,                    -- 产出标题
    content_summary TEXT,                   -- 内容摘要
    file_path TEXT,                         -- 文件路径（相对路径）
    quality_score INTEGER,                  -- 质量评分 0-100
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.5 system_logs表 - 系统日志记录
```sql
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id TEXT UNIQUE NOT NULL,            -- 日志ID: log_YYYYMMDD_HHMMSS_xxx
    log_level TEXT NOT NULL,                -- 日志级别: info, warning, error, debug
    component TEXT NOT NULL,                -- 组件名称
    message TEXT NOT NULL,                  -- 日志消息
    details_json TEXT,                      -- 详细信息（JSON格式）
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.6 hotspots表 - 热点数据存储
```sql
CREATE TABLE hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotspot_id TEXT UNIQUE NOT NULL,        -- 热点ID: hotspot_YYYYMMDD_HHMMSS_xxx
    title TEXT NOT NULL,                    -- 热点标题
    summary TEXT NOT NULL,                  -- 热点摘要
    content TEXT,                           -- 热点详细内容
    relevance_score INTEGER,                -- 相关性评分 0-100
    novelty_score INTEGER,                  -- 新颖性评分 0-100
    practicality_score INTEGER,             -- 实用性评分 0-100
    audience_interest_score INTEGER,        -- 受众兴趣评分 0-100
    total_score INTEGER,                    -- 总分 0-100
    sources_json TEXT,                      -- 来源信息（JSON格式）
    discovered_by TEXT,                     -- 发现者
    discovered_at DATETIME,                 -- 发现时间
    status TEXT DEFAULT 'new',              -- 状态: new, processing, processed, archived
    processed_by TEXT,                      -- 处理者
    processed_at DATETIME,                  -- 处理时间
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.7 content表 - 内容存储
```sql
CREATE TABLE content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id TEXT UNIQUE NOT NULL,        -- 内容ID: content_YYYYMMDD_HHMMSS_xxx
    title TEXT NOT NULL,                    -- 内容标题
    content_type TEXT NOT NULL,             -- 内容类型: article, report, guide
    content_text TEXT NOT NULL,             -- 内容文本
    summary TEXT,                           -- 内容摘要
    author TEXT,                            -- 作者
    word_count INTEGER,                     -- 字数统计
    read_time INTEGER,                      -- 阅读时间（分钟）
    quality_score INTEGER,                  -- 质量评分 0-100
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME                   -- 发布时间
);
```

#### 3.2.8 analytics表 - 分析数据
```sql
CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analytics_id TEXT UNIQUE NOT NULL,      -- 分析ID: analytics_YYYYMMDD_HHMMSS_xxx
    analysis_type TEXT NOT NULL,            -- 分析类型: trend, comparison, forecast
    title TEXT NOT NULL,                    -- 分析标题
    summary TEXT NOT NULL,                  -- 分析摘要
    insights_json TEXT NOT NULL,            -- 洞察数据（JSON格式）
    data_source TEXT,                       -- 数据来源
    methodology TEXT,                       -- 分析方法
    confidence_level INTEGER,               -- 置信度 0-100
    recommendations_json TEXT,              -- 建议（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.9 social_posts表 - 社交媒体内容
```sql
CREATE TABLE social_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT UNIQUE NOT NULL,           -- 帖子ID: post_YYYYMMDD_HHMMSS_xxx
    platform TEXT NOT NULL,                 -- 平台: wechat, weibo, douyin
    content TEXT NOT NULL,                  -- 帖子内容
    article_id TEXT,                        -- 关联的文章ID
    target_audience TEXT,                   -- 目标受众
    engagement_metrics_json TEXT,           -- 互动指标（JSON格式）
    scheduled_time DATETIME,                -- 计划发布时间
    published_time DATETIME,                -- 实际发布时间
    status TEXT DEFAULT 'draft',            -- 状态: draft, scheduled, published, archived
    performance_score INTEGER,              -- 表现评分 0-100
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.10 configurations表 - 系统配置
```sql
CREATE TABLE configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_id TEXT UNIQUE NOT NULL,         -- 配置ID: config_YYYYMMDD_HHMMSS_xxx
    config_key TEXT UNIQUE NOT NULL,        -- 配置键
    config_value TEXT NOT NULL,             -- 配置值
    config_type TEXT NOT NULL,              -- 配置类型: string, number, boolean, json
    category TEXT,                          -- 分类: system, agent, task, output
    description TEXT,                       -- 描述
    is_active BOOLEAN DEFAULT 1,            -- 是否激活
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT                         -- 更新者
);
```

#### 3.2.11 notifications表 - 通知记录
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id TEXT UNIQUE NOT NULL,   -- 通知ID: notify_YYYYMMDD_HHMMSS_xxx
    notification_type TEXT NOT NULL,        -- 通知类型: system, task, agent, output
    title TEXT NOT NULL,                    -- 通知标题
    message TEXT NOT NULL,                  -- 通知消息
    recipient TEXT,                         -- 接收者
    priority TEXT DEFAULT 'medium',         -- 优先级: low, medium, high, urgent
    status TEXT DEFAULT 'unread',           -- 状态: unread, read, archived
    action_required BOOLEAN DEFAULT 0,      -- 是否需要操作
    action_taken TEXT,                      -- 采取的操作
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,                       -- 阅读时间
    archived_at DATETIME                    -- 归档时间
);
```

#### 3.2.12 workflows表 - 工作流定义
```sql
CREATE TABLE workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT UNIQUE NOT NULL,       -- 工作流ID: workflow_YYYYMMDD_HHMMSS_xxx
    workflow_name TEXT NOT NULL,            -- 工作流名称
    description TEXT,                       -- 描述
    steps_json TEXT NOT NULL,               -- 步骤定义（JSON格式）
    trigger_type TEXT NOT NULL,             -- 触发类型: manual, schedule, event
    trigger_config_json TEXT,               -- 触发配置（JSON格式）
    status TEXT DEFAULT 'active',           -- 状态: active, inactive, archived
    last_executed_at DATETIME,              -- 最后执行时间
    execution_count INTEGER DEFAULT 0,      -- 执行次数
    success_count INTEGER DEFAULT 0,        -- 成功次数
    failure_count INTEGER DEFAULT 0,        -- 失败次数
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.13 performance_metrics表 - 性能指标
```sql
CREATE TABLE performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_id TEXT UNIQUE NOT NULL,         -- 指标ID: metric_YYYYMMDD_HHMMSS_xxx
    metric_type TEXT NOT NULL,              -- 指标类型: agent, task, system, output
    target_id TEXT NOT NULL,                -- 目标ID（agent_id, task_id等）
    metric_name TEXT NOT NULL,              -- 指标名称
    metric_value NUMERIC NOT NULL,          -- 指标值
    unit TEXT,                              -- 单位
    time_period TEXT,                       -- 时间周期: instant, daily, weekly, monthly
    recorded_at DATETIME NOT NULL,          -- 记录时间
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 表关系说明

#### 3.3.1 主要外键关系
1. **tasks表**：
   - `assigned_to` → `agents(agent_id)`
   - `assigned_by` → `agents(agent_id)`

2. **results表**：
   - `task_id` → `tasks(task_id)`
   - `agent_id` → `agents(agent_id)`

3. **messages表**：
   - `sender` → `agents(agent_id)`
   - `receiver` → `agents(agent_id)`

4. **social_posts表**：
   - `article_id` → `content(content_id)`

#### 3.3.2 数据流关系
```
agents (智能体)
    ↓ 创建/分配
tasks (任务)
    ↓ 执行/完成
results (结果)
    ↓ 关联
content (内容) ← social_posts (社交媒体)
```

### 3.4 数据库查询示例

### 3.3 数据库查询示例

#### 获取活跃Agent列表：
```sql
SELECT agent_id, agent_name, status, last_heartbeat, performance_score 
FROM agents 
WHERE status = 'active' 
ORDER BY last_heartbeat DESC;
```

#### 获取待处理任务：
```sql
SELECT task_id, title, agent_id, priority, created_at 
FROM tasks 
WHERE status = 'pending' 
ORDER BY priority ASC, created_at ASC;
```

#### 获取最新产出物：
```sql
SELECT r.result_id, r.title, a.agent_name, r.output_type, r.quality_score, r.created_at
FROM results r
JOIN agents a ON r.agent_id = a.agent_id
ORDER BY r.created_at DESC
LIMIT 10;
```

#### 获取系统性能指标：
```sql
SELECT metric_name, metric_value, unit, recorded_at
FROM performance_metrics
WHERE metric_type = 'system'
  AND time_period = 'daily'
  AND recorded_at >= date('now', '-7 days')
ORDER BY recorded_at DESC;
```

#### 获取热点分析数据：
```sql
SELECT hotspot_id, title, total_score, discovered_at, status
FROM hotspots
WHERE status IN ('new', 'processing')
  AND total_score >= 70
ORDER BY total_score DESC, discovered_at DESC;
```

#### 获取系统日志（最近24小时错误）：
```sql
SELECT log_id, log_level, component, message, timestamp
FROM system_logs
WHERE log_level IN ('error', 'warning')
  AND timestamp >= datetime('now', '-1 day')
ORDER BY timestamp DESC;
```

#### 获取任务执行统计：
```sql
SELECT 
  agent_id,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_tasks,
  AVG(actual_duration) as avg_duration
FROM tasks
WHERE assigned_to IS NOT NULL
  AND created_at >= date('now', '-30 days')
GROUP BY agent_id
ORDER BY total_tasks DESC;
```

### 3.5 实际数据示例

#### 3.5.1 agents表数据示例
```json
[
  {
    "agent_id": "mission_control",
    "agent_name": "任务管理器",
    "agent_type": "mission_control",
    "version": "1.0.0",
    "status": "active",
    "last_heartbeat": "2026-02-25T10:30:00Z",
    "config_json": "{\"heartbeat_interval\": 900, \"max_concurrent_tasks\": 5}",
    "performance_score": 70,
    "created_at": "2026-02-25T00:00:00Z",
    "updated_at": "2026-02-25T10:30:00Z"
  },
  {
    "agent_id": "content_creator",
    "agent_name": "内容创作者",
    "agent_type": "content_creator",
    "version": "1.0.0",
    "status": "active",
    "last_heartbeat": "2026-02-25T10:25:00Z",
    "config_json": "{\"max_article_length\": 5000, \"default_tone\": \"professional\"}",
    "performance_score": 70,
    "created_at": "2026-02-25T00:00:00Z",
    "updated_at": "2026-02-25T10:25:00Z"
  }
]
```

#### 3.5.2 tasks表数据示例
```json
[
  {
    "task_id": "task_20260225_100000_001",
    "task_type": "content_creation",
    "title": "撰写中小企业数字化转型文章",
    "description": "撰写一篇关于中小企业数字化转型的深度文章",
    "assigned_to": "content_creator",
    "assigned_by": "mission_control",
    "status": "in_progress",
    "priority": "high",
    "deadline": "2026-02-25T18:00:00Z",
    "estimated_duration": 7200,
    "actual_duration": 3600,
    "requirements_json": "{\"target_audience\": \"中小企业主\", \"word_count\": 2000}",
    "created_at": "2026-02-25T10:00:00Z",
    "updated_at": "2026-02-25T11:00:00Z",
    "started_at": "2026-02-25T10:30:00Z"
  }
]
```

#### 3.5.3 results表数据示例
```json
[
  {
    "result_id": "result_20260224_143000_001",
    "task_id": "task_20260224_100000_001",
    "agent_id": "data_analyst",
    "output_type": "analysis",
    "title": "中小企业数字化趋势数据分析报告",
    "content_summary": "本报告分析了中小企业数字化趋势，涵盖技术采纳、挑战和机遇",
    "file_path": "outputs/data_analyst/analysis/da_analysis_smedigitaltrendanalysis_20260224_001.md",
    "quality_score": 85,
    "metadata_json": "{\"word_count\": 1500, \"read_time\": \"5分钟\", \"data_sources\": 3}",
    "created_at": "2026-02-24T14:30:00Z",
    "updated_at": "2026-02-24T14:30:00Z"
  }
]
```

#### 3.5.4 system_logs表数据示例
```json
[
  {
    "log_id": "log_20260225_103000_001",
    "log_level": "info",
    "component": "mission_control",
    "message": "Agent content_creator 心跳正常",
    "details_json": "{\"agent_id\": \"content_creator\", \"heartbeat_time\": \"2026-02-25T10:25:00Z\"}",
    "timestamp": "2026-02-25T10:30:00Z",
    "created_at": "2026-02-25T10:30:00Z"
  },
  {
    "log_id": "log_20260225_102500_002",
    "log_level": "warning",
    "component": "task_scheduler",
    "message": "任务分配延迟：task_20260225_100000_001",
    "details_json": "{\"task_id\": \"task_20260225_100000_001\", \"delay_seconds\": 300}",
    "timestamp": "2026-02-25T10:25:00Z",
    "created_at": "2026-02-25T10:25:00Z"
  }
]
```

### 3.6 数据库操作注意事项

#### 3.6.1 连接数据库
```javascript
// Node.js连接示例
const sqlite3 = require('sqlite3').verbose();
const dbPath = '/home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
  }
});
```

#### 3.6.2 查询数据
```javascript
// 查询Agent列表
db.all('SELECT * FROM agents ORDER BY created_at DESC', (err, rows) => {
  if (err) {
    console.error('查询失败:', err.message);
  } else {
    console.log('查询结果:', rows);
  }
});
```

#### 3.6.3 插入数据
```javascript
// 插入新任务
const task = {
  task_id: `task_${Date.now()}_001`,
  task_type: 'content_creation',
  title: '新文章创作',
  assigned_to: 'content_creator',
  status: 'pending'
};

db.run(
  'INSERT INTO tasks (task_id, task_type, title, assigned_to, status) VALUES (?, ?, ?, ?, ?)',
  [task.task_id, task.task_type, task.title, task.assigned_to, task.status],
  function(err) {
    if (err) {
      console.error('插入失败:', err.message);
    } else {
      console.log('插入成功，ID:', this.lastID);
    }
  }
);
```

#### 3.6.4 更新数据
```javascript
// 更新任务状态
db.run(
  'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE task_id = ?',
  ['in_progress', 'task_20260225_100000_001'],
  function(err) {
    if (err) {
      console.error('更新失败:', err.message);
    } else {
      console.log('更新成功，影响行数:', this.changes);
    }
  }
);
```

#### 3.6.5 事务处理
```javascript
// 使用事务确保数据一致性
db.serialize(() => {
  db.run('BEGIN TRANSACTION');
  
  // 更新任务状态
  db.run('UPDATE tasks SET status = ? WHERE task_id = ?', ['completed', taskId]);
  
  // 插入结果记录
  db.run('INSERT INTO results (result_id, task_id, agent_id, title) VALUES (?, ?, ?, ?)',
    [resultId, taskId, agentId, title]);
  
  db.run('COMMIT', (err) => {
    if (err) {
      console.error('事务提交失败:', err.message);
      db.run('ROLLBACK');
    } else {
      console.log('事务提交成功');
    }
  });
});
```





## 4. 文件系统结构说明

### 4.1 工作目录结构

#### 4.1.1 mission control执行系统目录结构
```
/home/admin/.openclaw/workspace/projects/mission_control/
├── agents/                    # Agent工作目录
├── outputs/                   # 产出物存储目录
├── database/                  # 数据库目录
├── design/                    # 设计文档
├── utils/                     # 工具函数



```
#### 4.1.2 MC可视化管理平台目录
/home/admin/mc-web/             #可视化平台目录

```

### 4.2 产出物存储目录结构
```
outputs/
├── content_creator/           # 内容创作者产出
│   ├── articles/             # 文章
│   │   └── cc_article_digitaltransformationguide_20260224_001.md
│   └── reports/              # 报告
│       └── cc_report_workreport_20260224_001.md
├── data_analyst/             # 数据分析师产出
│   ├── analysis/             # 分析报告
│   │   └── da_analysis_smedigitaltrendanalysis_20260224_001.md
│   └── reports/              # 工作报告
│       └── da_report_workreport_20260224_001.md
├── tech_specialist/          # 技术专家产出
│   ├── solutions/            # 技术方案
│   │   └── ts_solution_systemperformanceoptimizationt_20260224_001.md
│   └── reports/              # 工作报告
│       └── ts_report_workreport_20260224_001.md
├── social_manager/           # 社交媒体经理产出
│   ├── posts/                # 社交媒体内容
│   │   └── sm_post_wechatdigitaltransformationent_20260224_001.md
│   └── reports/              # 工作报告
│       └── sm_report_workreport_20260224_001.md
├── hotspot_scout/            # 热点侦察兵产出
│   └── reports/              # 热点报告
│       ├── hs_report_digitalhotspotreport_20260224_001.md
│       └── hs_report_workreport_20260224_001.md
└── mission_control/          # 任务管理器产出
    └── reports/              # 系统报告（特殊格式）
        ├── mc_report_system_status_20260224_2330.md
        └── mc_report_system_status_20260224_2338.md
```

### 4.3 文件名命名规范

#### 4.3.1 标准命名格式
```
[agent_prefix]_[output_type]_[topic]_[YYYYMMDD]_[seq].[ext]
```

#### 4.3.2 组成部分说明
| 部分 | 说明 | 示例 | 规则 |
|------|------|------|------|
| `agent_prefix` | Agent前缀 | `cc`, `da`, `ts` | 2-3字母缩写 |
| `output_type` | 产出类型 | `article`, `report`, `solution` | 小写英文 |
| `topic` | 主题关键词 | `digital_transformation`, `performance` | 英文蛇形命名，30字符内 |
| `YYYYMMDD` | 创建日期 | `20260224` | 年月日，无分隔符 |
| `seq` | 序列号 | `001`, `002` | 3位数字，从001开始 |
| `ext` | 文件扩展名 | `.md`, `.json` | 根据内容类型 |

#### 4.3.3 Agent前缀映射表
| Agent ID | 前缀 | 说明 |
|----------|------|------|
| `content_creator` | `cc` | 内容创作者 |
| `data_analyst` | `da` | 数据分析师 |
| `tech_specialist` | `ts` | 技术专家 |
| `social_manager` | `sm` | 社交媒体经理 |
| `hotspot_scout` | `hs` | 热点侦察兵 |
| `mission_control` | `mc` | 任务管理器 |

#### 4.3.4 产出类型映射表
| Agent类型 | 产出类型 | 文件扩展名 | 说明 |
|-----------|----------|------------|------|
| `content_creator` | `article` | `.md` | 文章、报告 |
| `content_creator` | `report` | `.md` | 研究报告 |
| `data_analyst` | `analysis` | `.md` | 分析报告 |
| `data_analyst` | `report` | `.md` | 工作报告 |
| `tech_specialist` | `solution` | `.md` | 技术方案 |
| `tech_specialist` | `report` | `.md` | 工作报告 |
| `social_manager` | `post` | `.md` | 社交媒体内容 |
| `social_manager` | `report` | `.md` | 工作报告 |
| `hotspot_scout` | `report` | `.md` | 热点报告 |
| `mission_control` | `report` | `.md` | 系统报告 |
| `mission_control` | `status` | `.md` | 状态报告 |

#### 4.3.5 特殊格式说明
- **mission_control特殊格式**：`mc_report_system_status_YYYYMMDD_HHMM.md`
  - 使用`HHMM`（小时分钟）代替序列号
  - 固定topic为`system_status`
  - 示例：`mc_report_system_status_20260224_2330.md`

#### 4.3.6 文件名示例
```
标准格式：
cc_article_digitaltransformationguide_20260224_001.md
da_analysis_smedigitaltrendanalysis_20260224_001.md
ts_solution_systemperformanceoptimizationt_20260224_001.md
sm_post_wechatdigitaltransformationent_20260224_001.md
hs_report_digitalhotspotreport_20260224_001.md

特殊格式：
mc_report_system_status_20260224_2330.md
mc_report_system_status_20260224_2338.md
```

### 4.4 文件系统访问示例

#### 4.4.1 读取产出物文件内容
```javascript
const fs = require('fs');
const path = require('path');

// 构建文件路径
const filePath = path.join(
  '/home/admin/.openclaw/workspace/projects/mission_control/outputs',
  'data_analyst/analysis/da_analysis_smedigitaltrendanalysis_20260224_001.md'
);

// 读取文件内容
try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('文件内容:', content.substring(0, 200) + '...');
} catch (error) {
  console.error('读取文件失败:', error.message);
}
```

#### 4.4.2 遍历产出物目录
```javascript
const fs = require('fs');
const path = require('path');

function listOutputFiles(agentId, outputType) {
  const dirPath = path.join(
    '/home/admin/.openclaw/workspace/projects/mission_control/outputs',
    agentId,
    outputType === 'article' ? 'articles' : 
    outputType === 'analysis' ? 'analysis' :
    outputType === 'solution' ? 'solutions' :
    outputType === 'post' ? 'posts' : 'reports'
  );
  
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error(`读取目录 ${dirPath} 失败:`, error.message);
    return [];
  }
}

// 示例：列出content_creator的所有文章
const articles = listOutputFiles('content_creator', 'article');
console.log('文章列表:', articles);
```

#### 4.4.3 文件路径解析工具
```javascript
function parseOutputFilename(filename) {
  // 格式: [prefix]_[type]_[topic]_[YYYYMMDD]_[seq].md
  const pattern = /^([a-z]{2})_([a-z]+)_([a-z0-9_]+)_(\d{8})_(\d{3})\.md$/;
  const match = filename.match(pattern);
  
  if (!match) {
    // 尝试匹配特殊格式: mc_report_system_status_YYYYMMDD_HHMM.md
    const specialPattern = /^(mc)_(report)_(system_status)_(\d{8})_(\d{4})\.md$/;
    const specialMatch = filename.match(specialPattern);
    
    if (specialMatch) {
      return {
        agentPrefix: specialMatch[1],
        outputType: specialMatch[2],
        topic: specialMatch[3],
        date: specialMatch[4],
        sequence: specialMatch[5], // 这里是HHMM格式
        isSpecialFormat: true
      };
    }
    return null;
  }
  
  return {
    agentPrefix: match[1],
    outputType: match[2],
    topic: match[3],
    date: match[4],
    sequence: match[5],
    isSpecialFormat: false
  };
}

// 示例使用
const parsed = parseOutputFilename('cc_article_digitaltransformationguide_20260224_001.md');
console.log('解析结果:', parsed);
```

## 5. 开发注意事项

### 5.1 遵循的原则
- **模块化开发**：每个Agent应该独立开发，不要相互影响
- **协作分工**：数据库是统一的通信协作平台，所有的通信过程都应该通过数据库进行；文件系统负责存储产出物，要严格遵守约定的文件命名规则
- **语义通信**：整个系统基于严格而规范的语义通信机制，不要擅自修改
- **约定大于配置**：这个设计对文件系统有着苛刻的设计原则，不要修改文件系统的命名规则

### 5.2 前端项目目录结构

```
MC_visual_platform/
├── index.html                 # 主入口HTML（顶栏 + 侧边栏 + 页面容器）
├── vite.config.js             # Vite配置（端口3000, host 0.0.0.0）
├── package.json               # 依赖: vite, tailwindcss v4, echarts
├── src/
│   ├── main.js                # 应用初始化（主题、侧边栏、路由）
│   ├── router.js              # 自实现 Hash Router
│   ├── icons.js               # SVG图标函数库
│   ├── utils.js               # 工具函数（时间格式化、状态Badge、Toast等）
│   ├── data/
│   │   └── mock-data.js       # 模拟数据（后续替换为API调用）
│   ├── pages/
│   │   ├── dashboard.js       # 仪表盘
│   │   ├── agents.js          # 智能体管理
│   │   ├── tasks.js           # 任务管理（看板/列表视图）
│   │   ├── hotspots.js        # 热点监控
│   │   ├── articles.js        # 内容管理
│   │   ├── templates.js       # 模板管理（内联编辑）
│   │   ├── social.js          # 社媒管理
│   │   ├── messages.js        # 消息中心
│   │   ├── monitoring.js      # 系统监控
│   │   └── settings.js        # 系统设置
│   └── styles/
│       └── index.css          # 全局样式 + 暗色/亮色主题变量
├── backend/
│   ├── main.py                # FastAPI后端（所有API路由）
│   ├── requirements.txt       # Python依赖: fastapi, uvicorn
│   └── pyrightconfig.json     # IDE类型检查配置
├── database/
│   ├── mission_control.db     # 本地开发用SQLite数据库
│   ├── init_database.sql      # 建表脚本
│   ├── register_agents.sql    # Agent注册脚本
│   └── populate_sample_data.sql  # 示例数据填充
├── design/                    # 设计文档目录
└── .github/workflows/
    └── deploy.yml             # GitHub Actions自动部署
```

### 5.3 数据层说明

当前前端使用 `src/data/mock-data.js` 提供模拟数据（含 agents、tasks、hotspots、articles、social_posts、messages、system_logs、system_config、performance_data、templates），后续将替换为真实API调用。

**数据模块对应关系**：
| Mock数据 | 对应数据库表 | 后端API路由 |
|----------|-------------|-------------|
| `mockAgents` | `agents` | `GET /api/agents` |
| `mockTasks` | `tasks` | `GET /api/tasks` |
| `mockHotspots` | `hotspots` | `GET /api/hotspots` |
| `mockArticles` | `content` | `GET /api/articles` |
| `mockSocialPosts` | `social_posts` | `GET /api/social-posts` |
| `mockMessages` | `messages` | `GET /api/messages` |
| `mockSystemLogs` | `system_logs` | `GET /api/system-logs` |
| `mockSystemConfig` | `configurations` | `GET /api/system-config` |
| `mockPerformanceData` | `performance_metrics` | `GET /api/performance-data` |
| `mockTemplates` | `configurations` (category=template) | `GET /api/templates` |

### 5.4 前端路由机制

采用自实现的 Hash Router（`src/router.js`），基于 `hashchange` 事件实现页面切换，内置页面过渡动画（fade + translateY）。

**路由注册表**：
| Hash路径 | 页面文件 | 渲染函数 |
|----------|----------|----------|
| `#/dashboard` | `dashboard.js` | `renderDashboard()` |
| `#/agents` | `agents.js` | `renderAgents()` |
| `#/tasks` | `tasks.js` | `renderTasks()` |
| `#/hotspots` | `hotspots.js` | `renderHotspots()` |
| `#/articles` | `articles.js` | `renderArticles()` |
| `#/templates` | `templates.js` | `renderTemplates()` |
| `#/social` | `social.js` | `renderSocial()` |
| `#/messages` | `messages.js` | `renderMessages()` |
| `#/monitoring` | `monitoring.js` | `renderMonitoring()` |
| `#/settings` | `settings.js` | `renderSettings()` |

### 5.5 主题系统

支持暗色/亮色两套主题，通过 `data-theme` 属性切换。主题偏好存储在 `localStorage('mc-theme')`，默认暗色模式。




## 6. API接口设计

### 6.1 基础信息
- **后端框架**：Python FastAPI
- **API地址**：`http://localhost:8000`（开发环境）
- **启动命令**：`conda activate py312 && uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
- **数据格式**：JSON（FastAPI自动序列化）
- **跨域支持**：已配置 CORS 中间件（`allow_origins=["*"]`）
- **数据库连接**：通过环境变量 `DB_PATH` 配置，默认指向阿里云路径

**已实现的API路由**（`backend/main.py`）：
| 路由 | 方法 | 说明 | 状态 |
|------|------|------|------|
| `/` | GET | API健康检查 | ✅ 已实现 |
| `/api/agents` | GET | Agent列表（含任务统计聚合） | ✅ 已实现 |
| `/api/tasks` | GET | 任务列表 | ✅ 已实现 |
| `/api/hotspots` | GET | 热点列表（按评分排序） | ✅ 已实现 |
| `/api/articles` | GET | 文章列表（从content表查询） | ✅ 已实现 |
| `/api/social-posts` | GET | 社交媒体帖子列表 | ✅ 已实现 |
| `/api/messages` | GET | 消息列表 | ✅ 已实现 |
| `/api/system-logs` | GET | 系统日志（限200条） | ✅ 已实现 |
| `/api/system-config` | GET | 系统配置 | ✅ 已实现 |
| `/api/performance-data` | GET | 性能数据（当前Mock） | ✅ 已实现 |
| `/api/templates` | GET | 模板列表（从configurations查询） | ✅ 已实现 |

### 6.2 Agent相关接口

#### 6.2.1 获取Agent列表
```
GET /api/agents
```

**响应示例**：
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "agent_id": "mission_control",
      "agent_name": "任务管理器",
      "agent_type": "mission_control",
      "version": "1.0.0",
      "status": "active",
      "last_heartbeat": "2026-02-25T10:30:00Z",
      "config_json": "{}",
      "performance_score": 70,
      "created_at": "2026-02-25T00:00:00Z",
      "updated_at": "2026-02-25T10:30:00Z"
    }
  ],
  "total": 6
}
```

#### 6.2.2 获取单个Agent详情
```
GET /api/agents/:agentId
```

#### 6.2.3 更新Agent状态
```
PUT /api/agents/:agentId/status
```

**请求体**：
```json
{
  "status": "active"
}
```

#### 6.2.4 获取Agent性能历史
```
GET /api/agents/:agentId/performance-history
```

**查询参数**：
- `days`：查询天数（默认7天）

### 6.3 任务相关接口  

#### 6.3.1 获取任务列表
```
GET /api/tasks
```

**查询参数**：
- `status`：任务状态过滤
- `agent_id`：Agent ID过滤
- `priority`：优先级过滤
- `page`：页码（默认1）
- `limit`：每页数量（默认20）

#### 6.3.2 创建新任务
```
POST /api/tasks
```

**请求体**：
```json
{
  "title": "分析中小企业数字化趋势",
  "description": "深度分析中小企业数字化趋势，提供洞察报告",
  "agent_id": "data_analyst",
  "priority": 1,
  "deadline": "2026-02-28T23:59:59Z"
}
```

#### 6.3.3 获取任务详情
```
GET /api/tasks/:taskId
```

#### 6.3.4 更新任务进度
```
PUT /api/tasks/:taskId/progress
```

**请求体**：
```json
{
  "progress": 50
}
```

### 6.4 产出物相关接口

#### 6.4.1 获取产出物列表
```
GET /api/outputs
```

**查询参数**：
- `agent_id`：Agent ID过滤
- `output_type`：产出类型过滤
- `date_from`：开始日期
- `date_to`：结束日期
- `page`：页码
- `limit`：每页数量

#### 6.4.2 获取产出物详情
```
GET /api/outputs/:outputId
```

**响应示例**：
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "result_id": "result_20260224_143000_001",
    "task_id": "task_20260224_100000_001",
    "agent_id": "data_analyst",
    "output_type": "analysis",
    "title": "中小企业数字化趋势数据分析报告",
    "content_summary": "本报告分析了中小企业数字化趋势...",
    "file_path": "outputs/data_analyst/analysis/da_analysis_smedigitaltrendanalysis_20260224_001.md",
    "quality_score": 85,
    "metadata_json": "{\"word_count\": 1500, \"read_time\": \"5分钟\"}",
    "created_at": "2026-02-24T14:30:00Z"
  }
}
```

#### 6.4.3 获取产出物文件内容
```
GET /api/outputs/:outputId/content
```

**响应**：返回Markdown文件内容

### 6.5 系统监控接口

#### 6.5.1 获取系统状态概览
```
GET /api/system/overview
```

**响应示例**：
```json
{
  "code": 200,
  "data": {
    "agents": {
      "total": 6,
      "active": 5,
      "standby": 1,
      "error": 0
    },
    "tasks": {
      "total": 24,
      "pending": 3,
      "in_progress": 2,
      "completed": 18,
      "failed": 1
    },
    "outputs": {
      "total": 18,
      "today": 2,
      "avg_quality": 78.5
    },
    "performance": {
      "avg_score": 75.3,
      "trend": "up"
    }
  }
}
```

#### 6.5.2 获取系统日志
```
GET /api/system/logs
```

**查询参数**：
- `level`：日志级别（info, warning, error）
- `date_from`：开始日期
- `date_to`：结束日期
- `page`：页码
- `limit`：每页数量

### 6.6 实时数据接口

#### 6.6.1 WebSocket连接
```
ws://localhost:3000/ws
```

**消息类型**：
```json
{
  "type": "agent_update",
  "payload": {
    "agent_id": "mission_control",
    "status": "active",
    "last_heartbeat": "2026-02-25T11:00:00Z"
  }
}
```

```json
{
  "type": "task_update",
  "payload": {
    "task_id": "task_20260225_110000_001",
    "status": "completed",
    "progress": 100
  }
}
```

```json
{
  "type": "output_created",
  "payload": {
    "result_id": "result_20260225_110500_001",
    "agent_id": "content_creator",
    "title": "数字化转型指南"
  }
}
```

## 7. 已实现的前端页面

### 7.1 仪表盘（`#/dashboard`）
- **文件**：`src/pages/dashboard.js`
- **功能**：系统状态概览，包含统计卡片（Agent数、任务数、热点数、消息数）、Agent状态网格、最新任务列表、实时活动日志
- **数据源**：`mockAgents`, `mockTasks`, `mockHotspots`, `mockMessages`, `mockSystemLogs`

### 7.2 智能体管理（`#/agents`）
- **文件**：`src/pages/agents.js`
- **功能**：6个Agent的状态卡片展示，显示Agent名称、状态、最后心跳时间、任务统计
- **数据源**：`mockAgents`

### 7.3 任务管理（`#/tasks`）
- **文件**：`src/pages/tasks.js`
- **功能**：支持看板视图（按状态分列）和列表视图切换，包含任务创建表单（标题、描述、任务类型、优先级、截止时间），任务全部提交至 Mission Control 进行自主规划和分配
- **数据源**：`mockTasks`, `mockAgents`
- **任务类型**：热点侦察、内容创作、社媒推广、数据分析、技术维护

### 7.4 热点监控（`#/hotspots`）
- **文件**：`src/pages/hotspots.js`
- **功能**：热点卡片列表，展示多维评分（相关性、新颖性、实用性、受众兴趣、总分）、来源信息、状态
- **数据源**：`mockHotspots`

### 7.5 内容管理（`#/articles`）
- **文件**：`src/pages/articles.js`
- **功能**：文章列表与预览，支持Markdown渲染预览、复制到剪贴板，展示质量评分（可读性、互动性、SEO、原创性）
- **数据源**：`mockArticles`

### 7.6 模板管理（`#/templates`）
- **文件**：`src/pages/templates.js`
- **功能**：AI提示词模板的内联编辑管理，支持模板变量（`{{topic}}` 等）、平台分类、使用次数统计、启用/禁用切换
- **数据源**：`mockTemplates`

### 7.7 社媒管理（`#/social`）
- **文件**：`src/pages/social.js`
- **功能**：社交媒体帖子管理，展示各平台（微信公众号、知乎、头条号）发布状态、互动数据（阅读、点赞、分享、评论）
- **数据源**：`mockSocialPosts`

### 7.8 消息中心（`#/messages`）
- **文件**：`src/pages/messages.js`
- **功能**：Agent间通信记录展示，包含消息类型（任务分配、任务完成、热点报告、分析报告）、发送/接收方、消息载荷详情
- **数据源**：`mockMessages`

### 7.9 系统监控（`#/monitoring`）
- **文件**：`src/pages/monitoring.js`
- **功能**：系统日志实时查看（info/warning/error分级展示）、性能趋势图（ECharts折线图：任务完成量、热点数、文章数、平均响应时间）
- **数据源**：`mockSystemLogs`, `mockPerformanceData`

### 7.10 系统设置（`#/settings`）
- **文件**：`src/pages/settings.js`
- **功能**：系统配置键值对管理，展示配置项（系统名称、版本、运行模式、并发任务数等），支持配置值编辑
- **数据源**：`mockSystemConfig`
