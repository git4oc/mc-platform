// 内容管理页面
import { getArticles } from '../api.js';
import { formatDate, getStatusBadge, getScoreColor, copyToClipboard, markdownToHtml, escapeHtml, showToast } from '../utils.js';

let selectedArticle = null;

export async function renderArticles(container) {
  container.innerHTML = `<div class="page-loading"><span class="loading-spinner"></span> 加载中...</div>`;
  const mockArticles = await getArticles();

  const published = mockArticles.filter(a => a.status === 'published').length;
  const drafts = mockArticles.filter(a => a.status === 'draft').length;
  const avgScore = mockArticles.length > 0 ? Math.round(mockArticles.reduce((s, a) => s + (a.overall_score || 0), 0) / mockArticles.length) : 0;

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">内容管理</h2>
      <p class="page-subtitle">文章创作流程与质量控制 · 共 ${mockArticles.length} 篇文章</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">📝</div>
        <div class="stat-value">${mockArticles.length}</div>
        <div class="stat-label">总文章数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">✅</div>
        <div class="stat-value">${published}</div>
        <div class="stat-label">已发布</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">📋</div>
        <div class="stat-value">${drafts}</div>
        <div class="stat-label">草稿</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--chart-5)">
        <div class="stat-icon" style="background: rgba(236,72,153,0.12); color: var(--chart-5)">⭐</div>
        <div class="stat-value">${avgScore}</div>
        <div class="stat-label">平均评分</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- 文章列表 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">文章列表</h3>
        </div>
        <div class="card-body">
          <div class="article-list">
            ${mockArticles.map(a => {
    const status = getStatusBadge(a.status);
    return `
                <div class="article-list-item ${selectedArticle === a.article_id ? 'selected' : ''}" data-id="${a.article_id}">
                  <div class="article-list-title">${a.title}</div>
                  <div class="article-list-meta">
                    <span class="badge ${status.class}">${status.text}</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${a.actual_length || 0}字</span>
                    <span style="font-size: var(--text-xs); color: ${getScoreColor(a.overall_score)}">${a.overall_score}分</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${formatDate(a.created_at)}</span>
                  </div>
                  <!-- 质量评分 -->
                  <div class="article-scores">
                    <div class="mini-score"><span>可读</span><span style="color: ${getScoreColor(a.readability_score)}">${a.readability_score}</span></div>
                    <div class="mini-score"><span>互动</span><span style="color: ${getScoreColor(a.engagement_score)}">${a.engagement_score}</span></div>
                    <div class="mini-score"><span>SEO</span><span style="color: ${getScoreColor(a.seo_score)}">${a.seo_score}</span></div>
                    <div class="mini-score"><span>原创</span><span style="color: ${getScoreColor(a.originality_score)}">${a.originality_score}</span></div>
                  </div>
                </div>
              `;
  }).join('')}
          </div>
        </div>
      </div>

      <!-- 文章预览 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">文章预览</h3>
          <div class="copy-actions" id="copy-actions" style="display: none;">
            <button class="btn btn-sm btn-secondary" id="copy-md-btn" title="复制为Markdown格式">📋 复制 Markdown</button>
            <button class="btn btn-sm btn-secondary" id="copy-rich-btn" title="复制为富文本格式">📄 复制 富文本</button>
          </div>
        </div>
        <div class="card-body">
          <div id="article-preview" class="article-preview">
            <div class="empty-state">
              <div class="empty-icon">📖</div>
              <div class="empty-title">请选择文章</div>
              <div class="empty-desc">点击左侧文章列表查看预览</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 绑定文章选择事件
  container.querySelectorAll('.article-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const article = mockArticles.find(a => a.article_id === id);
      if (!article) return;

      selectedArticle = id;
      container.querySelectorAll('.article-list-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      // 渲染预览
      const preview = document.getElementById('article-preview');
      preview.innerHTML = markdownToHtml(article.content);

      // 显示复制按钮
      const copyActions = document.getElementById('copy-actions');
      copyActions.style.display = 'flex';

      // 绑定复制事件
      document.getElementById('copy-md-btn').onclick = () => {
        copyToClipboard(article.content);
      };
      document.getElementById('copy-rich-btn').onclick = () => {
        // 复制为富文本
        const html = markdownToHtml(article.content);
        const blob = new Blob([html], { type: 'text/html' });
        const plainBlob = new Blob([article.content], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blob,
          'text/plain': plainBlob
        });
        navigator.clipboard.write([item]).then(() => {
          showToast('已复制富文本到剪贴板', 'success');
        }).catch(() => {
          copyToClipboard(article.content);
        });
      };
    });
  });

  addArticleStyles();
}

function addArticleStyles() {
  if (document.getElementById('article-styles')) return;
  const style = document.createElement('style');
  style.id = 'article-styles';
  style.textContent = `
    .article-list { display: flex; flex-direction: column; gap: var(--space-2); }
    .article-list-item {
      padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);
      border: 1px solid var(--color-border-light); cursor: pointer;
      transition: all var(--transition-fast);
    }
    .article-list-item:hover { border-color: var(--color-accent-border); background: var(--color-accent-bg); }
    .article-list-item.selected { border-color: var(--color-accent); background: var(--color-accent-bg); }
    .article-list-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-primary); margin-bottom: var(--space-2); }
    .article-list-meta { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
    .article-scores {
      display: flex; gap: var(--space-3); margin-top: var(--space-2);
      padding-top: var(--space-2); border-top: 1px solid var(--color-border-light);
    }
    .mini-score { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: var(--text-xs); }
    .mini-score span:first-child { color: var(--color-text-tertiary); }
    .mini-score span:last-child { font-weight: var(--font-semibold); }
  `;
  document.head.appendChild(style);
}
