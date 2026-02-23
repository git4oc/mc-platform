// 热点监控页面
import { mockHotspots } from '../data/mock-data.js';
import { timeAgo, getStatusBadge, getScoreColor } from '../utils.js';

export function renderHotspots(container) {
    const sorted = [...mockHotspots].sort((a, b) => b.total_score - a.total_score);
    const avgScore = Math.round(sorted.reduce((s, h) => s + h.total_score, 0) / sorted.length);
    const excellent = sorted.filter(h => h.total_score >= 80).length;
    const good = sorted.filter(h => h.total_score >= 60 && h.total_score < 80).length;
    const poor = sorted.filter(h => h.total_score < 60).length;

    container.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">热点监控</h2>
      <p class="page-subtitle">热点发现与评估跟踪 · 共 ${mockHotspots.length} 个热点</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">📊</div>
        <div class="stat-value">${avgScore}</div>
        <div class="stat-label">平均评分</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">⭐</div>
        <div class="stat-value">${excellent}</div>
        <div class="stat-label">优秀 (≥80)</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">👍</div>
        <div class="stat-value">${good}</div>
        <div class="stat-label">良好 (60-79)</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">📉</div>
        <div class="stat-value">${poor}</div>
        <div class="stat-label">一般 (<60)</div>
      </div>
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="new">新发现</button>
      <button class="filter-btn" data-filter="processed">已处理</button>
      <button class="filter-btn" data-filter="archived">已归档</button>
    </div>

    <div class="hotspot-grid" id="hotspot-grid">
      ${sorted.map(h => renderHotspotCard(h)).join('')}
    </div>
  `;

    // 绑定筛选
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            container.querySelectorAll('.hotspot-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.status === filter) ? '' : 'none';
            });
        });
    });

    addHotspotStyles();
}

function renderHotspotCard(hotspot) {
    const status = getStatusBadge(hotspot.status);
    const scores = [
        { label: '相关性', value: hotspot.relevance_score, color: 'var(--chart-1)' },
        { label: '新颖性', value: hotspot.novelty_score, color: 'var(--chart-2)' },
        { label: '实用性', value: hotspot.practicality_score, color: 'var(--chart-3)' },
        { label: '受众兴趣', value: hotspot.audience_interest_score, color: 'var(--chart-4)' }
    ];

    return `
    <div class="hotspot-card" data-status="${hotspot.status}">
      <div class="hotspot-header">
        <div>
          <div class="hotspot-title">${hotspot.title}</div>
          <div style="margin-top: var(--space-1); display: flex; align-items: center; gap: var(--space-2)">
            <span class="badge ${status.class}">${status.text}</span>
            <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${timeAgo(hotspot.discovered_at)}</span>
          </div>
        </div>
        <div class="hotspot-score" style="color: ${getScoreColor(hotspot.total_score)}">${hotspot.total_score}</div>
      </div>
      <div class="hotspot-summary">${hotspot.summary}</div>
      <div class="hotspot-scores">
        ${scores.map(s => `
          <div class="score-item">
            <div class="score-label">${s.label}</div>
            <div class="score-value" style="color: ${getScoreColor(s.value)}">${s.value}</div>
            <div class="score-bar">
              <div class="score-bar-fill" style="width: ${s.value}%; background: ${s.color}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      ${hotspot.sources_json ? `
        <div style="margin-top: var(--space-3); display: flex; gap: var(--space-1); flex-wrap: wrap;">
          ${hotspot.sources_json.map(s => `<span class="badge badge-muted">${s}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function addHotspotStyles() {
    if (document.getElementById('hotspot-styles')) return;
    const style = document.createElement('style');
    style.id = 'hotspot-styles';
    style.textContent = `
    .hotspot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: var(--space-4);
    }
    @media (max-width: 768px) {
      .hotspot-grid { grid-template-columns: 1fr; }
    }
  `;
    document.head.appendChild(style);
}
