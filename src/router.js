// 简易 Hash Router
export class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    register(path, handler) {
        this.routes[path] = handler;
        return this;
    }

    handleRoute() {
        const hash = window.location.hash || '#/dashboard';
        const path = hash.replace('#', '');

        // 更新导航高亮
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === hash);
        });

        const handler = this.routes[path];
        if (handler) {
            this.currentPage = path;
            const container = document.getElementById('page-container');
            // 添加页面切换动画
            container.style.opacity = '0';
            container.style.transform = 'translateY(8px)';
            setTimeout(() => {
                handler(container);
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 150);
        }
    }

    start() {
        if (!window.location.hash) {
            window.location.hash = '#/dashboard';
        } else {
            this.handleRoute();
        }
    }
}
