// Mission Control API 客户端 v2
// 统一封装所有 API 调用，带 JWT 认证 + mock 降级

import {
    mockAgents, mockTasks, mockHotspots, mockArticles,
    mockSocialPosts, mockMessages, mockSystemLogs,
    mockSystemConfig, mockPerformanceData, mockTemplates
} from './data/mock-data.js';

// API 基地址
const API_BASE = import.meta.env.DEV
    ? 'http://localhost:8000'
    : '/api';

// ==================== Token 管理 ====================

export function getToken() {
    return localStorage.getItem('mc_token');
}

export function setToken(token) {
    localStorage.setItem('mc_token', token);
}

export function clearToken() {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_user');
}

export function isLoggedIn() {
    return !!getToken();
}

export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('mc_user') || 'null');
    } catch {
        return null;
    }
}

export function logout() {
    clearToken();
    window.location.hash = '#/login';
    window.location.reload();
}

// ==================== 请求工具 ====================

async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    // 自动附加 token（login 除外）
    const token = getToken();
    if (token && !endpoint.includes('/login')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        // Token 过期，跳转登录
        clearToken();
        window.location.hash = '#/login';
        throw new Error('认证已过期，请重新登录');
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `API error: ${response.status}`);
    }

    return response.json();
}

async function fetchWithFallback(endpoint, fallbackData, options = {}) {
    try {
        return await fetchAPI(endpoint, options);
    } catch (err) {
        // 401 不降级，必须登录
        if (err.message.includes('认证已过期') || err.message.includes('未提供认证')) {
            throw err;
        }
        console.warn(`[API] ${endpoint} 请求失败，使用本地数据:`, err.message);
        return fallbackData;
    }
}

// ==================== 认证 ====================

export async function login(username, password) {
    return fetchAPI('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

export async function verifyAuth() {
    return fetchAPI('/api/auth/me');
}

// ==================== 数据获取 ====================

export async function getAgents() {
    return fetchWithFallback('/api/agents', mockAgents);
}

export async function getTasks() {
    return fetchWithFallback('/api/tasks', mockTasks);
}

export async function getHotspots() {
    return fetchWithFallback('/api/hotspots', mockHotspots);
}

export async function getArticles() {
    return fetchWithFallback('/api/articles', mockArticles);
}

export async function getSocialPosts() {
    return fetchWithFallback('/api/social-posts', mockSocialPosts);
}

export async function getMessages() {
    return fetchWithFallback('/api/messages', mockMessages);
}

export async function getSystemLogs() {
    return fetchWithFallback('/api/system-logs', mockSystemLogs);
}

export async function getSystemConfig() {
    return fetchWithFallback('/api/system-config', mockSystemConfig);
}

export async function getPerformanceData() {
    return fetchWithFallback('/api/performance-data', mockPerformanceData);
}

export async function getTemplates() {
    return fetchWithFallback('/api/templates', mockTemplates);
}

// ==================== 写入操作 ====================

export async function createTask(taskData) {
    return fetchAPI('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
    });
}

export async function updateTask(taskId, data) {
    return fetchAPI(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteTask(taskId) {
    return fetchAPI(`/api/tasks/${taskId}`, { method: 'DELETE' });
}

export async function updateAgentStatus(agentId, status) {
    return fetchAPI(`/api/agents/${agentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

export async function getSystemOverview() {
    return fetchWithFallback('/api/system/overview', null);
}
