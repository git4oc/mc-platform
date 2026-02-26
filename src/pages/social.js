// 社交媒体管理页面
import { getSocialPosts, getArticles } from '../api.js';
import { formatDate, formatNumber, getStatusBadge } from '../utils.js';

export async function renderSocial(container) {
  container.innerHTML = `<div class="page-loading"><span class="loading-spinner"></span> 加载中...</div>`;
  const [mockSocialPosts, mockArticles] = await Promise.all([getSocialPosts(), getArticles()]);

  const published = mockSocialPosts.filter(p => p.status === 'published');
  const totalViews = published.reduce((s, p) => s + p.views, 0);
  const totalLikes = published.reduce((s, p) => s + p.likes, 0);
  const totalShares = published.reduce((s, p) => s + p.shares, 0);
  const totalComments = published.reduce((s, p) => s + p.comments, 0);

  // 按平台分组
  const platforms = {};
  mockSocialPosts.forEach(p => {
    if (!platforms[p.platform]) platforms[p.platform] = [];
    platforms[p.platform].push(p);
  });

  container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">社交媒体管理</h2>
      <p class="page-subtitle">社交平台内容发布与互动数据 · 共 ${mockSocialPosts.length} 条发布</p>
    </div>

    <!-- 互动数据 -->
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info)">👁️</div>
        <div class="stat-value">${formatNumber(totalViews)}</div>
        <div class="stat-label">总浏览量</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">❤️</div>
        <div class="stat-value">${formatNumber(totalLikes)}</div>
        <div class="stat-label">总点赞</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">🔄</div>
        <div class="stat-value">${formatNumber(totalShares)}</div>
        <div class="stat-label">总转发</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">💬</div>
        <div class="stat-value">${formatNumber(totalComments)}</div>
        <div class="stat-label">总评论</div>
      </div>
    </div>

    <!-- 发布列表 -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">发布记录</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>平台</th>
              <th>内容</th>
              <th>关联文章</th>
              <th>计划时间</th>
              <th>状态</th>
              <th>浏览</th>
              <th>点赞</th>
              <th>转发</th>
              <th>评论</th>
            </tr>
          </thead>
          <tbody>
            ${mockSocialPosts.map(p => {
    const status = getStatusBadge(p.status);
    const article = mockArticles.find(a => a.article_id === p.article_id);
    return `
                <tr>
                  <td><span class="badge badge-accent">${p.platform}</span></td>
                  <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text-primary)">${p.content}</td>
                  <td style="font-size: var(--text-xs)">${article ? article.title.slice(0, 15) + '...' : '-'}</td>
                  <td style="font-size: var(--text-xs)">${formatDate(p.scheduled_time)}</td>
                  <td><span class="badge ${status.class}">${status.text}</span></td>
                  <td style="font-weight: 500">${formatNumber(p.views)}</td>
                  <td style="color: var(--color-error)">${formatNumber(p.likes)}</td>
                  <td style="color: var(--color-success)">${formatNumber(p.shares)}</td>
                  <td style="color: var(--color-warning)">${formatNumber(p.comments)}</td>
                </tr>
              `;
  }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 按平台统计 -->
    <div class="grid-${Object.keys(platforms).length}" style="margin-top: var(--space-4);">
      ${Object.entries(platforms).map(([platform, posts]) => {
    const pubPosts = posts.filter(p => p.status === 'published');
    const views = pubPosts.reduce((s, p) => s + p.views, 0);
    const likes = pubPosts.reduce((s, p) => s + p.likes, 0);
    return `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${platform}</h3>
              <span class="badge badge-muted">${posts.length} 条</span>
            </div>
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                <div><span style="color: var(--color-text-tertiary)">浏览</span><br><strong>${formatNumber(views)}</strong></div>
                <div><span style="color: var(--color-text-tertiary)">点赞</span><br><strong>${formatNumber(likes)}</strong></div>
                <div><span style="color: var(--color-text-tertiary)">已发布</span><br><strong>${pubPosts.length}</strong></div>
              </div>
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}
