"""
独立脚本：仅创建 templates 表并插入示例数据
（不触发完整迁移，避免重复迁移卡住）
"""
import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'mission_control.db')

def main():
    if not os.path.exists(DB_PATH):
        print(f"❌ 数据库文件不存在: {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

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

    sample_templates = [
        ('tpl_001', '微信公众号深度分析文章', '微信公众号', '行业分析',
         '你是一位资深的行业分析师和公众号内容创作者。请根据以下要求撰写一篇微信公众号深度分析文章：\n\n**主题**: {{topic}}\n**目标字数**: {{word_count}} 字\n**目标受众**: {{audience}}\n\n## 写作要求\n1. 标题吸引眼球，包含数字或疑问句式\n2. 开头用一个引人入胜的场景或数据切入\n3. 正文分3-5个小节，每节配有小标题\n4. 每个论点需要有数据或案例支撑\n5. 结尾给出可执行的建议或展望\n6. 适当使用 emoji 增加可读性\n7. 语言风格：专业但不晦涩，适合非专业读者理解\n\n## 格式要求\n- 使用 Markdown 格式\n- 小标题使用 ## 格式\n- 重要观点加粗标注\n- 适配微信公众号排版',
         '["{{topic}}","{{word_count}}","{{audience}}"]', 2000, '专业严谨', 'active', 23),
        ('tpl_002', '知乎专业回答模板', '知乎', '技术教程',
         '你是一位在知乎上拥有10万+关注者的技术领域优质回答者。请撰写一篇专业且有深度的知乎风格文章：\n\n**主题**: {{topic}}\n**目标字数**: {{word_count}} 字\n**技术领域**: {{tech_domain}}\n\n## 写作要求\n1. 开头先给出核心结论（"先说结论"风格）\n2. 用通俗类比解释专业概念\n3. 层层递进地展开论述，逻辑清晰\n4. 引用权威来源和真实数据\n5. 适当加入个人经验和见解\n6. 结尾总结核心要点\n\n## 格式要求\n- 使用 Markdown 格式\n- 适当使用有序/无序列表\n- 代码片段用代码块包裹\n- 重要结论加粗',
         '["{{topic}}","{{word_count}}","{{tech_domain}}"]', 2500, '专业严谨', 'active', 18),
        ('tpl_003', '头条号热点速评', '头条号', '新闻速报',
         '你是今日头条平台的一位资深自媒体人。请根据以下热点信息撰写一篇头条号文章：\n\n**热点话题**: {{topic}}\n**热点来源**: {{source}}\n**目标字数**: {{word_count}} 字\n\n## 写作要求\n1. 标题必须有冲击力，适合信息流分发\n2. 第一段就要抓住读者注意力\n3. 快速给出事件背景和核心观点\n4. 多角度分析热点背后的深层原因\n5. 语言通俗易懂，节奏明快\n6. 结尾引导互动（提问或投票）\n\n## 注意事项\n- 避免敏感话题和争议性言论\n- 确保信息准确性\n- 适配头条号推荐算法偏好',
         '["{{topic}}","{{source}}","{{word_count}}"]', 1200, '通俗易懂', 'active', 31),
        ('tpl_004', '小红书种草笔记', '小红书', '案例研究',
         '你是小红书平台的一位万粉博主。请创作一篇适合小红书风格的种草/分享笔记：\n\n**分享主题**: {{topic}}\n**产品/工具**: {{product}}\n**目标字数**: {{word_count}} 字\n\n## 写作要求\n1. 标题使用小红书爆款标题公式（含emoji + 关键词 + 数字）\n2. 开头用个人体验引入，真实感强\n3. 正文按使用步骤/体验分点描述\n4. 突出亮点和痛点解决\n5. 配图指导说明（标注哪些地方需要配图）\n6. 结尾加话题标签\n\n## 风格特点\n- 语气亲切，像朋友分享\n- 大量使用 emoji 表情\n- 短句为主，阅读轻松\n- 包含互动话术',
         '["{{topic}}","{{product}}","{{word_count}}"]', 800, '轻松活泼', 'active', 12),
        ('tpl_005', '通用观点评论文章', '通用', '观点评论',
         '你是一位有独到见解的专栏作家。请就以下话题撰写一篇观点鲜明的评论文章：\n\n**评论话题**: {{topic}}\n**立场倾向**: {{stance}}\n**目标字数**: {{word_count}} 字\n\n## 写作要求\n1. 开篇即亮出核心观点\n2. 用3个分论点支撑主论点\n3. 每个分论点配备有力论据\n4. 考虑并回应可能的反对意见\n5. 结尾升华主题或给出行动呼吁\n6. 语言犀利但有理有据\n\n## 格式要求\n- Markdown 格式\n- 清晰的段落结构\n- 适当使用引用块\n- 可跨平台发布',
         '["{{topic}}","{{stance}}","{{word_count}}"]', 1500, '专业严谨', 'disabled', 7),
    ]

    now = datetime.now().isoformat()
    inserted = 0
    for t in sample_templates:
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO templates (template_id, name, platform, category, prompt,
                    variables_json, target_length, tone, status, usage_count,
                    last_used_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (*t, now, now, now))
            if cursor.rowcount > 0:
                inserted += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()
    print(f"✅ 完成！插入 {inserted} 个新模板（已存在的跳过）")

if __name__ == "__main__":
    main()
