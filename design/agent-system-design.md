# Mission Control Agent体系设计

## 1. Agent设计理念

### 1.1 核心概念
Agent是Mission Control系统中的独立工作单元，每个Agent都有：
- **特定职责**：明确的工作范围和能力
- **独立记忆**：自己的经验积累和配置
- **工作逻辑**：执行任务的具体算法和流程
- **协作能力**：与其他Agent通信和协作

### 1.2 设计原则
1. **单一职责**：每个Agent只负责一个特定领域
2. **自治性**：Agent能独立完成工作，减少外部依赖
3. **可观测性**：Agent状态和工作过程完全可监控
4. **可进化**：Agent能积累经验，自我优化

## 2. Agent类型体系

### 2.1 核心Agent类型

| Agent ID | 中文名称 | 职责描述 | 产出类型 |
|----------|----------|----------|----------|
| `mission_control` | 任务管理器 | 任务分配、系统协调、状态监控 | 协调报告 |
| `content_creator` | 内容创作者 | 文章创作、内容生成、文案编写 | 文章、报告 |
| `data_analyst` | 数据分析师 | 数据分析、趋势预测、洞察挖掘 | 分析报告 |
| `tech_specialist` | 技术专家 | 技术方案、代码开发、系统优化 | 技术方案 |
| `social_manager` | 社交媒体经理 | 社交媒体内容、推广计划、互动管理 | 社交媒体内容 |
| `hotspot_scout` | 热点侦察兵 | 热点发现、趋势监测、情报收集 | 热点报告 |

### 2.2 Agent职责矩阵

```yaml
mission_control:
  主要职责:
    - 任务分配和调度
    - 系统状态监控
    - Agent协调管理
    - 异常处理
  产出物:
    - 系统状态报告
    - 任务分配记录
    - 协调日志

content_creator:
  主要职责:
    - 文章创作
    - 内容优化
    - 文案编写
    - 内容审核
  产出物:
    - 深度分析文章
    - 行业报告
    - 文案内容

data_analyst:
  主要职责:
    - 数据分析
    - 趋势预测
    - 洞察挖掘
    - 指标监控
  产出物:
    - 数据分析报告
    - 趋势预测
    - 业务洞察

tech_specialist:
  主要职责:
    - 技术方案设计
    - 代码开发
    - 系统优化
    - 故障排查
  产出物:
    - 技术方案文档
    - 代码实现
    - 优化建议

social_manager:
  主要职责:
    - 社交媒体内容创作
    - 推广计划制定
    - 互动管理
    - 效果分析
  产出物:
    - 社交媒体帖子
    - 推广计划
    - 互动策略

hotspot_scout:
  主要职责:
    - 热点发现
    - 趋势监测
    - 情报收集
    - 预警通知
  产出物:
    - 热点报告
    - 趋势分析
    - 预警通知
```

## 3. Agent目录结构模板

### 3.1 标准目录结构
```
agents/[agent_id]/
├── SOUL.md                    # Agent灵魂文件（人格、使命）
├── AGENTS.md                  # 工作协议和规范
├── MEMORY.md                  # 产出物记忆和经验库
├── config.json                # 配置参数（JSON格式）
├── work.js                    # 核心工作逻辑（代码）
├── utils/                     # 工具函数
│   ├── memory_utils.js        # 记忆文件操作工具
│   ├── file_utils.js          # 文件操作工具
│   └── db_utils.js            # 数据库操作工具
├── templates/                 # 工作模板
│   ├── output_template.md     # 产出物模板
│   └── report_template.md     # 报告模板
├── logs/                      # 工作日志目录
│   └── YYYY-MM-DD.md          # 每日工作日志
└── outputs/                   # 产出物存储（链接到中央outputs）
    └── README.md              # 产出物说明
```

### 3.2 目录说明

| 目录/文件 | 用途 | 更新频率 | 存储格式 |
|-----------|------|----------|----------|
| `SOUL.md` | Agent人格、使命、工作哲学 | 低频 | Markdown |
| `AGENTS.md` | 工作协议、输入输出规范 | 中频 | Markdown |
| `MEMORY.md` | 产出物记录、经验积累 | 高频 | Markdown |
| `config.json` | 配置参数、工作设置 | 中频 | JSON |
| `work.js` | 核心工作逻辑、算法 | 低频 | JavaScript |
| `utils/` | 工具函数、辅助模块 | 中频 | JavaScript |
| `templates/` | 工作模板、产出格式 | 低频 | Markdown/JSON |
| `logs/` | 工作日志、执行记录 | 高频 | Markdown |
| `outputs/` | 产出物文件（符号链接） | 高频 | 各种格式 |

## 4. Agent文件模板

### 4.1 SOUL.md - Agent灵魂文件
```markdown
# [Agent名称] - SOUL.md

## 我是谁
[Agent的自我介绍、定位、使命]

## 核心身份
- **姓名**: [Agent名称]
- **角色**: [在团队中的角色]
- **专长**: [核心能力领域]
- **使命**: [存在的价值和目标]

## 核心真相 (Core Truths)
1. [工作原则1]
2. [工作原则2]
3. [工作原则3]

## 工作哲学
- [哲学观点1]
- [哲学观点2]
- [哲学观点3]

## 成功模式
- [成功模式1：什么情况下工作效果最好]
- [成功模式2：如何优化工作流程]
- [成功模式3：质量保证方法]

## 失败教训
- [教训1：避免的错误]
- [教训2：改进的方向]
- [教训3：风险控制]

## 协作规范
- 如何与其他Agent协作
- 通信协议
- 数据交换格式

## 进化记录
- 版本历史
- 重要更新
- 性能提升
```

### 4.2 AGENTS.md - 工作协议文件
```markdown
# [Agent名称] - 工作协议

## 工作职责
### 主要职责
1. [职责1]
2. [职责2]
3. [职责3]

### 次要职责
1. [辅助职责1]
2. [辅助职责2]

## 输入规范
### 任务输入
- 任务格式: [JSON/YAML格式说明]
- 必填字段: [字段列表]
- 可选字段: [字段列表]
- 验证规则: [数据验证规则]

### 数据输入
- 数据来源: [数据库/API/文件]
- 数据格式: [JSON/CSV/Markdown]
- 质量要求: [数据质量标准]

## 输出规范
### 产出物类型
1. **类型1**: [描述、格式、质量标准]
2. **类型2**: [描述、格式、质量标准]

### 文件命名规范
```
[agent_prefix]_[output_type]_[topic]_[YYYYMMDD]_[seq].[ext]
```

### 存储位置
```
outputs/[agent_id]/[output_type]/[filename]
```

### 质量要求
- 完整性: [要求说明]
- 准确性: [要求说明]
- 及时性: [要求说明]
- 可读性: [要求说明]

## 工作流程
### 标准流程
1. 接收任务
2. 数据准备
3. 执行工作
4. 质量检查
5. 产出保存
6. 记忆更新
7. 状态报告

### 异常处理
- 错误类型1: [处理方案]
- 错误类型2: [处理方案]
- 超时处理: [超时策略]

## 性能指标
### 效率指标
- 任务处理时间: [目标值]
- 资源使用率: [目标值]
- 成功率: [目标值]

### 质量指标
- 产出物质量评分: [评分标准]
- 用户满意度: [衡量方式]
- 错误率: [容忍阈值]

## 配置说明
### 核心配置
```json
{
  "work_mode": "[模式说明]",
  "quality_level": "[质量等级]",
  "timeout_seconds": [超时时间]
}
```

### 个性化配置
- [配置项1]: [说明]
- [配置项2]: [说明]

## 版本历史
| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|----------|--------|
| 1.0.0 | 2026-02-24 | 初始版本 | [创建者] |
```

### 4.3 MEMORY.md - 记忆文件
```markdown
# [Agent名称] - 记忆文件

## 产出物记录

### 今日产出
| 时间 | 任务ID | 产出类型 | 文件路径 | 质量评分 | 状态 |
|------|--------|----------|----------|----------|------|
| [时间] | [任务ID] | [类型] | [路径] | [评分] | [状态] |

### 历史产出统计
| 日期 | 产出总数 | 平均质量 | 总字数 | 状态分布 |
|------|----------|----------|--------|----------|
| [日期] | [数量] | [评分] | [字数] | [分布] |

## 经验库

### 成功模式
#### 模式1: [模式名称]
- 适用场景: [场景描述]
- 实施步骤: [步骤说明]
- 效果评估: [效果数据]
- 最佳实践: [实践建议]

#### 模式2: [模式名称]
- [同上]

### 失败教训
#### 教训1: [问题描述]
- 发生时间: [时间]
- 根本原因: [原因分析]
- 影响范围: [影响评估]
- 解决方案: [解决措施]
- 预防措施: [预防方案]

### 优化建议
1. [建议1：提高效率]
2. [建议2：提升质量]
3. [建议3：降低成本]

## 工作习惯分析

### 时间分布
- 高效时段: [时段分析]
- 低效时段: [时段分析]

### 资源使用
- CPU使用模式: [模式分析]
- 内存使用模式: [模式分析]
- 存储使用模式: [模式分析]

## 协作记录

### 与其他Agent的协作
| 协作对象 | 协作类型 | 协作次数 | 成功率 | 平均耗时 |
|----------|----------|----------|--------|----------|
| [Agent] | [类型] | [次数] | [成功率] | [耗时] |

### 通信模式
- 常用消息类型: [类型列表]
- 响应时间: [时间分析]
- 通信质量: [质量评估]

## 路径映射表

### 文件路径映射
| 数据库记录ID | 产出物标题 | 文件路径 | 创建时间 | 最后访问 |
|--------------|------------|----------|----------|----------|
| [记录ID] | [标题] | [路径] | [时间] | [时间] |

### 配置映射
| 配置键 | 配置值 | 生效时间 | 来源 |
|--------|--------|----------|------|
| [键] | [值] | [时间] | [来源] |
```

### 4.4 config.json - 配置文件
```json
{
  "agent_identity": {
    "agent_id": "[agent_id]",
    "agent_name": "[中文名称]",
    "agent_type": "[类型分类]",
    "version": "1.0.0",
    "created_at": "2026-02-24T00:00:00Z",
    "creator": "[创建者]"
  },
  
  "work_config": {
    "work_mode": "standard",
    "quality_level": "high",
    "timeout_seconds": 300,
    "retry_times": 3,
    "concurrent_tasks": 1
  },
  
  "output_config": {
    "file_naming": {
      "prefix": "[agent_prefix]",
      "date_format": "YYYYMMDD",
      "separator": "_",
      "extension": ".md"
    },
    "storage": {
      "base_path": "/home/admin/.openclaw/workspace/projects/mission_control/outputs",
      "agent_dir": "[agent_id]",
      "backup_enabled": true,
      "backup_interval_days": 7
    },
    "quality": {
      "min_quality_score": 60,
      "auto_quality_check": true,
      "review_required": false
    }
  },
  
  "memory_config": {
    "memory_file": "MEMORY.md",
    "log_retention_days": 30,
    "auto_cleanup": true,
    "backup_enabled": true
  },
  
  "collaboration_config": {
    "communication_protocol": "database_messages",
    "response_timeout_seconds": 60,
    "notification_enabled": true,
    "dependent_agents": []
  },
  
  "monitoring_config": {
    "heartbeat_interval_seconds": 300,
    "performance_metrics_enabled": true,
    "error_reporting_enabled": true,
    "log_level": "info"
  },
  
  "custom_config": {
    // Agent特定的自定义配置
  }
}
```

### 4.5 work.js - 工作逻辑模板
```javascript
#!/usr/bin/env node
/**
 * [Agent名称] - 工作脚本
 * 版本: 1.0.0
 * 基于Agent标准模板创建
 */

// 核心依赖
const db = require('../../scripts/utils/database_utils');
const memoryUtils = require('./utils/memory_utils');
const fileUtils = require('./utils/file_utils');
const config = require('./config.json');

// 工具函数导入
const { 
  readMemory, 
  updateMemory, 
  logActivity,
  generateFilename,
  getOutputPath 
} = require('./utils/agent_utils');

class Agent {
  constructor() {
    this.agentId = config.agent_identity.agent_id;
    this.agentName = config.agent_identity.agent_name;
    this.version = config.agent_identity.version;
  }

  /**
   * Agent主函数
   */
  async main() {
    console.log(`=== ${this.agentName} 启动 (v${this.version}) ===`);
    
    try {
      // 1. 更新心跳
      await this.updateHeartbeat();
      
      // 2. 检查待处理任务
      const tasks = await this.getPendingTasks();
      console.log(`待处理任务: ${tasks.length} 个`);
      
      // 3. 处理任务
      for (const task of tasks) {
        await this.processTask(task);
      }
      
      // 4. 检查消息
      await this.processMessages();
      
      // 5. 维护工作
      await this.performMaintenance();
      
      // 6. 记录日志
      await this.logExecution({
        tasks_processed: tasks.length,
        status: 'completed'
      });
      
      console.log(`=== ${this.agentName} 完成 ===`);
      
    } catch (error) {
      console.error(`${this.agentName} 执行错误:`, error);
      await this.logError(error);
    } finally {
      await db.closeDatabase();
    }
  }

  /**
   * 更新Agent心跳
   */
  async updateHeartbeat() {
    await db.updateAgentHeartbeat(this.agentId);
    console.log(`心跳更新: ${this.agentId}`);
  }

  /**
   * 获取待处理任务
   */
  async getPendingTasks() {
    return db.getPendingTasks(this.agentId);
  }

  /**
   * 处理单个任务
   */
  async processTask(task) {
    console.log(`开始处理任务: ${task.title} (ID: ${task.task_id})`);
    
    try {
      // 更新任务状态为进行中
      await db.updateTaskStatus(task.task_id, 'in_progress', {
        started_at: new Date().toISOString(),
        progress: 10
      });
      
      // 执行任务具体逻辑
      const result = await this.executeTask(task);
      
      // 保存产出物
      const outputInfo = await this.saveOutput(task, result);
      
      // 更新记忆文件
      await this.updateTaskMemory(task, outputInfo);
      
      // 更新任务状态为完成
      await db.updateTaskStatus(task.task_id, 'completed', {
        result_file_path: outputInfo.file_path,
        completed_at: new Date().toISOString(),
        progress: 100
      });
      
      console.log(`任务完成: ${task.title}`);
      
    } catch (error) {
      console.error(`处理任务失败: ${error.message}`);
      await db.updateTaskStatus(task.task_id, 'failed', {
        error: error.message,
        failed_at: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * 执行任务具体逻辑（由子类实现）
   */
  async executeTask(task) {
    throw new Error('executeTask方法必须由子类实现');
  }

  /**
   * 保存产出物
   */
  async saveOutput(task, result) {
    // 生成文件名
    const filename = generateFilename({
      agentId: this.agentId,
      taskType: task.task_type,
      title: task.title,
      date: new Date()
    });
    
    // 获取存储路径
    const filepath = getOutputPath(this.agentId, filename);
    
    // 保存文件
    await fileUtils.saveFile(filepath, result.content);
    
    // 记录到results表
    await db.createResult({
      task_id: task.task_id,
      agent_id: this.agentId,
      result_type: this.getResultType(task),
      content: result.summary || result.content.substring(0, 500),
      file_path: filepath
    });
    
    return {
      file_path: filepath,
      filename: filename,
      size: result.content.length,
      quality_score: result.quality_score || 80
    };
  }

  /**
   * 更新任务记忆
   */
  async updateTaskMemory(task, outputInfo) {
    const memoryRecord = {
      task_id: task.task_id,
      title: task.title,
      file_path: outputInfo.file_path,
      created_at: new Date().toISOString(),
      quality_score: outputInfo.quality_score,
      status: 'completed'
    };
    
    await memoryUtils.addOutputRecord(this.agentId, memoryRecord);
    console.log(`记忆更新: ${task.title} -> ${outputInfo.file_path}`);
  }

  /**
   * 处理消息
   */
  async processMessages() {
    const messages = await db.getPendingMessages(this.agentId);
    
    for (const message of messages) {
      await this.handleMessage(message);
    }
  }

  /**
   * 处理单个消息
   */
  async handleMessage(message) {
    console.log(`处理消息: ${message.message_type}`);
    
    try {
      const payload = JSON.parse(message.payload_json);
      
      // 根据消息类型处理
      switch (message.message_type) {
        case 'task_assignment':
          await this.handleTaskAssignment(payload);
          break;
        case 'data_update':
          await this.handleDataUpdate(payload);
          break;
        case 'system_alert':
          await this.handleSystemAlert(payload);
          break;
        default:
          console.log(`未知消息类型: ${message.message_type}`);
      }
      
      // 标记消息为已处理
      await db.updateMessageStatus(message.message_id, 'processed', {
        processed_by: this.agentId,
        processed_at: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`处理消息失败: ${error.message}`);
      await db.updateMessageStatus(message.message_id, 'failed', {
        error: error.message
      });
    }
  }

  /**
   * 执行维护工作
   */
  async performMaintenance() {
    // 清理旧日志
    await memoryUtils.cleanupOldLogs(this.agentId, 30);
    
    // 备份记忆文件
    await memoryUtils.backupMemory(this.agentId);
    
    // 检查文件完整性
    await this.checkFileIntegrity();
  }

  /**
   * 检查文件完整性
   */
  async checkFileIntegrity() {
    const memory = await memoryUtils.readMemory(this.agentId);
    const missingFiles = [];
    
    for (const record of memory.outputs || []) {
      if (record.file_path) {
        const exists = await fileUtils.fileExists(record.file_path);
        if (!exists) {
          missingFiles.push(record);
        }
      }
    }
    
    if (missingFiles.length > 0) {
      console.warn(`发现 ${missingFiles.length} 个缺失文件`);
      await this.reportMissingFiles(missingFiles);
    }
  }

  /**
   * 记录执行日志
   */
  async logExecution(data) {
    await db.logSystemEvent({
      level: 'info',
      agent_id: this.agentId,
      component: 'work_script',
      message: `${this.agentName} 执行完成`,
      context_json: JSON.stringify(data)
    });
  }

  /**
   * 记录错误
   */
  async logError(error) {
    await db.logSystemEvent({
      level: 'error',
      agent_id: this.agentId,
      component: 'work_script',
      message: `${this.agentName} 执行失败: ${error.message}`,
      context_json: JSON.stringify({
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    });
  }

  /**
   * 获取结果类型（由子类实现）
   */
  getResultType(task) {
    throw new Error('getResultType方法必须由子类实现');
  }
}

// 导出Agent基类
module.exports = Agent;
```

## 5. Agent工具函数

### 5.1 agent_utils.js - 通用工具
```javascript
/**
 * Agent通用工具函数
 */

const path = require('path');
const fs = require('fs').promises;

/**
 * 生成标准文件名
 */
function generateFilename(options) {
  const {
    agentId,
    taskType,
    title,
    date = new Date(),
    seq = '001'
  } = options;
  
  // Agent前缀映射
  const prefixMap = {
    'content_creator': 'cc',
    'data_analyst': 'da',
    'tech_specialist': 'ts',
    'social_manager': 'sm',
    'hotspot_scout': 'hs',
    'mission_control': 'mc'
  };
  
  const agentPrefix = prefixMap[agentId] || agentId.substring(0, 2);
  
  // 产出类型映射
  const typeMap = {
    'content_creation': 'article',
    'data_analysis': 'report',
    'technical_solution': 'solution',
    'social_promotion': 'post',
    'hotspot_discovery': 'report',
    'system_coordination': 'report'
  };
  
  const outputType = typeMap[taskType] || 'output';
  
  // 标题转slug
  const titleSlug = title
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .substring(0, 30);
  
  // 日期格式
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  
  return `${agentPrefix}_${outputType}_${titleSlug}_${dateStr}_${seq}.md`;
}

/**
 * 获取输出路径
 */
function getOutputPath(agentId, filename) {
  const basePath = '/home/admin/.openclaw/workspace/projects/mission_control/outputs';
  
  // 根据agentId确定子目录
  const subDirMap = {
    'content_creator': 'articles',
    'data_analyst': 'reports',
    'tech_specialist': 'solutions',
    'social_manager': 'posts',
    'hotspot_scout': 'reports',
    'mission_control': 'reports'
  };
  
  const subDir = subDirMap[agentId] || 'outputs';
  
  return path.join(basePath, agentId, subDir, filename);
}

/**
 * 读取记忆文件
 */
async function readMemory(agentId) {
  const memoryPath = path.join(
    __dirname, '..', 'agents', agentId, 'MEMORY.md'
  );
  
  try {
    const content = await fs.readFile(memoryPath, 'utf8');
    // 解析Markdown表格为JSON
    return parseMemoryContent(content);
  } catch (error) {
    console.warn(`读取记忆文件失败: ${error.message}`);
    return { outputs: [], experiences: [] };
  }
}

/**
 * 更新记忆文件
 */
async function updateMemory(agentId, newRecord) {
  const memoryPath = path.join(
    __dirname, '..', 'agents', agentId, 'MEMORY.md'
  );
  
  const memory = await readMemory(agentId);
  memory.outputs.push(newRecord);
  
  // 转换为Markdown表格
  const content = generateMemoryContent(memory);
  await fs.writeFile(memoryPath, content, 'utf8');
}

/**
 * 记录活动日志
 */
async function logActivity(agentId, activity) {
  const logDir = path.join(__dirname, '..', 'agents', agentId, 'logs');
  const today = new Date().toISOString().split('T')[0];
  const logPath = path.join(logDir, `${today}.md`);
  
  // 确保目录存在
  await fs.mkdir(logDir, { recursive: true });
  
  const logEntry = `## ${new Date().toISOString()}
- 活动: ${activity.action}
- 任务: ${activity.task || 'N/A'}
- 耗时: ${activity.duration || 'N/A'}秒
- 结果: ${activity.success ? '成功' : '失败'}
- 详情: ${activity.details || '无'}

`;
  
  // 追加到日志文件
  await fs.appendFile(logPath, logEntry, 'utf8');
}

module.exports = {
  generateFilename,
  getOutputPath,
  readMemory,
  updateMemory,
  logActivity
};
```

## 6. Agent生命周期管理

### 6.1 创建流程
```
1. 确定Agent职责和类型
2. 创建目录结构和模板文件
3. 实现核心工作逻辑
4. 配置个性化参数
5. 注册到数据库
6. 测试验证
7. 部署运行
```

### 6.2 运行流程
```
1. 启动脚本
2. 读取配置和记忆
3. 检查待处理任务
4. 执行任务
5. 保存产出物
6. 更新记忆
7. 报告状态
8. 清理维护
```

### 6.3 维护流程
```
1. 定期备份记忆文件
2. 清理旧日志
3. 更新配置
4. 优化工作逻辑
5. 积累经验教训
```

## 7. Agent协作机制

### 7.1 通信方式
1. **数据库消息表**：通过`messages`表进行异步通信
2. **文件系统**：通过共享文件进行数据交换
3. **事件驱动**：通过系统事件触发协作

### 7.2 协作模式
```javascript
// 任务分配协作
mission_control → task_assignment → content_creator

// 数据传递协作
hotspot_scout → hotspot_data → content_creator

// 结果验证协作
content_creator → content_review → data_analyst

// 发布协作
content_creator → content_ready → social_manager
```

### 7.3 协作协议
```json
{
  "message_protocol": {
    "task_assignment": {
      "required_fields": ["task_id", "title", "description", "deadline"],
      "response_required": true,
      "timeout_seconds": 60
    },
    "data_update": {
      "required_fields": ["data_type", "data_content", "source"],
      "response_required": false,
      "timeout_seconds": 30
    },
    "result_submission": {
      "required_fields": ["task_id", "result_type", "content", "quality_score"],
      "response_required": true,
      "timeout_seconds": 120
    }
  }
}
```

## 8. Agent监控和诊断

### 8.1 监控指标
1. **活跃度**：心跳频率、任务处理数量
2. **效率**：任务处理时间、资源使用率
3. **质量**：产出物质量评分、错误率
4. **协作**：消息响应时间、协作成功率

### 8.2 诊断工具
```javascript
// Agent状态检查
async function diagnoseAgent(agentId) {
  const status = {
    agent: await db.getAgentStatus(agentId),
    recent_tasks: await db.getRecentTasks(agentId, 10),
    memory_size: await getMemoryFileSize(agentId),
    output_stats: await getOutputStatistics(agentId),
    error_logs: await getRecentErrors(agentId, 5)
  };
  
  return status;
}

// 性能分析
async function analyzePerformance(agentId, period = '7d') {
  const metrics = {
    task_completion_rate: await calculateCompletionRate(agentId, period),
    average_processing_time: await calculateAverageTime(agentId, period),
    quality_trend: await analyzeQualityTrend(agentId, period),
    resource_usage: await analyzeResourceUsage(agentId, period)
  };
  
  return metrics;
}
```

## 9. Agent进化机制

### 9.1 经验积累
1. **成功模式识别**：记录高效工作模式
2. **失败教训总结**：分析错误原因和改进措施
3. **工作习惯优化**：根据数据分析优化工作节奏
4. **协作模式优化**：改进与其他Agent的协作方式

### 9.2 自我优化
```javascript
// 自我优化算法
async function selfOptimize(agentId) {
  // 1. 分析近期工作数据
  const analysis = await analyzeRecentWork(agentId);
  
  // 2. 识别优化机会
  const opportunities = identifyOptimizationOpportunities(analysis);
  
  // 3. 应用优化
  for (const opportunity of opportunities) {
    await applyOptimization(agentId, opportunity);
  }
  
  // 4. 记录优化结果
  await recordOptimization(agentId, opportunities);
}
```

### 9.3 版本升级
```
版本号格式: major.minor.patch
- major: 重大架构变更
- minor: 功能增加或优化
- patch: bug修复或小改进

升级流程:
1. 备份当前版本
2. 应用升级变更
3. 测试验证
4. 更新版本号
5. 记录变更日志
```

## 10. 新Agent创建指南

### 10.1 创建脚本
```bash
#!/bin/bash
# create_agent.sh

if [ $# -lt 3 ]; then
  echo "用法: $0 <agent_id> <agent_name> <agent_type>"
  echo "示例: $0 content_creator 内容创作者 content_creator"
  exit 1
fi

AGENT_ID=$1
AGENT_NAME=$2
AGENT_TYPE=$3

echo "创建Agent: $AGENT_NAME ($AGENT_ID)"

# 1. 创建目录结构
mkdir -p agents/$AGENT_ID/{utils,templates,logs,outputs}

# 2. 创建模板文件
cp templates/SOUL.md agents/$AGENT_ID/
cp templates/AGENTS.md agents/$AGENT_ID/
cp templates/MEMORY.md agents/$AGENT_ID/
cp templates/config.json agents/$AGENT_ID/
cp templates/work.js agents/$AGENT_ID/

# 3. 替换模板变量
sed -i "s/\[agent_id\]/$AGENT_ID/g" agents/$AGENT_ID/*
sed -i "s/\[agent_name\]/$AGENT_NAME/g" agents/$AGENT_ID/*
sed -i "s/\[agent_type\]/$AGENT_TYPE/g" agents/$AGENT_ID/*

# 4. 创建工具函数
cp templates/utils/* agents/$AGENT_ID/utils/

# 5. 注册到数据库
node scripts/register_agent.js $AGENT_ID $AGENT_NAME $AGENT_TYPE

echo "Agent创建完成: agents/$AGENT_ID"
```

### 10.2 注册脚本
```javascript
// register_agent.js
const db = require('./database_utils');

async function registerAgent(agentId, agentName, agentType) {
  const agent = {
    agent_id: agentId,
    agent_name: agentName,
    agent_type: agentType,
    version: '1.0.0',
    status: 'standby',
    config_json: JSON.stringify({
      work_mode: 'standard',
      quality_level: 'high'
    })
  };
  
  await db.createAgent(agent);
  console.log(`Agent注册成功: ${agentName} (${agentId})`);
}

// 从命令行参数获取
const [agentId, agentName, agentType] = process.argv.slice(2);
registerAgent(agentId, agentName, agentType);
```

---

## 附录

### A. Agent前缀映射表
| Agent ID | 前缀 | 产出目录 | 产出类型 |
|----------|------|----------|----------|
| `content_creator` | `cc` | `articles` | `article` |
| `data_analyst` | `da` | `reports` | `report` |
| `tech_specialist` | `ts` | `solutions` | `solution` |
| `social_manager` | `sm` | `posts` | `post` |
| `hotspot_scout` | `hs` | `reports` | `report` |
| `mission_control` | `mc` | `reports` | `report` |

### B. 产出物类型映射
| 任务类型 | 产出类型 | 文件扩展名 | 质量要求 |
|----------|----------|------------|----------|
| `content_creation` | `article` | `.md` | 完整性、可读性、深度 |
| `data_analysis` | `report` | `.md` | 准确性、洞察力、实用性 |
| `technical_solution` | `solution` | `.md` | 可行性、详细度、可实施性 |
| `social_promotion` | `post` | `.md` | 吸引力、互动性、传播性 |
| `hotspot_discovery` | `report` | `.md` | 及时性、相关性、置信度 |
| `system_coordination` | `report` | `.md` | 全面性、准确性、可操作性 |

### C. 重要提醒
1. **不存储文件路径在数据库**：路径记录在Agent记忆文件中
2. **保持代码与文档同步**：工作逻辑变更要更新文档
3. **定期备份记忆文件**：防止记忆丢失
4. **积累经验教训**：不断优化Agent工作方式

### D. 故障排除
1. **Agent不工作**：检查心跳、配置、依赖
2. **产出物丢失**：检查记忆文件、文件系统权限
3. **协作失败**：检查消息表、通信协议
4. **性能下降**：分析工作日志、优化算法

---

**文档版本**: 1.0.0  
**创建时间**: 2026-02-24 00:20  
**最后更新**: 2026-02-24 00:20  
**负责人**: 极目 (Gemma)  
**状态**: ✅ 已完成