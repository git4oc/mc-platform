# Mission Control 产出物管理规范

## 1. 设计原则

### 1.1 核心原则
1. **约定大于配置**：统一的命名、路径、格式规范
2. **路径记忆在Agent**：文件路径记录在Agent记忆文件，不在数据库
3. **松耦合设计**：数据库记录内容，记忆文件记录路径
4. **可追溯性**：通过多个维度可查找和追溯产出物

### 1.2 重要约定
- ❌ **不存储完整文件路径在数据库**：只存储相对路径或标识
- ✅ **路径记录在Agent记忆文件**：每个Agent维护自己的产出物映射
- ✅ **统一命名规范**：英文蛇形命名，避免中文文件名问题
- ✅ **标准目录结构**：按Agent和产出类型组织目录

## 2. 文件命名规范

### 2.1 命名格式
```
[agent_prefix]_[output_type]_[topic]_[YYYYMMDD]_[seq].[ext]
```

### 2.2 组成部分说明

| 部分 | 说明 | 示例 | 规则 |
|------|------|------|------|
| `agent_prefix` | Agent前缀 | `cc`, `da`, `ts` | 2-3字母缩写 |
| `output_type` | 产出类型 | `article`, `report`, `solution` | 小写英文 |
| `topic` | 主题关键词 | `ai_platform`, `performance` | 蛇形命名，30字符内 |
| `YYYYMMDD` | 创建日期 | `20260224` | 年月日，无分隔符 |
| `seq` | 序列号 | `001`, `002` | 3位数字，从001开始 |
| `ext` | 文件扩展名 | `.md`, `.json` | 根据内容类型 |

### 2.3 Agent前缀映射表

| Agent ID | 前缀 | 说明 |
|----------|------|------|
| `content_creator` | `cc` | 内容创作者 |
| `data_analyst` | `da` | 数据分析师 |
| `tech_specialist` | `ts` | 技术专家 |
| `social_manager` | `sm` | 社交媒体经理 |
| `hotspot_scout` | `hs` | 热点侦察兵 |
| `mission_control` | `mc` | 任务管理器 |

### 2.4 产出类型映射表

| Agent类型 | 产出类型 | 文件扩展名 | 说明 |
|-----------|----------|------------|------|
| `content_creator` | `article` | `.md` | 文章、报告 |
| `content_creator` | `report` | `.md` | 研究报告 |
| `data_analyst` | `analysis` | `.md` | 分析报告 |
| `data_analyst` | `insight` | `.md` | 洞察总结 |
| `tech_specialist` | `solution` | `.md` | 技术方案 |
| `tech_specialist` | `code` | `.js` | 代码文件 |
| `social_manager` | `post` | `.md` | 社交媒体内容 |
| `social_manager` | `plan` | `.md` | 推广计划 |
| `hotspot_scout` | `report` | `.md` | 热点报告 |
| `hotspot_scout` | `alert` | `.md` | 预警通知 |
| `mission_control` | `report` | `.md` | 系统报告 |
| `mission_control` | `status` | `.md` | 状态报告 |

### 2.5 主题关键词规范

#### 转换规则
```
中文标题 → 英文主题关键词
2026年AI代理平台发展趋势深度解析 → ai_platform_trends_2026
中小企业数字化转型指南 → sme_digital_transformation
```

#### 转换函数示例
```javascript
function titleToTopic(title) {
  return title
    // 移除标点符号
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '')
    // 替换空格为下划线
    .replace(/\s+/g, '_')
    // 转换为小写
    .toLowerCase()
    // 限制长度
    .substring(0, 30)
    // 移除末尾下划线
    .replace(/_+$/, '');
}
```

### 2.6 命名示例

#### 正确示例
```
cc_article_ai_platform_20260224_001.md
da_analysis_performance_20260224_001.md
ts_solution_database_20260224_001.md
sm_post_wechat_20260224_001.md
hs_report_digital_20260224_001.md
mc_report_system_20260224_001.md
```

#### 错误示例
```
❌ 2026年AI代理平台发展趋势深度解析.md  # 中文文件名
❌ cc_article_001.md                     # 缺少主题和日期
❌ content_creator_article_2026-02-24.md # 日期格式错误
❌ CC_ARTICLE_AI_PLATFORM.md             # 大写字母
```

## 3. 目录结构规范

### 3.1 整体目录结构
```
/home/admin/.openclaw/workspace/projects/mission_control/
├── outputs/                    # 产出物根目录
│   ├── content_creator/       # 内容创作者产出
│   │   ├── articles/          # 文章
│   │   ├── reports/           # 报告
│   │   └── drafts/            # 草稿
│   ├── data_analyst/          # 数据分析师产出
│   │   ├── reports/           # 分析报告
│   │   ├── insights/          # 洞察总结
│   │   └── data/              # 数据文件
│   ├── tech_specialist/       # 技术专家产出
│   │   ├── solutions/         # 技术方案
│   │   ├── code/              # 代码文件
│   │   └── docs/              # 技术文档
│   ├── social_manager/        # 社交媒体经理产出
│   │   ├── posts/             # 社交媒体内容
│   │   ├── plans/             # 推广计划
│   │   └── metrics/           # 效果指标
│   ├── hotspot_scout/         # 热点侦察兵产出
│   │   ├── reports/           # 热点报告
│   │   ├── alerts/            # 预警通知
│   │   └── trends/            # 趋势分析
│   └── mission_control/       # 任务管理器产出
│       ├── reports/           # 系统报告
│       ├── status/            # 状态报告
│       └── logs/              # 协调日志
├── agents/                    # Agent目录（符号链接到outputs）
│   ├── content_creator/       # → outputs/content_creator/
│   ├── data_analyst/          # → outputs/data_analyst/
│   └── ...                    # 其他Agent
└── design/                    # 设计文档
    └── output-management.md   # 本规范文档
```

### 3.2 目录创建规则
1. **自动创建**：Agent首次保存产出物时自动创建目录
2. **权限设置**：目录权限设置为755，文件权限设置为644
3. **符号链接**：agents目录下的子目录是outputs目录的符号链接
4. **备份目录**：每个产出类型目录下可创建backup子目录

### 3.3 目录管理函数
```javascript
/**
 * 确保产出目录存在
 */
async function ensureOutputDirectory(agentId, outputType) {
  const basePath = '/home/admin/.openclaw/workspace/projects/mission_control/outputs';
  const agentPath = path.join(basePath, agentId);
  const typePath = path.join(agentPath, outputType);
  
  // 创建目录（如果不存在）
  await fs.mkdir(typePath, { recursive: true });
  
  // 设置权限
  await fs.chmod(typePath, 0o755);
  
  return typePath;
}

/**
 * 创建符号链接
 */
async function createSymbolicLink(agentId) {
  const sourcePath = path.join('outputs', agentId);
  const linkPath = path.join('agents', agentId);
  
  // 如果链接已存在，先删除
  try {
    await fs.unlink(linkPath);
  } catch (error) {
    // 链接不存在，继续
  }
  
  // 创建符号链接
  await fs.symlink(sourcePath, linkPath);
}
```

## 4. 文件内容规范

### 4.1 Markdown文件规范

#### 文件头部元数据
```markdown
---
title: "2026年AI代理平台发展趋势深度解析"
author: "content_creator"
agent_id: "content_creator"
task_id: "task_20260224_090000_001"
created_at: "2026-02-24T09:00:00Z"
updated_at: "2026-02-24T09:30:00Z"
quality_score: 85
word_count: 2500
tags: ["AI", "代理平台", "趋势分析", "2026"]
category: "技术趋势"
status: "published"
---

# 2026年AI代理平台发展趋势深度解析

## 摘要
本文深入分析了2026年AI代理平台的发展趋势...

## 正文内容
...
```

#### 内容结构要求
1. **标题**：一级标题（#）为文章标题
2. **摘要**：二级标题（##）摘要，200-500字
3. **正文**：按逻辑分章节，使用二级和三级标题
4. **结论**：文章结尾有总结和展望
5. **参考文献**：如有引用，添加参考文献部分

### 4.2 JSON文件规范

#### 配置文件
```json
{
  "metadata": {
    "version": "1.0.0",
    "created_at": "2026-02-24T09:00:00Z",
    "updated_at": "2026-02-24T09:30:00Z",
    "author": "data_analyst"
  },
  "data": {
    // 实际数据内容
  }
}
```

#### 数据文件
```json
{
  "analysis_id": "analysis_20260224_090000_001",
  "title": "系统性能分析报告",
  "period": "2026-02-17 to 2026-02-24",
  "metrics": {
    "task_completion_rate": 92.5,
    "average_processing_time": 45.2,
    "error_rate": 1.8
  },
  "insights": [
    "任务完成率稳定在90%以上",
    "处理时间有优化空间",
    "错误率控制在2%以内"
  ]
}
```

### 4.3 代码文件规范

#### JavaScript文件
```javascript
/**
 * 数据库工具函数
 * 文件: database_utils.js
 * 作者: tech_specialist
 * 创建时间: 2026-02-24
 * 版本: 1.0.0
 */

/**
 * 连接数据库
 * @param {string} dbPath - 数据库路径
 * @returns {Promise<object>} 数据库连接对象
 */
async function connectDatabase(dbPath) {
  // 函数实现
}

module.exports = {
  connectDatabase
};
```

## 5. 质量要求

### 5.1 内容质量评分标准

| 维度 | 权重 | 评分标准 | 优秀(90-100) | 良好(70-89) | 合格(60-69) | 不合格(<60) |
|------|------|----------|--------------|-------------|-------------|-------------|
| **完整性** | 25% | 内容是否完整 | 全面覆盖主题 | 主要部分完整 | 基本完整 | 缺失重要内容 |
| **准确性** | 25% | 信息是否准确 | 数据精确无误 | 基本准确 | 有小错误 | 有重大错误 |
| **深度** | 20% | 分析是否深入 | 深度洞察 | 有一定深度 | 表面分析 | 过于肤浅 |
| **可读性** | 15% | 是否易于理解 | 清晰易懂 | 基本可读 | 需要改进 | 难以理解 |
| **实用性** | 15% | 是否有实用价值 | 高度实用 | 有一定价值 | 价值有限 | 无实用价值 |

### 5.2 自动质量检查
```javascript
/**
 * 自动质量评分
 */
async function autoQualityCheck(content) {
  const checks = {
    completeness: checkCompleteness(content),    // 完整性检查
    accuracy: checkAccuracy(content),           // 准确性检查
    depth: checkDepth(content),                 // 深度检查
    readability: checkReadability(content),     // 可读性检查
    practicality: checkPracticality(content)    // 实用性检查
  };
  
  // 计算加权分数
  const weights = {
    completeness: 0.25,
    accuracy: 0.25,
    depth: 0.20,
    readability: 0.15,
    practicality: 0.15
  };
  
  let totalScore = 0;
  for (const [dimension, score] of Object.entries(checks)) {
    totalScore += score * weights[dimension];
  }
  
  return {
    score: Math.round(totalScore),
    details: checks,
    passed: totalScore >= 60
  };
}
```

### 5.3 质量改进建议
```javascript
/**
 * 生成质量改进建议
 */
function generateQualitySuggestions(qualityReport) {
  const suggestions = [];
  
  if (qualityReport.details.completeness < 80) {
    suggestions.push({
      dimension: '完整性',
      suggestion: '建议补充相关数据和案例',
      priority: 'high'
    });
  }
  
  if (qualityReport.details.readability < 70) {
    suggestions.push({
      dimension: '可读性',
      suggestion: '建议优化段落结构和语言表达',
      priority: 'medium'
    });
  }
  
  return suggestions;
}
```

## 6. 路径记忆系统

### 6.1 记忆文件结构

#### MEMORY.md 产出物记录部分
```markdown
## 产出物记录

### 今日产出
| 时间 | 任务ID | 产出类型 | 文件路径 | 质量评分 | 状态 |
|------|--------|----------|----------|----------|------|
| 2026-02-24 09:00 | task_20260224_090000_001 | article | outputs/content_creator/articles/cc_article_ai_platform_20260224_001.md | 85 | published |
| 2026-02-24 10:30 | task_20260224_103000_001 | report | outputs/data_analyst/reports/da_analysis_performance_20260224_001.md | 78 | completed |

### 路径映射表
| 数据库记录ID | 产出物标题 | 文件路径 | 创建时间 | 最后访问 |
|--------------|------------|----------|----------|----------|
| content_001 | 2026年AI代理平台发展趋势深度解析 | outputs/content_creator/articles/cc_article_ai_platform_20260224_001.md | 2026-02-24 09:00 | 2026-02-24 09:30 |
| analysis_001 | 系统性能分析报告 | outputs/data_analyst/reports/da_analysis_performance_20260224_001.md | 2026-02-24 10:30 | 2026-02-24 10:35 |
```

### 6.2 路径查找机制

#### 通过记忆文件查找
```javascript
/**
 * 通过任务ID查找产出物路径
 */
async function findOutputByTaskId(agentId, taskId) {
  const memory = await readMemory(agentId);
  
  // 在记忆文件中查找
  const record = memory.outputs.find(item => item.task_id === taskId);
  if (record) {
    return record.file_path;
  }
  
  // 在路径映射表中查找
  const mapping = memory.path_mappings.find(item => item.related_task_id === taskId);
  if (mapping) {
    return mapping.file_path;
  }
  
  return null;
}

/**
 * 通过数据库记录ID查找路径
 */
async function findOutputByDbId(agentId, dbId) {
  const memory = await readMemory(agentId);
  
  const mapping = memory.path_mappings.find(item => item.db_id === dbId);
  return mapping?.file_path;
}
```

#### 通过内容标题查找
```javascript
/**
 * 通过标题关键词查找产出物
 */
async function searchOutputsByTitle(agentId, keyword) {
  const memory = await readMemory(agentId);
  
  return memory.outputs.filter(item => 
    item.title.includes(keyword) || 
    item.file_path.includes(keyword.toLowerCase().replace(/\s+/g, '_'))
  );
}
```

### 6.3 路径验证和修复
```javascript
/**
 * 验证产出物文件完整性
 */
async function validateOutputs(agentId) {
  const memory = await readMemory(agentId);
  const issues = [];
  
  for (const record of memory.outputs) {
    if (record.file_path) {
      const exists = await fileExists(record.file_path);
      if (!exists) {
        issues.push({
          type: 'missing_file',
          record: record,
          severity: 'high'
        });
      } else {
        // 检查文件大小和修改时间
        const stats = await fs.stat(record.file_path);
        if (stats.size === 0) {
          issues.push({
            type: 'empty_file',
            record: record,
            severity: 'medium'
          });
        }
      }
    }
  }
  
  return {
    total: memory.outputs.length,
    valid: memory.outputs.length - issues.length,
    issues: issues
  };
}

/**
 * 修复缺失的文件路径
 */
async function fixMissingOutputs(agentId) {
  const memory = await readMemory(agentId);
  const fixes = [];
  
  for (const record of memory.outputs) {
    if (!record.file_path || !(await fileExists(record.file_path))) {
      // 尝试重新生成路径
      const newPath = await regenerateFilePath(agentId, record);
      if (newPath) {
        record.file_path = newPath;
        fixes.push({
          record_id: record.db_id,
          old_path: record.file_path,
          new_path: newPath
        });
      }
    }
  }
  
  // 保存更新后的记忆文件
  if (fixes.length > 0) {
    await saveMemory(agentId, memory);
  }
  
  return fixes;
}
```

## 7. 备份和归档

### 7.1 备份策略

#### 定期备份
```bash
#!/bin/bash
# backup_outputs.sh

BACKUP_DIR="/home/admin/.openclaw/workspace/projects/mission_control/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "开始备份产出物目录..."

# 1. 创建备份目录
mkdir -p "$BACKUP_DIR/$DATE"

# 2. 备份outputs目录
cp -r outputs "$BACKUP_DIR/$DATE/"

# 3. 备份agents目录（符号链接）
cp -rL agents "$BACKUP_DIR/$DATE/agents_real"

# 4. 备份记忆文件
find agents -name "MEMORY.md" -exec cp --parents {} "$BACKUP_DIR/$DATE/" \;

# 5. 压缩备份
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# 6. 清理临时目录
rm -rf "$BACKUP_DIR/$DATE"

echo "备份完成: $BACKUP_DIR/$DATE.tar.gz"
```

#### 增量备份
```javascript
/**
 * 增量备份产出物
 */
async function incrementalBackup(agentId) {
  const memory = await readMemory(agentId);
  const today = new Date().toISOString().split('T')[0];
  
  // 获取今日新增产出物
  const todayOutputs = memory.outputs.filter(item => 
    item.created_at.startsWith(today)
  );
  
  if (todayOutputs.length === 0) {
    return { backed_up: 0, message: '今日无新增产出物' };
  }
  
  // 备份今日新增文件
  const backupDir = `/backups/${today}/${agentId}`;
  await fs.mkdir(backupDir, { recursive: true });
  
  for (const output of todayOutputs) {
    if (output.file_path) {
      const filename = path.basename(output.file_path);
      await fs.copyFile(output.file_path, path.join(backupDir, filename));
    }
  }
  
  return {
    backed_up: todayOutputs.length,
    backup_dir: backupDir,
    files: todayOutputs.map(o => path.basename(o.file_path))
  };
}
```

### 7.2 归档策略

#### 归档规则
```yaml
归档策略:
  立即归档:
    - 状态为archived的产出物
    - 质量评分低于50的产出物
  
  定期归档:
    - 创建时间超过30天的草稿
    - 创建时间超过90天的已完成产出物
    - 创建时间超过180天的所有产出物
  
  归档位置:
    - /archives/YYYY/MM/[agent_id]/[output_type]/
  
  归档操作:
    - 移动文件到归档目录
    - 更新记忆文件状态为archived
    - 记录归档日志
```

#### 归档脚本
```javascript
/**
 * 自动归档旧产出物
 */
async function autoArchive(agentId, daysThreshold = 90) {
  const memory = await readMemory(agentId);
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
  
  const toArchive = memory.outputs.filter(item => {
    const createdDate = new Date(item.created_at);
    return createdDate < thresholdDate && item.status !== 'archived';
  });
  
  if (toArchive.length === 0) {
    return { archived: 0, message: '无符合条件的产出物' };
  }
  
  const archiveDir = `/archives/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${agentId}`;
  await fs.mkdir(archiveDir, { recursive: true });
  
  for (const item of toArchive) {
    if (item.file_path) {
      const filename = path.basename(item.file_path);
      const archivePath = path.join(archiveDir, filename);
      
      // 移动文件
      await fs.rename(item.file_path, archivePath);
      
      // 更新记忆文件
      item.file_path = archivePath;
      item.status = 'archived';
      item.archived_at = new Date().toISOString();
    }
  }
  
  // 保存更新后的记忆文件
  await saveMemory(agentId, memory);
  
  return {
    archived: toArchive.length,
    archive_dir: archiveDir,
    items: toArchive.map(item => ({
      title: item.title,
      original_path: item.file_path,
      archived_path: path.join(archiveDir, path.basename(item.file_path))
    }))
  };
}
```

## 8. 监控和统计

### 8.1 产出物统计

#### 统计函数
```javascript
/**
 * 统计Agent产出物
 */
async function getOutputStatistics(agentId, period = 'all') {
  const memory = await readMemory(agentId);
  
  let filteredOutputs = memory.outputs;
  if (period !== 'all') {
    const cutoffDate = calculateCutoffDate(period);
    filteredOutputs = memory.outputs.filter(item => 
      new Date(item.created_at) >= cutoffDate
    );
  }
  
  const stats = {
    total: filteredOutputs.length,
    by_type: {},
    by_status: {},
    by_quality: {
      excellent: 0, // 90-100
      good: 0,      // 70-89
      average: 0,   // 60-69
      poor: 0       // <60
    },
    total_words: 0,
    avg_quality: 0
  };
  
  let totalQuality = 0;
  
  for (const item of filteredOutputs) {
    // 按类型统计
    stats.by_type[item.output_type] = (stats.by_type[item.output_type] || 0) + 1;
    
    // 按状态统计
    stats.by_status[item.status] = (stats.by_status[item.status] || 0) + 1;
    
    // 按质量统计
    if (item.quality_score >= 90) stats.by_quality.excellent++;
    else if (item.quality_score >= 70) stats.by_quality.good++;
    else if (item.quality_score >= 60) stats.by_quality.average++;
    else stats.by_quality.poor++;
    
    // 累计字数
    stats.total_words += item.word_count || 0;
    
    // 累计质量分数
    totalQuality += item.quality_score || 0;
  }
  
  // 计算平均质量
  if (filteredOutputs.length > 0) {
    stats.avg_quality = Math.round(totalQuality / filteredOutputs.length);
  }
  
  return stats;
}
```

### 8.2 存储空间监控

#### 空间使用统计
```javascript
/**
 * 监控产出物存储空间
 */
async function monitorStorageUsage() {
  const outputsDir = '/home/admin/.openclaw/workspace/projects/mission_control/outputs';
  const stats = {
    total_size: 0,
    by_agent: {},
    by_type: {},
    file_count: 0,
    last_updated: new Date().toISOString()
  };
  
  // 遍历所有Agent目录
  const agents = await fs.readdir(outputsDir);
  
  for (const agentId of agents) {
    const agentPath = path.join(outputsDir, agentId);
    const agentStats = await getDirectoryStats(agentPath);
    
    stats.by_agent[agentId] = {
      size: agentStats.size,
      file_count: agentStats.fileCount,
      last_modified: agentStats.lastModified
    };
    
    stats.total_size += agentStats.size;
    stats.file_count += agentStats.fileCount;
    
    // 按产出类型统计
    const types = await fs.readdir(agentPath);
    for (const type of types) {
      const typePath = path.join(agentPath, type);
      const typeStats = await getDirectoryStats(typePath);
      
      const key = `${agentId}.${type}`;
      stats.by_type[key] = {
        size: typeStats.size,
        file_count: typeStats.fileCount
      };
    }
  }
  
  // 转换为人类可读格式
  stats.total_size_human = formatBytes(stats.total_size);
  
  return stats;
}

/**
 * 获取目录统计信息
 */
async function getDirectoryStats(dirPath) {
  let totalSize = 0;
  let fileCount = 0;
  let lastModified = 0;
  
  async function traverse(currentPath) {
    const items = await fs.readdir(currentPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(currentPath, item.name);
      
      if (item.isDirectory()) {
        await traverse(itemPath);
      } else if (item.isFile()) {
        const stats = await fs.stat(itemPath);
        totalSize += stats.size;
        fileCount++;
        lastModified = Math.max(lastModified, stats.mtimeMs);
      }
    }
  }
  
  await traverse(dirPath);
  
  return {
    size: totalSize,
    fileCount: fileCount,
    lastModified: new Date(lastModified).toISOString()
  };
}
```

## 9. 实施指南

### 9.1 新产出物创建流程
```
1. Agent接收任务
2. 生成产出物内容
3. 按规范生成文件名
4. 确定存储路径
5. 保存文件到文件系统
6. 更新数据库记录
7. 更新Agent记忆文件
8. 记录工作日志
9. 报告完成状态
```

### 9.2 产出物查找流程
```
1. 确定查找条件（任务ID、标题、日期等）
2. 查询数据库获取记录信息
3. 读取Agent记忆文件查找路径
4. 验证文件是否存在
5. 返回文件内容或路径
```

### 9.3 产出物维护流程
```
1. 定期验证文件完整性
2. 清理过期或低质量产出物
3. 归档旧产出物
4. 备份重要产出物
5. 更新统计信息
```

## 10. 故障排除

### 10.1 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 文件路径不存在 | 记忆文件未更新或文件被移动 | 1. 检查记忆文件 2. 重新生成路径 3. 修复记忆文件 |
| 文件名不符合规范 | 命名函数错误或手动创建 | 1. 使用规范命名函数 2. 重命名文件 3. 更新记忆文件 |
| 文件内容损坏 | 保存过程中断或磁盘错误 | 1. 从备份恢复 2. 重新生成内容 3. 检查磁盘健康 |
| 记忆文件不同步 | 多进程同时更新或更新失败 | 1. 加锁机制 2. 合并更新 3. 重建记忆文件 |
| 存储空间不足 | 产出物过多或未及时归档 | 1. 清理临时文件 2. 归档旧产出物 3. 扩展存储空间 |

### 10.2 诊断工具
```javascript
/**
 * 诊断产出物系统问题
 */
async function diagnoseOutputSystem(agentId) {
  const diagnosis = {
    agent_id: agentId,
    timestamp: new Date().toISOString(),
    checks: {}
  };
  
  // 1. 检查记忆文件
  diagnosis.checks.memory_file = await checkMemoryFile(agentId);
  
  // 2. 检查产出物目录
  diagnosis.checks.output_directory = await checkOutputDirectory(agentId);
  
  // 3. 检查文件完整性
  diagnosis.checks.file_integrity = await checkFileIntegrity(agentId);
  
  // 4. 检查路径映射
  diagnosis.checks.path_mapping = await checkPathMapping(agentId);
  
  // 5. 检查存储空间
  diagnosis.checks.storage_space = await checkStorageSpace(agentId);
  
  // 汇总结果
  diagnosis.summary = {
    passed: Object.values(diagnosis.checks).filter(c => c.passed).length,
    total: Object.keys(diagnosis.checks).length,
    issues: Object.values(diagnosis.checks).filter(c => !c.passed).map(c => c.issue)
  };
  
  return diagnosis;
}
```

---

## 附录

### A. 文件命名示例库
```
cc_article_ai_trends_20260224_001.md
da_report_performance_q1_20260224_001.md
ts_solution_api_optimization_20260224_001.md
sm_post_product_launch_20260224_001.md
hs_alert_market_change_20260224_001.md
mc_status_daily_20260224_001.md
```

### B. 质量评分维度说明
1. **完整性**：是否覆盖主题所有重要方面
2. **准确性**：数据、事实、引用是否准确
3. **深度**：分析是否深入，有无独特见解
4. **可读性**：结构是否清晰，语言是否流畅
5. **实用性**：对读者是否有实际价值

### C. 存储空间计算
```javascript
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
```

### D. 重要提醒
1. **始终使用规范命名**：避免手动创建文件
2. **及时更新记忆文件**：文件保存后立即更新记忆
3. **定期验证完整性**：防止文件丢失或损坏
4. **合理使用归档**：保持产出物目录整洁
5. **备份重要产出物**：防止数据丢失

---

**文档版本**: 1.0.0  
**创建时间**: 2026-02-24 00:20  
**最后更新**: 2026-02-24 00:20  
**负责人**: 极目 (Gemma)  
**状态**: ✅ 已完成