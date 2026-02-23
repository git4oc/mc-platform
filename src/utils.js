// 工具函数

/**
 * 格式化时间为相对时间
 */
export function timeAgo(dateStr) {
    if (!dateStr) return '未知';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return formatDate(dateStr);
}

/**
 * 格式化日期
 */
export function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
}

/**
 * 格式化持续时间（秒 → 可读）
 */
export function formatDuration(seconds) {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}小时${m}分`;
}

/**
 * 获取状态标签样式类
 */
export function getStatusBadge(status) {
    const map = {
        'active': { class: 'badge-success', text: '活跃' },
        'standby': { class: 'badge-warning', text: '待命' },
        'inactive': { class: 'badge-error', text: '离线' },
        'completed': { class: 'badge-success', text: '已完成' },
        'in_progress': { class: 'badge-info', text: '进行中' },
        'pending': { class: 'badge-warning', text: '待处理' },
        'assigned': { class: 'badge-accent', text: '已分配' },
        'failed': { class: 'badge-error', text: '失败' },
        'new': { class: 'badge-info', text: '新发现' },
        'processed': { class: 'badge-success', text: '已处理' },
        'archived': { class: 'badge-muted', text: '已归档' },
        'draft': { class: 'badge-warning', text: '草稿' },
        'published': { class: 'badge-success', text: '已发布' },
        'scheduled': { class: 'badge-accent', text: '已排期' }
    };
    return map[status] || { class: 'badge-muted', text: status };
}

/**
 * 获取优先级标签
 */
export function getPriorityBadge(priority) {
    const map = {
        'high': { class: 'badge-error', text: '高优' },
        'medium': { class: 'badge-warning', text: '中等' },
        'low': { class: 'badge-muted', text: '低优' }
    };
    return map[priority] || { class: 'badge-muted', text: priority };
}

/**
 * 获取状态颜色（用于状态指示灯点）
 */
export function getStatusColor(status) {
    const map = {
        'active': 'var(--color-success)',
        'standby': 'var(--color-warning)',
        'inactive': 'var(--color-error)'
    };
    return map[status] || 'var(--color-text-muted)';
}

/**
 * 获取评分颜色
 */
export function getScoreColor(score) {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
}

/**
 * 显示toast通知
 */
export function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 简单的HTML转义
 */
export function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('已复制到剪贴板', 'success');
        return true;
    } catch (err) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('已复制到剪贴板', 'success');
        return true;
    }
}

/**
 * Markdown简易转HTML（用于文章预览）
 */
export function markdownToHtml(md) {
    if (!md) return '';
    return md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

/**
 * Markdown转富文本（用于复制到富文本编辑器）
 */
export function markdownToRichText(md) {
    const html = markdownToHtml(md);
    return html;
}

/**
 * 数字格式化（千分位）
 */
export function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
