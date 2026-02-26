"""
Mission Control 后端配置文件
所有可配置项集中管理，便于扩展和环境切换
"""
import os

# ==================== 数据库配置 ====================

# 默认为阿里云生产路径，本地开发自动切换
DB_PATH_DEFAULT = "/home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db"
DB_PATH = os.environ.get("DB_PATH", DB_PATH_DEFAULT)

# 开发环境自动检测本地数据库
_local_db = os.path.join(os.path.dirname(__file__), '..', 'database', 'mission_control.db')
if os.path.exists(_local_db):
    DB_PATH = os.path.abspath(_local_db)

# ==================== JWT 认证配置 ====================

JWT_SECRET = os.environ.get("JWT_SECRET", "mc_platform_secret_key_2026")
JWT_EXPIRE_HOURS = int(os.environ.get("JWT_EXPIRE_HOURS", "24"))

# ==================== CORS 配置 ====================

# 允许的前端域名列表，生产环境建议配置具体域名
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

# ==================== 服务器配置 ====================

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))
RELOAD = os.environ.get("RELOAD", "true").lower() == "true"

# ==================== 应用信息 ====================

APP_TITLE = "Mission Control API"
APP_VERSION = "2.0.0"

# ==================== 日志配置 ====================

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_QUERY_LIMIT = int(os.environ.get("LOG_QUERY_LIMIT", "200"))  # 日志查询默认上限

# ==================== 产出物配置 ====================

OUTPUTS_DIR_DEFAULT = "/home/admin/.openclaw/workspace/projects/mission_control/outputs"
OUTPUTS_DIR = os.environ.get("OUTPUTS_DIR", OUTPUTS_DIR_DEFAULT)

# 开发环境自动检测本地目录
_local_outputs = os.path.join(os.path.dirname(__file__), '..', 'outputs')
if os.path.exists(os.path.dirname(_local_outputs)): # Verify parent directory exists
    OUTPUTS_DIR = os.path.abspath(_local_outputs)
    os.makedirs(OUTPUTS_DIR, exist_ok=True)

