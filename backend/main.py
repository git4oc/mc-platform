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
    allow_origins=["*"],  # 生产环境建议替换为您的实际前端域名，如 ["https://yourdomain.com"]
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
        
        # 尝试自动解析 JSON 字符串字段（如果数据库里存的是用 JSON 序列化过的字符串）
        for item in result:
            for key, value in item.items():
                if isinstance(value, str) and (value.startswith('{') or value.startswith('[')):
                    try:
                        item[key] = json.loads(value)
                    except json.JSONDecodeError:
                        pass # 如果不是真的 JSON 就不处理

        return result
    except sqlite3.Error as e:
        print(f"Database error executing {query}: {e}")
        # 如果表不存在等错误，这里可以提供一个空列表的容错处理
        if "no such table" in str(e):
            return []
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()

# ----------------- 数据接口定义 -----------------

@app.get("/api/agents")
def get_agents():
    # 假设数据库表名叫 agents
    # 从您的现有假数据结构来看，最好返回 {"tasks": {"total": 10, ...}} 之类的嵌套，或者您已经在数据库存成了 JSON 文本。
    return execute_query("SELECT * FROM agents")

@app.get("/api/tasks")
def get_tasks():
    # 假设数据库表名叫 tasks
    return execute_query("SELECT * FROM tasks ORDER BY created_at DESC")

@app.get("/api/hotspots")
def get_hotspots():
    # 假设数据库表名叫 hotspots
    return execute_query("SELECT * FROM hotspots ORDER BY total_score DESC")

@app.get("/api/articles")
def get_articles():
    # 假设数据库表名叫 articles
    return execute_query("SELECT * FROM articles ORDER BY created_at DESC")

@app.get("/api/social-posts")
def get_social_posts():
    # 假设数据库表名叫 social_posts
    return execute_query("SELECT * FROM social_posts ORDER BY created_at DESC")

@app.get("/api/messages")
def get_messages():
    # 假设数据库表名叫 messages
    return execute_query("SELECT * FROM messages ORDER BY timestamp DESC")

@app.get("/api/system-logs")
def get_system_logs():
    # 假设数据库表名叫 system_logs
    return execute_query("SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 100")

@app.get("/api/system-config")
def get_system_config():
    # 假设数据库表名叫 system_config
    return execute_query("SELECT * FROM system_config")

@app.get("/api/performance-data")
def get_performance_data():
    # 为了简化，如果数据库里没有直接存时间序列指标，可以在这里聚会计算，
    # 也可以在数据库中创一个视图。这里提供一个静态兜底数据作掩饰：
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
    return execute_query("SELECT * FROM templates ORDER BY created_at DESC")

# 如果运行此文件，默认在 0.0.0.0:8000 启动
if __name__ == "__main__":
    import uvicorn
    # 为了兼容直接运行 Python 文件测试
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
