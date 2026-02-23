-- 注册Mission Control系统智能体
-- 版本: 1.0.0
-- 创建时间: 2026-02-21

-- 1. 注册任务管理器
INSERT OR REPLACE INTO agents (agent_id, agent_name, agent_type, version, status) 
VALUES ('mission_control', '任务管理器', 'central_controller', '1.0.0', 'active');

-- 2. 注册内容创作者
INSERT OR REPLACE INTO agents (agent_id, agent_name, agent_type, version, status) 
VALUES ('content_creator', '内容创作者', 'content_creator', '1.0.0', 'standby');

-- 3. 注册技术专家
INSERT OR REPLACE INTO agents (agent_id, agent_name, agent_type, version, status) 
VALUES ('tech_specialist', '技术专家', 'tech_specialist', '1.0.0', 'standby');

-- 4. 注册数据分析师
INSERT OR REPLACE INTO agents (agent_id, agent_name, agent_type, version, status) 
VALUES ('data_analyst', '数据分析师', 'data_analyst', '1.0.0', 'standby');

-- 5. 注册社交媒体经理
INSERT OR REPLACE INTO agents (agent_id, agent_name, agent_type, version, status) 
VALUES ('social_manager', '社交媒体经理', 'social_manager', '1.0.0', 'standby');

-- 6. 注册热点侦察兵
INSERT OR REPLACE INTO agents (agent_id, agent_name, agent_type, version, status) 
VALUES ('hotspot_scout', '热点侦察兵', 'hotspot_scout', '1.0.0', 'standby');

-- 7. 插入系统配置
INSERT OR REPLACE INTO system_config (config_key, config_value, config_type, description) VALUES
('system_name', 'Mission Control可视化管理系统', 'string', '系统名称'),
('system_version', '1.0.0', 'string', '系统版本'),
('database_version', '1.0.0', 'string', '数据库版本'),
('last_initialized', '2026-02-21 19:13:00', 'datetime', '最后初始化时间'),
('total_agents', '6', 'number', '智能体总数'),
('system_status', 'active', 'string', '系统状态');

-- 8. 插入初始系统日志
INSERT INTO system_logs (level, agent_id, component, message, context_json) VALUES
('info', 'system', 'database', '数据库初始化完成', '{"action": "database_init", "timestamp": "2026-02-21T19:13:00Z", "tables_created": 13}'),
('info', 'system', 'agents', '智能体注册完成', '{"action": "agent_registration", "timestamp": "2026-02-21T19:13:00Z", "agents_registered": 6}');

-- 9. 验证插入结果
SELECT '智能体注册完成:' as result;
SELECT agent_id, agent_name, agent_type, status FROM agents ORDER BY id;