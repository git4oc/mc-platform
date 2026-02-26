// 仪表盘页面
import { getAgents, getTasks, getHotspots, getMessages, getSystemLogs } from '../api.js';
import { timeAgo, getStatusBadge, getPriorityBadge, getScoreColor, formatNumber } from '../utils.js';
import { icon } from '../icons.js';

// Agent图标映射（API数据中没有icon字段，前端补充）
const agentIcons = {
  'mission_control': '🎯', 'hotspot_scout': '🔍', 'content_creator': '✍️',
  'social_manager': '📢', 'tech_specialist': '🔧', 'data_analyst': '📊'
};

export async function renderDashboard(container) {
  container.innerHTML = `<div class="page-loading"><span class="loading-spinner"></span> 加载中...</div>`;

  const [mockAgents, mockTasks, mockHotspots, mockMessages, mockSystemLogs] = await Promise.all([
    getAgents(), getTasks(), getHotspots(), getMessages(), getSystemLogs()
  ]);

  // 为API数据补充icon
  mockAgents.forEach(a => { if (!a.icon) a.icon = agentIcons[a.agent_id] || '🤖'; });

  const activeAgents = mockAgents.filter(a => a.status === 'active').length;
  const totalAgents = mockAgents.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const totalTasks = mockTasks.length;
  const newHotspots = mockHotspots.filter(h => h.status === 'new').length;
  const totalViews = 2850 + 1560;
  const totalLikes = 128 + 86;
  const completionRate = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">系统仪表盘</h2>
      <p class="page-subtitle">Mission Control 系统运行概览 · 实时监控中</p>
    </div>

    <!-- 核心指标 -->
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border)">${icon('agents', 20)}</div>
        <div class="stat-value">${activeAgents}<span class="stat-value-sub">/${totalAgents}</span></div>
        <div class="stat-label">智能体在线</div>
        <div class="stat-trend up">${icon('arrowUp', 12)} 全部正常</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info); border: 1px solid var(--color-info-border)">${icon('tasks', 20)}</div>
        <div class="stat-value">${completionRate}<span class="stat-value-sub">%</span></div>
        <div class="stat-label">任务完成率</div>
        <div class="stat-trend up">${icon('arrowUp', 12)} ${completedTasks}/${totalTasks} 完成</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border)">${icon('hotspot', 20)}</div>
        <div class="stat-value">${newHotspots}</div>
        <div class="stat-label">待处理热点</div>
        <div class="stat-trend up">${icon('arrowUp', 12)} 新发现</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--chart-5)">
        <div class="stat-icon" style="background: rgba(244,114,182,0.1); color: var(--chart-5); border: 1px solid rgba(244,114,182,0.2)">${icon('chart', 20)}</div>
        <div class="stat-value">${formatNumber(totalViews)}</div>
        <div class="stat-label">内容总浏览</div>
        <div class="stat-trend up">${icon('arrowUp', 12)} ${totalLikes} 互动</div>
      </div>
    </div>

    <div class="grid-main-side">
      <!-- 最新任务 (Main Focus) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${icon('tasks', 16)} 最新任务</h3>
          <a href="#/tasks" class="btn btn-sm btn-secondary">查看全部 ${icon('arrowRight', 12)}</a>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>任务</th><th>分配给</th><th>优先级</th><th>状态</th></tr></thead>
            <tbody>
              ${mockTasks.slice(0, 5).map(t => {
    const agent = mockAgents.find(a => a.agent_id === (t.agent_id || t.assigned_to));
    const status = getStatusBadge(t.status);
    const priority = getPriorityBadge(t.priority);
    return `<tr>
                  <td style="color: var(--color-text-primary); font-weight: var(--font-semibold)">${t.title}</td>
                  <td>${agent ? agent.icon + ' ' + agent.agent_name : (t.agent_id || t.assigned_to)}</td>
                  <td><span class="badge ${priority.class}">${priority.text}</span></td>
                  <td><span class="badge ${status.class}">${status.text}</span></td>
                </tr>`;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 智能体状态 (Side Focus) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${icon('agents', 16)} 智能体状态</h3>
          <a href="#/agents" class="btn btn-sm btn-secondary">查看全部 ${icon('arrowRight', 12)}</a>
        </div>
        <div class="card-body">
          <div class="agent-mini-list">
            ${mockAgents.map(a => {
    const status = getStatusBadge(a.status);
    return `
              <div class="dash-agent-row">
                <div class="dash-agent-left">
                  <span class="dash-agent-icon">${a.icon}</span>
                  <div class="dash-agent-info">
                    <span class="dash-agent-name">${a.agent_name}</span>
                    <span class="dash-agent-time">${timeAgo(a.last_heartbeat)}</span>
                  </div>
                </div>
                <span class="badge ${status.class}">${status.text}</span>
              </div>`;
  }).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="grid-side-main" style="margin-top: var(--space-4)">
      <!-- 热点排行 (Side) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${icon('hotspot', 16)} 热点排行</h3>
          <a href="#/hotspots" class="btn btn-sm btn-secondary">查看全部 ${icon('arrowRight', 12)}</a>
        </div>
        <div class="card-body">
          ${[...mockHotspots].sort((a, b) => b.total_score - a.total_score).slice(0, 5).map((h, i) => `
            <div class="dash-hotspot-row">
              <span class="dash-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
              <div class="dash-hotspot-info">
                <div class="dash-hotspot-title">${h.title}</div>
                <div class="dash-hotspot-meta">
                  ${timeAgo(h.discovered_at)} · <span class="badge ${getStatusBadge(h.status).class}">${getStatusBadge(h.status).text}</span>
                </div>
              </div>
              <span class="dash-score" style="color: ${getScoreColor(h.total_score)}">${h.total_score}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 最新消息 (Main) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${icon('message', 16)} 最新消息</h3>
          <a href="#/messages" class="btn btn-sm btn-secondary">查看全部 ${icon('arrowRight', 12)}</a>
        </div>
        <div class="card-body">
          <div class="timeline">
            ${mockMessages.slice(0, 5).map(m => {
    const typeMap = {
      'hotspot_report': '提交热点报告',
      'task_assignment': '分配任务',
      'task_completion': '完成任务',
      'analysis_report': '提交分析报告'
    };
    return `
              <div class="timeline-item">
                <div class="timeline-dot">${mockAgents.find(a => a.agent_id === m.sender_agent_id)?.icon || icon('inbox', 16)}</div>
                <div class="timeline-content">
                  <div class="timeline-title">${m.sender_agent_name} → ${m.receiver_agent_name}</div>
                  <div class="timeline-desc">${typeMap[m.message_type] || m.message_type}</div>
                </div>
                <div class="timeline-time">${timeAgo(m.timestamp)}</div>
              </div>`;
  }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 系统日志 -->
    <div class="card" style="margin-top: var(--space-4)">
      <div class="card-header">
        <h3 class="card-title">${icon('log', 16)} 最新系统日志</h3>
        <a href="#/monitoring" class="btn btn-sm btn-secondary">查看全部 ${icon('arrowRight', 12)}</a>
      </div>
      <div class="card-body">
        <div class="log-list">
          ${mockSystemLogs.slice(0, 6).map(l => `
            <div class="log-item">
              <span class="log-level ${l.level}">${l.level}</span>
              <span class="log-time">${timeAgo(l.timestamp)}</span>
              <span class="log-agent">[${l.agent_id}]</span>
              <span class="log-message">${l.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  addDashboardStyles();
}

function addDashboardStyles() {
  if (document.getElementById('dashboard-v2-styles')) return;
  const style = document.createElement('style');
  style.id = 'dashboard-v2-styles';
  style.textContent = `
    .stat-value-sub {
      font-size: var(--text-lg);
      font-weight: var(--font-normal);
      color: var(--color-text-muted);
      margin-left: 3px;
    }
    .card-title { display: flex; align-items: center; gap: var(--space-2); }
    .card-title svg { opacity: 0.6; }
    .stat-icon { display: flex; align-items: center; justify-content: center; }
    .stat-trend svg { vertical-align: middle; margin-right: 2px; }
    .dash-agent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .dash-agent-row:hover { background: var(--color-accent-bg); }
    .dash-agent-left { display: flex; align-items: center; gap: var(--space-4); }
    .dash-agent-icon { font-size: 1.35rem; }
    .dash-agent-info { display: flex; flex-direction: column; }
    .dash-agent-name {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--color-text-primary);
    }
    .dash-agent-time {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }
    .dash-hotspot-row {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-3-5) var(--space-4);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .dash-hotspot-row:hover { background: var(--color-accent-bg); }
    .dash-rank {
      font-size: var(--text-xl);
      font-weight: var(--font-extrabold);
      width: 32px;
      text-align: center;
      color: var(--color-text-muted);
    }
    .dash-rank.top { color: var(--color-warning); }
    .dash-hotspot-info { flex: 1; min-width: 0; }
    .dash-hotspot-title {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--color-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dash-hotspot-meta {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin-top: 3px;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .dash-score {
      font-size: var(--text-2xl);
      font-weight: var(--font-extrabold);
      letter-spacing: -0.03em;
    }
  `;
  document.head.appendChild(style);
}
