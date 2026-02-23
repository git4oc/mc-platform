#!/usr/bin/env node
/**
 * Mission Control 数据库迁移脚本
 * 从旧数据库迁移数据到新数据库结构
 * 版本: 1.0.0
 * 创建时间: 2026-02-21
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 数据库路径
const OLD_DB_PATH = '/home/admin/.openclaw/workspace/mission_control.db';
const NEW_DB_PATH = '/home/admin/.openclaw/workspace/projects/mission_control/database/mission_control.db';

// 备份路径
const BACKUP_DIR = '/home/admin/.openclaw/workspace/projects/mission_control/database/migrations/backups/';

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 日志函数
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`[${timestamp}] [${level}] ${message}`);

  // 同时写入日志文件
  const logFile = path.join(BACKUP_DIR, `migration_${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, `[${timestamp}] [${level}] ${message}\n`);
}

// 备份旧数据库
function backupOldDatabase() {
  const backupFile = path.join(BACKUP_DIR, `mission_control_old_${new Date().toISOString().replace(/[:.]/g, '-')}.db`);

  try {
    if (fs.existsSync(OLD_DB_PATH)) {
      fs.copyFileSync(OLD_DB_PATH, backupFile);
      log(`旧数据库已备份到: ${backupFile}`, 'INFO');
      return backupFile;
    } else {
      log('旧数据库文件不存在，跳过备份', 'WARNING');
      return null;
    }
  } catch (error) {
    log(`备份失败: ${error.message}`, 'ERROR');
    return null;
  }
}

// 检查旧数据库表结构
function checkOldDatabaseStructure(oldDb) {
  return new Promise((resolve, reject) => {
    oldDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        reject(err);
        return;
      }

      const tableNames = tables.map(t => t.name);
      log(`旧数据库表: ${tableNames.join(', ')}`, 'INFO');

      // 检查关键表是否存在
      const requiredTables = ['documents', 'tasks', 'agents', 'messages'];
      const missingTables = requiredTables.filter(table => !tableNames.includes(table));

      if (missingTables.length > 0) {
        log(`缺少关键表: ${missingTables.join(', ')}`, 'WARNING');
      }

      resolve(tableNames);
    });
  });
}

// 迁移文档数据
function migrateDocuments(oldDb, newDb) {
  return new Promise((resolve, reject) => {
    log('开始迁移文档数据...', 'INFO');

    // 检查旧表结构
    oldDb.all("PRAGMA table_info(documents)", (err, columns) => {
      if (err) {
        log(`无法获取文档表结构: ${err.message}`, 'ERROR');
        resolve(0); // 跳过此表
        return;
      }

      const columnNames = columns.map(c => c.name);
      log(`文档表列: ${columnNames.join(', ')}`, 'INFO');

      // 读取所有文档
      oldDb.all("SELECT * FROM documents", (err, documents) => {
        if (err) {
          log(`读取文档失败: ${err.message}`, 'ERROR');
          resolve(0);
          return;
        }

        log(`找到 ${documents.length} 个文档`, 'INFO');

        if (documents.length === 0) {
          resolve(0);
          return;
        }

        // 准备插入语句
        const insertStmt = newDb.prepare(`
          INSERT OR IGNORE INTO articles (
            article_id, title, content, author, content_type, 
            status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let migratedCount = 0;
        let skippedCount = 0;

        // 迁移每个文档
        documents.forEach((doc, index) => {
          try {
            // 生成新的文章ID
            const articleId = `article_${doc.id || `old_${index + 1}`}`;

            // 确定内容类型
            let contentType = 'other';
            if (doc.category) {
              const categoryMap = {
                'report': 'industry_analysis',
                'article': 'industry_analysis',
                'plan': 'how_to_guide',
                'framework': 'how_to_guide',
                'solution': 'case_study',
                'status': 'trend_report'
              };
              contentType = categoryMap[doc.category] || 'other';
            }

            // 插入数据
            insertStmt.run(
              articleId,
              doc.title || `文档 ${index + 1}`,
              doc.content || '',
              'content_creator',
              contentType,
              'published',
              doc.created_at || new Date().toISOString(),
              doc.updated_at || new Date().toISOString()
            );

            migratedCount++;

            if (index % 10 === 0) {
              log(`已迁移 ${index + 1}/${documents.length} 个文档`, 'INFO');
            }
          } catch (error) {
            log(`迁移文档 ${index + 1} 失败: ${error.message}`, 'ERROR');
            skippedCount++;
          }
        });

        insertStmt.finalize();
        log(`文档迁移完成: ${migratedCount} 个成功, ${skippedCount} 个跳过`, 'INFO');
        resolve(migratedCount);
      });
    });
  });
}

// 迁移任务数据
function migrateTasks(oldDb, newDb) {
  return new Promise((resolve, reject) => {
    log('开始迁移任务数据...', 'INFO');

    // 检查旧表结构
    oldDb.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%task%'", (err, tables) => {
      if (err) {
        log(`检查任务表失败: ${err.message}`, 'ERROR');
        resolve(0);
        return;
      }

      if (tables.length === 0) {
        log('未找到任务表，跳过迁移', 'INFO');
        resolve(0);
        return;
      }

      const taskTable = tables[0].name;
      log(`找到任务表: ${taskTable}`, 'INFO');

      oldDb.all(`SELECT * FROM ${taskTable}`, (err, tasks) => {
        if (err) {
          log(`读取任务失败: ${err.message}`, 'ERROR');
          resolve(0);
          return;
        }

        log(`找到 ${tasks.length} 个任务`, 'INFO');

        if (tasks.length === 0) {
          resolve(0);
          return;
        }

        // 准备插入语句
        const insertStmt = newDb.prepare(`
          INSERT OR IGNORE INTO tasks (
            task_id, task_type, title, assigned_to, assigned_by,
            status, priority, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let migratedCount = 0;

        tasks.forEach((task, index) => {
          try {
            // 生成新的任务ID
            const taskId = task.task_id || `task_old_${index + 1}`;

            // 确定任务类型
            let taskType = 'general';
            if (task.title && task.title.includes('热点')) {
              taskType = 'hotspot_discovery';
            } else if (task.title && task.title.includes('文章')) {
              taskType = 'content_creation';
            } else if (task.title && task.title.includes('推广')) {
              taskType = 'social_promotion';
            }

            // 确定分配对象
            let assignedTo = 'mission_control';
            if (task.assigned_to) {
              assignedTo = task.assigned_to;
            }

            // 插入数据
            insertStmt.run(
              taskId,
              taskType,
              task.title || `任务 ${index + 1}`,
              assignedTo,
              'mission_control',
              task.status || 'completed',
              task.priority || 'medium',
              task.created_at || new Date().toISOString(),
              task.updated_at || new Date().toISOString()
            );

            migratedCount++;
          } catch (error) {
            log(`迁移任务 ${index + 1} 失败: ${error.message}`, 'ERROR');
          }
        });

        insertStmt.finalize();
        log(`任务迁移完成: ${migratedCount} 个成功`, 'INFO');
        resolve(migratedCount);
      });
    });
  });
}

// 迁移消息数据
function migrateMessages(oldDb, newDb) {
  return new Promise((resolve, reject) => {
    log('开始迁移消息数据...', 'INFO');

    // 检查旧表结构
    oldDb.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%message%'", (err, tables) => {
      if (err) {
        log(`检查消息表失败: ${err.message}`, 'ERROR');
        resolve(0);
        return;
      }

      if (tables.length === 0) {
        log('未找到消息表，跳过迁移', 'INFO');
        resolve(0);
        return;
      }

      const messageTable = tables[0].name;
      log(`找到消息表: ${messageTable}`, 'INFO');

      oldDb.all(`SELECT * FROM ${messageTable} LIMIT 100`, (err, messages) => {
        if (err) {
          log(`读取消息失败: ${err.message}`, 'ERROR');
          resolve(0);
          return;
        }

        log(`找到 ${messages.length} 个消息 (限制100条)`, 'INFO');

        if (messages.length === 0) {
          resolve(0);
          return;
        }

        // 准备插入语句
        const insertStmt = newDb.prepare(`
          INSERT OR IGNORE INTO messages (
            message_id, timestamp, sender_agent_id, sender_agent_name,
            receiver_agent_id, receiver_agent_name, message_type,
            priority, payload_json, metadata_json, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let migratedCount = 0;

        messages.forEach((msg, index) => {
          try {
            // 生成新的消息ID
            const messageId = msg.message_id || `msg_old_${index + 1}`;

            // 确定发送方和接收方
            let senderAgentId = 'unknown';
            let senderAgentName = '未知';
            let receiverAgentId = 'mission_control';
            let receiverAgentName = '任务管理器';

            if (msg.sender) {
              senderAgentId = msg.sender;
              senderAgentName = msg.sender === 'mission_control' ? '任务管理器' :
                msg.sender === 'hotspot_scout' ? '热点侦察兵' :
                  msg.sender === 'content_creator' ? '内容创作者' :
                    msg.sender === 'social_manager' ? '社交媒体经理' :
                      msg.sender === 'tech_specialist' ? '技术专家' :
                        msg.sender === 'data_analyst' ? '数据分析师' : '未知';
            }

            // 确定消息类型
            let messageType = 'general';
            if (msg.message_type) {
              messageType = msg.message_type;
            } else if (msg.content && msg.content.includes('任务')) {
              messageType = 'task_assignment';
            } else if (msg.content && msg.content.includes('完成')) {
              messageType = 'task_completion';
            }

            // 创建payload和metadata
            const payload = {
              content: msg.content || '',
              original_id: msg.id,
              timestamp: msg.timestamp || new Date().toISOString()
            };

            const metadata = {
              migrated: true,
              original_table: messageTable,
              migration_timestamp: new Date().toISOString()
            };

            // 插入数据
            insertStmt.run(
              messageId,
              msg.timestamp || new Date().toISOString(),
              senderAgentId,
              senderAgentName,
              receiverAgentId,
              receiverAgentName,
              messageType,
              msg.priority || 'medium',
              JSON.stringify(payload),
              JSON.stringify(metadata),
              msg.status || 'processed',
              msg.created_at || new Date().toISOString()
            );

            migratedCount++;
          } catch (error) {
            log(`迁移消息 ${index + 1} 失败: ${error.message}`, 'ERROR');
          }
        });

        insertStmt.finalize();
        log(`消息迁移完成: ${migratedCount} 个成功`, 'INFO');
        resolve(migratedCount);
      });
    });
  });
}

// 迁移系统日志
function migrateSystemLogs(oldDb, newDb) {
  return new Promise((resolve, reject) => {
    log('开始迁移系统日志...', 'INFO');

    // 检查旧表结构
    oldDb.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%log%'", (err, tables) => {
      if (err) {
        log(`检查日志表失败: ${err.message}`, 'ERROR');
        resolve(0);
        return;
      }

      if (tables.length === 0) {
        log('未找到日志表，跳过迁移', 'INFO');
        resolve(0);
        return;
      }

      const logTable = tables[0].name;
      log(`找到日志表: ${logTable}`, 'INFO');

      oldDb.all(`SELECT * FROM ${logTable} LIMIT 50`, (err, logs) => {
        if (err) {
          log(`读取日志失败: ${err.message}`, 'ERROR');
          resolve(0);
          return;
        }

        log(`找到 ${logs.length} 个日志 (限制50条)`, 'INFO');

        if (logs.length === 0) {
          resolve(0);
          return;
        }

        // 准备插入语句
        const insertStmt = newDb.prepare(`
          INSERT OR IGNORE INTO system_logs (
            log_id, timestamp, level, agent_id, component,
            message, context_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let migratedCount = 0;

        logs.forEach((logEntry, index) => {
          try {
            // 生成新的日志ID
            const logId = logEntry.log_id || `log_old_${index + 1}`;

            // 确定日志级别
            let level = 'info';
            if (logEntry.level) {
              level = logEntry.level.toLowerCase();
            } else if (logEntry.message && (logEntry.message.includes('错误') || logEntry.message.includes('失败'))) {
              level = 'error';
            } else if (logEntry.message && logEntry.message.includes('警告')) {
              level = 'warning';
            }

            // 创建上下文
            const context = {
              migrated: true,
              original_table: logTable,
              original_id: logEntry.id,
              migration_timestamp: new Date().toISOString()
            };

            // 插入数据
            insertStmt.run(
              logId,
              logEntry.timestamp || new Date().toISOString(),
              level,
              logEntry.agent_id || 'system',
              logEntry.component || 'migration',
              logEntry.message || `日志条目 ${index + 1}`,
              JSON.stringify(context),
              logEntry.created_at || new Date().toISOString()
            );

            migratedCount++;
          } catch (error) {
            log(`迁移日志 ${index + 1} 失败: ${error.message}`, 'ERROR');
          }
        });

        insertStmt.finalize();
        log(`系统日志迁移完成: ${migratedCount} 个成功`, 'INFO');
        resolve(migratedCount);
      });
    });
  });
}

// 主迁移函数
async function main() {
  log('开始 Mission Control 数据库迁移', 'INFO');
  log(`旧数据库: ${OLD_DB_PATH}`, 'INFO');
  log(`新数据库: ${NEW_DB_PATH}`, 'INFO');

  // 备份旧数据库
  const backupFile = backupOldDatabase();

  // 检查旧数据库是否存在
  if (!fs.existsSync(OLD_DB_PATH)) {
    log('旧数据库文件不存在，跳过迁移', 'WARNING');
    log('迁移完成: 0 条记录迁移', 'INFO');
    return;
  }

  // 打开数据库连接
  const oldDb = new sqlite3.Database(OLD_DB_PATH, sqlite3.OPEN_READONLY);
  const newDb = new sqlite3.Database(NEW_DB_PATH);

  try {
    // 开始事务
    await new Promise((resolve, reject) => {
      newDb.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 检查旧数据库结构
    const oldTables = await checkOldDatabaseStructure(oldDb);

    // 执行迁移
    const migrationResults = {
      documents: 0,
      tasks: 0,
      messages: 0,
      system_logs: 0
    };

    // 迁移文档数据
    if (oldTables.includes('documents')) {
      migrationResults.documents = await migrateDocuments(oldDb, newDb);
    }

    // 迁移任务数据
    if (oldTables.some(table => table.includes('task'))) {
      migrationResults.tasks = await migrateTasks(oldDb, newDb);
    }

    // 迁移消息数据
    if (oldTables.some(table => table.includes('message'))) {
      migrationResults.messages = await migrateMessages(oldDb, newDb);
    }

    // 迁移系统日志
    if (oldTables.some(table => table.includes('log'))) {
      migrationResults.system_logs = await migrateSystemLogs(oldDb, newDb);
    }

    // 提交事务
    await new Promise((resolve, reject) => {
      newDb.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 统计结果
    const totalMigrated = Object.values(migrationResults).reduce((sum, count) => sum + count, 0);

    log('迁移完成统计:', 'INFO');
    log(`  文档: ${migrationResults.documents} 条`, 'INFO');
    log(`  任务: ${migrationResults.tasks} 条`, 'INFO');
    log(`  消息: ${migrationResults.messages} 条`, 'INFO');
    log(`  系统日志: ${migrationResults.system_logs} 条`, 'INFO');
    log(`  总计: ${totalMigrated} 条记录迁移`, 'INFO');

    if (backupFile) {
      log(`旧数据库已备份到: ${backupFile}`, 'INFO');
    }

    // 验证新数据库
    const tableCount = await new Promise((resolve, reject) => {
      newDb.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    log(`新数据库包含 ${tableCount} 个表`, 'INFO');

    // 记录迁移完成
    await new Promise((resolve, reject) => {
      newDb.run(`
        INSERT INTO system_logs (log_id, timestamp, level, agent_id, component, message, context_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        `migration_${new Date().toISOString().replace(/[:.]/g, '-')}`,
        new Date().toISOString(),
        'info',
        'system',
        'database_migration',
        `数据库迁移完成: ${totalMigrated} 条记录迁移`,
        JSON.stringify({
          migration_results: migrationResults,
          backup_file: backupFile,
          old_database: OLD_DB_PATH,
          new_database: NEW_DB_PATH
        })
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  } catch (error) {
    // 回滚事务
    await new Promise((resolve) => {
      newDb.run('ROLLBACK', () => resolve());
    });

    log(`迁移失败: ${error.message}`, 'ERROR');
    throw error;
  } finally {
    // 关闭数据库连接
    oldDb.close();
    newDb.close();
  }
}

// 执行迁移
main().catch(error => {
  log(`迁移过程出错: ${error.message}`, 'ERROR');
  process.exit(1);
});