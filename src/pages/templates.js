// 模板管理页面 — 内嵌式编辑（无弹窗）
import { getTemplates } from '../api.js';
import { timeAgo, getStatusBadge, copyToClipboard, escapeHtml, showToast } from '../utils.js';
import { icon } from '../icons.js';

let selectedTemplate = null;
let editingTemplate = null; // 当前编辑中的模板 ID 或 'new'
let cachedTemplates = []; // 缓存模板数据供内部函数使用

// 平台配置
const platformOptions = ['微信公众号', '知乎', '头条号', '小红书', '通用', 'B站', '抖音'];
const categoryOptions = ['行业分析', '技术教程', '新闻速报', '案例研究', '观点评论', '产品评测', '生活分享'];
const toneOptions = ['专业严谨', '通俗易懂', '轻松活泼', '犀利深刻', '温暖治愈'];

export async function renderTemplates(container) {
  container.innerHTML = `<div class="page-loading"><span class="loading-spinner"></span> 加载中...</div>`;
  const mockTemplates = await getTemplates();
  cachedTemplates = mockTemplates;

  const activeCount = mockTemplates.filter(t => t.status === 'active').length;
  const totalUsage = mockTemplates.reduce((s, t) => s + (t.usage_count || 0), 0);
  const platforms = [...new Set(mockTemplates.map(t => t.platform))];

  container.innerHTML = `
    <div class="page-header" style="display: flex; align-items: flex-start; justify-content: space-between;">
      <div>
        <h2 class="page-title">创作模板</h2>
        <p class="page-subtitle">AI内容创作提示词模板库 · 共 ${mockTemplates.length} 个模板</p>
      </div>
      <button class="btn btn-primary" id="create-tpl-btn">
        ${icon('plus', 16)} 新建模板
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent); border: 1px solid var(--color-accent-border)">${icon('template', 20)}</div>
        <div class="stat-value">${mockTemplates.length}</div>
        <div class="stat-label">模板总数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border)">${icon('check', 20)}</div>
        <div class="stat-value">${activeCount}</div>
        <div class="stat-label">已启用</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info); border: 1px solid var(--color-info-border)">${icon('refresh', 20)}</div>
        <div class="stat-value">${totalUsage}</div>
        <div class="stat-label">总使用次数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--chart-5)">
        <div class="stat-icon" style="background: rgba(244,114,182,0.1); color: var(--chart-5); border: 1px solid rgba(244,114,182,0.2)">${icon('globe', 20)}</div>
        <div class="stat-value">${platforms.length}</div>
        <div class="stat-label">覆盖平台</div>
      </div>
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      ${platforms.map(p => `<button class="filter-btn" data-filter="${p}">${p}</button>`).join('')}
    </div>

    <div class="tpl-layout">
      <!-- 模板列表 -->
      <div class="tpl-list-wrap">
        ${mockTemplates.map(t => renderTemplateCard(t)).join('')}
      </div>

      <!-- 右侧面板：预览 或 编辑 -->
      <div class="tpl-preview-wrap" id="tpl-right-panel">
        ${editingTemplate ? renderEditPanel(editingTemplate) : renderPreviewPanel()}
      </div>
    </div>
  `;

  bindEvents(container);
  addTemplateStyles();
}

function renderTemplateCard(t) {
  const status = getStatusBadge(t.status);
  const isSelected = selectedTemplate === t.template_id;
  const isEditing = editingTemplate === t.template_id;
  return `
    <div class="tpl-card ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}" data-id="${t.template_id}" data-platform="${t.platform}">
      <div class="tpl-card-top">
        <div class="tpl-card-head">
          <span class="tpl-name">${t.name}</span>
          <span class="badge ${status.class}">${status.text}</span>
        </div>
        <div class="tpl-card-tags">
          <span class="badge badge-accent">${t.platform}</span>
          <span class="badge badge-muted">${t.category}</span>
          <span class="badge badge-muted">${t.tone}</span>
        </div>
      </div>
      <div class="tpl-card-stats">
        <div class="tpl-stat">
          <span class="tpl-stat-val">${t.usage_count}</span>
          <span class="tpl-stat-label">使用</span>
        </div>
        <div class="tpl-stat">
          <span class="tpl-stat-val">${t.target_length}</span>
          <span class="tpl-stat-label">字数</span>
        </div>
        <div class="tpl-stat">
          <span class="tpl-stat-val">${t.variables.length}</span>
          <span class="tpl-stat-label">变量</span>
        </div>
        <div class="tpl-stat">
          <span class="tpl-stat-val">${timeAgo(t.last_used_at)}</span>
          <span class="tpl-stat-label">更新</span>
        </div>
      </div>
    </div>
  `;
}

function renderPreviewPanel() {
  if (!selectedTemplate) {
    return `
      <div class="card" style="height: 100%;">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-icon">${icon('template', 40)}</div>
            <div class="empty-title">选择模板</div>
            <div class="empty-desc">点击左侧模板卡片查看完整提示词</div>
          </div>
        </div>
      </div>
    `;
  }

  const tpl = cachedTemplates.find(t => t.template_id === selectedTemplate);
  if (!tpl) return '';

  return `
    <div class="card" style="height: 100%;">
      <div class="card-header">
        <h3 class="card-title">模板预览</h3>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn-sm btn-secondary" id="tpl-edit-btn">${icon('edit', 14)} 编辑</button>
          <button class="btn btn-sm btn-secondary" id="tpl-delete-btn" style="color: var(--color-error)">${icon('trash', 14)} 删除</button>
          <button class="btn btn-sm btn-primary" id="tpl-copy-btn">${icon('copy', 14)} 复制</button>
        </div>
      </div>
      <div class="card-body">
        <div class="tpl-preview">
          <div class="tpl-detail-header">
            <h3>${tpl.name}</h3>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-2); flex-wrap: wrap;">
              <span class="badge badge-accent">${tpl.platform}</span>
              <span class="badge badge-muted">${tpl.category}</span>
              <span class="badge badge-muted">${tpl.tone}</span>
              <span class="badge ${getStatusBadge(tpl.status).class}">${getStatusBadge(tpl.status).text}</span>
            </div>
            <div style="margin-top: var(--space-2); font-size: 10px; color: var(--color-text-muted);">
              目标字数: ${tpl.target_length} · 使用次数: ${tpl.usage_count} · 更新于 ${timeAgo(tpl.updated_at)}
            </div>
          </div>
          <div class="tpl-vars">
            <span class="tpl-vars-label">模板变量:</span>
            ${tpl.variables.map(v => `<code class="tpl-var">${v}</code>`).join('')}
          </div>
          <pre class="tpl-prompt">${escapeHtml(tpl.prompt)}</pre>
        </div>
      </div>
    </div>
  `;
}

function renderEditPanel(editId) {
  const isNew = editId === 'new';
  const tpl = isNew ? null : cachedTemplates.find(t => t.template_id === editId);

  return `
    <div class="card tpl-edit-card">
      <div class="card-header">
        <h3 class="card-title">${isNew ? '新建模板' : `编辑 · ${tpl?.name || ''}`}</h3>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn-sm btn-secondary" id="tpl-edit-cancel">${icon('x', 14)} 取消</button>
          <button class="btn btn-sm btn-primary" id="tpl-edit-save">${icon('save', 14)} 保存</button>
        </div>
      </div>
      <div class="card-body" style="overflow-y: auto; max-height: calc(100vh - 340px);">
        <div class="form-group">
          <label class="form-label">模板名称 <span style="color: var(--color-error)">*</span></label>
          <input type="text" class="form-input" id="tpl-form-name" value="${isNew ? '' : tpl?.name || ''}" placeholder="如：微信公众号深度分析文章" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">目标平台 <span style="color: var(--color-error)">*</span></label>
            <select class="form-input" id="tpl-form-platform">
              ${platformOptions.map(p => `<option value="${p}" ${(!isNew && tpl?.platform === p) ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">内容分类</label>
            <select class="form-input" id="tpl-form-category">
              ${categoryOptions.map(c => `<option value="${c}" ${(!isNew && tpl?.category === c) ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">语气风格</label>
            <select class="form-input" id="tpl-form-tone">
              ${toneOptions.map(t => `<option value="${t}" ${(!isNew && tpl?.tone === t) ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">目标字数</label>
            <input type="number" class="form-input" id="tpl-form-length" value="${isNew ? 2000 : tpl?.target_length || 2000}" min="100" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">状态</label>
            <select class="form-input" id="tpl-form-status">
              <option value="active" ${(!isNew && tpl?.status === 'active') ? 'selected' : ''}>已启用</option>
              <option value="disabled" ${(!isNew && tpl?.status === 'disabled') ? 'selected' : ''}>已禁用</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">模板变量</label>
            <input type="text" class="form-input" id="tpl-form-vars" value="${isNew ? '{{topic}},{{word_count}}' : tpl?.variables.join(',') || ''}" placeholder="逗号分隔" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">提示词内容 <span style="color: var(--color-error)">*</span></label>
          <textarea class="form-input form-textarea" id="tpl-form-prompt" rows="14" placeholder="在此编写完整的AI提示词模板内容...">${isNew ? '' : tpl?.prompt || ''}</textarea>
        </div>
      </div>
    </div>
  `;
}

function bindEvents(container) {
  // 筛选
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      container.querySelectorAll('.tpl-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.platform === filter) ? '' : 'none';
      });
    });
  });

  // 模板选择
  container.querySelectorAll('.tpl-card').forEach(card => {
    card.addEventListener('click', () => {
      if (editingTemplate) return; // 编辑中不允许切换
      const id = card.dataset.id;
      selectedTemplate = id;
      editingTemplate = null;
      container.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateRightPanel(container);
    });
  });

  // 新建
  document.getElementById('create-tpl-btn')?.addEventListener('click', () => {
    selectedTemplate = null;
    editingTemplate = 'new';
    container.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('selected'));
    updateRightPanel(container);
  });

  // 右侧面板按钮（预览模式）
  bindPreviewButtons(container);
  // 右侧面板按钮（编辑模式）
  bindEditButtons(container);
}

function updateRightPanel(container) {
  const panel = document.getElementById('tpl-right-panel');
  if (!panel) return;
  panel.innerHTML = editingTemplate ? renderEditPanel(editingTemplate) : renderPreviewPanel();
  bindPreviewButtons(container);
  bindEditButtons(container);
}

function bindPreviewButtons(container) {
  const editBtn = document.getElementById('tpl-edit-btn');
  const deleteBtn = document.getElementById('tpl-delete-btn');
  const copyBtn = document.getElementById('tpl-copy-btn');

  if (editBtn && selectedTemplate) {
    editBtn.addEventListener('click', () => {
      editingTemplate = selectedTemplate;
      updateRightPanel(container);
    });
  }
  if (deleteBtn && selectedTemplate) {
    deleteBtn.addEventListener('click', () => {
      const tpl = cachedTemplates.find(t => t.template_id === selectedTemplate);
      if (!tpl) return;
      if (!confirm(`确定要删除模板「${tpl.name}」吗？`)) return;
      const idx = cachedTemplates.findIndex(t => t.template_id === tpl.template_id);
      if (idx > -1) {
        cachedTemplates.splice(idx, 1);
        selectedTemplate = null;
        editingTemplate = null;
        showToast(`模板「${tpl.name}」已删除`, 'success');
        renderTemplates(container);
      }
    });
  }
  if (copyBtn && selectedTemplate) {
    const tpl = cachedTemplates.find(t => t.template_id === selectedTemplate);
    if (tpl) copyBtn.addEventListener('click', () => copyToClipboard(tpl.prompt));
  }
}

function bindEditButtons(container) {
  const cancelBtn = document.getElementById('tpl-edit-cancel');
  const saveBtn = document.getElementById('tpl-edit-save');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      editingTemplate = null;
      updateRightPanel(container);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = document.getElementById('tpl-form-name').value.trim();
      const platform = document.getElementById('tpl-form-platform').value;
      const category = document.getElementById('tpl-form-category').value;
      const tone = document.getElementById('tpl-form-tone').value;
      const targetLength = parseInt(document.getElementById('tpl-form-length').value) || 2000;
      const status = document.getElementById('tpl-form-status').value;
      const varsStr = document.getElementById('tpl-form-vars').value.trim();
      const prompt = document.getElementById('tpl-form-prompt').value.trim();

      if (!name) { showToast('请填写模板名称', 'warning'); return; }
      if (!prompt) { showToast('请填写提示词内容', 'warning'); return; }

      const variables = varsStr ? varsStr.split(',').map(v => v.trim()).filter(v => v) : [];
      const now = new Date().toISOString();

      if (editingTemplate === 'new') {
        const newId = `tpl_${String(cachedTemplates.length + 1).padStart(3, '0')}`;
        cachedTemplates.push({
          template_id: newId, name, platform, category, prompt, variables,
          target_length: targetLength, tone, status, usage_count: 0,
          last_used_at: now, created_at: now, updated_at: now
        });
        selectedTemplate = newId;
        showToast(`模板「${name}」已创建`, 'success');
      } else {
        const tpl = cachedTemplates.find(t => t.template_id === editingTemplate);
        if (tpl) {
          Object.assign(tpl, { name, platform, category, tone, target_length: targetLength, status, variables, prompt, updated_at: now });
          showToast(`模板「${name}」已更新`, 'success');
        }
      }

      editingTemplate = null;
      renderTemplates(container);
    });
  }
}

function addTemplateStyles() {
  if (document.getElementById('template-styles')) return;
  const style = document.createElement('style');
  style.id = 'template-styles';
  style.textContent = `
    .tpl-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      align-items: start;
    }
    @media (max-width: 1024px) {
      .tpl-layout { grid-template-columns: 1fr; }
    }
    .tpl-list-wrap {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .tpl-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-card);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-card);
    }
    .tpl-card:hover {
      border-color: var(--color-accent-border);
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .tpl-card.selected {
      border-color: var(--color-accent);
      background: var(--gradient-accent-subtle);
    }
    .tpl-card.editing {
      border-color: var(--color-warning);
      background: var(--color-warning-bg);
    }
    .tpl-card-top { margin-bottom: var(--space-3); }
    .tpl-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
    .tpl-name { font-size: var(--text-base); font-weight: var(--font-bold); color: var(--color-text-primary); letter-spacing: -0.01em; }
    .tpl-card-tags { display: flex; gap: var(--space-1-5); flex-wrap: wrap; }
    .tpl-card-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-2);
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-border-light);
    }
    .tpl-stat { text-align: center; }
    .tpl-stat-val { display: block; font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text-primary); }
    .tpl-stat-label { font-size: 10px; color: var(--color-text-muted); }
    .tpl-preview-wrap { position: sticky; top: 0; }
    .tpl-preview { max-height: 560px; overflow-y: auto; }
    .tpl-detail-header {
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--color-border-light);
    }
    .tpl-detail-header h3 { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text-primary); }
    .tpl-vars {
      display: flex; align-items: center; gap: var(--space-2);
      margin-bottom: var(--space-4); flex-wrap: wrap;
    }
    .tpl-vars-label { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--font-medium); }
    .tpl-var {
      font-family: var(--font-mono); font-size: 10px; padding: 2px 8px;
      background: var(--color-accent-bg); color: var(--color-accent);
      border: 1px solid var(--color-accent-border); border-radius: var(--radius-sm);
    }
    .tpl-prompt {
      font-family: var(--font-mono); font-size: var(--text-xs);
      line-height: var(--leading-relaxed); color: var(--color-text-secondary);
      background: var(--color-bg-tertiary); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); padding: var(--space-5);
      white-space: pre-wrap; word-wrap: break-word; overflow-x: auto;
    }
    .tpl-edit-card .form-textarea {
      min-height: 200px;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      line-height: var(--leading-relaxed);
    }
  `;
  document.head.appendChild(style);
}
