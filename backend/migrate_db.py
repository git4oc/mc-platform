"""
Mission Control 数据库迁移脚本
将实际数据库结构对齐到设计文档 (visualization-platform-guide.md §3.2)
"""
import sqlite3
import json
import os
import shutil
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'mission_control.db')
BACKUP_PATH = DB_PATH + f'.backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}'

def migrate():
    # 1. 备份
    print(f"[1/10] 备份数据库 → {BACKUP_PATH}")
    shutil.copy2(DB_PATH, BACKUP_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # ========== 2. agents 表：增加缺失字段 ==========
    print("[2/10] agents: 增加 config_json, performance_score")
    cols = [r[1] for r in cursor.execute("PRAGMA table_info(agents)").fetchall()]
    if 'config_json' not in cols:
        cursor.execute("ALTER TABLE agents ADD COLUMN config_json TEXT")
    if 'performance_score' not in cols:
        cursor.execute("ALTER TABLE agents ADD COLUMN performance_score INTEGER DEFAULT 70")
    # 修正默认 status（SQLite 不支持 ALTER DEFAULT，但现有数据保持不变）
    
    # ========== 3. tasks 表：重构字段 ==========
    print("[3/10] tasks: 重构为设计文档结构")
    cols = [r[1] for r in cursor.execute("PRAGMA table_info(tasks)").fetchall()]
    
    # 保存现有数据
    old_tasks = [dict(r) for r in cursor.execute("SELECT * FROM tasks").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS tasks")
    cursor.execute("""
        CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            agent_id TEXT,
            status TEXT DEFAULT 'pending',
            priority INTEGER DEFAULT 2,
            progress INTEGER DEFAULT 0,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deadline DATETIME,
            started_at DATETIME,
            completed_at DATETIME,
            error_message TEXT
        )
    """)
    
    # 迁移数据
    for t in old_tasks:
        cursor.execute("""
            INSERT INTO tasks (task_id, title, description, agent_id, status, priority,
                             progress, metadata_json, created_at, updated_at, deadline, 
                             started_at, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t.get('task_id'), t.get('title'), t.get('description'),
            t.get('assigned_to') or t.get('agent_id'),  # 兼容旧字段名
            t.get('status', 'pending'),
            # 优先级转换: 字符串→整数
            {'urgent': 0, 'high': 1, 'medium': 2, 'low': 3}.get(str(t.get('priority', '2')), int(t['priority']) if str(t.get('priority', '')).isdigit() else 2),
            t.get('progress', 0),
            json.dumps({
                'task_type': t.get('task_type'),
                'assigned_by': t.get('assigned_by'),
                'requirements': t.get('requirements_json'),
                'result': t.get('result_json'),
                'estimated_duration': t.get('estimated_duration'),
                'actual_duration': t.get('actual_duration'),
            }) if t.get('task_type') else None,
            t.get('created_at'), t.get('updated_at'), t.get('deadline'),
            t.get('started_at'), t.get('completed_at')
        ))
    print(f"    迁移 {len(old_tasks)} 条任务数据")
    
    # ========== 4. messages 表：重建 ==========
    print("[4/10] messages: 重建为设计文档结构")
    old_msgs = [dict(r) for r in cursor.execute("SELECT * FROM messages").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS messages")
    cursor.execute("""
        CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message_id TEXT UNIQUE NOT NULL,
            message_type TEXT NOT NULL,
            sender TEXT NOT NULL,
            receiver TEXT NOT NULL,
            subject TEXT,
            content TEXT NOT NULL,
            status TEXT DEFAULT 'unread',
            metadata_json TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            processed_at DATETIME
        )
    """)
    
    for m in old_msgs:
        payload = m.get('payload_json', '{}')
        if isinstance(payload, str):
            try:
                payload_obj = json.loads(payload)
            except:
                payload_obj = {}
        else:
            payload_obj = payload or {}
        
        content = payload_obj.get('content') or payload_obj.get('message') or json.dumps(payload_obj)
        subject = payload_obj.get('subject') or payload_obj.get('title') or m.get('message_type', '')
        
        cursor.execute("""
            INSERT INTO messages (message_id, message_type, sender, receiver, subject,
                                content, status, metadata_json, timestamp, processed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            m.get('message_id'), m.get('message_type', 'system'),
            m.get('sender_agent_id', ''), m.get('receiver_agent_id', ''),
            subject, content,
            m.get('status', 'unread'),
            m.get('metadata_json'),
            m.get('timestamp'), m.get('processed_at')
        ))
    print(f"    迁移 {len(old_msgs)} 条消息数据")
    
    # ========== 5. system_logs 表：重命名字段 ==========
    print("[5/10] system_logs: 重建匹配设计文档")
    old_logs = [dict(r) for r in cursor.execute("SELECT * FROM system_logs").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS system_logs")
    cursor.execute("""
        CREATE TABLE system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_id TEXT UNIQUE NOT NULL,
            log_level TEXT NOT NULL,
            component TEXT NOT NULL,
            message TEXT NOT NULL,
            details_json TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    for l in old_logs:
        cursor.execute("""
            INSERT INTO system_logs (log_id, log_level, component, message, details_json, timestamp, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            l.get('log_id'), l.get('level', 'info'),
            l.get('component', 'system'), l.get('message', ''),
            json.dumps({'agent_id': l.get('agent_id'), 'context': l.get('context_json')}) if l.get('agent_id') else l.get('context_json'),
            l.get('timestamp'), l.get('created_at')
        ))
    print(f"    迁移 {len(old_logs)} 条日志数据")
    
    # ========== 6. social_posts 表：字段调整 ==========
    print("[6/10] social_posts: 重建匹配设计文档")
    old_posts = [dict(r) for r in cursor.execute("SELECT * FROM social_posts").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS social_posts")
    cursor.execute("""
        CREATE TABLE social_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id TEXT UNIQUE NOT NULL,
            platform TEXT NOT NULL,
            content TEXT NOT NULL,
            article_id TEXT,
            target_audience TEXT,
            engagement_metrics_json TEXT,
            scheduled_time DATETIME,
            published_time DATETIME,
            status TEXT DEFAULT 'draft',
            performance_score INTEGER,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    for p in old_posts:
        metrics = json.dumps({
            'views': p.get('views', 0),
            'likes': p.get('likes', 0),
            'shares': p.get('shares', 0),
            'comments': p.get('comments', 0)
        })
        cursor.execute("""
            INSERT INTO social_posts (post_id, platform, content, article_id, engagement_metrics_json,
                                     scheduled_time, published_time, status, metadata_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p.get('post_id'), p.get('platform', ''), p.get('content', ''),
            p.get('article_id'), metrics,
            p.get('scheduled_time'), p.get('actual_post_time'),
            p.get('status', 'draft'),
            json.dumps({'post_url': p.get('post_url')}) if p.get('post_url') else None,
            p.get('created_at'), p.get('updated_at')
        ))
    print(f"    迁移 {len(old_posts)} 条社交媒体数据")
    
    # ========== 7. system_config → configurations ==========
    print("[7/10] system_config → configurations")
    old_configs = [dict(r) for r in cursor.execute("SELECT * FROM system_config").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS system_config")
    cursor.execute("DROP TABLE IF EXISTS configurations")
    cursor.execute("""
        CREATE TABLE configurations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            config_id TEXT UNIQUE NOT NULL,
            config_key TEXT UNIQUE NOT NULL,
            config_value TEXT NOT NULL,
            config_type TEXT NOT NULL,
            category TEXT,
            description TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_by TEXT
        )
    """)
    
    for i, c in enumerate(old_configs):
        config_id = f"config_{i+1:03d}"
        cursor.execute("""
            INSERT INTO configurations (config_id, config_key, config_value, config_type, category, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            config_id, c.get('config_key'), c.get('config_value', ''),
            c.get('config_type', 'string'), 'system',
            c.get('description'), c.get('created_at'), c.get('updated_at')
        ))
    print(f"    迁移 {len(old_configs)} 条配置数据")
    
    # ========== 8. articles → content ==========
    print("[8/10] articles → content")
    old_articles = [dict(r) for r in cursor.execute("SELECT * FROM articles").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS articles")
    cursor.execute("DROP TABLE IF EXISTS content")
    cursor.execute("""
        CREATE TABLE content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            content_type TEXT NOT NULL,
            content_text TEXT NOT NULL,
            summary TEXT,
            author TEXT,
            word_count INTEGER,
            read_time INTEGER,
            quality_score INTEGER,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            published_at DATETIME
        )
    """)
    
    for a in old_articles:
        meta = {
            'source_hotspot_id': a.get('source_hotspot_id'),
            'readability_score': a.get('readability_score'),
            'engagement_score': a.get('engagement_score'),
            'seo_score': a.get('seo_score'),
            'originality_score': a.get('originality_score'),
            'target_length': a.get('target_length'),
        }
        content_text = a.get('content', '')
        word_count = len(content_text) if content_text else 0
        cursor.execute("""
            INSERT INTO content (content_id, title, content_type, content_text, author,
                               word_count, read_time, quality_score, metadata_json,
                               created_at, updated_at, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            a.get('article_id'), a.get('title', ''), a.get('content_type', 'article'),
            content_text, a.get('author'),
            word_count, max(1, word_count // 300),
            a.get('overall_score'), json.dumps(meta),
            a.get('created_at'), a.get('updated_at'), a.get('published_at')
        ))
    print(f"    迁移 {len(old_articles)} 条内容数据")
    
    # ========== 9. analysis_results → analytics ==========
    print("[9/10] analysis_results → analytics + 新建 results/notifications/workflows/users")
    old_analysis = [dict(r) for r in cursor.execute("SELECT * FROM analysis_results").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS analysis_results")
    cursor.execute("DROP TABLE IF EXISTS analytics")
    cursor.execute("""
        CREATE TABLE analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            analytics_id TEXT UNIQUE NOT NULL,
            analysis_type TEXT NOT NULL,
            title TEXT NOT NULL,
            summary TEXT NOT NULL,
            insights_json TEXT NOT NULL,
            data_source TEXT,
            methodology TEXT,
            confidence_level INTEGER,
            recommendations_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    for a in old_analysis:
        cursor.execute("""
            INSERT INTO analytics (analytics_id, analysis_type, title, summary, insights_json,
                                  recommendations_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            a.get('analysis_id'), a.get('analysis_type', 'trend'),
            a.get('title', ''), a.get('summary', ''),
            a.get('insights_json', '{}'),
            a.get('recommendations_json'), a.get('created_at'), a.get('updated_at')
        ))
    print(f"    迁移 {len(old_analysis)} 条分析数据")
    
    # 新建 results 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            result_id TEXT UNIQUE NOT NULL,
            task_id TEXT NOT NULL,
            agent_id TEXT NOT NULL,
            output_type TEXT NOT NULL,
            title TEXT NOT NULL,
            content_summary TEXT,
            file_path TEXT,
            quality_score INTEGER,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # 新建 notifications 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            notification_id TEXT UNIQUE NOT NULL,
            notification_type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            recipient TEXT,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'unread',
            action_required BOOLEAN DEFAULT 0,
            action_taken TEXT,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            read_at DATETIME,
            archived_at DATETIME
        )
    """)
    
    # 新建 workflows 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workflows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workflow_id TEXT UNIQUE NOT NULL,
            workflow_name TEXT NOT NULL,
            description TEXT,
            steps_json TEXT NOT NULL,
            trigger_type TEXT NOT NULL,
            trigger_config_json TEXT,
            status TEXT DEFAULT 'active',
            last_executed_at DATETIME,
            execution_count INTEGER DEFAULT 0,
            success_count INTEGER DEFAULT 0,
            failure_count INTEGER DEFAULT 0,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # ========== 10. 新建 users 表（登录功能） ==========
    print("[10/10] 新建 users 表 + performance_metrics 字段调整")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            role TEXT DEFAULT 'admin',
            is_active BOOLEAN DEFAULT 1,
            last_login DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # 插入默认用户 admin/admin (使用 SHA256 哈希)
    import hashlib
    pwd_hash = hashlib.sha256("admin".encode()).hexdigest()
    try:
        cursor.execute("""
            INSERT INTO users (username, password_hash, display_name, role)
            VALUES (?, ?, ?, ?)
        """, ('admin', pwd_hash, '管理员', 'admin'))
    except sqlite3.IntegrityError:
        pass  # 已存在
    
    # performance_metrics 字段调整
    old_pm_cols = [r[1] for r in cursor.execute("PRAGMA table_info(performance_metrics)").fetchall()]
    old_pm = [dict(r) for r in cursor.execute("SELECT * FROM performance_metrics").fetchall()]
    
    cursor.execute("DROP TABLE IF EXISTS performance_metrics")
    cursor.execute("""
        CREATE TABLE performance_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_id TEXT UNIQUE NOT NULL,
            metric_type TEXT NOT NULL,
            target_id TEXT NOT NULL,
            metric_name TEXT NOT NULL,
            metric_value NUMERIC NOT NULL,
            unit TEXT,
            time_period TEXT,
            recorded_at DATETIME NOT NULL,
            metadata_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    for p in old_pm:
        cursor.execute("""
            INSERT INTO performance_metrics (metric_id, metric_type, target_id, metric_name,
                                           metric_value, unit, time_period, recorded_at, metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p.get('metric_id'), p.get('metric_type', 'system'),
            p.get('agent_id') or p.get('component') or 'system',
            p.get('metric_name', ''), p.get('metric_value', 0),
            p.get('unit'), 'instant',
            p.get('timestamp') or p.get('created_at'),
            p.get('context_json'), p.get('created_at')
        ))
    print(f"    迁移 {len(old_pm)} 条性能数据")
    
    # 创建索引
    print("创建索引...")
    indices = [
        "CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status)",
        "CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(agent_type)",
        "CREATE INDEX IF NOT EXISTS idx_agents_heartbeat ON agents(last_heartbeat)",
        "CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)",
        "CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(agent_id)",
        "CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)",
        "CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender)",
        "CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver)",
        "CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)",
        "CREATE INDEX IF NOT EXISTS idx_hotspots_status ON hotspots(status)",
        "CREATE INDEX IF NOT EXISTS idx_hotspots_score ON hotspots(total_score)",
        "CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(log_level)",
        "CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp)",
        "CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type)",
        "CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform)",
        "CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status)",
        "CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status)",
        "CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type)",
    ]
    for idx in indices:
        try:
            cursor.execute(idx)
        except sqlite3.Error:
            pass
    
    # ========== 新增: templates 表 ==========
    print("创建 templates 表...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            template_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            platform TEXT NOT NULL,
            category TEXT,
            prompt TEXT NOT NULL,
            variables_json TEXT,
            target_length INTEGER DEFAULT 2000,
            tone TEXT,
            status TEXT DEFAULT 'active',
            usage_count INTEGER DEFAULT 0,
            last_used_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # 插入示例模板
    sample_templates = [
        ('tpl_001', '微信公众号深度分析文章', '微信公众号', '行业分析',
         '你是一位资深的行业分析师和公众号内容创作者。请根据以下要求撰写一篇微信公众号深度分析文章：\n\n**主题**: {{topic}}\n**目标字数**: {{word_count}} 字\n**目标受众**: {{audience}}\n\n## 写作要求\n1. 标题吸引眼球，包含数字或疑问句式\n2. 开头用一个引人入胜的场景或数据切入\n3. 正文分3-5个小节，每节配有小标题\n4. 每个论点需要有数据或案例支撑\n5. 结尾给出可执行的建议或展望\n6. 适当使用 emoji 增加可读性\n7. 语言风格：专业但不晦涩，适合非专业读者理解',
         '["{{topic}}","{{word_count}}","{{audience}}"]', 2000, '专业严谨', 'active', 23),
        ('tpl_002', '知乎专业回答模板', '知乎', '技术教程',
         '你是一位在知乎上拥有10万+关注者的技术领域优质回答者。请撰写一篇专业且有深度的知乎风格文章：\n\n**主题**: {{topic}}\n**目标字数**: {{word_count}} 字\n**技术领域**: {{tech_domain}}\n\n## 写作要求\n1. 开头先给出核心结论（"先说结论"风格）\n2. 用通俗类比解释专业概念\n3. 层层递进地展开论述，逻辑清晰\n4. 引用权威来源和真实数据\n5. 适当加入个人经验和见解\n6. 结尾总结核心要点',
         '["{{topic}}","{{word_count}}","{{tech_domain}}"]', 2500, '专业严谨', 'active', 18),
        ('tpl_003', '头条号热点速评', '头条号', '新闻速报',
         '你是今日头条平台的一位资深自媒体人。请根据以下热点信息撰写一篇头条号文章：\n\n**热点话题**: {{topic}}\n**热点来源**: {{source}}\n**目标字数**: {{word_count}} 字\n\n## 写作要求\n1. 标题必须有冲击力，适合信息流分发\n2. 第一段就要抓住读者注意力\n3. 快速给出事件背景和核心观点\n4. 多角度分析热点背后的深层原因\n5. 语言通俗易懂，节奏明快\n6. 结尾引导互动（提问或投票）',
         '["{{topic}}","{{source}}","{{word_count}}"]', 1200, '通俗易懂', 'active', 31),
        ('tpl_004', '小红书种草笔记', '小红书', '案例研究',
         '你是小红书平台的一位万粉博主。请创作一篇适合小红书风格的种草/分享笔记：\n\n**分享主题**: {{topic}}\n**产品/工具**: {{product}}\n**目标字数**: {{word_count}} 字\n\n## 写作要求\n1. 标题使用小红书爆款标题公式（含emoji + 关键词 + 数字）\n2. 开头用个人体验引入，真实感强\n3. 正文按使用步骤/体验分点描述\n4. 突出亮点和痛点解决\n5. 配图指导说明\n6. 结尾加话题标签',
         '["{{topic}}","{{product}}","{{word_count}}"]', 800, '轻松活泼', 'active', 12),
        ('tpl_005', '通用观点评论文章', '通用', '观点评论',
         '你是一位有独到见解的专栏作家。请就以下话题撰写一篇观点鲜明的评论文章：\n\n**评论话题**: {{topic}}\n**立场倾向**: {{stance}}\n**目标字数**: {{word_count}} 字\n\n## 写作要求\n1. 开篇即亮出核心观点\n2. 用3个分论点支撑主论点\n3. 每个分论点配备有力论据\n4. 考虑并回应可能的反对意见\n5. 结尾升华主题或给出行动呼吁\n6. 语言犀利但有理有据',
         '["{{topic}}","{{stance}}","{{word_count}}"]', 1500, '专业严谨', 'disabled', 7),
    ]
    
    now = datetime.now().isoformat()
    for t in sample_templates:
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO templates (template_id, name, platform, category, prompt,
                    variables_json, target_length, tone, status, usage_count,
                    last_used_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (*t, now, now, now))
        except sqlite3.IntegrityError:
            pass
    print(f"    插入 {len(sample_templates)} 个示例模板")

    conn.commit()
    conn.close()
    
    print("\n✅ 数据库迁移完成！")
    print(f"   备份文件: {BACKUP_PATH}")

if __name__ == "__main__":
    migrate()
