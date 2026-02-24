// 智能体管理页面
import { mockAgents } from '../data/mock-data.js';
import { timeAgo, getStatusBadge, getStatusColor } from '../utils.js';

export function renderAgents(container) {
  const activeCount = mockAgents.filter(a => a.status === 'active').length;
  const standbyCount = mockAgents.filter(a => a.status === 'standby').length;
  const inactiveCount = mockAgents.filter(a => a.status === 'inactive').length;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">智能体管理</h2>
      <p class="page-subtitle">监控所有AI智能体的运行状态 · 共 ${mockAgents.length} 个智能体</p>
    </div>

    <!-- 状态统计 -->
    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">🟢</div>
        <div class="stat-value">${activeCount}</div>
        <div class="stat-label">活跃中</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">🟡</div>
        <div class="stat-value">${standbyCount}</div>
        <div class="stat-label">待命中</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">🔴</div>
        <div class="stat-value">${inactiveCount}</div>
        <div class="stat-label">已离线</div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="active">活跃</button>
      <button class="filter-btn" data-filter="standby">待命</button>
      <button class="filter-btn" data-filter="inactive">离线</button>
    </div>

    <!-- 智能体卡片 -->
    <div class="agent-cards" id="agent-cards">
      ${mockAgents.map(a => renderAgentCard(a)).join('')}
    </div>
  `;

  // 绑定筛选事件
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const cards = container.querySelectorAll('.agent-card');
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.status === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function renderAgentCard(agent) {
  const status = getStatusBadge(agent.status);
  const completionRate = agent.tasks.total > 0
    ? Math.round(agent.tasks.completed / agent.tasks.total * 100)
    : 0;

  return `
    <div class="agent-card" data-status="${agent.status}">
      <div class="agent-header">
        <div class="agent-avatar">${agent.icon}</div>
        <div class="agent-info">
          <div class="agent-name">${agent.agent_name}</div>
          <div class="agent-type">${agent.agent_id} · v${agent.version}</div>
        </div>
        <div class="agent-status-dot" style="background: ${getStatusColor(agent.status)}; box-shadow: 0 0 8px ${getStatusColor(agent.status)}" title="${status.text}"></div>
      </div>

      <div class="agent-meta">
        <div class="meta-item">
          <span class="meta-label">状态</span>
          <span class="meta-value"><span class="badge ${status.class}">${status.text}</span></span>
        </div>
        <div class="meta-item">
          <span class="meta-label">最后心跳</span>
          <span class="meta-value agent-num" style="font-size: var(--text-base)">${timeAgo(agent.last_heartbeat)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">任务总数</span>
          <span class="meta-value agent-num">${agent.tasks.total}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">完成率</span>
          <span class="meta-value agent-num" style="color: ${completionRate >= 80 ? 'var(--color-success)' : completionRate >= 60 ? 'var(--color-warning)' : 'var(--color-error)'}">${completionRate}%</span>
        </div>
      </div>

      ${agent.latest_task ? `
        <div class="agent-task-preview">
          <span>最新任务:</span>
          <span class="task-title">${agent.latest_task.title}</span>
          <span class="badge ${getStatusBadge(agent.latest_task.status).class}">${getStatusBadge(agent.latest_task.status).text}</span>
        </div>
      ` : ''}

      <!-- 完成率进度条 -->
      <div style="margin-top: var(--space-3)">
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${completionRate}%; background: ${completionRate >= 80 ? 'var(--color-success)' : completionRate >= 60 ? 'var(--color-warning)' : 'var(--color-error)'}"></div>
        </div>
      </div>
    </div>
  `;
}
