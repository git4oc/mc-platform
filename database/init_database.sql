-- Mission Control 系统数据库初始化脚本
-- 版本: 1.0.0
-- 创建时间: 2026-02-21
-- 描述: 集中式任务调度系统的核心数据库结构

-- 启用外键约束
PRAGMA foreign_keys = ON;

-- ==================== 系统配置表 ====================
CREATE TABLE IF NOT EXISTS system_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  config_type TEXT DEFAULT 'string',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 智能体注册表 ====================
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT UNIQUE NOT NULL,
  agent_name TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  status TEXT DEFAULT 'inactive',
  last_heartbeat DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 消息表 (集中式通信) ====================
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT UNIQUE NOT NULL,
  protocol_version TEXT DEFAULT '1.0.0',
  timestamp DATETIME NOT NULL,
  
  -- 发送方信息
  sender_agent_id TEXT NOT NULL,
  sender_agent_name TEXT NOT NULL,
  
  -- 接收方信息 (始终是mission_control，除了mission_control发给用户的)
  receiver_agent_id TEXT NOT NULL,
  receiver_agent_name TEXT NOT NULL,
  
  -- 消息内容
  message_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  payload_json TEXT NOT NULL,
  
  -- 元数据
  metadata_json TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  processed_at DATETIME,
  response_json TEXT,
  
  -- 索引和约束
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (receiver_agent_id IN ('mission_control', 'user') OR sender_agent_id = 'mission_control')
);

-- ==================== 任务表 ====================
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- 分配信息
  assigned_to TEXT NOT NULL,
  assigned_by TEXT DEFAULT 'mission_control',
  
  -- 任务状态
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  
  -- 时间信息
  deadline DATETIME,
  estimated_duration INTEGER, -- 单位: 秒
  actual_duration INTEGER,    -- 单位: 秒
  
  -- 任务要求
  requirements_json TEXT,
  result_json TEXT,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  
  -- 外键约束
  FOREIGN KEY (assigned_to) REFERENCES agents(agent_id),
  FOREIGN KEY (assigned_by) REFERENCES agents(agent_id)
);

-- ==================== 热点数据表 ====================
CREATE TABLE IF NOT EXISTS hotspots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hotspot_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  
  -- 评分信息
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
  novelty_score INTEGER CHECK (novelty_score >= 0 AND novelty_score <= 100),
  practicality_score INTEGER CHECK (practicality_score >= 0 AND practicality_score <= 100),
  audience_interest_score INTEGER CHECK (audience_interest_score >= 0 AND audience_interest_score <= 100),
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 100),
  
  -- 来源信息
  sources_json TEXT,
  discovered_by TEXT,
  discovered_at DATETIME,
  
  -- 状态
  status TEXT DEFAULT 'new',
  processed_by TEXT,
  processed_at DATETIME,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 文章内容表 ====================
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- 元数据
  author TEXT DEFAULT 'content_creator',
  content_type TEXT DEFAULT 'industry_analysis',
  target_length INTEGER,
  actual_length INTEGER,
  
  -- 质量评分
  readability_score INTEGER CHECK (readability_score >= 0 AND readability_score <= 100),
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  originality_score INTEGER CHECK (originality_score >= 0 AND originality_score <= 100),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- 来源和状态
  source_hotspot_id TEXT,
  status TEXT DEFAULT 'draft',
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  
  -- 外键约束
  FOREIGN KEY (source_hotspot_id) REFERENCES hotspots(hotspot_id)
);

-- ==================== 社交媒体发布表 ====================
CREATE TABLE IF NOT EXISTS social_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- 元数据
  article_id TEXT,
  scheduled_time DATETIME,
  actual_post_time DATETIME,
  
  -- 状态
  status TEXT DEFAULT 'scheduled',
  post_url TEXT,
  
  -- 互动数据
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- 外键约束
  FOREIGN KEY (article_id) REFERENCES articles(article_id)
);

-- ==================== 系统日志表 ====================
CREATE TABLE IF NOT EXISTS system_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_id TEXT UNIQUE NOT NULL,
  timestamp DATETIME NOT NULL,
  
  -- 日志信息
  level TEXT NOT NULL,
  agent_id TEXT,
  component TEXT,
  message TEXT NOT NULL,
  
  -- 上下文
  context_json TEXT,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 性能指标表 ====================
CREATE TABLE IF NOT EXISTS performance_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id TEXT UNIQUE NOT NULL,
  timestamp DATETIME NOT NULL,
  
  -- 指标信息
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  unit TEXT,
  
  -- 上下文
  agent_id TEXT,
  component TEXT,
  context_json TEXT,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 分析结果表 ====================
CREATE TABLE IF NOT EXISTS analysis_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  analysis_id TEXT UNIQUE NOT NULL,
  analysis_type TEXT NOT NULL,
  
  -- 分析内容
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  insights_json TEXT NOT NULL,
  recommendations_json TEXT,
  
  -- 状态
  status TEXT DEFAULT 'completed',
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- ==================== 维护记录表 ====================
CREATE TABLE IF NOT EXISTS maintenance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_id TEXT UNIQUE NOT NULL,
  maintenance_type TEXT NOT NULL,
  
  -- 维护信息
  title TEXT NOT NULL,
  description TEXT,
  performed_by TEXT DEFAULT 'tech_specialist',
  
  -- 状态
  status TEXT DEFAULT 'completed',
  start_time DATETIME,
  end_time DATETIME,
  duration INTEGER, -- 单位: 秒
  
  -- 结果
  result_json TEXT,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 备份记录表 ====================
CREATE TABLE IF NOT EXISTS backup_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backup_id TEXT UNIQUE NOT NULL,
  backup_type TEXT NOT NULL,
  
  -- 备份信息
  filename TEXT NOT NULL,
  size_bytes INTEGER,
  location TEXT,
  
  -- 状态
  status TEXT DEFAULT 'completed',
  start_time DATETIME,
  end_time DATETIME,
  
  -- 验证
  checksum TEXT,
  verified BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 索引创建 ====================

-- 消息表索引
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- 任务表索引
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);

-- 热点表索引
CREATE INDEX IF NOT EXISTS idx_hotspots_score ON hotspots(total_score);
CREATE INDEX IF NOT EXISTS idx_hotspots_status ON hotspots(status);
CREATE INDEX IF NOT EXISTS idx_hotspots_discovered_at ON hotspots(discovered_at);

-- 文章表索引
CREATE INDEX IF NOT EXISTS idx_articles_score ON articles(overall_score);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);

-- 社交媒体发布表索引
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_time ON social_posts(scheduled_time);

-- 系统日志表索引
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_agent_id ON system_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);

-- 性能指标表索引
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- ==================== 初始化数据 ====================

-- 插入系统配置
INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description) VALUES
('system_name', 'Mission Control 系统', 'string', '系统名称'),
('system_version', '2.0.0', 'string', '系统版本'),
('protocol_version', '1.0.0', 'string', '通信协议版本'),
('timezone', 'Asia/Shanghai', 'string', '系统时区'),
('created_date', '2026-02-21', 'date', '系统创建日期');

-- 插入智能体注册信息
INSERT OR IGNORE INTO agents (agent_id, agent_name, agent_type, version, status) VALUES
('mission_control', '任务管理器', 'controller', '1.0.0', 'active'),
('hotspot_scout', '热点侦察兵', 'discovery', '1.0.0', 'inactive'),
('content_creator', '内容创作者', 'creation', '1.0.0', 'inactive'),
('social_manager', '社交媒体经理', 'promotion', '1.0.0', 'inactive'),
('tech_specialist', '技术专家', 'maintenance', '1.0.0', 'inactive'),
('data_analyst', '数据分析师', 'analysis', '1.0.0', 'inactive');

-- 插入示例热点数据
INSERT OR IGNORE INTO hotspots (hotspot_id, title, summary, relevance_score, novelty_score, practicality_score, audience_interest_score, total_score, discovered_by, status) VALUES
('hs_20260221_070000_001', '中小企业数字化转型的5个关键步骤', '分析中小企业数字化转型的常见挑战，提出5个关键实施步骤，包括技术选型、团队培训、流程优化等。', 85, 75, 90, 80, 82, 'hotspot_scout', 'new'),
('hs_20260221_070000_002', 'AI在制造业的实际应用案例', '探讨AI技术在制造业中的具体应用场景，分析实施效果和ROI，包括预测性维护、质量控制、供应链优化等。', 78, 85, 80, 75, 79, 'hotspot_scout', 'new'),
('hs_20260221_070000_003', '云计算成本优化的10个技巧', '分享云计算成本控制的实用技巧，帮助企业降低IT支出，包括资源优化、预留实例、自动伸缩等策略。', 72, 70, 85, 65, 73, 'hotspot_scout', 'new');

-- 插入示例任务
INSERT OR IGNORE INTO tasks (task_id, task_type, title, assigned_to, status, priority, deadline) VALUES
('task_20260221_070000_001', 'hotspot_discovery', '今日热点侦察', 'hotspot_scout', 'pending', 'high', '2026-02-21 08:00:00'),
('task_20260221_070000_002', 'content_creation', '基于热点创作文章', 'content_creator', 'pending', 'high', '2026-02-21 12:00:00'),
('task_20260221_070000_003', 'social_promotion', '社交媒体推广', 'social_manager', 'pending', 'medium', '2026-02-21 18:00:00');

-- ==================== 视图创建 ====================

-- 智能体状态视图
CREATE VIEW IF NOT EXISTS v_agent_status AS
SELECT 
  agent_id,
  agent_name,
  agent_type,
  status,
  last_heartbeat,
  CASE 
    WHEN last_heartbeat IS NULL THEN 'never'
    WHEN datetime(last_heartbeat) > datetime('now', '-5 minutes') THEN 'active'
    WHEN datetime(last_heartbeat) > datetime('now', '-30 minutes') THEN 'warning'
    ELSE 'inactive'
  END as heartbeat_status,
  created_at,
  updated_at
FROM agents;

-- 任务统计视图
CREATE VIEW IF NOT EXISTS v_task_statistics AS
SELECT 
  assigned_to,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_tasks,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
  AVG(actual_duration) as avg_duration_seconds
FROM tasks
GROUP BY assigned_to;

-- 热点质量视图
CREATE VIEW IF NOT EXISTS v_hotspot_quality AS
SELECT 
  discovered_by,
  COUNT(*) as total_hotspots,
  AVG(total_score) as avg_score,
  SUM(CASE WHEN total_score >= 80 THEN 1 ELSE 0 END) as excellent_hotspots,
  SUM(CASE WHEN total_score >= 60 AND total_score < 80 THEN 1 ELSE 0 END) as good_hotspots,
  SUM(CASE WHEN total_score < 60 THEN 1 ELSE 0 END) as poor_hotspots
FROM hotspots
GROUP BY discovered_by;

-- 系统性能视图
CREATE VIEW IF NOT EXISTS v_system_performance AS
SELECT 
  date(timestamp) as date,
  metric_type,
  metric_name,
  AVG(metric_value) as avg_value,
  MIN(metric_value) as min_value,
  MAX(metric_value) as max_value
FROM performance_metrics
GROUP BY date(timestamp), metric_type, metric_name;

-- ==================== 触发器 ====================

-- 自动更新updated_at时间戳
CREATE TRIGGER IF NOT EXISTS trg_agents_update AFTER UPDATE ON agents
BEGIN
  UPDATE agents SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_tasks_update AFTER UPDATE ON tasks
BEGIN
  UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_hotspots_update AFTER UPDATE ON hotspots
BEGIN
  UPDATE hotspots SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_articles_update AFTER UPDATE ON articles
BEGIN
  UPDATE articles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 任务状态变更日志
CREATE TRIGGER IF NOT EXISTS trg_task_status_change AFTER UPDATE OF status ON tasks
BEGIN
  INSERT INTO system_logs (log_id, timestamp, level, agent_id, component, message, context_json)
  VALUES (
    'log_' || strftime('%Y%m%d_%H%M%S', 'now') || '_' || substr(hex(randomblob(4)), 1, 8),
    CURRENT_TIMESTAMP,
    'info',
    NEW.assigned_by,
    'task_system',
    '任务状态变更: ' || OLD.status || ' -> ' || NEW.status,
    json_object('task_id', NEW.task_id, 'old_status', OLD.status, 'new_status', NEW.status)
  );
END;

-- ==================== 完成标记 ====================
INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description) VALUES
('database_version', '1.0.0', 'string', '数据库版本'),
('database_initialized', 'true', 'boolean', '数据库初始化完成'),
('last_initialization', CURRENT_TIMESTAMP, 'datetime', '最后初始化时间');

-- ==================== 输出完成信息 ====================
SELECT '数据库初始化完成' as message, COUNT(*) as tables_created FROM sqlite_master WHERE type = 'table';