// 登录页面
import { login } from '../api.js';

export function renderLogin(container) {
    // 全屏登录页面，替换整个内容区域
    container.innerHTML = `
        <div class="login-page">
            <div class="login-card">
                <div class="login-header">
                    <div class="login-brand-icon">🛰️</div>
                    <h1 class="login-title">Mission Control</h1>
                    <p class="login-subtitle">智能体可视化管理平台</p>
                </div>
                
                <form id="login-form" class="login-form">
                    <div class="login-field">
                        <label for="login-username">用户名</label>
                        <div class="login-input-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <input type="text" id="login-username" placeholder="请输入用户名" autocomplete="username" autofocus />
                        </div>
                    </div>
                    
                    <div class="login-field">
                        <label for="login-password">密码</label>
                        <div class="login-input-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <input type="password" id="login-password" placeholder="请输入密码" autocomplete="current-password" />
                        </div>
                    </div>
                    
                    <div id="login-error" class="login-error" style="display:none"></div>
                    
                    <button type="submit" class="login-btn" id="login-submit">
                        <span class="login-btn-text">登 录</span>
                        <span class="login-btn-loading" style="display:none">
                            <span class="loading-spinner"></span> 登录中...
                        </span>
                    </button>
                </form>
                
                <div class="login-footer">
                    <span>Mission Control v2.0</span>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        const btnText = container.querySelector('.login-btn-text');
        const btnLoading = container.querySelector('.login-btn-loading');
        const submitBtn = document.getElementById('login-submit');

        if (!username || !password) {
            errorEl.textContent = '请输入用户名和密码';
            errorEl.style.display = 'block';
            return;
        }

        errorEl.style.display = 'none';
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        try {
            const result = await login(username, password);
            localStorage.setItem('mc_token', result.token);
            localStorage.setItem('mc_user', JSON.stringify({
                username: result.username,
                display_name: result.display_name,
                role: result.role
            }));
            // 跳转到仪表盘
            window.location.hash = '#/dashboard';
            window.location.reload();
        } catch (err) {
            errorEl.textContent = err.message || '登录失败，请检查用户名和密码';
            errorEl.style.display = 'block';
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}
