# Mission Control 数据库设计规范

## 1. 设计原则

### 1.1 核心原则
1. **13个核心表**：严格保持13个表，不随意增加
2. **约定大于配置**：统一字段命名和类型规范
3. **松耦合设计**：表间关系清晰，避免过度耦合
4. **可扩展性**：通过扩展字段而非新增表来适应变化

### 1.2 重要约定
- ❌ **不增加`articles`表**：使用`content`表存储文章内容
- ✅ **路径记录在记忆文件**：文件路径不存储在数据库，在Agent记忆文件中
- ✅ **标准字段**：每个表都有`created_at`和`updated_at`
- ✅ **唯一标识**：使用`[table_name]_id`格式的唯一ID

## 2. 13个核心表结构

### 2.1 agents表 - 智能体状态管理
```sql
CREATE TABLE agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT UNIQUE NOT NULL,          -- 智能体ID: mission_control, content_creator等
    agent_name TEXT NOT NULL,               -- 智能体名称（中文）
    agent_type TEXT NOT NULL,               -- 智能体类型: task_manager, content_creator等
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

### 2.2 tasks表 - 任务定义和状态
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

**索引**：
```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_agent_id ON tasks(agent_id);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
```

### 2.3 messages表 - 代理间通信记录
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

**索引**：
```sql
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_sender ON messages(sender);
CREATE INDEX idx_messages_receiver ON messages(receiver);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

### 2.4 results表 - 任务结果存储
```sql
CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id TEXT UNIQUE NOT NULL,         -- 结果ID: result_YYYYMMDD_HHMMSS_xxx
    task_id TEXT NOT NULL,                  -- 关联的任务ID
    agent_id TEXT NOT NULL,                 -- 创建者ID
    result_type TEXT NOT NULL,              -- 结果类型: content, analysis, technical, social, hotspot
    title TEXT NOT NULL,                    -- 结果标题
    summary TEXT,                           -- 结果摘要
    content TEXT,                           -- 结果内容（完整内容或摘要）
    quality_score INTEGER,                  -- 质量评分 0-100
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_results_task_id ON results(task_id);
CREATE INDEX idx_results_agent_id ON results(agent_id);
CREATE INDEX idx_results_type ON results(result_type);
CREATE INDEX idx_results_created ON results(created_at);
```

### 2.5 system_logs表 - 系统运行日志
```sql
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_level TEXT NOT NULL,                -- 日志级别: debug, info, warning, error, critical
    component TEXT NOT NULL,                -- 组件名称
    agent_id TEXT,                          -- 相关Agent ID
    message TEXT NOT NULL,                  -- 日志消息
    context_json TEXT,                      -- 上下文信息（JSON格式）
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_logs_level ON system_logs(log_level);
CREATE INDEX idx_logs_component ON system_logs(component);
CREATE INDEX idx_logs_agent_id ON system_logs(agent_id);
CREATE INDEX idx_logs_timestamp ON system_logs(timestamp);
```

### 2.6 hotspots表 - 热点情报数据
```sql
CREATE TABLE hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotspot_id TEXT UNIQUE NOT NULL,        -- 热点ID: hs_YYYYMMDD_HHMMSS_xxx
    title TEXT NOT NULL,                    -- 热点标题
    description TEXT,                       -- 热点描述
    category TEXT,                          -- 热点分类
    source TEXT,                            -- 来源
    confidence_score REAL,                  -- 置信度评分 0-1
    relevance_score INTEGER,                -- 相关度评分 0-100
    tags_json TEXT,                         -- 标签（JSON数组）
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_hotspots_category ON hotspots(category);
CREATE INDEX idx_hotspots_confidence ON hotspots(confidence_score);
CREATE INDEX idx_hotspots_created ON hotspots(created_at);
```

### 2.7 content表 - 内容创作成果
```sql
CREATE TABLE content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id TEXT UNIQUE NOT NULL,        -- 内容ID: content_YYYYMMDD_HHMMSS_xxx
    title TEXT NOT NULL,                    -- 内容标题
    content_type TEXT NOT NULL,             -- 内容类型: article, report, plan, framework
    author TEXT NOT NULL,                   -- 创作者ID
    summary TEXT,                           -- 内容摘要
    content TEXT,                           -- 内容正文（完整或摘要）
    word_count INTEGER,                     -- 字数统计
    quality_score INTEGER,                  -- 质量评分 0-100
    status TEXT DEFAULT 'draft',            -- 状态: draft, review, published, archived
    tags_json TEXT,                         -- 标签（JSON数组）
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME                   -- 发布时间
);
```

**索引**：
```sql
CREATE INDEX idx_content_type ON content(content_type);
CREATE INDEX idx_content_author ON content(author);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_created ON content(created_at);
```

### 2.8 analytics表 - 数据分析报告
```sql
CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analytics_id TEXT UNIQUE NOT NULL,      -- 分析ID: analytics_YYYYMMDD_HHMMSS_xxx
    report_type TEXT NOT NULL,              -- 报告类型: performance, trend, forecast, insight
    data_source TEXT,                       -- 数据来源
    analysis_result TEXT NOT NULL,          -- 分析结果
    insights TEXT,                          -- 洞察总结
    metrics_json TEXT,                      -- 指标数据（JSON格式）
    recommendations TEXT,                   -- 建议
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_analytics_type ON analytics(report_type);
CREATE INDEX idx_analytics_created ON analytics(created_at);
```

### 2.9 social_posts表 - 社交媒体内容
```sql
CREATE TABLE social_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT UNIQUE NOT NULL,           -- 帖子ID: post_YYYYMMDD_HHMMSS_xxx
    platform TEXT NOT NULL,                 -- 平台: wechat, weibo, douyin, xiaohongshu
    content TEXT NOT NULL,                  -- 内容
    author TEXT NOT NULL,                   -- 作者ID
    schedule_time DATETIME,                 -- 计划发布时间
    status TEXT DEFAULT 'planned',          -- 状态: planned, scheduled, published, archived
    performance_metrics_json TEXT,          -- 性能指标（JSON格式）
    engagement_score INTEGER,               -- 互动评分 0-100
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME                   -- 实际发布时间
);
```

**索引**：
```sql
CREATE INDEX idx_posts_platform ON social_posts(platform);
CREATE INDEX idx_posts_status ON social_posts(status);
CREATE INDEX idx_posts_schedule ON social_posts(schedule_time);
```

### 2.10 configurations表 - 系统配置
```sql
CREATE TABLE configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT UNIQUE NOT NULL,        -- 配置键
    config_value TEXT NOT NULL,             -- 配置值
    config_type TEXT DEFAULT 'string',      -- 配置类型: string, number, boolean, json, array
    category TEXT DEFAULT 'general',        -- 分类: system, agent, output, security
    description TEXT,                       -- 描述
    is_encrypted BOOLEAN DEFAULT FALSE,     -- 是否加密
    updated_by TEXT,                        -- 最后更新者
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_configs_key ON configurations(config_key);
CREATE INDEX idx_configs_category ON configurations(category);
```

### 2.11 notifications表 - 通知管理
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id TEXT UNIQUE NOT NULL,   -- 通知ID: notify_YYYYMMDD_HHMMSS_xxx
    notification_type TEXT NOT NULL,        -- 通知类型: task_assigned, task_completed, system_alert, agent_error
    recipient TEXT NOT NULL,                -- 接收者
    subject TEXT NOT NULL,                  -- 主题
    message TEXT NOT NULL,                  -- 消息内容
    status TEXT DEFAULT 'unread',           -- 状态: unread, read, archived
    priority INTEGER DEFAULT 2,             -- 优先级: 0=紧急, 1=高, 2=中, 3=低
    metadata_json TEXT,                     -- 元数据（JSON格式）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME                        -- 阅读时间
);
```

**索引**：
```sql
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_recipient ON notifications(recipient);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

### 2.12 workflows表 - 工作流定义
```sql
CREATE TABLE workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT UNIQUE NOT NULL,       -- 工作流ID: workflow_YYYYMMDD_HHMMSS_xxx
    workflow_name TEXT NOT NULL,            -- 工作流名称
    description TEXT,                       -- 描述
    steps_json TEXT NOT NULL,               -- 步骤定义（JSON数组）
    triggers_json TEXT,                     -- 触发器定义（JSON数组）
    status TEXT DEFAULT 'active',           -- 状态: active, inactive, deprecated
    version TEXT DEFAULT '1.0.0',           -- 版本号
    created_by TEXT,                        -- 创建者
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**索引**：
```sql
CREATE INDEX idx_workflows_name ON workflows(workflow_name);
CREATE INDEX idx_workflows_status ON workflows(status);
```

### 2.13 performance_metrics表 - 性能指标
```sql
CREATE TABLE performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_id TEXT UNIQUE NOT NULL,         -- 指标ID: metric_YYYYMMDD_HHMMSS_xxx
    agent_id TEXT NOT NULL,                 -- Agent ID
    metric_type TEXT NOT NULL,              -- 指标类型: efficiency, accuracy, speed, quality, reliability
    metric_name TEXT NOT NULL,              -- 指标名称
    metric_value REAL NOT NULL,             -- 指标值
    unit TEXT,                              -- 单位
    target_value REAL,                      -- 目标值
    measured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    period TEXT DEFAULT 'instant'           -- 统计周期: instant, hourly, daily, weekly, monthly
);
```

**索引**：
```sql
CREATE INDEX idx_metrics_agent ON performance_metrics(agent_id);
CREATE INDEX idx_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_metrics_measured ON performance_metrics(measured_at);
```

## 3. 表关系设计

### 3.1 核心关系图
```
agents ─┬─ tasks ─── results
        ├─ messages
        ├─ system_logs
        ├─ content
        ├─ social_posts
        └─ performance_metrics

hotspots ──┬─ (独立热点数据)
           └─ 可能关联到content或tasks

configurations ── (系统配置，独立表)
notifications ── (通知，独立表)
workflows ── (工作流，独立表)
analytics ── (分析报告，独立表)
```

### 3.2 外键关系
```sql
-- tasks表外键（可选，SQLite支持有限）
-- ALTER TABLE tasks ADD FOREIGN KEY (agent_id) REFERENCES agents(agent_id);

-- results表外键
-- ALTER TABLE results ADD FOREIGN KEY (task_id) REFERENCES tasks(task_id);
-- ALTER TABLE results ADD FOREIGN KEY (agent_id) REFERENCES agents(agent_id);

-- content表外键
-- ALTER TABLE content ADD FOREIGN KEY (author) REFERENCES agents(agent_id);

-- social_posts表外键
-- ALTER TABLE social_posts ADD FOREIGN KEY (author) REFERENCES agents(agent_id);
```

## 4. 数据完整性约束

### 4.1 业务逻辑约束
1. **任务状态流转**：必须按顺序流转，不能跳跃
2. **Agent状态**：active状态的Agent必须有最近心跳
3. **内容状态**：published的内容必须有published_at时间
4. **热点置信度**：confidence_score必须在0-1之间

### 4.2 数据验证规则
```javascript
// 示例验证规则
const validationRules = {
  tasks: {
    status: ['pending', 'assigned', 'in_progress', 'completed', 'failed'],
    priority: { min: 0, max: 3 }
  },
  agents: {
    status: ['active', 'standby', 'inactive', 'error'],
    performance_score: { min: 0, max: 100 }
  },
  hotspots: {
    confidence_score: { min: 0, max: 1 },
    relevance_score: { min: 0, max: 100 }
  }
};
```

## 5. 数据库初始化脚本

### 5.1 完整初始化脚本
```sql
-- init_database.sql
-- Mission Control 数据库初始化脚本
-- 版本: 1.0.0
-- 创建时间: 2026-02-24

BEGIN TRANSACTION;

-- 创建agents表
CREATE TABLE agents (...);

-- 创建tasks表
CREATE TABLE tasks (...);

-- 创建messages表
CREATE TABLE messages (...);

-- 创建results表
CREATE TABLE results (...);

-- 创建system_logs表
CREATE TABLE system_logs (...);

-- 创建hotspots表
CREATE TABLE hotspots (...);

-- 创建content表
CREATE TABLE content (...);

-- 创建analytics表
CREATE TABLE analytics (...);

-- 创建social_posts表
CREATE TABLE social_posts (...);

-- 创建configurations表
CREATE TABLE configurations (...);

-- 创建notifications表
CREATE TABLE notifications (...);

-- 创建workflows表
CREATE TABLE workflows (...);

-- 创建performance_metrics表
CREATE TABLE performance_metrics (...);

-- 创建索引
CREATE INDEX idx_agents_status ON agents(status);
-- ... 其他索引

-- 插入默认配置
INSERT INTO configurations (config_key, config_value, description) VALUES
  ('system.name', 'Mission Control', '系统名称'),
  ('system.version', '1.0.0', '系统版本'),
  ('output.base_path', '/home/admin/.openclaw/workspace/projects/mission_control/outputs', '产出物基础路径'),
  ('agent.heartbeat_interval', '300', 'Agent心跳间隔（秒）');

COMMIT;
```

## 6. 数据库维护

### 6.1 定期维护任务
1. **数据清理**：删除过期的日志和临时数据
2. **索引重建**：定期重建索引优化性能
3. **备份恢复**：自动备份和恢复测试
4. **完整性检查**：验证数据一致性

### 6.2 维护脚本示例
```bash
#!/bin/bash
# database_maintenance.sh

# 1. 备份数据库
sqlite3 mission_control.db ".backup mission_control_backup_$(date +%Y%m%d).db"

# 2. 清理旧日志（保留30天）
sqlite3 mission_control.db "DELETE FROM system_logs WHERE timestamp < datetime('now', '-30 days');"

# 3. 清理旧通知（已读且超过7天）
sqlite3 mission_control.db "DELETE FROM notifications WHERE status = 'read' AND created_at < datetime('now', '-7 days');"

# 4. 更新统计信息
sqlite3 mission_control.db "ANALYZE;"

echo "数据库维护完成"
```

## 7. 迁移策略

### 7.1 版本迁移
1. **版本控制**：每个表添加version字段
2. **向后兼容**：新字段可空，旧代码继续工作
3. **数据迁移**：编写迁移脚本，逐步升级

### 7.2 迁移脚本模板
```javascript
// migrate_v1_to_v2.js
const db = require('./database_utils');

async function migrate() {
  console.log('开始数据库迁移 v1 -> v2');
  
  // 1. 备份当前数据库
  await db.backup('before_migration_v2');
  
  // 2. 添加新字段
  await db.addColumn('agents', 'config_json', 'TEXT');
  await db.addColumn('tasks', 'metadata_json', 'TEXT');
  
  // 3. 迁移数据
  await migrateAgentConfigs();
  await migrateTaskMetadata();
  
  // 4. 更新版本号
  await db.updateConfig('database.version', '2.0.0');
  
  console.log('数据库迁移完成');
}
```

## 8. 性能优化

### 8.1 查询优化
1. **使用索引**：为常用查询字段创建索引
2. **避免全表扫描**：使用WHERE条件限制查询范围
3. **分页查询**：大数据集使用LIMIT和OFFSET
4. **预编译语句**：重复查询使用预编译语句

### 8.2 连接优化
1. **连接池**：使用数据库连接池
2. **事务优化**：合理使用事务，避免长时间锁定
3. **批量操作**：批量插入和更新减少连接次数

## 9. 监控和诊断

### 9.1 监控指标
1. **表大小**：各表数据量和增长趋势
2. **查询性能**：慢查询统计和优化
3. **连接状态**：活跃连接数和等待连接
4. **锁状态**：锁竞争和死锁检测

### 9.2 诊断工具
```sql
-- 查看表大小
SELECT name, COUNT(*) as row_count 
FROM sqlite_master 
WHERE type='table' 
GROUP BY name 
ORDER BY row_count DESC;

-- 查看索引使用情况
SELECT * FROM sqlite_stat1;

-- 查看最近查询
SELECT * FROM sqlite_history ORDER BY timestamp DESC LIMIT 10;
```

---

## 附录

### A. 字段命名规范
- **ID字段**：`[table_name]_id` (如 `task_id`, `agent_id`)
- **时间字段**：`[action]_at` (如 `created_at`, `updated_at`)
- **状态字段**：`status` (使用预定义状态值)
- **JSON字段**：`[name]_json` (如 `metadata_json`, `config_json`)

### B. 数据类型选择
- **文本**：TEXT (可变长度)
- **数字**：INTEGER (整数), REAL (浮点数)
- **布尔**：BOOLEAN (SQLite中存储为0/1)
- **时间**：DATETIME (ISO8601格式)
- **JSON**：TEXT (存储JSON字符串)

### C. 默认值规范
- **时间字段**：`DEFAULT CURRENT_TIMESTAMP`
- **状态字段**：`DEFAULT 'pending'/'standby'等`
- **版本字段**：`DEFAULT '1.0.0'`
- **评分字段**：`DEFAULT 0` 或 `DEFAULT 70`

### D. 重要提醒
1. **不存储文件路径**：文件路径存储在Agent记忆文件中
2. **保持13个表**：不随意增加新表，通过扩展字段适应需求
3. **JSON字段使用**：灵活数据使用JSON字段，避免频繁表结构变更
4. **索引策略**：为查询条件字段创建索引，但避免过度索引

---

**文档版本**: 1.0.0  
**创建时间**: 2026-02-24 00:20  
**最后更新**: 2026-02-24 00:20  
**负责人**: 极目 (Gemma)  
**状态**: ✅ 已完成