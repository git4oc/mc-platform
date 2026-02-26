// 简易 Hash Router（带认证守卫）
import { isLoggedIn } from './api.js';

export class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.publicRoutes = new Set(['/login']);
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    register(path, handler) {
        this.routes[path] = handler;
        return this;
    }

    async handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const path = hash.replace('#', '');

        // 认证守卫：未登录 + 非公开页面 → 跳转登录
        if (!this.publicRoutes.has(path) && !isLoggedIn()) {
            window.location.hash = '#/login';
            return;
        }

        // 已登录 + 访问登录页 → 跳转仪表盘
        if (path === '/login' && isLoggedIn()) {
            window.location.hash = '#/dashboard';
            return;
        }

        // 更新导航高亮（登录页不需要）
        if (path !== '/login') {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('href') === hash);
            });
        }

        const handler = this.routes[path];
        if (handler) {
            this.currentPage = path;
            const container = document.getElementById('page-container');

            // 登录页：隐藏侧边栏和头部
            const sidebar = document.querySelector('.app-sidebar');
            const header = document.querySelector('.app-header');
            if (path === '/login') {
                if (sidebar) sidebar.style.display = 'none';
                if (header) header.style.display = 'none';
                container.style.padding = '0';
            } else {
                if (sidebar) sidebar.style.display = '';
                if (header) header.style.display = '';
                container.style.padding = '';
            }

            // 页面切换动画
            container.style.opacity = '0';
            container.style.transform = 'translateY(8px)';
            setTimeout(async () => {
                await handler(container);
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 150);
        }
    }

    start() {
        if (!window.location.hash) {
            window.location.hash = isLoggedIn() ? '#/dashboard' : '#/login';
        } else {
            this.handleRoute();
        }
    }
}
