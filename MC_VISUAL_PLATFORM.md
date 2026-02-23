这是个很好的想法！用专业开发工具开发可视化平台会更高效。我把所有关键配置信息和设计信息整理给你。

## 📋 Mission Control可视化平台开发包

### 🔗 **数据库连接信息**

```
数据库类型: SQLite
数据库路径: /home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db
公网IP: 118.31.127.116
端口: 5000 (Flask API) / 22 (SSH)
访问方式: 通过API或SSH隧道连接数据库
```

### 🗄️ **数据库结构（13个核心表）**

#### 1. **agents表** - 智能体状态管理
```sql
CREATE TABLE agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT UNIQUE NOT NULL,        -- 智能体ID: mission_control, content_creator等
    agent_name TEXT NOT NULL,             -- 智能体名称
    agent_type TEXT NOT NULL,             -- 智能体类型: task_manager, content_creator等
    version TEXT DEFAULT '1.0',
    status TEXT DEFAULT 'standby',        -- active, standby, inactive
    last_heartbeat DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **tasks表** - 任务定义和状态
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    agent_id TEXT,                        -- 分配的智能体ID
    status TEXT DEFAULT 'pending',        -- pending, assigned, in_progress, completed, failed
    priority INTEGER DEFAULT 2,           -- 0:紧急, 1:高, 2:中, 3:低
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME,
    result_file_path TEXT                 -- 结果文件路径
);
```

#### 3. **messages表** - 代理间通信记录
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_type TEXT NOT NULL,           -- task_assignment, task_update, result_submission等
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT                         -- JSON格式的元数据
);
```

#### 4. **results表** - 任务结果存储
```sql
CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    result_type TEXT NOT NULL,            -- content, analysis, technical, social, hotspot
    content TEXT NOT NULL,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **system_logs表** - 系统运行日志
```sql
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_level TEXT NOT NULL,              -- info, warning, error, critical
    component TEXT NOT NULL,              -- 组件名称
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. **hotspots表** - 热点情报数据
```sql
CREATE TABLE hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,                        -- 热点分类
    source TEXT,
    confidence_score REAL,                -- 置信度评分 0-1
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. **content表** - 内容创作成果
```sql
CREATE TABLE content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,           -- article, report, plan, framework
    content TEXT NOT NULL,
    author TEXT,                          -- 创作者ID
    status TEXT DEFAULT 'draft',          -- draft, review, published, archived
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. **analytics表** - 数据分析报告
```sql
CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_type TEXT NOT NULL,            -- performance, trend, forecast
    data_source TEXT,
    analysis_result TEXT NOT NULL,
    insights TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. **social_posts表** - 社交媒体内容
```sql
CREATE TABLE social_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,               -- 平台: wechat, weibo, douyin等
    content TEXT NOT NULL,
    schedule_time DATETIME,
    status TEXT DEFAULT 'planned',        -- planned, published, archived
    performance_metrics TEXT,             -- JSON格式的性能指标
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. **configurations表** - 系统配置
```sql
CREATE TABLE configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 11. **notifications表** - 通知管理
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_type TEXT NOT NULL,      -- task_assigned, task_completed, system_alert
    recipient TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',         -- unread, read, archived
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 12. **workflows表** - 工作流定义
```sql
CREATE TABLE workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_name TEXT NOT NULL,
    steps TEXT NOT NULL,                  -- JSON格式的工作流步骤
    status TEXT DEFAULT 'active',         -- active, inactive, deprecated
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 13. **performance_metrics表** - 性能指标
```sql
CREATE TABLE performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    metric_type TEXT NOT NULL,            -- efficiency, accuracy, speed, quality
    metric_value REAL NOT NULL,
    measured_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 🌐 **API接口规范**

#### 基础信息
```
API地址: http://118.31.127.116:5000/api/
响应格式: JSON
认证: 目前无需认证（生产环境需添加）
```

#### 核心API端点

##### 1. **系统状态API**
```
GET /api/system/status
响应: {
  "status": "success",
  "agents": [
    {
      "agent_id": "mission_control",
      "agent_name": "任务管理器",
      "status": "active",
      "last_heartbeat": "2026-02-22T00:15:00",
      "performance_score": 85
    }
  ],
  "tasks": {
    "total": 8,
    "completed": 1,
    "in_progress": 1,
    "assigned": 1,
    "pending": 5,
    "completion_rate": 13
  }
}
```

##### 2. **智能体工作统计API**
```
GET /api/agents/work_stats
响应: {
  "status": "success",
  "work_stats": {
    "mission_control": {
      "total_tasks": 3,
      "completed": 0,
      "in_progress": 1,
      "assigned": 1,
      "pending": 1,
      "efficiency": 0
    }
  }
}
```

##### 3. **文档列表API**
```
GET /api/documents/list?page=1&page_size=20
参数:
  - page: 页码
  - page_size: 每页数量
  - category: 分类筛选
  - search: 搜索关键词
响应: {
  "status": "success",
  "documents": [...],
  "total_count": 96,
  "page": 1,
  "page_size": 20,
  "total_pages": 5,
  "category_stats": {...}
}
```

##### 4. **文档查看API**
```
GET /api/documents/view?path=README.md
响应: {
  "status": "success",
  "content": "# Mission Control Output Directory...",
  "type": "markdown",
  "filename": "README.md",
  "path": "README.md",
  "size": 4403
}
```

##### 5. **文档下载API**
```
GET /api/documents/download?path=README.md
响应: 文件下载
```

##### 6. **模板列表API**
```
GET /api/templates/list
响应: {
  "status": "success",
  "templates": [
    {
      "name": "article_template.html",
      "size": 2048,
      "created_at": "2026-02-19T09:24:26",
      "type": "html_template"
    }
  ]
}
```

##### 7. **分类统计API**
```
GET /api/documents/category_stats
响应: {
  "status": "success",
  "category_stats": {
    "业务报告": 11,
    "内容创作": 19,
    "学习资料": 4,
    "技术文档": 9,
    "数据分析": 12,
    "未分类": 2,
    "计划任务": 35,
    "通信记录": 4
  },
  "total_documents": 96,
  "classified_count": 94,
  "pattern_coverage": "97%"
}
```

##### 8. **健康检查API**
```
GET /health
响应: {
  "status": "healthy",
  "timestamp": "2026-02-22T00:24:00",
  "service": "MC可视化管理系统"
}
```

### 🎨 **前端设计规范**

#### 1. **页面结构**
```
首页 (/) - 系统概览
├── 智能体状态监控
├── 最近文档查看
├── 任务统计面板
└── 系统健康度

监控面板 (/dashboard) - 详细监控
├── 智能体详细状态
├── 任务分配视图
├── 性能指标图表
└── 系统日志查看

文档库 (/documents) - 文档管理
├── 文档分类浏览
├── 文档搜索
├── 文档预览
└── 文档下载

模板系统 (/templates) - 模板管理
├── 模板列表
├── 模板预览
└── 模板使用
```

#### 2. **智能体状态显示规范**
- **活跃 (active)**: 绿色，显示"运行中"
- **待命 (standby)**: 蓝色，显示"待命"
- **离线 (inactive)**: 灰色，显示"离线"

#### 3. **智能体中文名称映射**
```javascript
const agentChineseNames = {
  'mission_control': '任务管理器',
  'content_creator': '内容创作者',
  'tech_specialist': '技术专家',
  'data_analyst': '数据分析师',
  'social_manager': '社交媒体经理',
  'hotspot_scout': '热点侦察兵'
};
```

#### 4. **智能体角色描述**
```javascript
const agentRoleDescriptions = {
  'mission_control': '系统大脑，负责任务分配和协调',
  'content_creator': '文章创作和内容编辑专家',
  'tech_specialist': '技术开发和系统优化专家',
  'data_analyst': '数据分析和趋势预测专家',
  'social_manager': '社交媒体运营和推广专家',
  'hotspot_scout': '热点发现和情报收集专家'
};
```

#### 5. **智能体工作指标**
```javascript
// 不同智能体显示不同的工作指标
const agentWorkMetrics = {
  'mission_control': {
    label: '协调任务',
    resultLabel: '协调效率'
  },
  'content_creator': {
    label: '创作任务',
    resultLabel: '文章产出'
  },
  'tech_specialist': {
    label: '技术任务',
    resultLabel: '问题解决'
  },
  'data_analyst': {
    label: '分析任务',
    resultLabel: '报告生成'
  },
  'social_manager': {
    label: '推广任务',
    resultLabel: '社交互动'
  },
  'hotspot_scout': {
    label: '侦察任务',
    resultLabel: '热点发现'
  }
};
```

#### 6. **文档分类映射**
```javascript
const categoryMap = {
  '业务报告': '业务报告',
  '内容创作': '内容创作',
  '学习资料': '学习资料',
  '技术文档': '技术文档',
  '数据分析': '数据分析',
  '未分类': '未分类',
  '计划任务': '计划任务',
  '通信记录': '通信记录'
};

const categoryClassMap = {
  '业务报告': 'category-business',
  '内容创作': 'category-content',
  '学习资料': 'category-learning',
  '技术文档': 'category-tech',
  '数据分析': 'category-analysis',
  '未分类': 'category-other',
  '计划任务': 'category-planning',
  '通信记录': 'category-communication'
};
```

#### 7. **性能评分计算逻辑**
```javascript
// 性能评分算法
function calculatePerformanceScore(agent) {
  let score = 70; // 基础分
  
  // 状态加分
  if (agent.status === 'active') score += 20;
  else if (agent.status === 'standby') score += 10;
  
  // 活跃时间减分（超过30分钟未活跃开始减分）
  if (agent.minutes_inactive > 30) {
    score -= Math.min(30, Math.floor((agent.minutes_inactive - 30) / 10));
  }
  
  // 智能体特定调整
  const agentBonuses = {
    'mission_control': 5,
    'content_creator': 8,
    'social_manager': 7
  };
  
  if (agentBonuses[agent.agent_id]) {
    score += agentBonuses[agent.agent_id];
  }
  
  // 确保评分在合理范围内
  return Math.max(0, Math.min(100, score));
}
```

### 📁 **文件目录结构**

```
/home/admin/mc-web/
├── app.py                    # Flask主应用
├── requirements.txt          # Python依赖
├── static/                   # 静态文件
│   ├── css/
│   │   └── style.css        # 主样式文件
│   ├── js/
│   │   └── main.js          # 主JavaScript文件
│   └── images/              # 图片资源
├── templates/               # 模板文件
│   ├── base.html           # 基础模板
│   ├── index.html          # 首页
│   ├── dashboard.html      # 监控面板
│   ├── documents_table_fixed.html  # 文档库
│   ├── documents_markdown.html     # Markdown文档
│   └── patterns/           # 模板模式目录
└── config.py               # 配置文件
```

### 🔧 **当前实现的功能**

#### 已完成功能
1. ✅ **系统状态监控** - 实时显示智能体状态和任务统计
2. ✅ **最近文档查看** - 完整的文档预览和下载功能
3. ✅ **分类文档库** - 文档分类浏览和搜索
4. ✅ **模板系统** - 文档模板管理
5. ✅ **API接口** - 完整的RESTful API
6. ✅ **响应式设计** - 适配不同屏幕尺寸

#### 技术特性
- **前端**: Vue.js + Bootstrap 5
- **后端**: Flask + SQLite
- **API**: RESTful设计，JSON响应
- **数据库**: 13个标准化表结构
- **部署**: 运行在5000端口

### 🚀 **开发建议**

#### 1. **数据库连接方式**
开发阶段通过方式三进行开发
- **方式一**: 通过API连接（推荐）
- **方式二**: SSH隧道连接数据库文件
- **方式三**: 导出数据库副本进行开发，数据库已经下载在本地 database目录，可以用于开发测试

#### 2. **开发环境搭建**
```bash
# Python环境
本地miniforge 搭建的 py312环境可用

# 前端依赖
npm install vue bootstrap axios
```

#### 3. **联调测试步骤**
1. 先通过API测试连接
2. 验证数据库结构
3. 开发前端界面
4. 集成API调用
5. 功能测试验证
6. 部署到服务器

#### 4. **注意事项**
- 数据库文件路径固定，不要修改
- API响应格式保持统一
- 智能体状态显示逻辑保持一致
- 文档分类映射关系不要更改

### 📊 **当前数据状态**

#### 智能体数据（6个）
```json
[
  {"agent_id": "mission_control", "status": "active"},
  {"agent_id": "content_creator", "status": "standby"},
  {"agent_id": "tech_specialist", "status": "standby"},
  {"agent_id": "data_analyst", "status": "standby"},
  {"agent_id": "social_manager", "status": "standby"},
  {"agent_id": "hotspot_scout", "status": "standby"}
]
```

#### 任务数据（8个）
- 总任务数: 8
- 已完成: 1 (13%)
- 进行中: 1
- 已分配: 1
- 待处理: 5

#### 文档数据（96个）
- 已分类: 94个 (97%)
- 未分类: 2个
- 分类分布: 计划任务35个、内容创作19个等

###
...(truncated)...