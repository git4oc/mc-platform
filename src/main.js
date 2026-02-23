// Mission Control 可视化管理平台 - 主入口
import { Router } from './router.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderAgents } from './pages/agents.js';
import { renderTasks } from './pages/tasks.js';
import { renderHotspots } from './pages/hotspots.js';
import { renderArticles } from './pages/articles.js';
import { renderTemplates } from './pages/templates.js';
import { renderSocial } from './pages/social.js';
import { renderMessages } from './pages/messages.js';
import { renderMonitoring } from './pages/monitoring.js';
import { renderSettings } from './pages/settings.js';

// 初始化主题
function initTheme() {
    const saved = localStorage.getItem('mc-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('mc-theme', next);
    });
}

// 初始化侧边栏
function initSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('app-sidebar');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('mc-sidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
    });

    // 恢复侧边栏状态
    if (localStorage.getItem('mc-sidebar') === 'collapsed') {
        sidebar.classList.add('collapsed');
    }
}

// 初始化路由
function initRouter() {
    const router = new Router();

    router
        .register('/dashboard', renderDashboard)
        .register('/agents', renderAgents)
        .register('/tasks', renderTasks)
        .register('/hotspots', renderHotspots)
        .register('/articles', renderArticles)
        .register('/templates', renderTemplates)
        .register('/social', renderSocial)
        .register('/messages', renderMessages)
        .register('/monitoring', renderMonitoring)
        .register('/settings', renderSettings);

    router.start();
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initRouter();
});
