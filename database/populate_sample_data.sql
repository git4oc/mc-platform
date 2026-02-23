-- 填充Mission Control系统示例数据
-- 版本: 1.0.0
-- 创建时间: 2026-02-21

-- 1. 更新智能体心跳时间
UPDATE agents SET last_heartbeat = datetime('now', '-1 hour') WHERE agent_id = 'mission_control';
UPDATE agents SET last_heartbeat = datetime('now', '-2 hours') WHERE agent_id = 'content_creator';
UPDATE agents SET last_heartbeat = datetime('now', '-3 hours') WHERE agent_id = 'tech_specialist';
UPDATE agents SET last_heartbeat = datetime('now', '-4 hours') WHERE agent_id = 'data_analyst';
UPDATE agents SET last_heartbeat = datetime('now', '-5 hours') WHERE agent_id = 'social_manager';
UPDATE agents SET last_heartbeat = datetime('now', '-6 hours') WHERE agent_id = 'hotspot_scout';

-- 2. 插入示例任务
INSERT INTO tasks (task_id, task_type, title, description, assigned_to, assigned_by, status, priority, created_at) VALUES
('task_001', 'content_creation', '撰写中小企业数字化转型文章', '基于热点数据创作一篇1500字的文章', 'content_creator', 'mission_control', 'completed', 'high', datetime('now', '-2 days')),
('task_002', 'data_analysis', '分析公众号用户增长趋势', '分析最近30天的用户增长数据', 'data_analyst', 'mission_control', 'in_progress', 'medium', datetime('now', '-1 day')),
('task_003', 'tech_maintenance', '检查系统备份状态', '验证数据库备份和系统日志', 'tech_specialist', 'mission_control', 'pending', 'low', datetime('now', '-12 hours')),
('task_004', 'hotspot_scouting', '发现AI行业最新趋势', '搜索并分析AI行业的最新热点', 'hotspot_scout', 'mission_control', 'assigned', 'high', datetime('now', '-6 hours')),
('task_005', 'social_promotion', '推广数字化转型文章', '在社交媒体平台推广最新文章', 'social_manager', 'mission_control', 'pending', 'medium', datetime('now', '-3 hours'));

-- 3. 插入示例消息
INSERT INTO messages (message_id, protocol_version, timestamp, sender_agent_id, sender_agent_name, receiver_agent_id, receiver_agent_name, message_type, priority, payload_json, metadata_json, status) VALUES
('msg_001', '1.0.0', datetime('now', '-2 days'), 'hotspot_scout', '热点侦察兵', 'mission_control', '任务管理器', 'hotspot_report', 'high', 
 '{"hotspot": "中小企业数字化转型", "trend_score": 85, "sources": ["百度指数", "微信指数", "行业报告"]}',
 '{"source": "自动侦察", "confidence": 0.92}', 'processed'),
('msg_002', '1.0.0', datetime('now', '-1 day'), 'mission_control', '任务管理器', 'content_creator', '内容创作者', 'task_assignment', 'high',
 '{"task_id": "task_001", "title": "撰写中小企业数字化转型文章", "deadline": "2026-02-22T12:00:00Z"}',
 '{"assignment_reason": "热点匹配度高", "priority_reason": "时效性强"}', 'processed'),
('msg_003', '1.0.0', datetime('now', '-12 hours'), 'content_creator', '内容创作者', 'mission_control', '任务管理器', 'task_completion', 'medium',
 '{"task_id": "task_001", "result": "文章已创作完成", "article_url": "https://docs.qq.com/doc/DYU5YQ2hKc0JtR0lH", "word_count": 1560}',
 '{"quality_score": 88, "seo_score": 92}', 'processed'),
('msg_004', '1.0.0', datetime('now', '-6 hours'), 'mission_control', '任务管理器', 'social_manager', '社交媒体经理', 'task_assignment', 'medium',
 '{"task_id": "task_005", "title": "推广数字化转型文章", "platforms": ["微信公众号", "知乎", "头条号"]}',
 '{"target_audience": "中小企业主", "promotion_budget": "自然流量"}', 'pending');

-- 4. 插入热点数据
INSERT INTO hotspots (hotspot_id, title, category, trend_score, source_count, first_seen, last_updated, description) VALUES
('hs_001', '中小企业数字化转型', 'business', 85, 3, datetime('now', '-3 days'), datetime('now', '-1 hour'), '传统中小企业向数字化运营转型的趋势'),
('hs_002', 'AI在客服场景的应用', 'technology', 78, 2, datetime('now', '-2 days'), datetime('now', '-2 hours'), '人工智能在客户服务领域的创新应用'),
('hs_003', '远程办公常态化', 'workplace', 72, 4, datetime('now', '-5 days'), datetime('now', '-3 hours'), '后疫情时代远程办公成为新常态');

-- 5. 插入系统配置
INSERT OR REPLACE INTO system_config (config_key, config_value, config_type, description) VALUES
('system_mode', 'production', 'string', '系统运行模式'),
('max_concurrent_tasks', '10', 'number', '最大并发任务数'),
('agent_health_check_interval', '300', 'number', '智能体健康检查间隔(秒)'),
('task_timeout_hours', '24', 'number', '任务超时时间(小时)'),
('backup_enabled', 'true', 'boolean', '是否启用备份'),
('notification_enabled', 'true', 'boolean', '是否启用通知');

-- 6. 插入系统日志
INSERT INTO system_logs (log_id, level, agent_id, component, message, context_json, created_at) VALUES
('log_001', 'info', 'mission_control', 'system', '系统初始化完成', '{"action": "system_init", "version": "1.0.0"}', datetime('now', '-1 day')),
('log_002', 'info', 'hotspot_scout', 'scouting', '发现新热点: 中小企业数字化转型', '{"hotspot_id": "hs_001", "score": 85}', datetime('now', '-18 hours')),
('log_003', 'warning', 'content_creator', 'content', '文章生成延迟', '{"task_id": "task_001", "delay_minutes": 30}', datetime('now', '-10 hours')),
('log_004', 'info', 'data_analyst', 'analysis', '用户增长分析完成', '{"period": "30天", "growth_rate": "15%"}', datetime('now', '-5 hours'));

-- 7. 验证数据插入
SELECT '=== 数据统计 ===' as section;
SELECT '智能体数量:' as item, COUNT(*) as value FROM agents
UNION ALL
SELECT '任务数量:', COUNT(*) FROM tasks
UNION ALL
SELECT '消息数量:', COUNT(*) FROM messages
UNION ALL
SELECT '热点数量:', COUNT(*) FROM hotspots
UNION ALL
SELECT '系统日志数量:', COUNT(*) FROM system_logs;