// 系统监控页面
import { getSystemLogs } from '../api.js';
import { timeAgo, formatDate } from '../utils.js';

let activeTab = 'logs';
let cachedLogs = []; // 缓存日志数据供tab切换使用

export async function renderMonitoring(container) {
  container.innerHTML = `<div class="page-loading"><span class="loading-spinner"></span> 加载中...</div>`;
  const mockSystemLogs = await getSystemLogs();
  cachedLogs = mockSystemLogs;

  const logCounts = {
    info: mockSystemLogs.filter(l => (l.log_level || l.level) === 'info').length,
    warning: mockSystemLogs.filter(l => (l.log_level || l.level) === 'warning').length,
    error: mockSystemLogs.filter(l => (l.log_level || l.level) === 'error').length
  };

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">系统监控</h2>
      <p class="page-subtitle">系统运行状态、日志与性能监控</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info)">ℹ️</div>
        <div class="stat-value">${logCounts.info}</div>
        <div class="stat-label">INFO 日志</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">⚠️</div>
        <div class="stat-value">${logCounts.warning}</div>
        <div class="stat-label">WARNING 日志</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">❌</div>
        <div class="stat-value">${logCounts.error}</div>
        <div class="stat-label">ERROR 日志</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">💚</div>
        <div class="stat-value">正常</div>
        <div class="stat-label">系统状态</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab ${activeTab === 'logs' ? 'active' : ''}" data-tab="logs">系统日志</button>
      <button class="tab ${activeTab === 'maintenance' ? 'active' : ''}" data-tab="maintenance">维护记录</button>
      <button class="tab ${activeTab === 'backup' ? 'active' : ''}" data-tab="backup">备份管理</button>
    </div>

    <div id="monitoring-content">
      ${activeTab === 'logs' ? renderLogsTab() : activeTab === 'maintenance' ? renderMaintenanceTab() : renderBackupTab()}
    </div>
  `;

  // Tab切换
  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      renderMonitoring(container);
    });
  });

  // 日志级别筛选
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      container.querySelectorAll('.log-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.level === filter) ? '' : 'none';
      });
    });
  });
}

function renderLogsTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">系统日志</h3>
        <div class="filter-bar" style="margin-bottom: 0;">
          <button class="filter-btn active" data-filter="all">全部</button>
          <button class="filter-btn" data-filter="info">INFO</button>
          <button class="filter-btn" data-filter="warning">WARN</button>
          <button class="filter-btn" data-filter="error">ERROR</button>
        </div>
      </div>
      <div class="card-body">
        <div class="log-list">
          ${cachedLogs.map(l => `
            <div class="log-item" data-level="${l.log_level || l.level}">
              <span class="log-level ${l.log_level || l.level}">${(l.log_level || l.level).toUpperCase()}</span>
              <span class="log-time">${formatDate(l.timestamp)}</span>
              <span class="log-agent">[${l.agent_id}]</span>
              <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${l.component}</span>
              <span class="log-message">${l.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderMaintenanceTab() {
  const records = [
    { type: '数据库优化', title: '运行VACUUM和索引重建', performed_by: 'tech_specialist', status: 'completed', duration: 120, time: new Date(Date.now() - 2 * 86400000).toISOString() },
    { type: '日志清理', title: '清理30天前的系统日志', performed_by: 'tech_specialist', status: 'completed', duration: 45, time: new Date(Date.now() - 5 * 86400000).toISOString() },
    { type: '系统检查', title: '全面系统健康检查', performed_by: 'tech_specialist', status: 'completed', duration: 300, time: new Date(Date.now() - 7 * 86400000).toISOString() }
  ];

  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">维护记录</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>类型</th><th>描述</th><th>执行者</th><th>状态</th><th>耗时</th><th>时间</th></tr>
          </thead>
          <tbody>
            ${records.map(r => `
              <tr>
                <td><span class="badge badge-accent">${r.type}</span></td>
                <td style="color: var(--color-text-primary)">${r.title}</td>
                <td>🔧 ${r.performed_by}</td>
                <td><span class="badge badge-success">已完成</span></td>
                <td>${r.duration}秒</td>
                <td style="font-size: var(--text-xs)">${timeAgo(r.time)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderBackupTab() {
  const backups = [
    { type: 'full', filename: 'mission_control_full_20260221.db', size: '1.3 MB', verified: true, time: new Date(Date.now() - 86400000).toISOString() },
    { type: 'incremental', filename: 'mission_control_incr_20260220.db', size: '256 KB', verified: true, time: new Date(Date.now() - 2 * 86400000).toISOString() },
    { type: 'full', filename: 'mission_control_full_20260214.db', size: '1.1 MB', verified: true, time: new Date(Date.now() - 8 * 86400000).toISOString() }
  ];

  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">备份记录</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>类型</th><th>文件名</th><th>大小</th><th>状态</th><th>校验</th><th>时间</th></tr>
          </thead>
          <tbody>
            ${backups.map(b => `
              <tr>
                <td><span class="badge ${b.type === 'full' ? 'badge-accent' : 'badge-muted'}">${b.type === 'full' ? '全量' : '增量'}</span></td>
                <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-primary)">${b.filename}</td>
                <td>${b.size}</td>
                <td><span class="badge badge-success">已完成</span></td>
                <td>${b.verified ? '<span style="color: var(--color-success)">✅ 已验证</span>' : '<span style="color: var(--color-warning)">⏳ 待验证</span>'}</td>
                <td style="font-size: var(--text-xs)">${timeAgo(b.time)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
