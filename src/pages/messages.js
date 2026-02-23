// 消息中心页面
import { mockMessages, mockAgents } from '../data/mock-data.js';
import { timeAgo, formatDate, getStatusBadge, getPriorityBadge, escapeHtml } from '../utils.js';

export function renderMessages(container) {
    const processed = mockMessages.filter(m => m.status === 'processed').length;
    const pending = mockMessages.filter(m => m.status === 'pending').length;

    // 消息类型映射
    const typeNames = {
        'hotspot_report': '热点报告',
        'task_assignment': '任务分配',
        'task_completion': '任务完成',
        'analysis_report': '分析报告',
        'status_update': '状态更新'
    };

    container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">消息中心</h2>
      <p class="page-subtitle">智能体间集中式通信记录 · 共 ${mockMessages.length} 条消息</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">💬</div>
        <div class="stat-value">${mockMessages.length}</div>
        <div class="stat-label">总消息数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">✅</div>
        <div class="stat-value">${processed}</div>
        <div class="stat-label">已处理</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">⏳</div>
        <div class="stat-value">${pending}</div>
        <div class="stat-label">待处理</div>
      </div>
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="processed">已处理</button>
      <button class="filter-btn" data-filter="pending">待处理</button>
    </div>

    <!-- 消息时间线 -->
    <div class="card">
      <div class="card-body">
        <div class="message-list" id="message-list">
          ${mockMessages.map(m => {
        const senderAgent = mockAgents.find(a => a.agent_id === m.sender_agent_id);
        const receiverAgent = mockAgents.find(a => a.agent_id === m.receiver_agent_id);
        const status = getStatusBadge(m.status);
        const priority = getPriorityBadge(m.priority);

        return `
              <div class="message-item" data-status="${m.status}">
                <div class="message-header">
                  <div class="message-route">
                    <span class="message-sender">${senderAgent?.icon || '📨'} ${m.sender_agent_name}</span>
                    <span class="message-arrow">→</span>
                    <span class="message-receiver">${receiverAgent?.icon || '📨'} ${m.receiver_agent_name}</span>
                  </div>
                  <div class="message-badges">
                    <span class="badge badge-accent">${typeNames[m.message_type] || m.message_type}</span>
                    <span class="badge ${priority.class}">${priority.text}</span>
                    <span class="badge ${status.class}">${status.text}</span>
                  </div>
                </div>
                <div class="message-body">
                  <div class="message-payload">
                    <span class="payload-label">消息内容:</span>
                    <code>${JSON.stringify(m.payload_json, null, 0).slice(0, 120)}${JSON.stringify(m.payload_json).length > 120 ? '...' : ''}</code>
                  </div>
                  <div class="message-meta-row">
                    <span class="badge badge-muted">v${m.protocol_version}</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${formatDate(m.timestamp)}</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-tertiary)">${timeAgo(m.timestamp)}</span>
                  </div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    </div>
  `;

    // 筛选绑定
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            container.querySelectorAll('.message-item').forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.status === filter) ? '' : 'none';
            });
        });
    });

    addMessageStyles();
}

function addMessageStyles() {
    if (document.getElementById('message-styles')) return;
    const style = document.createElement('style');
    style.id = 'message-styles';
    style.textContent = `
    .message-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .message-item {
      padding: var(--space-4); border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md); transition: all var(--transition-fast);
    }
    .message-item:hover { border-color: var(--color-accent-border); background: var(--color-accent-bg); }
    .message-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2); }
    .message-route { display: flex; align-items: center; gap: var(--space-2); }
    .message-sender, .message-receiver { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-primary); }
    .message-arrow { color: var(--color-accent); font-weight: bold; }
    .message-badges { display: flex; gap: var(--space-1); flex-wrap: wrap; }
    .message-body { }
    .message-payload {
      font-size: var(--text-xs); padding: var(--space-2) var(--space-3);
      background: var(--color-bg-tertiary); border-radius: var(--radius-sm);
      margin-bottom: var(--space-2); overflow: hidden;
    }
    .message-payload code { font-family: var(--font-mono); color: var(--color-text-secondary); word-break: break-all; }
    .payload-label { color: var(--color-text-tertiary); margin-right: var(--space-2); }
    .message-meta-row { display: flex; align-items: center; gap: var(--space-3); }
  `;
    document.head.appendChild(style);
}
