import os
import sqlite3
import json
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Any, Dict, List, Optional
import uvicorn

from config import (
    DB_PATH, JWT_SECRET, JWT_EXPIRE_HOURS,
    CORS_ORIGINS, APP_TITLE, APP_VERSION, LOG_QUERY_LIMIT,
    HOST, PORT, RELOAD, OUTPUTS_DIR
)

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== JWT 工具 ====================

def create_jwt(payload: dict) -> str:
    """简易 JWT 生成（不依赖 PyJWT 库）"""
    import base64, hmac
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).rstrip(b'=').decode()
    payload["exp"] = (datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)).isoformat()
    body = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b'=').decode()
    signature = hmac.new(JWT_SECRET.encode(), f"{header}.{body}".encode(), hashlib.sha256).hexdigest()
    return f"{header}.{body}.{signature}"

def verify_jwt(token: str) -> Optional[dict]:
    """验证 JWT token"""
    import base64, hmac
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, body, signature = parts
        expected_sig = hmac.new(JWT_SECRET.encode(), f"{header}.{body}".encode(), hashlib.sha256).hexdigest()
        if signature != expected_sig:
            return None
        # 补齐 base64 padding
        body_padded = body + '=' * (4 - len(body) % 4)
        payload = json.loads(base64.urlsafe_b64decode(body_padded))
        # 检查过期
        if datetime.fromisoformat(payload.get("exp", "2000-01-01")) < datetime.utcnow():
            return None
        return payload
    except Exception:
        return None

async def get_current_user(request: Request) -> dict:
    """从请求头提取并验证 JWT"""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供认证令牌")
    token = auth[7:]
    payload = verify_jwt(token)
    if not payload:
        raise HTTPException(status_code=401, detail="令牌无效或已过期")
    return payload

# ==================== 数据库工具 ====================

def get_db_connection():
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=500, detail=f"数据库文件未找到: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def execute_query(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    conn = None
    result = []
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        result = [dict(row) for row in rows]
        # 自动解析 _json 字段
        for item in result:
            for key, value in item.items():
                if isinstance(value, str) and key.endswith('_json'):
                    try:
                        parsed = json.loads(value)
                        item[key] = parsed
                    except (json.JSONDecodeError, TypeError):
                        pass
    except sqlite3.Error as e:
        if "no such table" not in str(e):
            raise HTTPException(status_code=500, detail=f"数据库错误: {str(e)}")
    finally:
        if conn:
            conn.close()
    return result

def execute_write(query: str, params: tuple = ()) -> int:
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor.lastrowid or cursor.rowcount
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"数据库写入错误: {str(e)}")
    finally:
        if conn:
            conn.close()
    return 0  # unreachable, satisfies type checker

def parse_json(value, default=None):
    """安全解析 JSON 字符串，已经是 dict/list 则直接返回"""
    if default is None:
        default = {}
    if isinstance(value, (dict, list)):
        return value
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return default
    return default

# ==================== 产出物工具 ====================
import re

def title_to_topic(title: str) -> str:
    # 移除标点符号
    topic = re.sub(r'[^\w\s\u4e00-\u9fa5]', '', title)
    # 替换空格为下划线，转小写
    topic = re.sub(r'\s+', '_', topic).lower()
    # 限制长度
    topic = topic[:30]
    # 移除末尾下划线
    return topic.rstrip('_')

AGENT_PREFIX_MAP = {
    "content_creator": "cc",
    "data_analyst": "da",
    "tech_specialist": "ts",
    "social_manager": "sm",
    "hotspot_scout": "hs",
    "mission_control": "mc",
}

def save_output_to_file(agent_id: str, output_type: str, title: str, content: str, extension: str = "md") -> str:
    prefix = AGENT_PREFIX_MAP.get(agent_id, "sys")
    topic = title_to_topic(title) or "output"
    date_str = datetime.now().strftime("%Y%m%d")
    
    # 决定子目录
    type_dir = output_type + ("s" if not output_type.endswith("s") else "")
    
    # 构建基础目录
    base_dir = os.path.join(OUTPUTS_DIR, agent_id, type_dir)
    os.makedirs(base_dir, exist_ok=True)
    
    # 寻找下一个序号
    existing_files = [f for f in os.listdir(base_dir) if f.startswith(f"{prefix}_{output_type}_{topic}_{date_str}_")]
    seq = len(existing_files) + 1
    
    filename = f"{prefix}_{output_type}_{topic}_{date_str}_{seq:03d}.{extension}"
    full_path = os.path.join(base_dir, filename)
    
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    return f"{agent_id}/{type_dir}/{filename}"

# ==================== 公开接口（无需认证） ====================

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Mission Control API v2.0"}

@app.get("/api/outputs/{file_path:path}")
def get_output_file(file_path: str):
    """获取产出物文件内容"""
    full_path = os.path.abspath(os.path.join(OUTPUTS_DIR, file_path))
    if not full_path.startswith(os.path.abspath(OUTPUTS_DIR)):
        raise HTTPException(status_code=403, detail="非法路径")
    if not os.path.exists(full_path) or not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    return FileResponse(full_path)

@app.post("/api/login")
def login(credentials: dict):
    """用户登录，返回 JWT token"""
    username = credentials.get("username", "").strip()
    password = credentials.get("password", "").strip()
    if not username or not password:
        raise HTTPException(status_code=400, detail="用户名和密码不能为空")
    
    pwd_hash = hashlib.sha256(password.encode()).hexdigest()
    users = execute_query(
        "SELECT * FROM users WHERE username = ? AND password_hash = ? AND is_active = 1",
        (username, pwd_hash)
    )
    if not users:
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    user = users[0]
    token = create_jwt({"username": user["username"], "role": user.get("role", "admin"), "display_name": user.get("display_name", username)})
    
    # 更新最后登录时间
    execute_write("UPDATE users SET last_login = ? WHERE username = ?", (datetime.now().isoformat(), username))
    
    return {"token": token, "username": user["username"], "display_name": user.get("display_name", username), "role": user.get("role", "admin")}

@app.get("/api/auth/me")
def auth_me(user: dict = Depends(get_current_user)):
    """验证当前 token 有效性"""
    return {"username": user["username"], "role": user.get("role"), "display_name": user.get("display_name")}

# ==================== 受保护接口 ====================

# ---------- 系统概览 ----------
@app.get("/api/system/overview")
def get_system_overview(user: dict = Depends(get_current_user)):
    agents = execute_query("SELECT status, COUNT(*) as count FROM agents GROUP BY status")
    tasks = execute_query("SELECT status, COUNT(*) as count FROM tasks GROUP BY status")
    
    agent_stats = {"total": 0, "active": 0, "standby": 0, "error": 0}
    for row in agents:
        s = row["status"]
        if s in agent_stats:
            agent_stats[s] = row["count"]
        agent_stats["total"] += row["count"]
    
    task_stats = {"total": 0, "pending": 0, "in_progress": 0, "completed": 0, "failed": 0}
    for row in tasks:
        s = row["status"]
        if s in task_stats:
            task_stats[s] = row["count"]
        task_stats["total"] += row["count"]
    
    return {"agents": agent_stats, "tasks": task_stats}

# ---------- Agents ----------
@app.get("/api/agents")
def get_agents(user: dict = Depends(get_current_user)):
    agents_data = execute_query("SELECT * FROM agents ORDER BY last_heartbeat DESC")
    stats_data = execute_query("SELECT agent_id, status, count(*) as count FROM tasks GROUP BY agent_id, status")
    
    agent_tasks_map: Dict[str, Dict[str, int]] = {}
    for stat in stats_data:
        aid = stat.get('agent_id', '')
        status = str(stat.get('status', ''))
        count = int(stat.get('count', 0) or 0)
        if aid not in agent_tasks_map:
            agent_tasks_map[aid] = {"total": 0, "completed": 0, "failed": 0, "pending": 0, "in_progress": 0}
        agent_tasks_map[aid]["total"] += count
        if status in agent_tasks_map[aid]:
            agent_tasks_map[aid][status] = count
    
    for agent in agents_data:
        aid = agent.get('agent_id', '')
        agent['tasks'] = agent_tasks_map.get(aid, {"total": 0, "completed": 0, "failed": 0, "pending": 0, "in_progress": 0})
    
    return agents_data

@app.put("/api/agents/{agent_id}/status")
def update_agent_status(agent_id: str, body: dict, user: dict = Depends(get_current_user)):
    status = body.get("status")
    if status not in ("active", "standby", "inactive", "error"):
        raise HTTPException(status_code=400, detail="无效的状态值")
    rows = execute_write("UPDATE agents SET status = ?, updated_at = ? WHERE agent_id = ?",
                         (status, datetime.now().isoformat(), agent_id))
    if not rows:
        raise HTTPException(status_code=404, detail="智能体不存在")
    return {"message": f"智能体 {agent_id} 状态已更新为 {status}"}

# ---------- Tasks ----------
@app.get("/api/tasks")
def get_tasks(user: dict = Depends(get_current_user)):
    rows = execute_query("SELECT * FROM tasks ORDER BY created_at DESC")
    priority_map = {0: 'urgent', 1: 'high', 2: 'medium', 3: 'low'}
    for r in rows:
        p = r.get('priority')
        if isinstance(p, int):
            r['priority'] = priority_map.get(p, 'medium')
    return rows

@app.post("/api/tasks")
def create_task(task: dict, user: dict = Depends(get_current_user)):
    title = task.get("title", "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="任务标题不能为空")
    
    now = datetime.now()
    task_id = f"task_{now.strftime('%Y%m%d_%H%M%S')}_{now.microsecond // 1000:03d}"
    priority_map = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
    priority = priority_map.get(task.get("priority", "medium"), 2)
    
    execute_write(
        """INSERT INTO tasks (task_id, title, description, agent_id, status, priority, deadline, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (task_id, title, task.get("description", "用户通过管理平台提交的任务"),
         "mission_control", "pending", priority, task.get("deadline"),
         now.isoformat(), now.isoformat())
    )
    return {"task_id": task_id, "status": "pending", "message": f"任务「{title}」已提交给 Mission Control"}

@app.put("/api/tasks/{task_id}")
def update_task(task_id: str, body: dict, user: dict = Depends(get_current_user)):
    fields, values = [], []
    for key in ("title", "description", "status", "priority", "progress", "agent_id", "deadline", "error_message"):
        if key in body:
            fields.append(f"{key} = ?")
            values.append(body[key])
    if not fields:
        raise HTTPException(status_code=400, detail="没有需要更新的字段")
    fields.append("updated_at = ?")
    values.append(datetime.now().isoformat())
    values.append(task_id)
    rows = execute_write(f"UPDATE tasks SET {', '.join(fields)} WHERE task_id = ?", tuple(values))
    if not rows:
        raise HTTPException(status_code=404, detail="任务不存在")
    return {"message": f"任务 {task_id} 已更新"}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, user: dict = Depends(get_current_user)):
    rows = execute_write("DELETE FROM tasks WHERE task_id = ?", (task_id,))
    if not rows:
        raise HTTPException(status_code=404, detail="任务不存在")
    return {"message": f"任务 {task_id} 已删除"}

# ---------- Results ----------
@app.get("/api/results")
def get_results(user: dict = Depends(get_current_user)):
    return execute_query("SELECT * FROM results ORDER BY created_at DESC")

@app.post("/api/results")
def create_result(result: dict, user: dict = Depends(get_current_user)):
    now = datetime.now()
    result_id = f"result_{now.strftime('%Y%m%d_%H%M%S')}_{now.microsecond // 1000:03d}"
    
    agent_id = result.get("agent_id", "mission_control")
    output_type = result.get("output_type", "report")
    title = result.get("title", "未命名产出物")
    content = result.get("content", "")
    extension = result.get("extension", "md")
    
    # 保存内容到文件
    file_path = save_output_to_file(agent_id, output_type, title, content, extension)
    
    # 提取摘要（前200字符）
    content_summary = result.get("content_summary")
    if not content_summary and content:
        content_summary = content[:200] + ("..." if len(content) > 200 else "")
        
    execute_write(
        """INSERT INTO results (result_id, task_id, agent_id, output_type, title, content_summary,
           file_path, quality_score, metadata_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (result_id, result.get("task_id", ""), agent_id, output_type, title, content_summary,
         file_path, result.get("quality_score", 0), json.dumps(result.get("metadata", {})),
         now.isoformat(), now.isoformat())
    )
    return {"result_id": result_id, "file_path": file_path, "message": "产出物已保存"}

# ---------- Hotspots ----------
@app.get("/api/hotspots")
def get_hotspots(user: dict = Depends(get_current_user)):
    return execute_query("SELECT * FROM hotspots ORDER BY total_score DESC, created_at DESC")

@app.post("/api/hotspots")
def create_hotspot(hotspot: dict, user: dict = Depends(get_current_user)):
    now = datetime.now()
    hotspot_id = f"hotspot_{now.strftime('%Y%m%d_%H%M%S')}_{now.microsecond // 1000:03d}"
    execute_write(
        """INSERT INTO hotspots (hotspot_id, title, summary, content, relevance_score, novelty_score,
           practicality_score, audience_interest_score, total_score, discovered_by, discovered_at, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (hotspot_id, hotspot.get("title", ""), hotspot.get("summary", ""), hotspot.get("content"),
         hotspot.get("relevance_score", 0), hotspot.get("novelty_score", 0),
         hotspot.get("practicality_score", 0), hotspot.get("audience_interest_score", 0),
         hotspot.get("total_score", 0), hotspot.get("discovered_by", "hotspot_scout"),
         now.isoformat(), "new", now.isoformat(), now.isoformat())
    )
    return {"hotspot_id": hotspot_id, "message": "热点已创建"}

# ---------- Content (articles) ----------
@app.get("/api/articles")
def get_articles(user: dict = Depends(get_current_user)):
    """查询 content 表，映射字段名适配前端"""
    rows = execute_query("SELECT * FROM content ORDER BY created_at DESC")
    for r in rows:
        r['article_id'] = r.get('content_id', '')
        r['content'] = r.get('content_text', '')
        r['actual_length'] = r.get('word_count', 0)
        r['overall_score'] = r.get('quality_score', 0)
        meta = parse_json(r.get('metadata_json', '{}'))
        r['readability_score'] = meta.get('readability_score', 0)
        r['engagement_score'] = meta.get('engagement_score', 0)
        r['seo_score'] = meta.get('seo_score', 0)
        r['originality_score'] = meta.get('originality_score', 0)
        r['file_path'] = meta.get('file_path', '')
        r['status'] = 'published' if r.get('published_at') else 'draft'
    return rows

@app.post("/api/articles")
def create_article(article: dict, user: dict = Depends(get_current_user)):
    now = datetime.now()
    content_id = f"content_{now.strftime('%Y%m%d_%H%M%S')}_{now.microsecond // 1000:03d}"
    text = article.get("content_text", "")
    title = article.get("title", "未命名文章")
    word_count = len(text)
    
    author = article.get("author", "content_creator")
    file_path = save_output_to_file(author, "article", title, text, "md")
    
    summary = article.get("summary")
    if not summary and text:
        summary = text[:200] + ("..." if len(text) > 200 else "")
        
    metadata = article.get("metadata", {})
    metadata["file_path"] = file_path
    
    execute_write(
        """INSERT INTO content (content_id, title, content_type, content_text, summary, author,
           word_count, read_time, quality_score, metadata_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (content_id, title, article.get("content_type", "article"),
         summary, summary, author,
         word_count, max(1, word_count // 300), article.get("quality_score", 0),
         json.dumps(metadata), now.isoformat(), now.isoformat())
    )
    return {"content_id": content_id, "file_path": file_path, "message": "内容已创建并保存至文件"}

# ---------- Social Posts ----------
@app.get("/api/social-posts")
def get_social_posts(user: dict = Depends(get_current_user)):
    rows = execute_query("SELECT * FROM social_posts ORDER BY created_at DESC")
    for r in rows:
        metrics = parse_json(r.get('engagement_metrics_json', '{}'))
        r['views'] = metrics.get('views', 0)
        r['likes'] = metrics.get('likes', 0)
        r['shares'] = metrics.get('shares', 0)
        r['comments'] = metrics.get('comments', 0)
    return rows

# ---------- Messages ----------
@app.get("/api/messages")
def get_messages(user: dict = Depends(get_current_user)):
    rows = execute_query("SELECT * FROM messages ORDER BY timestamp DESC")
    agents = {a['agent_id']: a['agent_name'] for a in execute_query("SELECT agent_id, agent_name FROM agents")}
    for r in rows:
        sender = r.get('sender', '')
        receiver = r.get('receiver', '')
        r['sender_agent_id'] = sender
        r['sender_agent_name'] = agents.get(sender, sender)
        r['receiver_agent_id'] = receiver
        r['receiver_agent_name'] = agents.get(receiver, receiver)
        r['payload_json'] = parse_json(r.get('content', '{}'))
        r['protocol_version'] = '1.0.0'
        meta = parse_json(r.get('metadata_json', '{}'))
        r['priority'] = meta.get('priority', 'medium')
    return rows

# ---------- System Logs ----------
@app.get("/api/system-logs")
def get_system_logs(user: dict = Depends(get_current_user)):
    rows = execute_query(f"SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT {LOG_QUERY_LIMIT}")
    for r in rows:
        r['level'] = r.get('log_level', 'info')
        details = parse_json(r.get('details_json', '{}'))
        r['agent_id'] = details.get('agent_id', 'system')
    return rows

# ---------- Configurations ----------
@app.get("/api/system-config")
def get_system_config(user: dict = Depends(get_current_user)):
    return execute_query("SELECT * FROM configurations WHERE is_active = 1")

# ---------- Performance Data ----------
@app.get("/api/performance-data")
def get_performance_data(user: dict = Depends(get_current_user)):
    metrics = execute_query(
        "SELECT * FROM performance_metrics ORDER BY recorded_at DESC LIMIT 100"
    )
    if not metrics:
        # 降级为示例数据
        return {
            "labels": ['02-16', '02-17', '02-18', '02-19', '02-20', '02-21', '02-22'],
            "datasets": {
                "taskCompletion": [4, 6, 5, 7, 8, 6, 3],
                "hotspotCount": [2, 3, 1, 4, 2, 3, 1],
                "articleCount": [1, 2, 1, 1, 2, 1, 0],
                "avgResponseTime": [2.1, 1.8, 2.5, 1.9, 2.0, 1.7, 2.2]
            }
        }
    return metrics

# ---------- Templates ----------
@app.get("/api/templates")
def get_templates(user: dict = Depends(get_current_user)):
    rows = execute_query("SELECT * FROM templates ORDER BY updated_at DESC")
    for r in rows:
        r['variables'] = parse_json(r.get('variables_json', '[]'), default=[])
    return rows

# ---------- Notifications ----------
@app.get("/api/notifications")
def get_notifications(user: dict = Depends(get_current_user)):
    return execute_query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50")

# ==================== 启动 ====================

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=RELOAD)
