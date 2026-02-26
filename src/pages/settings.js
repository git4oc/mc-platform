// 系统设置页面
import { getSystemConfig, getAgents } from '../api.js';

const agentIcons = {
  'mission_control': '🎯', 'hotspot_scout': '🔍', 'content_creator': '✍️',
  'social_manager': '📢', 'tech_specialist': '🔧', 'data_analyst': '📊'
};

export async function renderSettings(container) {
  container.innerHTML = `<div class="page-loading"><span class="loading-spinner"></span> 加载中...</div>`;
  const [mockSystemConfig, mockAgents] = await Promise.all([getSystemConfig(), getAgents()]);
  mockAgents.forEach(a => { if (!a.icon) a.icon = agentIcons[a.agent_id] || '🤖'; });

  // 分组配置
  const basicConfig = mockSystemConfig.filter(c => ['system_name', 'system_version', 'system_mode', 'protocol_version', 'timezone', 'database_version'].includes(c.config_key));
  const runtimeConfig = mockSystemConfig.filter(c => ['max_concurrent_tasks', 'agent_health_check_interval', 'task_timeout_hours', 'total_agents'].includes(c.config_key));
  const featureConfig = mockSystemConfig.filter(c => ['backup_enabled', 'notification_enabled'].includes(c.config_key));

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
      <p class="page-subtitle">系统配置与参数管理</p>
    </div>

    <!-- 系统信息卡片 -->
    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">🎯</div>
        <div class="stat-value" style="font-size: var(--text-lg)">Mission Control</div>
        <div class="stat-label">系统名称</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info)">📦</div>
        <div class="stat-value">v2.0.0</div>
        <div class="stat-label">系统版本</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">🌐</div>
        <div class="stat-value" style="font-size: var(--text-lg)">Production</div>
        <div class="stat-label">运行模式</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">🤖</div>
        <div class="stat-value">${mockAgents.length}</div>
        <div class="stat-label">已注册智能体</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- 基础设置 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">基础设置</h3>
        </div>
        <div class="card-body">
          <div class="config-list">
            ${basicConfig.map(c => `
              <div class="config-item">
                <div>
                  <div class="config-key">${c.config_key}</div>
                  <div class="config-desc">${c.description}</div>
                </div>
                <div class="config-value">${c.config_value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 运行参数 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">运行参数</h3>
        </div>
        <div class="card-body">
          <div class="config-list">
            ${runtimeConfig.map(c => `
              <div class="config-item">
                <div>
                  <div class="config-key">${c.config_key}</div>
                  <div class="config-desc">${c.description}</div>
                </div>
                <div class="config-value">${c.config_value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 功能开关 -->
    <div class="card" style="margin-top: var(--space-4)">
      <div class="card-header">
        <h3 class="card-title">功能开关</h3>
      </div>
      <div class="card-body">
        <div class="config-list">
          ${featureConfig.map(c => `
            <div class="config-item">
              <div>
                <div class="config-key">${c.config_key}</div>
                <div class="config-desc">${c.description}</div>
              </div>
              <div class="config-value">
                <span class="badge ${c.config_value === 'true' ? 'badge-success' : 'badge-error'}">${c.config_value === 'true' ? '已启用' : '已禁用'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- 智能体注册列表 -->
    <div class="card" style="margin-top: var(--space-4)">
      <div class="card-header">
        <h3 class="card-title">已注册智能体</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>图标</th><th>名称</th><th>ID</th><th>类型</th><th>版本</th><th>状态</th></tr>
          </thead>
          <tbody>
            ${mockAgents.map(a => `
              <tr>
                <td>${a.icon}</td>
                <td style="color: var(--color-text-primary); font-weight: 500">${a.agent_name}</td>
                <td style="font-family: var(--font-mono); font-size: var(--text-xs)">${a.agent_id}</td>
                <td>${a.agent_type}</td>
                <td>${a.version}</td>
                <td><span class="badge badge-${a.status === 'active' ? 'success' : a.status === 'standby' ? 'warning' : 'error'}">${a.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
