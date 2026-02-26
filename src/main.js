// Mission Control 可视化管理平台 - 主入口
import { Router } from './router.js';
import { renderLogin } from './pages/login.js';
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
import { logout, getCurrentUser, isLoggedIn } from './api.js';

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

    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open');
        } else {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('mc-sidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
        }
        e.stopPropagation(); // 防止触发点击外部关闭的逻辑
    });

    // 恢复侧边栏状态 (仅限桌面端)
    if (window.innerWidth > 768 && localStorage.getItem('mc-sidebar') === 'collapsed') {
        sidebar.classList.add('collapsed');
    }

    // 移动端：点击导航项自动收起
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });

    // 移动端：点击外部区域自动收起侧边栏
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
}

// 初始化路由
function initRouter() {
    const router = new Router();

    router
        .register('/login', renderLogin)
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

// 初始化用户信息显示 和 登出按钮
function initUserControls() {
    // 登出按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) logout();
        });
    }
    // 显示当前用户
    const user = getCurrentUser();
    const userNameEl = document.getElementById('current-user-name');
    if (userNameEl && user) {
        userNameEl.textContent = user.display_name || user.username || '';
    }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initUserControls();
    initRouter();
});
