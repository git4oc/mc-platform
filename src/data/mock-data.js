// Mission Control 模拟数据（基于数据库结构）
// 后续将替换为真实API调用

export const mockAgents = [
    {
        agent_id: 'mission_control',
        agent_name: '任务管理器',
        agent_type: 'central_controller',
        version: '1.0.0',
        status: 'active',
        icon: '🎯',
        last_heartbeat: new Date(Date.now() - 60 * 1000).toISOString(),
        tasks: { total: 28, completed: 22, failed: 1, pending: 5 },
        latest_task: { title: '每日任务调度', status: 'completed' }
    },
    {
        agent_id: 'hotspot_scout',
        agent_name: '热点侦察兵',
        agent_type: 'hotspot_scout',
        version: '1.0.0',
        status: 'active',
        icon: '🔍',
        last_heartbeat: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        tasks: { total: 15, completed: 12, failed: 0, pending: 3 },
        latest_task: { title: '发现AI行业最新趋势', status: 'in_progress' }
    },
    {
        agent_id: 'content_creator',
        agent_name: '内容创作者',
        agent_type: 'content_creator',
        version: '1.0.0',
        status: 'standby',
        icon: '✍️',
        last_heartbeat: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        tasks: { total: 20, completed: 18, failed: 1, pending: 1 },
        latest_task: { title: '撰写中小企业数字化转型文章', status: 'completed' }
    },
    {
        agent_id: 'social_manager',
        agent_name: '社交媒体经理',
        agent_type: 'social_manager',
        version: '1.0.0',
        status: 'standby',
        icon: '📢',
        last_heartbeat: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        tasks: { total: 12, completed: 10, failed: 0, pending: 2 },
        latest_task: { title: '推广数字化转型文章', status: 'pending' }
    },
    {
        agent_id: 'tech_specialist',
        agent_name: '技术专家',
        agent_type: 'tech_specialist',
        version: '1.0.0',
        status: 'standby',
        icon: '🔧',
        last_heartbeat: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        tasks: { total: 8, completed: 7, failed: 0, pending: 1 },
        latest_task: { title: '检查系统备份状态', status: 'pending' }
    },
    {
        agent_id: 'data_analyst',
        agent_name: '数据分析师',
        agent_type: 'data_analyst',
        version: '1.0.0',
        status: 'active',
        icon: '📊',
        last_heartbeat: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        tasks: { total: 10, completed: 8, failed: 0, pending: 2 },
        latest_task: { title: '分析公众号用户增长趋势', status: 'in_progress' }
    }
];

export const mockTasks = [
    {
        task_id: 'task_001', task_type: 'content_creation',
        title: '撰写中小企业数字化转型文章', description: '基于热点数据创作一篇1500字的文章',
        assigned_to: 'content_creator', assigned_by: 'mission_control',
        status: 'completed', priority: 'high',
        deadline: '2026-02-22 12:00:00',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86400000).toISOString(),
        estimated_duration: 7200, actual_duration: 5400
    },
    {
        task_id: 'task_002', task_type: 'data_analysis',
        title: '分析公众号用户增长趋势', description: '分析最近30天的用户增长数据',
        assigned_to: 'data_analyst', assigned_by: 'mission_control',
        status: 'in_progress', priority: 'medium',
        deadline: '2026-02-22 18:00:00',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        started_at: new Date(Date.now() - 3600000).toISOString(),
        estimated_duration: 3600, actual_duration: null
    },
    {
        task_id: 'task_003', task_type: 'tech_maintenance',
        title: '检查系统备份状态', description: '验证数据库备份和系统日志',
        assigned_to: 'tech_specialist', assigned_by: 'mission_control',
        status: 'pending', priority: 'low',
        deadline: '2026-02-23 08:00:00',
        created_at: new Date(Date.now() - 43200000).toISOString(),
        estimated_duration: 1800, actual_duration: null
    },
    {
        task_id: 'task_004', task_type: 'hotspot_scouting',
        title: '发现AI行业最新趋势', description: '搜索并分析AI行业的最新热点',
        assigned_to: 'hotspot_scout', assigned_by: 'mission_control',
        status: 'in_progress', priority: 'high',
        deadline: '2026-02-22 08:00:00',
        created_at: new Date(Date.now() - 21600000).toISOString(),
        started_at: new Date(Date.now() - 7200000).toISOString(),
        estimated_duration: 3600, actual_duration: null
    },
    {
        task_id: 'task_005', task_type: 'social_promotion',
        title: '推广数字化转型文章', description: '在社交媒体平台推广最新文章',
        assigned_to: 'social_manager', assigned_by: 'mission_control',
        status: 'pending', priority: 'medium',
        deadline: '2026-02-22 18:00:00',
        created_at: new Date(Date.now() - 10800000).toISOString(),
        estimated_duration: 2400, actual_duration: null
    },
    {
        task_id: 'task_006', task_type: 'content_creation',
        title: '创作AI应用案例分析文章', description: '基于AI在制造业的应用案例热点创作深度分析',
        assigned_to: 'content_creator', assigned_by: 'mission_control',
        status: 'assigned', priority: 'high',
        deadline: '2026-02-23 12:00:00',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        estimated_duration: 7200, actual_duration: null
    },
    {
        task_id: 'task_007', task_type: 'hotspot_scouting',
        title: '今日热点侦察', description: '执行每日热点发现任务',
        assigned_to: 'hotspot_scout', assigned_by: 'mission_control',
        status: 'completed', priority: 'high',
        deadline: '2026-02-21 08:00:00',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        completed_at: new Date(Date.now() - 2.5 * 86400000).toISOString(),
        estimated_duration: 3600, actual_duration: 3200
    },
    {
        task_id: 'task_008', task_type: 'data_analysis',
        title: '月度内容质量报告', description: '生成月度文章质量评分报告',
        assigned_to: 'data_analyst', assigned_by: 'mission_control',
        status: 'completed', priority: 'medium',
        deadline: '2026-02-20 18:00:00',
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        completed_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        estimated_duration: 5400, actual_duration: 4800
    }
];

export const mockHotspots = [
    {
        hotspot_id: 'hs_001', title: '中小企业数字化转型的5个关键步骤',
        summary: '分析中小企业数字化转型的常见挑战，提出5个关键实施步骤，包括技术选型、团队培训、流程优化等。',
        content: '受到全球数字化转型大潮的推动，越来越多的中小企业开始关注如何将业务数字化...',
        relevance_score: 85, novelty_score: 75, practicality_score: 90, audience_interest_score: 80, total_score: 82,
        sources_json: ['百度指数', '微信指数', '行业报告'],
        discovered_by: 'hotspot_scout', status: 'processed',
        discovered_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
        hotspot_id: 'hs_002', title: 'AI在制造业的实际应用案例',
        summary: '探讨AI技术在制造业中的具体应用场景，分析实施效果和ROI，包括预测性维护、质量控制、供应链优化等。',
        content: '随着人工智能技术的不断成熟，制造业成为了AI落地应用最具潜力的领域之一...',
        relevance_score: 78, novelty_score: 85, practicality_score: 80, audience_interest_score: 75, total_score: 79,
        sources_json: ['36氪', '极客公园', '制造业论坛'],
        discovered_by: 'hotspot_scout', status: 'new',
        discovered_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
        hotspot_id: 'hs_003', title: '云计算成本优化的10个技巧',
        summary: '分享云计算成本控制的实用技巧，帮助企业降低IT支出，包括资源优化、预留实例、自动伸缩等策略。',
        content: '云计算已经成为企业IT基础设施的重要组成部分，但不断增长的云支出也成为了...',
        relevance_score: 72, novelty_score: 70, practicality_score: 85, audience_interest_score: 65, total_score: 73,
        sources_json: ['InfoQ', 'CSDN', '云栖社区'],
        discovered_by: 'hotspot_scout', status: 'new',
        discovered_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        hotspot_id: 'hs_004', title: '2026年AI Agent发展趋势预测',
        summary: '分析AI Agent在2026年的发展方向，包括多模态交互、自主决策、工具使用等关键技术突破。',
        content: '2026年被业界称为"AI Agent元年"，多个重要技术突破正在推动AI Agent从概念走向...',
        relevance_score: 92, novelty_score: 90, practicality_score: 75, audience_interest_score: 95, total_score: 88,
        sources_json: ['OpenAI Blog', 'DeepMind', 'arXiv'],
        discovered_by: 'hotspot_scout', status: 'new',
        discovered_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date(Date.now() - 3600000).toISOString()
    }
];

export const mockArticles = [
    {
        article_id: 'art_001', title: '中小企业数字化转型：5个关键步骤助你迈向智能运营',
        content: `# 中小企业数字化转型：5个关键步骤助你迈向智能运营

## 引言
在数字化浪潮席卷全球的今天，中小企业面临着前所未有的机遇与挑战。数字化转型不再是可选项，而是企业生存和发展的必经之路。

## 第一步：明确转型目标
数字化转型首先需要明确目标。企业应该从业务痛点出发，找到最能产生价值的切入点。

## 第二步：技术选型与评估
选择合适的技术栈是转型成功的关键。不要盲目追求最新技术，而应该选择最适合自己的。

## 第三步：团队培训与能力建设
技术只是工具，人才才是核心。企业需要投入足够的资源进行团队培训。

## 第四步：流程再造与优化
数字化转型不仅是技术升级，更是业务流程的重新设计。

## 第五步：持续迭代与优化
数字化是一个持续的过程，需要不断迭代优化，紧跟时代步伐。

## 总结
中小企业的数字化转型虽然充满挑战，但只要把握好方向、选好路径、建好团队，就一定能够实现成功转型。`,
        author: 'content_creator', content_type: 'industry_analysis',
        target_length: 1500, actual_length: 1560,
        readability_score: 88, engagement_score: 82, seo_score: 92, originality_score: 78, overall_score: 85,
        source_hotspot_id: 'hs_001', status: 'published',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        published_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        article_id: 'art_002', title: 'AI赋能制造业：从预测性维护到智能质检的落地实践',
        content: `# AI赋能制造业：从预测性维护到智能质检的落地实践

## 概述
人工智能正在深刻改变制造业的面貌，越来越多的企业开始尝试将AI技术融入到生产环节中...

## 场景一：预测性维护
利用机器学习算法分析设备运行数据，提前预测设备故障...

## 场景二：智能质检
基于计算机视觉技术，实现产品质量的自动检测...

## ROI分析
以某中型制造企业为例，实施AI解决方案后...`,
        author: 'content_creator', content_type: 'case_study',
        target_length: 2000, actual_length: 1850,
        readability_score: 85, engagement_score: 78, seo_score: 88, originality_score: 82, overall_score: 83,
        source_hotspot_id: 'hs_002', status: 'draft',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        published_at: null
    }
];

export const mockSocialPosts = [
    {
        post_id: 'post_001', platform: '微信公众号',
        content: '🚀 中小企业数字化转型，5个关键步骤助你迈向智能运营！从技术选型到团队建设，一文读懂转型全流程 →',
        article_id: 'art_001', scheduled_time: '2026-02-21 10:00:00',
        actual_post_time: '2026-02-21 10:05:00', status: 'published',
        post_url: 'https://mp.weixin.qq.com/s/xxxxx',
        views: 2850, likes: 128, shares: 45, comments: 23,
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        post_id: 'post_002', platform: '知乎',
        content: '如何看待中小企业数字化转型趋势？来看看我们从行业数据中总结的5个关键步骤...',
        article_id: 'art_001', scheduled_time: '2026-02-21 14:00:00',
        actual_post_time: '2026-02-21 14:10:00', status: 'published',
        post_url: 'https://zhuanlan.zhihu.com/p/xxxxx',
        views: 1560, likes: 86, shares: 32, comments: 15,
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        post_id: 'post_003', platform: '头条号',
        content: '数字化转型不是大企业的专利！中小企业如何用5步实现智能运营升级？',
        article_id: 'art_001', scheduled_time: '2026-02-22 09:00:00',
        actual_post_time: null, status: 'scheduled',
        views: 0, likes: 0, shares: 0, comments: 0,
        created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
        post_id: 'post_004', platform: '微信公众号',
        content: '🤖 AI在制造业的真实应用案例：预测性维护让设备故障率降低60%，智能质检准确率达99.5%！',
        article_id: 'art_002', scheduled_time: '2026-02-23 10:00:00',
        actual_post_time: null, status: 'scheduled',
        views: 0, likes: 0, shares: 0, comments: 0,
        created_at: new Date(Date.now() - 1800000).toISOString()
    }
];

export const mockMessages = [
    {
        message_id: 'msg_001', protocol_version: '1.0.0',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        sender_agent_id: 'hotspot_scout', sender_agent_name: '热点侦察兵',
        receiver_agent_id: 'mission_control', receiver_agent_name: '任务管理器',
        message_type: 'hotspot_report', priority: 'high',
        payload_json: { hotspot: '中小企业数字化转型', trend_score: 85, sources: ['百度指数', '微信指数', '行业报告'] },
        metadata_json: { source: '自动侦察', confidence: 0.92 },
        status: 'processed'
    },
    {
        message_id: 'msg_002', protocol_version: '1.0.0',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        sender_agent_id: 'mission_control', sender_agent_name: '任务管理器',
        receiver_agent_id: 'content_creator', receiver_agent_name: '内容创作者',
        message_type: 'task_assignment', priority: 'high',
        payload_json: { task_id: 'task_001', title: '撰写中小企业数字化转型文章', deadline: '2026-02-22T12:00:00Z' },
        metadata_json: { assignment_reason: '热点匹配度高', priority_reason: '时效性强' },
        status: 'processed'
    },
    {
        message_id: 'msg_003', protocol_version: '1.0.0',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        sender_agent_id: 'content_creator', sender_agent_name: '内容创作者',
        receiver_agent_id: 'mission_control', receiver_agent_name: '任务管理器',
        message_type: 'task_completion', priority: 'medium',
        payload_json: { task_id: 'task_001', result: '文章已创作完成', word_count: 1560 },
        metadata_json: { quality_score: 88, seo_score: 92 },
        status: 'processed'
    },
    {
        message_id: 'msg_004', protocol_version: '1.0.0',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        sender_agent_id: 'mission_control', sender_agent_name: '任务管理器',
        receiver_agent_id: 'social_manager', receiver_agent_name: '社交媒体经理',
        message_type: 'task_assignment', priority: 'medium',
        payload_json: { task_id: 'task_005', title: '推广数字化转型文章', platforms: ['微信公众号', '知乎', '头条号'] },
        metadata_json: { target_audience: '中小企业主', promotion_budget: '自然流量' },
        status: 'pending'
    },
    {
        message_id: 'msg_005', protocol_version: '1.0.0',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        sender_agent_id: 'data_analyst', sender_agent_name: '数据分析师',
        receiver_agent_id: 'mission_control', receiver_agent_name: '任务管理器',
        message_type: 'analysis_report', priority: 'medium',
        payload_json: { report_type: '用户增长分析', period: '30天', growth_rate: '15%', key_findings: ['新增用户来源主要为搜索引擎', '文章阅读完成率78%', '公众号打开率12.5%'] },
        metadata_json: { data_quality: 'high', confidence: 0.88 },
        status: 'processed'
    }
];

export const mockSystemLogs = [
    { log_id: 'log_001', timestamp: new Date(Date.now() - 86400000).toISOString(), level: 'info', agent_id: 'mission_control', component: 'system', message: '系统初始化完成' },
    { log_id: 'log_002', timestamp: new Date(Date.now() - 64800000).toISOString(), level: 'info', agent_id: 'hotspot_scout', component: 'scouting', message: '发现新热点: 中小企业数字化转型' },
    { log_id: 'log_003', timestamp: new Date(Date.now() - 36000000).toISOString(), level: 'warning', agent_id: 'content_creator', component: 'content', message: '文章生成延迟30分钟' },
    { log_id: 'log_004', timestamp: new Date(Date.now() - 18000000).toISOString(), level: 'info', agent_id: 'data_analyst', component: 'analysis', message: '用户增长分析完成, 增长率15%' },
    { log_id: 'log_005', timestamp: new Date(Date.now() - 7200000).toISOString(), level: 'info', agent_id: 'mission_control', component: 'task_system', message: '任务分配完成: AI行业热点侦察' },
    { log_id: 'log_006', timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'info', agent_id: 'hotspot_scout', component: 'scouting', message: '发现高分热点: 2026年AI Agent发展趋势预测 (88分)' },
    { log_id: 'log_007', timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'warning', agent_id: 'tech_specialist', component: 'backup', message: '数据库备份文件大小异常，需要检查' },
    { log_id: 'log_008', timestamp: new Date(Date.now() - 900000).toISOString(), level: 'error', agent_id: 'social_manager', component: 'posting', message: '头条号发布失败：API限流' },
    { log_id: 'log_009', timestamp: new Date(Date.now() - 600000).toISOString(), level: 'info', agent_id: 'mission_control', component: 'health_check', message: '智能体健康检查完成: 3个活跃, 3个待命' },
    { log_id: 'log_010', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'info', agent_id: 'data_analyst', component: 'metrics', message: '性能指标采集完成' }
];

export const mockSystemConfig = [
    { config_key: 'system_name', config_value: 'Mission Control可视化管理系统', config_type: 'string', description: '系统名称' },
    { config_key: 'system_version', config_value: '2.0.0', config_type: 'string', description: '系统版本' },
    { config_key: 'system_mode', config_value: 'production', config_type: 'string', description: '系统运行模式' },
    { config_key: 'protocol_version', config_value: '1.0.0', config_type: 'string', description: '通信协议版本' },
    { config_key: 'timezone', config_value: 'Asia/Shanghai', config_type: 'string', description: '系统时区' },
    { config_key: 'max_concurrent_tasks', config_value: '10', config_type: 'number', description: '最大并发任务数' },
    { config_key: 'agent_health_check_interval', config_value: '300', config_type: 'number', description: '智能体健康检查间隔(秒)' },
    { config_key: 'task_timeout_hours', config_value: '24', config_type: 'number', description: '任务超时时间(小时)' },
    { config_key: 'backup_enabled', config_value: 'true', config_type: 'boolean', description: '是否启用备份' },
    { config_key: 'notification_enabled', config_value: 'true', config_type: 'boolean', description: '是否启用通知' },
    { config_key: 'total_agents', config_value: '6', config_type: 'number', description: '智能体总数' },
    { config_key: 'database_version', config_value: '1.0.0', config_type: 'string', description: '数据库版本' }
];

export const mockPerformanceData = {
    labels: ['02-16', '02-17', '02-18', '02-19', '02-20', '02-21', '02-22'],
    datasets: {
        taskCompletion: [4, 6, 5, 7, 8, 6, 3],
        hotspotCount: [2, 3, 1, 4, 2, 3, 1],
        articleCount: [1, 2, 1, 1, 2, 1, 0],
        avgResponseTime: [2.1, 1.8, 2.5, 1.9, 2.0, 1.7, 2.2]
    }
};

export const mockTemplates = [
    {
        template_id: 'tpl_001',
        name: '微信公众号深度分析文章',
        platform: '微信公众号',
        category: '行业分析',
        prompt: `你是一位资深的行业分析师和公众号内容创作者。请根据以下要求撰写一篇微信公众号深度分析文章：

**主题**: {{topic}}
**目标字数**: {{word_count}} 字
**目标受众**: {{audience}}

## 写作要求
1. 标题吸引眼球，包含数字或疑问句式
2. 开头用一个引人入胜的场景或数据切入
3. 正文分3-5个小节，每节配有小标题
4. 每个论点需要有数据或案例支撑
5. 结尾给出可执行的建议或展望
6. 适当使用 emoji 增加可读性
7. 语言风格：专业但不晦涩，适合非专业读者理解

## 格式要求
- 使用 Markdown 格式
- 小标题使用 ## 格式
- 重要观点加粗标注
- 适配微信公众号排版`,
        variables: ['{{topic}}', '{{word_count}}', '{{audience}}'],
        target_length: 2000,
        tone: '专业严谨',
        status: 'active',
        usage_count: 23,
        last_used_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
        template_id: 'tpl_002',
        name: '知乎专业回答模板',
        platform: '知乎',
        category: '技术教程',
        prompt: `你是一位在知乎上拥有10万+关注者的技术领域优质回答者。请撰写一篇专业且有深度的知乎风格文章：

**主题**: {{topic}}
**目标字数**: {{word_count}} 字
**技术领域**: {{tech_domain}}

## 写作要求
1. 开头先给出核心结论（"先说结论"风格）
2. 用通俗类比解释专业概念
3. 层层递进地展开论述，逻辑清晰
4. 引用权威来源和真实数据
5. 适当加入个人经验和见解
6. 结尾总结核心要点

## 格式要求
- 使用 Markdown 格式
- 适当使用有序/无序列表
- 代码片段用代码块包裹
- 重要结论加粗`,
        variables: ['{{topic}}', '{{word_count}}', '{{tech_domain}}'],
        target_length: 2500,
        tone: '专业严谨',
        status: 'active',
        usage_count: 18,
        last_used_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
        template_id: 'tpl_003',
        name: '头条号热点速评',
        platform: '头条号',
        category: '新闻速报',
        prompt: `你是今日头条平台的一位资深自媒体人。请根据以下热点信息撰写一篇头条号文章：

**热点话题**: {{topic}}
**热点来源**: {{source}}
**目标字数**: {{word_count}} 字

## 写作要求
1. 标题必须有冲击力，适合信息流分发（可用"震惊体"但不低俗）
2. 第一段就要抓住读者注意力
3. 快速给出事件背景和核心观点
4. 多角度分析热点背后的深层原因
5. 语言通俗易懂，节奏明快
6. 结尾引导互动（提问或投票）

## 注意事项
- 避免敏感话题和争议性言论
- 确保信息准确性
- 适配头条号推荐算法偏好`,
        variables: ['{{topic}}', '{{source}}', '{{word_count}}'],
        target_length: 1200,
        tone: '通俗易懂',
        status: 'active',
        usage_count: 31,
        last_used_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        template_id: 'tpl_004',
        name: '小红书种草笔记',
        platform: '小红书',
        category: '案例研究',
        prompt: `你是小红书平台的一位万粉博主。请创作一篇适合小红书风格的种草/分享笔记：

**分享主题**: {{topic}}
**产品/工具**: {{product}}
**目标字数**: {{word_count}} 字

## 写作要求
1. 标题使用小红书爆款标题公式（含emoji + 关键词 + 数字）
2. 开头用个人体验引入，真实感强
3. 正文按使用步骤/体验分点描述
4. 突出亮点和痛点解决
5. 配图指导说明（标注哪些地方需要配图）
6. 结尾加话题标签

## 风格特点
- 语气亲切，像朋友分享
- 大量使用 emoji 表情
- 短句为主，阅读轻松
- 包含互动话术`,
        variables: ['{{topic}}', '{{product}}', '{{word_count}}'],
        target_length: 800,
        tone: '轻松活泼',
        status: 'active',
        usage_count: 12,
        last_used_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
        template_id: 'tpl_005',
        name: '通用观点评论文章',
        platform: '通用',
        category: '观点评论',
        prompt: `你是一位有独到见解的专栏作家。请就以下话题撰写一篇观点鲜明的评论文章：

**评论话题**: {{topic}}
**立场倾向**: {{stance}}
**目标字数**: {{word_count}} 字

## 写作要求
1. 开篇即亮出核心观点
2. 用3个分论点支撑主论点
3. 每个分论点配备有力论据
4. 考虑并回应可能的反对意见
5. 结尾升华主题或给出行动呼吁
6. 语言犀利但有理有据

## 格式要求
- Markdown 格式
- 清晰的段落结构
- 适当使用引用块
- 可跨平台发布`,
        variables: ['{{topic}}', '{{stance}}', '{{word_count}}'],
        target_length: 1500,
        tone: '专业严谨',
        status: 'disabled',
        usage_count: 7,
        last_used_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
    }
];
