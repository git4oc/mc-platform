import os
import sqlite3
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict, List

# 设定真实的数据库路径为环境变量，或者默认为阿里云上的路径
DB_PATH = os.environ.get("DB_PATH", "/home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db")

app = FastAPI(title="Mission Control API", version="1.0.0")

# 配置跨域，允许前端域名访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议针对真实域名配置
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    """获取 SQLite 数据库连接，并设置返回字典格式"""
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=500, detail=f"Database file not found at {DB_PATH}")
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 让查出来的数据可以通过列名当字典访问
    return conn

def execute_query(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """通用的数据库查询函数"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # 转换 sqlite3.Row 为标准字典
        result = [dict(row) for row in rows]
        
        # 尝试自动解析具有 _json 后缀字段的字符串（依据您的数据库设计规范）
        for item in result:
            for key, value in item.items():
                if isinstance(value, str) and (value.startswith('{') or value.startswith('[')) and key.endswith('_json'):
                    try:
                        item[key] = json.loads(value)
                    except json.JSONDecodeError:
                        pass # 如果不是真的 JSON 就不处理

        return result
    except sqlite3.Error as e:
        print(f"Database error executing {query}: {e}")
        # 如果表不存在等错误，提供一个空列表的容错处理
        if "no such table" in str(e):
            return []
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()

# ----------------- 数据接口定义 -----------------

@app.get("/")
def read_root():
    """根路由检测 API 状态"""
    return {"status": "ok", "message": "Mission Control API is running."}

@app.get("/api/agents")
def get_agents():
    # 查询 agents 表
    agents_data = execute_query("SELECT * FROM agents ORDER BY last_heartbeat DESC")
    
    # 根据前端需要，临时聚合每个 agent 的任务统计（由于您的 SQLite 的 tasks 表）
    # 在真实复杂场景下，可以使用 JOIN 语句实现
    stats_data = execute_query("SELECT agent_id, status, count(*) as count FROM tasks GROUP BY agent_id, status")
    
    # 组合 tasks 统计到 agents 对象里
    agent_tasks_map = {}
    for stat in stats_data:
        aid = stat.get('agent_id')
        status = stat.get('status')
        count = stat.get('count')
        if aid not in agent_tasks_map:
            agent_tasks_map[aid] = {"total": 0, "completed": 0, "failed": 0, "pending": 0, "in_progress": 0}
        
        agent_tasks_map[aid]["total"] += count
        if status in agent_tasks_map[aid]:
            agent_tasks_map[aid][status] = count

    for agent in agents_data:
        aid = agent.get('agent_id')
        agent['tasks'] = agent_tasks_map.get(aid, {"total": 0, "completed": 0, "failed": 0, "pending": 0})
        # 这里的 agent.icon 依赖前端或配置。可直接将配置里包含 icon

    return agents_data

@app.get("/api/tasks")
def get_tasks():
    # 按照数据库设计规范查询 tasks 表
    return execute_query("SELECT * FROM tasks ORDER BY created_at DESC")

@app.get("/api/hotspots")
def get_hotspots():
    # 按照数据库设计规范查询 hotspots 表，热点一般按相关度或最新时间排序
    return execute_query("SELECT * FROM hotspots ORDER BY relevance_score DESC, created_at DESC")

@app.get("/api/articles")
def get_articles():
    # **重点** 根据设计规范：❌ 不增加 articles 表，使用 content 表存储文章内容
    return execute_query("SELECT * FROM content WHERE content_type IN ('article', 'report') ORDER BY created_at DESC")

@app.get("/api/social-posts")
def get_social_posts():
    # 按照数据库设计规范查询 social_posts 表
    return execute_query("SELECT * FROM social_posts ORDER BY created_at DESC")

@app.get("/api/messages")
def get_messages():
    # 按照数据库设计规范查询 messages 表
    return execute_query("SELECT * FROM messages ORDER BY timestamp DESC")

@app.get("/api/system-logs")
def get_system_logs():
    # 按照数据库设计规范查询 system_logs 表
    return execute_query("SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 200")

@app.get("/api/system-config")
def get_system_config():
    # 按照数据库设计规范查询 configurations 表
    return execute_query("SELECT * FROM configurations")

@app.get("/api/performance-data")
def get_performance_data():
    # 性能图表数据。
    # 根据数据库设计的 performance_metrics 表，我们可以按时间跨度聚合并生成图表需要的数据。
    # 由于该计算较为复杂，这里保留基础 Mock 样例格式，之后您可以根据 metric_value 具体写法实现。
    return {
        "labels": ['02-16', '02-17', '02-18', '02-19', '02-20', '02-21', '02-22'],
        "datasets": {
            "taskCompletion": [4, 6, 5, 7, 8, 6, 3],
            "hotspotCount": [2, 3, 1, 4, 2, 3, 1],
            "articleCount": [1, 2, 1, 1, 2, 1, 0],
            "avgResponseTime": [2.1, 1.8, 2.5, 1.9, 2.0, 1.7, 2.2]
        }
    }

@app.get("/api/templates")
def get_templates():
    # 您的规范的13个核心表中没有明确的 templates。
    # 很大可能它是存储在 configurations(config_type='template') 或是 workloads 中。
    # 在这里我们暂时查询 configurations 表里分类为 template 的记录
    return execute_query("SELECT * FROM configurations WHERE category = 'template' ORDER BY updated_at DESC")

# 如果运行此文件，默认在 0.0.0.0:8000 启动
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
