// 任务管理页面
import { mockTasks, mockAgents } from '../data/mock-data.js';
import { timeAgo, formatDate, formatDuration, getStatusBadge, getPriorityBadge, showToast } from '../utils.js';

let currentView = 'kanban';

// 任务类型映射
const taskTypes = {
  'hotspot_scouting': '热点侦察',
  'content_creation': '内容创作',
  'social_promotion': '社媒推广',
  'data_analysis': '数据分析',
  'tech_maintenance': '技术维护'
};

export function renderTasks(container) {
  const statusGroups = {
    pending: mockTasks.filter(t => t.status === 'pending'),
    assigned: mockTasks.filter(t => t.status === 'assigned'),
    in_progress: mockTasks.filter(t => t.status === 'in_progress'),
    completed: mockTasks.filter(t => t.status === 'completed'),
    failed: mockTasks.filter(t => t.status === 'failed')
  };

  container.innerHTML = `
    <div class="page-header" style="display: flex; align-items: flex-start; justify-content: space-between;">
      <div>
        <h2 class="page-title">任务管理</h2>
        <p class="page-subtitle">任务调度与进度跟踪 · 共 ${mockTasks.length} 个任务</p>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-3);">
        <div class="tabs" style="border-bottom: none; margin-bottom: 0;">
          <button class="tab ${currentView === 'kanban' ? 'active' : ''}" data-view="kanban">看板视图</button>
          <button class="tab ${currentView === 'list' ? 'active' : ''}" data-view="list">列表视图</button>
        </div>
      </div>
    </div>

    <!-- 统计 -->
    <div class="stats-grid" style="grid-template-columns: repeat(5, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-value">${statusGroups.pending.length}</div>
        <div class="stat-label">待处理</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-value">${statusGroups.assigned.length}</div>
        <div class="stat-label">已分配</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-value">${statusGroups.in_progress.length}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-value">${statusGroups.completed.length}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-value">${statusGroups.failed.length}</div>
        <div class="stat-label">失败</div>
      </div>
    </div>

    <div id="task-view-container">
      ${currentView === 'kanban' ? renderKanbanView(statusGroups) : renderListView()}
    </div>

    <!-- 提交新任务（内联） -->
    <div class="card" style="margin-top: var(--space-8); border-top: 4px solid var(--color-primary);">
      <div class="card-header" style="border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-4); margin-bottom: var(--space-6);">
        <h3 class="card-title" style="display: flex; align-items: center; gap: var(--space-2);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary)">
            <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
          提交新任务
        </h3>
        <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px">描述你的任务目标，Mission Control 将自动进行任务规划、拆分与分配。</p>
      </div>

      <!-- 工作流提示 -->
      <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); margin-bottom: var(--space-6); background: var(--color-bg-tertiary); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">📝</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">提交需求</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="flex-shrink: 0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">🎯</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">管理员规划</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="flex-shrink: 0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">🤖</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">Agent 执行</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="flex-shrink: 0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">📊</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">结果汇报</span>
        </div>
      </div>
      
      <div class="form-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6);">
        <div class="form-left-col">
          <div class="form-group">
            <label class="form-label">任务目标 <span style="color: var(--color-error)">*</span></label>
            <input type="text" class="form-input" id="task-title" placeholder="简要描述你的目标，如：围绕 AI Agent 话题产出并发布一篇深度文章" />
          </div>
          <div class="form-group">
            <label class="form-label">详细要求</label>
            <textarea class="form-input form-textarea" id="task-desc" rows="5" placeholder="补充说明任务的具体要求、期望产出、参考素材等...
例如：
- 文章不少于1500字，风格专业但通俗易懂
- 需要包含实际案例和数据支撑
- 完成后同步发布到微信公众号和知乎"></textarea>
          </div>
        </div>
        
        <div class="form-right-col">
          <div class="form-group">
            <label class="form-label">优先级</label>
            <select class="form-input" id="task-priority">
              <option value="high">🔴 高优 · 立即处理</option>
              <option value="medium" selected>🟡 中等 · 按计划推进</option>
              <option value="low">⚪ 低优 · 空闲时处理</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">期望完成时间</label>
            <input type="datetime-local" class="form-input" id="task-deadline" />
          </div>
          <div class="form-group">
            <label class="form-label">负责人</label>
            <div style="display: flex; align-items: center; gap: var(--space-2); padding: 10px var(--space-4); background: var(--color-bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <span style="font-size: 20px;">🎯</span>
              <div>
                <div style="font-weight: 600; font-size: var(--text-sm); color: var(--color-text-primary);">任务管理器 (Mission Control)</div>
                <div style="font-size: var(--text-xs); color: var(--color-text-muted);">自动规划并分配给最合适的 Agent</div>
              </div>
            </div>
          </div>
          <div style="margin-top: var(--space-6); display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-lg" id="task-save-btn" style="width: 100%; justify-content: center; height: 48px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              提交任务
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // 视图切换
  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentView = tab.dataset.view;
      renderTasks(container);
    });
  });

  // 初始化表单默认值
  const setDefaultDeadline = () => {
    const tomorrow = new Date(Date.now() + 86400000);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    const h = String(tomorrow.getHours()).padStart(2, '0');
    const min = String(tomorrow.getMinutes()).padStart(2, '0');
    const deadlineInput = document.getElementById('task-deadline');
    if (deadlineInput) deadlineInput.value = `${y}-${m}-${d}T${h}:${min}`;
  };

  setDefaultDeadline();

  // 提交任务给 Mission Control
  document.getElementById('task-save-btn').addEventListener('click', () => {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-desc').value.trim();
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;

    if (!title) { showToast('请填写任务目标', 'warning'); return; }

    // 生成任务ID
    const now = new Date();
    const ts = now.toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
    const taskId = `task_${ts}_${String(mockTasks.length + 1).padStart(3, '0')}`;

    const newTask = {
      task_id: taskId,
      task_type: 'general',
      title,
      description: description || `用户通过管理平台提交的任务`,
      assigned_to: 'mission_control',
      assigned_by: 'user',
      status: 'pending',
      priority,
      deadline: deadline ? deadline.replace('T', ' ') + ':00' : null,
      created_at: now.toISOString(),
      estimated_duration: null,
      actual_duration: null
    };

    // 插入到 mock 数据（前端模拟）
    mockTasks.unshift(newTask);

    showToast(`任务「${title}」已提交给 Mission Control，将自动规划分配`, 'success');
    renderTasks(container);
  });

  addTaskStyles();
}

function renderKanbanView(groups) {
  const columns = [
    { key: 'pending', title: '待处理', color: 'var(--color-warning)' },
    { key: 'assigned', title: '已分配', color: 'var(--color-accent)' },
    { key: 'in_progress', title: '进行中', color: 'var(--color-info)' },
    { key: 'completed', title: '已完成', color: 'var(--color-success)' },
    { key: 'failed', title: '失败', color: 'var(--color-error)' }
  ];

  return `
    <div class="kanban-board">
      ${columns.map(col => `
        <div class="kanban-column">
          <div class="kanban-column-header">
            <span class="kanban-column-title" style="color: ${col.color}">${col.title}</span>
            <span class="kanban-column-count">${(groups[col.key] || []).length}</span>
          </div>
          <div class="kanban-cards">
            ${(groups[col.key] || []).map(t => {
    const agent = mockAgents.find(a => a.agent_id === t.assigned_to);
    const priority = getPriorityBadge(t.priority);
    return `
                <div class="kanban-card">
                  <div class="kanban-card-title">${t.title}</div>
                  <div class="kanban-card-meta">
                    <span class="kanban-card-agent">${agent ? agent.icon + ' ' + agent.agent_name : t.assigned_to}</span>
                    <span class="badge ${priority.class}">${priority.text}</span>
                  </div>
                  ${t.deadline ? `<div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-2)">截止: ${formatDate(t.deadline)}</div>` : ''}
                </div>
              `;
  }).join('') || '<div class="empty-state" style="padding: var(--space-6)"><div class="empty-icon">📭</div><div class="empty-desc">暂无任务</div></div>'}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderListView() {
  return `
    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>任务ID</th>
            <th>标题</th>
            <th>类型</th>
            <th>分配给</th>
            <th>优先级</th>
            <th>状态</th>
            <th>截止时间</th>
            <th>耗时</th>
          </tr>
        </thead>
        <tbody>
          ${mockTasks.map(t => {
    const agent = mockAgents.find(a => a.agent_id === t.assigned_to);
    const status = getStatusBadge(t.status);
    const priority = getPriorityBadge(t.priority);
    return `
              <tr>
                <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted)">${t.task_id}</td>
                <td style="color: var(--color-text-primary); font-weight: 500">${t.title}</td>
                <td>${taskTypes[t.task_type] || t.task_type}</td>
                <td>${agent ? agent.icon + ' ' + agent.agent_name : t.assigned_to}</td>
                <td><span class="badge ${priority.class}">${priority.text}</span></td>
                <td><span class="badge ${status.class}">${status.text}</span></td>
                <td style="font-size: var(--text-xs)">${t.deadline ? formatDate(t.deadline) : '-'}</td>
                <td style="font-size: var(--text-xs)">
                  ${t.actual_duration ? formatDuration(t.actual_duration) : (t.estimated_duration ? '预估 ' + formatDuration(t.estimated_duration) : '-')}
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function addTaskStyles() {
  // modal/form 样式已提升到全局 index.css，此处仅保留任务页特有样式
}
