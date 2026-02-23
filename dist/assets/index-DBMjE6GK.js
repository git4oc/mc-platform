(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const l of e)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(e){const l={};return e.integrity&&(l.integrity=e.integrity),e.referrerPolicy&&(l.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?l.credentials="include":e.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(e){if(e.ep)return;e.ep=!0;const l=s(e);fetch(e.href,l)}})();class W{constructor(){this.routes={},this.currentPage=null,window.addEventListener("hashchange",()=>this.handleRoute())}register(a,s){return this.routes[a]=s,this}handleRoute(){const a=window.location.hash||"#/dashboard",s=a.replace("#","");document.querySelectorAll(".nav-item").forEach(e=>{e.classList.toggle("active",e.getAttribute("href")===a)});const o=this.routes[s];if(o){this.currentPage=s;const e=document.getElementById("page-container");e.style.opacity="0",e.style.transform="translateY(8px)",setTimeout(()=>{o(e),e.style.opacity="1",e.style.transform="translateY(0)"},150)}}start(){window.location.hash?this.handleRoute():window.location.hash="#/dashboard"}}const u=[{agent_id:"mission_control",agent_name:"任务管理器",agent_type:"central_controller",version:"1.0.0",status:"active",icon:"🎯",last_heartbeat:new Date(Date.now()-60*1e3).toISOString(),tasks:{total:28,completed:22,failed:1,pending:5},latest_task:{title:"每日任务调度",status:"completed"}},{agent_id:"hotspot_scout",agent_name:"热点侦察兵",agent_type:"hotspot_scout",version:"1.0.0",status:"active",icon:"🔍",last_heartbeat:new Date(Date.now()-180*1e3).toISOString(),tasks:{total:15,completed:12,failed:0,pending:3},latest_task:{title:"发现AI行业最新趋势",status:"in_progress"}},{agent_id:"content_creator",agent_name:"内容创作者",agent_type:"content_creator",version:"1.0.0",status:"standby",icon:"✍️",last_heartbeat:new Date(Date.now()-600*1e3).toISOString(),tasks:{total:20,completed:18,failed:1,pending:1},latest_task:{title:"撰写中小企业数字化转型文章",status:"completed"}},{agent_id:"social_manager",agent_name:"社交媒体经理",agent_type:"social_manager",version:"1.0.0",status:"standby",icon:"📢",last_heartbeat:new Date(Date.now()-1500*1e3).toISOString(),tasks:{total:12,completed:10,failed:0,pending:2},latest_task:{title:"推广数字化转型文章",status:"pending"}},{agent_id:"tech_specialist",agent_name:"技术专家",agent_type:"tech_specialist",version:"1.0.0",status:"standby",icon:"🔧",last_heartbeat:new Date(Date.now()-2100*1e3).toISOString(),tasks:{total:8,completed:7,failed:0,pending:1},latest_task:{title:"检查系统备份状态",status:"pending"}},{agent_id:"data_analyst",agent_name:"数据分析师",agent_type:"data_analyst",version:"1.0.0",status:"active",icon:"📊",last_heartbeat:new Date(Date.now()-120*1e3).toISOString(),tasks:{total:10,completed:8,failed:0,pending:2},latest_task:{title:"分析公众号用户增长趋势",status:"in_progress"}}],w=[{task_id:"task_001",task_type:"content_creation",title:"撰写中小企业数字化转型文章",description:"基于热点数据创作一篇1500字的文章",assigned_to:"content_creator",assigned_by:"mission_control",status:"completed",priority:"high",deadline:"2026-02-22 12:00:00",created_at:new Date(Date.now()-2*864e5).toISOString(),completed_at:new Date(Date.now()-864e5).toISOString(),estimated_duration:7200,actual_duration:5400},{task_id:"task_002",task_type:"data_analysis",title:"分析公众号用户增长趋势",description:"分析最近30天的用户增长数据",assigned_to:"data_analyst",assigned_by:"mission_control",status:"in_progress",priority:"medium",deadline:"2026-02-22 18:00:00",created_at:new Date(Date.now()-864e5).toISOString(),started_at:new Date(Date.now()-36e5).toISOString(),estimated_duration:3600,actual_duration:null},{task_id:"task_003",task_type:"tech_maintenance",title:"检查系统备份状态",description:"验证数据库备份和系统日志",assigned_to:"tech_specialist",assigned_by:"mission_control",status:"pending",priority:"low",deadline:"2026-02-23 08:00:00",created_at:new Date(Date.now()-432e5).toISOString(),estimated_duration:1800,actual_duration:null},{task_id:"task_004",task_type:"hotspot_scouting",title:"发现AI行业最新趋势",description:"搜索并分析AI行业的最新热点",assigned_to:"hotspot_scout",assigned_by:"mission_control",status:"in_progress",priority:"high",deadline:"2026-02-22 08:00:00",created_at:new Date(Date.now()-216e5).toISOString(),started_at:new Date(Date.now()-72e5).toISOString(),estimated_duration:3600,actual_duration:null},{task_id:"task_005",task_type:"social_promotion",title:"推广数字化转型文章",description:"在社交媒体平台推广最新文章",assigned_to:"social_manager",assigned_by:"mission_control",status:"pending",priority:"medium",deadline:"2026-02-22 18:00:00",created_at:new Date(Date.now()-108e5).toISOString(),estimated_duration:2400,actual_duration:null},{task_id:"task_006",task_type:"content_creation",title:"创作AI应用案例分析文章",description:"基于AI在制造业的应用案例热点创作深度分析",assigned_to:"content_creator",assigned_by:"mission_control",status:"assigned",priority:"high",deadline:"2026-02-23 12:00:00",created_at:new Date(Date.now()-36e5).toISOString(),estimated_duration:7200,actual_duration:null},{task_id:"task_007",task_type:"hotspot_scouting",title:"今日热点侦察",description:"执行每日热点发现任务",assigned_to:"hotspot_scout",assigned_by:"mission_control",status:"completed",priority:"high",deadline:"2026-02-21 08:00:00",created_at:new Date(Date.now()-3*864e5).toISOString(),completed_at:new Date(Date.now()-2.5*864e5).toISOString(),estimated_duration:3600,actual_duration:3200},{task_id:"task_008",task_type:"data_analysis",title:"月度内容质量报告",description:"生成月度文章质量评分报告",assigned_to:"data_analyst",assigned_by:"mission_control",status:"completed",priority:"medium",deadline:"2026-02-20 18:00:00",created_at:new Date(Date.now()-4*864e5).toISOString(),completed_at:new Date(Date.now()-3*864e5).toISOString(),estimated_duration:5400,actual_duration:4800}],L=[{hotspot_id:"hs_001",title:"中小企业数字化转型的5个关键步骤",summary:"分析中小企业数字化转型的常见挑战，提出5个关键实施步骤，包括技术选型、团队培训、流程优化等。",content:"受到全球数字化转型大潮的推动，越来越多的中小企业开始关注如何将业务数字化...",relevance_score:85,novelty_score:75,practicality_score:90,audience_interest_score:80,total_score:82,sources_json:["百度指数","微信指数","行业报告"],discovered_by:"hotspot_scout",status:"processed",discovered_at:new Date(Date.now()-3*864e5).toISOString(),created_at:new Date(Date.now()-3*864e5).toISOString()},{hotspot_id:"hs_002",title:"AI在制造业的实际应用案例",summary:"探讨AI技术在制造业中的具体应用场景，分析实施效果和ROI，包括预测性维护、质量控制、供应链优化等。",content:"随着人工智能技术的不断成熟，制造业成为了AI落地应用最具潜力的领域之一...",relevance_score:78,novelty_score:85,practicality_score:80,audience_interest_score:75,total_score:79,sources_json:["36氪","极客公园","制造业论坛"],discovered_by:"hotspot_scout",status:"new",discovered_at:new Date(Date.now()-2*864e5).toISOString(),created_at:new Date(Date.now()-2*864e5).toISOString()},{hotspot_id:"hs_003",title:"云计算成本优化的10个技巧",summary:"分享云计算成本控制的实用技巧，帮助企业降低IT支出，包括资源优化、预留实例、自动伸缩等策略。",content:"云计算已经成为企业IT基础设施的重要组成部分，但不断增长的云支出也成为了...",relevance_score:72,novelty_score:70,practicality_score:85,audience_interest_score:65,total_score:73,sources_json:["InfoQ","CSDN","云栖社区"],discovered_by:"hotspot_scout",status:"new",discovered_at:new Date(Date.now()-864e5).toISOString(),created_at:new Date(Date.now()-864e5).toISOString()},{hotspot_id:"hs_004",title:"2026年AI Agent发展趋势预测",summary:"分析AI Agent在2026年的发展方向，包括多模态交互、自主决策、工具使用等关键技术突破。",content:'2026年被业界称为"AI Agent元年"，多个重要技术突破正在推动AI Agent从概念走向...',relevance_score:92,novelty_score:90,practicality_score:75,audience_interest_score:95,total_score:88,sources_json:["OpenAI Blog","DeepMind","arXiv"],discovered_by:"hotspot_scout",status:"new",discovered_at:new Date(Date.now()-36e5).toISOString(),created_at:new Date(Date.now()-36e5).toISOString()}],S=[{article_id:"art_001",title:"中小企业数字化转型：5个关键步骤助你迈向智能运营",content:`# 中小企业数字化转型：5个关键步骤助你迈向智能运营

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
中小企业的数字化转型虽然充满挑战，但只要把握好方向、选好路径、建好团队，就一定能够实现成功转型。`,author:"content_creator",content_type:"industry_analysis",target_length:1500,actual_length:1560,readability_score:88,engagement_score:82,seo_score:92,originality_score:78,overall_score:85,source_hotspot_id:"hs_001",status:"published",created_at:new Date(Date.now()-2*864e5).toISOString(),published_at:new Date(Date.now()-864e5).toISOString()},{article_id:"art_002",title:"AI赋能制造业：从预测性维护到智能质检的落地实践",content:`# AI赋能制造业：从预测性维护到智能质检的落地实践

## 概述
人工智能正在深刻改变制造业的面貌，越来越多的企业开始尝试将AI技术融入到生产环节中...

## 场景一：预测性维护
利用机器学习算法分析设备运行数据，提前预测设备故障...

## 场景二：智能质检
基于计算机视觉技术，实现产品质量的自动检测...

## ROI分析
以某中型制造企业为例，实施AI解决方案后...`,author:"content_creator",content_type:"case_study",target_length:2e3,actual_length:1850,readability_score:85,engagement_score:78,seo_score:88,originality_score:82,overall_score:83,source_hotspot_id:"hs_002",status:"draft",created_at:new Date(Date.now()-864e5).toISOString(),published_at:null}],M=[{post_id:"post_001",platform:"微信公众号",content:"🚀 中小企业数字化转型，5个关键步骤助你迈向智能运营！从技术选型到团队建设，一文读懂转型全流程 →",article_id:"art_001",scheduled_time:"2026-02-21 10:00:00",actual_post_time:"2026-02-21 10:05:00",status:"published",post_url:"https://mp.weixin.qq.com/s/xxxxx",views:2850,likes:128,shares:45,comments:23,created_at:new Date(Date.now()-864e5).toISOString()},{post_id:"post_002",platform:"知乎",content:"如何看待中小企业数字化转型趋势？来看看我们从行业数据中总结的5个关键步骤...",article_id:"art_001",scheduled_time:"2026-02-21 14:00:00",actual_post_time:"2026-02-21 14:10:00",status:"published",post_url:"https://zhuanlan.zhihu.com/p/xxxxx",views:1560,likes:86,shares:32,comments:15,created_at:new Date(Date.now()-864e5).toISOString()},{post_id:"post_003",platform:"头条号",content:"数字化转型不是大企业的专利！中小企业如何用5步实现智能运营升级？",article_id:"art_001",scheduled_time:"2026-02-22 09:00:00",actual_post_time:null,status:"scheduled",views:0,likes:0,shares:0,comments:0,created_at:new Date(Date.now()-36e5).toISOString()},{post_id:"post_004",platform:"微信公众号",content:"🤖 AI在制造业的真实应用案例：预测性维护让设备故障率降低60%，智能质检准确率达99.5%！",article_id:"art_002",scheduled_time:"2026-02-23 10:00:00",actual_post_time:null,status:"scheduled",views:0,likes:0,shares:0,comments:0,created_at:new Date(Date.now()-18e5).toISOString()}],O=[{message_id:"msg_001",protocol_version:"1.0.0",timestamp:new Date(Date.now()-2*864e5).toISOString(),sender_agent_id:"hotspot_scout",sender_agent_name:"热点侦察兵",receiver_agent_id:"mission_control",receiver_agent_name:"任务管理器",message_type:"hotspot_report",priority:"high",payload_json:{hotspot:"中小企业数字化转型",trend_score:85,sources:["百度指数","微信指数","行业报告"]},metadata_json:{source:"自动侦察",confidence:.92},status:"processed"},{message_id:"msg_002",protocol_version:"1.0.0",timestamp:new Date(Date.now()-864e5).toISOString(),sender_agent_id:"mission_control",sender_agent_name:"任务管理器",receiver_agent_id:"content_creator",receiver_agent_name:"内容创作者",message_type:"task_assignment",priority:"high",payload_json:{task_id:"task_001",title:"撰写中小企业数字化转型文章",deadline:"2026-02-22T12:00:00Z"},metadata_json:{assignment_reason:"热点匹配度高",priority_reason:"时效性强"},status:"processed"},{message_id:"msg_003",protocol_version:"1.0.0",timestamp:new Date(Date.now()-432e5).toISOString(),sender_agent_id:"content_creator",sender_agent_name:"内容创作者",receiver_agent_id:"mission_control",receiver_agent_name:"任务管理器",message_type:"task_completion",priority:"medium",payload_json:{task_id:"task_001",result:"文章已创作完成",word_count:1560},metadata_json:{quality_score:88,seo_score:92},status:"processed"},{message_id:"msg_004",protocol_version:"1.0.0",timestamp:new Date(Date.now()-216e5).toISOString(),sender_agent_id:"mission_control",sender_agent_name:"任务管理器",receiver_agent_id:"social_manager",receiver_agent_name:"社交媒体经理",message_type:"task_assignment",priority:"medium",payload_json:{task_id:"task_005",title:"推广数字化转型文章",platforms:["微信公众号","知乎","头条号"]},metadata_json:{target_audience:"中小企业主",promotion_budget:"自然流量"},status:"pending"},{message_id:"msg_005",protocol_version:"1.0.0",timestamp:new Date(Date.now()-72e5).toISOString(),sender_agent_id:"data_analyst",sender_agent_name:"数据分析师",receiver_agent_id:"mission_control",receiver_agent_name:"任务管理器",message_type:"analysis_report",priority:"medium",payload_json:{report_type:"用户增长分析",period:"30天",growth_rate:"15%",key_findings:["新增用户来源主要为搜索引擎","文章阅读完成率78%","公众号打开率12.5%"]},metadata_json:{data_quality:"high",confidence:.88},status:"processed"}],A=[{log_id:"log_001",timestamp:new Date(Date.now()-864e5).toISOString(),level:"info",agent_id:"mission_control",component:"system",message:"系统初始化完成"},{log_id:"log_002",timestamp:new Date(Date.now()-648e5).toISOString(),level:"info",agent_id:"hotspot_scout",component:"scouting",message:"发现新热点: 中小企业数字化转型"},{log_id:"log_003",timestamp:new Date(Date.now()-36e6).toISOString(),level:"warning",agent_id:"content_creator",component:"content",message:"文章生成延迟30分钟"},{log_id:"log_004",timestamp:new Date(Date.now()-18e6).toISOString(),level:"info",agent_id:"data_analyst",component:"analysis",message:"用户增长分析完成, 增长率15%"},{log_id:"log_005",timestamp:new Date(Date.now()-72e5).toISOString(),level:"info",agent_id:"mission_control",component:"task_system",message:"任务分配完成: AI行业热点侦察"},{log_id:"log_006",timestamp:new Date(Date.now()-36e5).toISOString(),level:"info",agent_id:"hotspot_scout",component:"scouting",message:"发现高分热点: 2026年AI Agent发展趋势预测 (88分)"},{log_id:"log_007",timestamp:new Date(Date.now()-18e5).toISOString(),level:"warning",agent_id:"tech_specialist",component:"backup",message:"数据库备份文件大小异常，需要检查"},{log_id:"log_008",timestamp:new Date(Date.now()-9e5).toISOString(),level:"error",agent_id:"social_manager",component:"posting",message:"头条号发布失败：API限流"},{log_id:"log_009",timestamp:new Date(Date.now()-6e5).toISOString(),level:"info",agent_id:"mission_control",component:"health_check",message:"智能体健康检查完成: 3个活跃, 3个待命"},{log_id:"log_010",timestamp:new Date(Date.now()-12e4).toISOString(),level:"info",agent_id:"data_analyst",component:"metrics",message:"性能指标采集完成"}],C=[{config_key:"system_name",config_value:"Mission Control可视化管理系统",config_type:"string",description:"系统名称"},{config_key:"system_version",config_value:"2.0.0",config_type:"string",description:"系统版本"},{config_key:"system_mode",config_value:"production",config_type:"string",description:"系统运行模式"},{config_key:"protocol_version",config_value:"1.0.0",config_type:"string",description:"通信协议版本"},{config_key:"timezone",config_value:"Asia/Shanghai",config_type:"string",description:"系统时区"},{config_key:"max_concurrent_tasks",config_value:"10",config_type:"number",description:"最大并发任务数"},{config_key:"agent_health_check_interval",config_value:"300",config_type:"number",description:"智能体健康检查间隔(秒)"},{config_key:"task_timeout_hours",config_value:"24",config_type:"number",description:"任务超时时间(小时)"},{config_key:"backup_enabled",config_value:"true",config_type:"boolean",description:"是否启用备份"},{config_key:"notification_enabled",config_value:"true",config_type:"boolean",description:"是否启用通知"},{config_key:"total_agents",config_value:"6",config_type:"number",description:"智能体总数"},{config_key:"database_version",config_value:"1.0.0",config_type:"string",description:"数据库版本"}],y=[{template_id:"tpl_001",name:"微信公众号深度分析文章",platform:"微信公众号",category:"行业分析",prompt:`你是一位资深的行业分析师和公众号内容创作者。请根据以下要求撰写一篇微信公众号深度分析文章：

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
- 适配微信公众号排版`,variables:["{{topic}}","{{word_count}}","{{audience}}"],target_length:2e3,tone:"专业严谨",status:"active",usage_count:23,last_used_at:new Date(Date.now()-864e5).toISOString(),created_at:new Date(Date.now()-15*864e5).toISOString(),updated_at:new Date(Date.now()-2*864e5).toISOString()},{template_id:"tpl_002",name:"知乎专业回答模板",platform:"知乎",category:"技术教程",prompt:`你是一位在知乎上拥有10万+关注者的技术领域优质回答者。请撰写一篇专业且有深度的知乎风格文章：

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
- 重要结论加粗`,variables:["{{topic}}","{{word_count}}","{{tech_domain}}"],target_length:2500,tone:"专业严谨",status:"active",usage_count:18,last_used_at:new Date(Date.now()-2*864e5).toISOString(),created_at:new Date(Date.now()-12*864e5).toISOString(),updated_at:new Date(Date.now()-3*864e5).toISOString()},{template_id:"tpl_003",name:"头条号热点速评",platform:"头条号",category:"新闻速报",prompt:`你是今日头条平台的一位资深自媒体人。请根据以下热点信息撰写一篇头条号文章：

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
- 适配头条号推荐算法偏好`,variables:["{{topic}}","{{source}}","{{word_count}}"],target_length:1200,tone:"通俗易懂",status:"active",usage_count:31,last_used_at:new Date(Date.now()-36e5).toISOString(),created_at:new Date(Date.now()-20*864e5).toISOString(),updated_at:new Date(Date.now()-864e5).toISOString()},{template_id:"tpl_004",name:"小红书种草笔记",platform:"小红书",category:"案例研究",prompt:`你是小红书平台的一位万粉博主。请创作一篇适合小红书风格的种草/分享笔记：

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
- 包含互动话术`,variables:["{{topic}}","{{product}}","{{word_count}}"],target_length:800,tone:"轻松活泼",status:"active",usage_count:12,last_used_at:new Date(Date.now()-5*864e5).toISOString(),created_at:new Date(Date.now()-8*864e5).toISOString(),updated_at:new Date(Date.now()-5*864e5).toISOString()},{template_id:"tpl_005",name:"通用观点评论文章",platform:"通用",category:"观点评论",prompt:`你是一位有独到见解的专栏作家。请就以下话题撰写一篇观点鲜明的评论文章：

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
- 可跨平台发布`,variables:["{{topic}}","{{stance}}","{{word_count}}"],target_length:1500,tone:"专业严谨",status:"disabled",usage_count:7,last_used_at:new Date(Date.now()-10*864e5).toISOString(),created_at:new Date(Date.now()-25*864e5).toISOString(),updated_at:new Date(Date.now()-10*864e5).toISOString()}];function $(t){if(!t)return"未知";const a=new Date(t),o=new Date-a,e=Math.floor(o/6e4),l=Math.floor(o/36e5),i=Math.floor(o/864e5);return e<1?"刚刚":e<60?`${e}分钟前`:l<24?`${l}小时前`:i<7?`${i}天前`:I(t)}function I(t){if(!t)return"-";const a=new Date(t),s=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),e=String(a.getDate()).padStart(2,"0"),l=String(a.getHours()).padStart(2,"0"),i=String(a.getMinutes()).padStart(2,"0");return`${s}-${o}-${e} ${l}:${i}`}function R(t){if(!t)return"-";if(t<60)return`${t}秒`;if(t<3600)return`${Math.floor(t/60)}分${t%60}秒`;const a=Math.floor(t/3600),s=Math.floor(t%3600/60);return`${a}小时${s}分`}function b(t){return{active:{class:"badge-success",text:"活跃"},standby:{class:"badge-warning",text:"待命"},inactive:{class:"badge-error",text:"离线"},completed:{class:"badge-success",text:"已完成"},in_progress:{class:"badge-info",text:"进行中"},pending:{class:"badge-warning",text:"待处理"},assigned:{class:"badge-accent",text:"已分配"},failed:{class:"badge-error",text:"失败"},new:{class:"badge-info",text:"新发现"},processed:{class:"badge-success",text:"已处理"},archived:{class:"badge-muted",text:"已归档"},draft:{class:"badge-warning",text:"草稿"},published:{class:"badge-success",text:"已发布"},scheduled:{class:"badge-accent",text:"已排期"}}[t]||{class:"badge-muted",text:t}}function B(t){return{high:{class:"badge-error",text:"高优"},medium:{class:"badge-warning",text:"中等"},low:{class:"badge-muted",text:"低优"}}[t]||{class:"badge-muted",text:t}}function N(t){return{active:"var(--color-success)",standby:"var(--color-warning)",inactive:"var(--color-error)"}[t]||"var(--color-text-muted)"}function D(t){return t>=80?"var(--color-success)":t>=60?"var(--color-warning)":"var(--color-error)"}function k(t,a="info"){let s=document.querySelector(".toast-container");s||(s=document.createElement("div"),s.className="toast-container",document.body.appendChild(s));const o=document.createElement("div");o.className=`toast ${a}`,o.textContent=t,s.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100%)",setTimeout(()=>o.remove(),300)},3e3)}function X(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}async function T(t){try{return await navigator.clipboard.writeText(t),k("已复制到剪贴板","success"),!0}catch{const s=document.createElement("textarea");return s.value=t,s.style.position="fixed",s.style.opacity="0",document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s),k("已复制到剪贴板","success"),!0}}function P(t){return t?t.replace(/^### (.*$)/gim,"<h3>$1</h3>").replace(/^## (.*$)/gim,"<h2>$1</h2>").replace(/^# (.*$)/gim,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}function x(t){return t==null?"0":t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}const v=(t,a=20)=>`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,Z={agents:v('<circle cx="12" cy="8" r="3"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="20" cy="7" r="2"/><circle cx="4" cy="7" r="2"/>'),tasks:v('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>'),hotspot:v('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'),chart:v('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),globe:v('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>'),check:v('<polyline points="20 6 9 17 4 12"/>'),refresh:v('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>'),template:v('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/>'),message:v('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'),monitor:v('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),log:v('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),settings:v('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.26.61.87 1 1.51 1H21a2 2 0 010 4h-.09c-.64.01-1.25.4-1.51 1z"/>'),plus:v('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),edit:v('<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>'),trash:v('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>'),copy:v('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>'),save:v('<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>'),send:v('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>'),x:v('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),arrowRight:v('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),back:v('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),eye:v('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),inbox:v('<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>'),social:v('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>'),arrowUp:v('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',12),arrowDown:v('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',12)};function d(t,a=20){const s=Z[t];return s?s.replace(/width="\d+"/,`width="${a}"`).replace(/height="\d+"/,`height="${a}"`):""}function Q(t){const a=u.filter(r=>r.status==="active").length,s=u.length,o=w.filter(r=>r.status==="completed").length,e=w.length,l=L.filter(r=>r.status==="new").length,i=4410,n=214,c=Math.round(o/e*100);t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">系统仪表盘</h2>
      <p class="page-subtitle">Mission Control 系统运行概览 · 实时监控中</p>
    </div>

    <!-- 核心指标 -->
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border)">${d("agents",20)}</div>
        <div class="stat-value">${a}<span class="stat-value-sub">/${s}</span></div>
        <div class="stat-label">智能体在线</div>
        <div class="stat-trend up">${d("arrowUp",12)} 全部正常</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info); border: 1px solid var(--color-info-border)">${d("tasks",20)}</div>
        <div class="stat-value">${c}<span class="stat-value-sub">%</span></div>
        <div class="stat-label">任务完成率</div>
        <div class="stat-trend up">${d("arrowUp",12)} ${o}/${e} 完成</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border)">${d("hotspot",20)}</div>
        <div class="stat-value">${l}</div>
        <div class="stat-label">待处理热点</div>
        <div class="stat-trend up">${d("arrowUp",12)} 新发现</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--chart-5)">
        <div class="stat-icon" style="background: rgba(244,114,182,0.1); color: var(--chart-5); border: 1px solid rgba(244,114,182,0.2)">${d("chart",20)}</div>
        <div class="stat-value">${x(i)}</div>
        <div class="stat-label">内容总浏览</div>
        <div class="stat-trend up">${d("arrowUp",12)} ${n} 互动</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- 智能体状态 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${d("agents",16)} 智能体状态</h3>
          <a href="#/agents" class="btn btn-sm btn-secondary">查看全部 ${d("arrowRight",12)}</a>
        </div>
        <div class="card-body">
          <div class="agent-mini-list">
            ${u.map(r=>{const p=b(r.status);return`
              <div class="dash-agent-row">
                <div class="dash-agent-left">
                  <span class="dash-agent-icon">${r.icon}</span>
                  <div class="dash-agent-info">
                    <span class="dash-agent-name">${r.agent_name}</span>
                    <span class="dash-agent-time">${$(r.last_heartbeat)}</span>
                  </div>
                </div>
                <span class="badge ${p.class}">${p.text}</span>
              </div>`}).join("")}
          </div>
        </div>
      </div>

      <!-- 最新任务 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${d("tasks",16)} 最新任务</h3>
          <a href="#/tasks" class="btn btn-sm btn-secondary">查看全部 ${d("arrowRight",12)}</a>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>任务</th><th>分配给</th><th>优先级</th><th>状态</th></tr></thead>
            <tbody>
              ${w.slice(0,5).map(r=>{const p=u.find(m=>m.agent_id===r.assigned_to),_=b(r.status),g=B(r.priority);return`<tr>
                  <td style="color: var(--color-text-primary); font-weight: var(--font-semibold)">${r.title}</td>
                  <td>${p?p.icon+" "+p.agent_name:r.assigned_to}</td>
                  <td><span class="badge ${g.class}">${g.text}</span></td>
                  <td><span class="badge ${_.class}">${_.text}</span></td>
                </tr>`}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: var(--space-4)">
      <!-- 热点排行 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${d("hotspot",16)} 热点排行</h3>
          <a href="#/hotspots" class="btn btn-sm btn-secondary">查看全部 ${d("arrowRight",12)}</a>
        </div>
        <div class="card-body">
          ${[...L].sort((r,p)=>p.total_score-r.total_score).slice(0,5).map((r,p)=>`
            <div class="dash-hotspot-row">
              <span class="dash-rank ${p<3?"top":""}">${p+1}</span>
              <div class="dash-hotspot-info">
                <div class="dash-hotspot-title">${r.title}</div>
                <div class="dash-hotspot-meta">
                  ${$(r.discovered_at)} · <span class="badge ${b(r.status).class}">${b(r.status).text}</span>
                </div>
              </div>
              <span class="dash-score" style="color: ${D(r.total_score)}">${r.total_score}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- 最新消息 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${d("message",16)} 最新消息</h3>
          <a href="#/messages" class="btn btn-sm btn-secondary">查看全部 ${d("arrowRight",12)}</a>
        </div>
        <div class="card-body">
          <div class="timeline">
            ${O.slice(0,5).map(r=>{var _;const p={hotspot_report:"提交热点报告",task_assignment:"分配任务",task_completion:"完成任务",analysis_report:"提交分析报告"};return`
              <div class="timeline-item">
                <div class="timeline-dot">${((_=u.find(g=>g.agent_id===r.sender_agent_id))==null?void 0:_.icon)||d("inbox",16)}</div>
                <div class="timeline-content">
                  <div class="timeline-title">${r.sender_agent_name} → ${r.receiver_agent_name}</div>
                  <div class="timeline-desc">${p[r.message_type]||r.message_type}</div>
                </div>
                <div class="timeline-time">${$(r.timestamp)}</div>
              </div>`}).join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- 系统日志 -->
    <div class="card" style="margin-top: var(--space-4)">
      <div class="card-header">
        <h3 class="card-title">${d("log",16)} 最新系统日志</h3>
        <a href="#/monitoring" class="btn btn-sm btn-secondary">查看全部 ${d("arrowRight",12)}</a>
      </div>
      <div class="card-body">
        <div class="log-list">
          ${A.slice(0,6).map(r=>`
            <div class="log-item">
              <span class="log-level ${r.level}">${r.level}</span>
              <span class="log-time">${$(r.timestamp)}</span>
              <span class="log-agent">[${r.agent_id}]</span>
              <span class="log-message">${r.message}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,tt()}function tt(){if(document.getElementById("dashboard-v2-styles"))return;const t=document.createElement("style");t.id="dashboard-v2-styles",t.textContent=`
    .stat-value-sub {
      font-size: var(--text-base);
      font-weight: var(--font-normal);
      color: var(--color-text-muted);
      margin-left: 2px;
    }
    .card-title { display: flex; align-items: center; gap: var(--space-2); }
    .card-title svg { opacity: 0.6; }
    .stat-icon { display: flex; align-items: center; justify-content: center; }
    .stat-trend svg { vertical-align: middle; margin-right: 2px; }
    .dash-agent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2-5) var(--space-3);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .dash-agent-row:hover { background: var(--color-accent-bg); }
    .dash-agent-left { display: flex; align-items: center; gap: var(--space-3); }
    .dash-agent-icon { font-size: 1.15rem; }
    .dash-agent-info { display: flex; flex-direction: column; }
    .dash-agent-name {
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--color-text-primary);
    }
    .dash-agent-time {
      font-size: 10px;
      color: var(--color-text-muted);
    }
    .dash-hotspot-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-3);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .dash-hotspot-row:hover { background: var(--color-accent-bg); }
    .dash-rank {
      font-size: var(--text-lg);
      font-weight: var(--font-extrabold);
      width: 28px;
      text-align: center;
      color: var(--color-text-muted);
    }
    .dash-rank.top { color: var(--color-warning); }
    .dash-hotspot-info { flex: 1; min-width: 0; }
    .dash-hotspot-title {
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--color-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dash-hotspot-meta {
      font-size: 10px;
      color: var(--color-text-muted);
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .dash-score {
      font-size: var(--text-xl);
      font-weight: var(--font-extrabold);
      letter-spacing: -0.03em;
    }
  `,document.head.appendChild(t)}function et(t){const a=u.filter(e=>e.status==="active").length,s=u.filter(e=>e.status==="standby").length,o=u.filter(e=>e.status==="inactive").length;t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">智能体管理</h2>
      <p class="page-subtitle">监控所有AI智能体的运行状态 · 共 ${u.length} 个智能体</p>
    </div>

    <!-- 状态统计 -->
    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">🟢</div>
        <div class="stat-value">${a}</div>
        <div class="stat-label">活跃中</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">🟡</div>
        <div class="stat-value">${s}</div>
        <div class="stat-label">待命中</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">🔴</div>
        <div class="stat-value">${o}</div>
        <div class="stat-label">已离线</div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="active">活跃</button>
      <button class="filter-btn" data-filter="standby">待命</button>
      <button class="filter-btn" data-filter="inactive">离线</button>
    </div>

    <!-- 智能体卡片 -->
    <div class="agent-cards" id="agent-cards">
      ${u.map(e=>at(e)).join("")}
    </div>
  `,t.querySelectorAll(".filter-btn").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".filter-btn").forEach(n=>n.classList.remove("active")),e.classList.add("active");const l=e.dataset.filter;t.querySelectorAll(".agent-card").forEach(n=>{l==="all"||n.dataset.status===l?n.style.display="":n.style.display="none"})})})}function at(t){const a=b(t.status),s=t.tasks.total>0?Math.round(t.tasks.completed/t.tasks.total*100):0;return`
    <div class="agent-card" data-status="${t.status}">
      <div class="agent-header">
        <div class="agent-avatar">${t.icon}</div>
        <div class="agent-info">
          <div class="agent-name">${t.agent_name}</div>
          <div class="agent-type">${t.agent_id} · v${t.version}</div>
        </div>
        <div class="agent-status-dot" style="background: ${N(t.status)}; box-shadow: 0 0 8px ${N(t.status)}" title="${a.text}"></div>
      </div>

      <div class="agent-meta">
        <div class="meta-item">
          <span class="meta-label">状态</span>
          <span class="meta-value"><span class="badge ${a.class}">${a.text}</span></span>
        </div>
        <div class="meta-item">
          <span class="meta-label">最后心跳</span>
          <span class="meta-value">${$(t.last_heartbeat)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">任务总数</span>
          <span class="meta-value">${t.tasks.total}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">完成率</span>
          <span class="meta-value" style="color: ${s>=80?"var(--color-success)":s>=60?"var(--color-warning)":"var(--color-error)"}">${s}%</span>
        </div>
      </div>

      ${t.latest_task?`
        <div class="agent-task-preview">
          <span>最新任务:</span>
          <span class="task-title">${t.latest_task.title}</span>
          <span class="badge ${b(t.latest_task.status).class}">${b(t.latest_task.status).text}</span>
        </div>
      `:""}

      <!-- 完成率进度条 -->
      <div style="margin-top: var(--space-3)">
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${s}%; background: ${s>=80?"var(--color-success)":s>=60?"var(--color-warning)":"var(--color-error)"}"></div>
        </div>
      </div>
    </div>
  `}let z="kanban";const st={hotspot_scouting:"热点侦察",content_creation:"内容创作",social_promotion:"社媒推广",data_analysis:"数据分析",tech_maintenance:"技术维护"};function H(t){const a={pending:w.filter(o=>o.status==="pending"),assigned:w.filter(o=>o.status==="assigned"),in_progress:w.filter(o=>o.status==="in_progress"),completed:w.filter(o=>o.status==="completed"),failed:w.filter(o=>o.status==="failed")};t.innerHTML=`
    <div class="page-header" style="display: flex; align-items: flex-start; justify-content: space-between;">
      <div>
        <h2 class="page-title">任务管理</h2>
        <p class="page-subtitle">任务调度与进度跟踪 · 共 ${w.length} 个任务</p>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-3);">
        <div class="tabs" style="border-bottom: none; margin-bottom: 0;">
          <button class="tab ${z==="kanban"?"active":""}" data-view="kanban">看板视图</button>
          <button class="tab ${z==="list"?"active":""}" data-view="list">列表视图</button>
        </div>
      </div>
    </div>

    <!-- 统计 -->
    <div class="stats-grid" style="grid-template-columns: repeat(5, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-value">${a.pending.length}</div>
        <div class="stat-label">待处理</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-value">${a.assigned.length}</div>
        <div class="stat-label">已分配</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-value">${a.in_progress.length}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-value">${a.completed.length}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-value">${a.failed.length}</div>
        <div class="stat-label">失败</div>
      </div>
    </div>

    <div id="task-view-container">
      ${z==="kanban"?ot(a):it()}
    </div>

    <!-- 提交新任务（内联） -->
    <div class="card" style="margin-top: var(--space-8); border-top: 4px solid var(--color-primary);">
      <div class="card-header" style="border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-4); margin-bottom: var(--space-6);">
        <h3 class="card-title" style="display: flex; align-items: center; gap: var(--space-2);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary)">
            <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
          提交新任务
        </h3>
        <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px">描述你的任务目标，Mission Control 将自动进行任务规划、拆分与分配。</p>
      </div>

      <!-- 工作流提示 -->
      <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); margin-bottom: var(--space-6); background: var(--color-bg-tertiary); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">📝</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">提交需求</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="flex-shrink: 0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">🎯</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">管理员规划</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="flex-shrink: 0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">🤖</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">Agent 执行</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="flex-shrink: 0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 1; justify-content: center;">
          <span style="font-size: 20px;">📊</span>
          <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">结果汇报</span>
        </div>
      </div>
      
      <div class="form-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6);">
        <div class="form-left-col">
          <div class="form-group">
            <label class="form-label">任务目标 <span style="color: var(--color-error)">*</span></label>
            <input type="text" class="form-input" id="task-title" placeholder="简要描述你的目标，如：围绕 AI Agent 话题产出并发布一篇深度文章" />
          </div>
          <div class="form-group">
            <label class="form-label">详细要求</label>
            <textarea class="form-input form-textarea" id="task-desc" rows="5" placeholder="补充说明任务的具体要求、期望产出、参考素材等...
例如：
- 文章不少于1500字，风格专业但通俗易懂
- 需要包含实际案例和数据支撑
- 完成后同步发布到微信公众号和知乎"></textarea>
          </div>
        </div>
        
        <div class="form-right-col">
          <div class="form-group">
            <label class="form-label">优先级</label>
            <select class="form-input" id="task-priority">
              <option value="high">🔴 高优 · 立即处理</option>
              <option value="medium" selected>🟡 中等 · 按计划推进</option>
              <option value="low">⚪ 低优 · 空闲时处理</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">期望完成时间</label>
            <input type="datetime-local" class="form-input" id="task-deadline" />
          </div>
          <div class="form-group">
            <label class="form-label">负责人</label>
            <div style="display: flex; align-items: center; gap: var(--space-2); padding: 10px var(--space-4); background: var(--color-bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <span style="font-size: 20px;">🎯</span>
              <div>
                <div style="font-weight: 600; font-size: var(--text-sm); color: var(--color-text-primary);">任务管理器 (Mission Control)</div>
                <div style="font-size: var(--text-xs); color: var(--color-text-muted);">自动规划并分配给最合适的 Agent</div>
              </div>
            </div>
          </div>
          <div style="margin-top: var(--space-6); display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-lg" id="task-save-btn" style="width: 100%; justify-content: center; height: 48px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              提交给 Mission Control
            </button>
          </div>
        </div>
      </div>
    </div>
  `,t.querySelectorAll(".tab").forEach(o=>{o.addEventListener("click",()=>{z=o.dataset.view,H(t)})}),(()=>{const o=new Date(Date.now()+864e5),e=o.getFullYear(),l=String(o.getMonth()+1).padStart(2,"0"),i=String(o.getDate()).padStart(2,"0"),n=String(o.getHours()).padStart(2,"0"),c=String(o.getMinutes()).padStart(2,"0"),r=document.getElementById("task-deadline");r&&(r.value=`${e}-${l}-${i}T${n}:${c}`)})(),document.getElementById("task-save-btn").addEventListener("click",()=>{const o=document.getElementById("task-title").value.trim(),e=document.getElementById("task-desc").value.trim(),l=document.getElementById("task-priority").value,i=document.getElementById("task-deadline").value;if(!o){k("请填写任务目标","warning");return}const n=new Date,p={task_id:`task_${n.toISOString().replace(/[-T:\.Z]/g,"").slice(0,14)}_${String(w.length+1).padStart(3,"0")}`,task_type:"general",title:o,description:e||"用户通过管理平台提交的任务",assigned_to:"mission_control",assigned_by:"user",status:"pending",priority:l,deadline:i?i.replace("T"," ")+":00":null,created_at:n.toISOString(),estimated_duration:null,actual_duration:null};w.unshift(p),k(`任务「${o}」已提交给 Mission Control，将自动规划分配`,"success"),H(t)})}function ot(t){return`
    <div class="kanban-board">
      ${[{key:"pending",title:"待处理",color:"var(--color-warning)"},{key:"assigned",title:"已分配",color:"var(--color-accent)"},{key:"in_progress",title:"进行中",color:"var(--color-info)"},{key:"completed",title:"已完成",color:"var(--color-success)"},{key:"failed",title:"失败",color:"var(--color-error)"}].map(s=>`
        <div class="kanban-column">
          <div class="kanban-column-header">
            <span class="kanban-column-title" style="color: ${s.color}">${s.title}</span>
            <span class="kanban-column-count">${(t[s.key]||[]).length}</span>
          </div>
          <div class="kanban-cards">
            ${(t[s.key]||[]).map(o=>{const e=u.find(i=>i.agent_id===o.assigned_to),l=B(o.priority);return`
                <div class="kanban-card">
                  <div class="kanban-card-title">${o.title}</div>
                  <div class="kanban-card-meta">
                    <span class="kanban-card-agent">${e?e.icon+" "+e.agent_name:o.assigned_to}</span>
                    <span class="badge ${l.class}">${l.text}</span>
                  </div>
                  ${o.deadline?`<div style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-2)">截止: ${I(o.deadline)}</div>`:""}
                </div>
              `}).join("")||'<div class="empty-state" style="padding: var(--space-6)"><div class="empty-icon">📭</div><div class="empty-desc">暂无任务</div></div>'}
          </div>
        </div>
      `).join("")}
    </div>
  `}function it(){return`
    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>任务ID</th>
            <th>标题</th>
            <th>类型</th>
            <th>分配给</th>
            <th>优先级</th>
            <th>状态</th>
            <th>截止时间</th>
            <th>耗时</th>
          </tr>
        </thead>
        <tbody>
          ${w.map(t=>{const a=u.find(e=>e.agent_id===t.assigned_to),s=b(t.status),o=B(t.priority);return`
              <tr>
                <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted)">${t.task_id}</td>
                <td style="color: var(--color-text-primary); font-weight: 500">${t.title}</td>
                <td>${st[t.task_type]||t.task_type}</td>
                <td>${a?a.icon+" "+a.agent_name:t.assigned_to}</td>
                <td><span class="badge ${o.class}">${o.text}</span></td>
                <td><span class="badge ${s.class}">${s.text}</span></td>
                <td style="font-size: var(--text-xs)">${t.deadline?I(t.deadline):"-"}</td>
                <td style="font-size: var(--text-xs)">
                  ${t.actual_duration?R(t.actual_duration):t.estimated_duration?"预估 "+R(t.estimated_duration):"-"}
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function rt(t){const a=[...L].sort((i,n)=>n.total_score-i.total_score),s=Math.round(a.reduce((i,n)=>i+n.total_score,0)/a.length),o=a.filter(i=>i.total_score>=80).length,e=a.filter(i=>i.total_score>=60&&i.total_score<80).length,l=a.filter(i=>i.total_score<60).length;t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">热点监控</h2>
      <p class="page-subtitle">热点发现与评估跟踪 · 共 ${L.length} 个热点</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">📊</div>
        <div class="stat-value">${s}</div>
        <div class="stat-label">平均评分</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">⭐</div>
        <div class="stat-value">${o}</div>
        <div class="stat-label">优秀 (≥80)</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">👍</div>
        <div class="stat-value">${e}</div>
        <div class="stat-label">良好 (60-79)</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">📉</div>
        <div class="stat-value">${l}</div>
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
      ${a.map(i=>lt(i)).join("")}
    </div>
  `,t.querySelectorAll(".filter-btn").forEach(i=>{i.addEventListener("click",()=>{t.querySelectorAll(".filter-btn").forEach(c=>c.classList.remove("active")),i.classList.add("active");const n=i.dataset.filter;t.querySelectorAll(".hotspot-card").forEach(c=>{c.style.display=n==="all"||c.dataset.status===n?"":"none"})})}),nt()}function lt(t){const a=b(t.status),s=[{label:"相关性",value:t.relevance_score,color:"var(--chart-1)"},{label:"新颖性",value:t.novelty_score,color:"var(--chart-2)"},{label:"实用性",value:t.practicality_score,color:"var(--chart-3)"},{label:"受众兴趣",value:t.audience_interest_score,color:"var(--chart-4)"}];return`
    <div class="hotspot-card" data-status="${t.status}">
      <div class="hotspot-header">
        <div>
          <div class="hotspot-title">${t.title}</div>
          <div style="margin-top: var(--space-1); display: flex; align-items: center; gap: var(--space-2)">
            <span class="badge ${a.class}">${a.text}</span>
            <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${$(t.discovered_at)}</span>
          </div>
        </div>
        <div class="hotspot-score" style="color: ${D(t.total_score)}">${t.total_score}</div>
      </div>
      <div class="hotspot-summary">${t.summary}</div>
      <div class="hotspot-scores">
        ${s.map(o=>`
          <div class="score-item">
            <div class="score-label">${o.label}</div>
            <div class="score-value" style="color: ${D(o.value)}">${o.value}</div>
            <div class="score-bar">
              <div class="score-bar-fill" style="width: ${o.value}%; background: ${o.color}"></div>
            </div>
          </div>
        `).join("")}
      </div>
      ${t.sources_json?`
        <div style="margin-top: var(--space-3); display: flex; gap: var(--space-1); flex-wrap: wrap;">
          ${t.sources_json.map(o=>`<span class="badge badge-muted">${o}</span>`).join("")}
        </div>
      `:""}
    </div>
  `}function nt(){if(document.getElementById("hotspot-styles"))return;const t=document.createElement("style");t.id="hotspot-styles",t.textContent=`
    .hotspot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: var(--space-4);
    }
    @media (max-width: 768px) {
      .hotspot-grid { grid-template-columns: 1fr; }
    }
  `,document.head.appendChild(t)}let V=null;function ct(t){const a=S.filter(e=>e.status==="published").length,s=S.filter(e=>e.status==="draft").length,o=Math.round(S.reduce((e,l)=>e+l.overall_score,0)/S.length);t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">内容管理</h2>
      <p class="page-subtitle">文章创作流程与质量控制 · 共 ${S.length} 篇文章</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">📝</div>
        <div class="stat-value">${S.length}</div>
        <div class="stat-label">总文章数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">✅</div>
        <div class="stat-value">${a}</div>
        <div class="stat-label">已发布</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">📋</div>
        <div class="stat-value">${s}</div>
        <div class="stat-label">草稿</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--chart-5)">
        <div class="stat-icon" style="background: rgba(236,72,153,0.12); color: var(--chart-5)">⭐</div>
        <div class="stat-value">${o}</div>
        <div class="stat-label">平均评分</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- 文章列表 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">文章列表</h3>
        </div>
        <div class="card-body">
          <div class="article-list">
            ${S.map(e=>{const l=b(e.status);return`
                <div class="article-list-item ${V===e.article_id?"selected":""}" data-id="${e.article_id}">
                  <div class="article-list-title">${e.title}</div>
                  <div class="article-list-meta">
                    <span class="badge ${l.class}">${l.text}</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${e.actual_length||0}字</span>
                    <span style="font-size: var(--text-xs); color: ${D(e.overall_score)}">${e.overall_score}分</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${I(e.created_at)}</span>
                  </div>
                  <!-- 质量评分 -->
                  <div class="article-scores">
                    <div class="mini-score"><span>可读</span><span style="color: ${D(e.readability_score)}">${e.readability_score}</span></div>
                    <div class="mini-score"><span>互动</span><span style="color: ${D(e.engagement_score)}">${e.engagement_score}</span></div>
                    <div class="mini-score"><span>SEO</span><span style="color: ${D(e.seo_score)}">${e.seo_score}</span></div>
                    <div class="mini-score"><span>原创</span><span style="color: ${D(e.originality_score)}">${e.originality_score}</span></div>
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>
      </div>

      <!-- 文章预览 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">文章预览</h3>
          <div class="copy-actions" id="copy-actions" style="display: none;">
            <button class="btn btn-sm btn-secondary" id="copy-md-btn" title="复制为Markdown格式">📋 复制 Markdown</button>
            <button class="btn btn-sm btn-secondary" id="copy-rich-btn" title="复制为富文本格式">📄 复制 富文本</button>
          </div>
        </div>
        <div class="card-body">
          <div id="article-preview" class="article-preview">
            <div class="empty-state">
              <div class="empty-icon">📖</div>
              <div class="empty-title">请选择文章</div>
              <div class="empty-desc">点击左侧文章列表查看预览</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,t.querySelectorAll(".article-list-item").forEach(e=>{e.addEventListener("click",()=>{const l=e.dataset.id,i=S.find(r=>r.article_id===l);if(!i)return;V=l,t.querySelectorAll(".article-list-item").forEach(r=>r.classList.remove("selected")),e.classList.add("selected");const n=document.getElementById("article-preview");n.innerHTML=P(i.content);const c=document.getElementById("copy-actions");c.style.display="flex",document.getElementById("copy-md-btn").onclick=()=>{T(i.content)},document.getElementById("copy-rich-btn").onclick=()=>{const r=P(i.content),p=new Blob([r],{type:"text/html"}),_=new Blob([i.content],{type:"text/plain"}),g=new ClipboardItem({"text/html":p,"text/plain":_});navigator.clipboard.write([g]).then(()=>{k("已复制富文本到剪贴板","success")}).catch(()=>{T(i.content)})}})}),dt()}function dt(){if(document.getElementById("article-styles"))return;const t=document.createElement("style");t.id="article-styles",t.textContent=`
    .article-list { display: flex; flex-direction: column; gap: var(--space-2); }
    .article-list-item {
      padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);
      border: 1px solid var(--color-border-light); cursor: pointer;
      transition: all var(--transition-fast);
    }
    .article-list-item:hover { border-color: var(--color-accent-border); background: var(--color-accent-bg); }
    .article-list-item.selected { border-color: var(--color-accent); background: var(--color-accent-bg); }
    .article-list-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-primary); margin-bottom: var(--space-2); }
    .article-list-meta { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
    .article-scores {
      display: flex; gap: var(--space-3); margin-top: var(--space-2);
      padding-top: var(--space-2); border-top: 1px solid var(--color-border-light);
    }
    .mini-score { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: var(--text-xs); }
    .mini-score span:first-child { color: var(--color-text-tertiary); }
    .mini-score span:last-child { font-weight: var(--font-semibold); }
  `,document.head.appendChild(t)}let h=null,f=null;const vt=["微信公众号","知乎","头条号","小红书","通用","B站","抖音"],pt=["行业分析","技术教程","新闻速报","案例研究","观点评论","产品评测","生活分享"],gt=["专业严谨","通俗易懂","轻松活泼","犀利深刻","温暖治愈"];function q(t){const a=y.filter(e=>e.status==="active").length,s=y.reduce((e,l)=>e+l.usage_count,0),o=[...new Set(y.map(e=>e.platform))];t.innerHTML=`
    <div class="page-header" style="display: flex; align-items: flex-start; justify-content: space-between;">
      <div>
        <h2 class="page-title">创作模板</h2>
        <p class="page-subtitle">AI内容创作提示词模板库 · 共 ${y.length} 个模板</p>
      </div>
      <button class="btn btn-primary" id="create-tpl-btn">
        ${d("plus",16)} 新建模板
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent); border: 1px solid var(--color-accent-border)">${d("template",20)}</div>
        <div class="stat-value">${y.length}</div>
        <div class="stat-label">模板总数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border)">${d("check",20)}</div>
        <div class="stat-value">${a}</div>
        <div class="stat-label">已启用</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info); border: 1px solid var(--color-info-border)">${d("refresh",20)}</div>
        <div class="stat-value">${s}</div>
        <div class="stat-label">总使用次数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--chart-5)">
        <div class="stat-icon" style="background: rgba(244,114,182,0.1); color: var(--chart-5); border: 1px solid rgba(244,114,182,0.2)">${d("globe",20)}</div>
        <div class="stat-value">${o.length}</div>
        <div class="stat-label">覆盖平台</div>
      </div>
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      ${o.map(e=>`<button class="filter-btn" data-filter="${e}">${e}</button>`).join("")}
    </div>

    <div class="tpl-layout">
      <!-- 模板列表 -->
      <div class="tpl-list-wrap">
        ${y.map(e=>ut(e)).join("")}
      </div>

      <!-- 右侧面板：预览 或 编辑 -->
      <div class="tpl-preview-wrap" id="tpl-right-panel">
        ${f?F(f):U()}
      </div>
    </div>
  `,mt(t),yt()}function ut(t){const a=b(t.status),s=h===t.template_id,o=f===t.template_id;return`
    <div class="tpl-card ${s?"selected":""} ${o?"editing":""}" data-id="${t.template_id}" data-platform="${t.platform}">
      <div class="tpl-card-top">
        <div class="tpl-card-head">
          <span class="tpl-name">${t.name}</span>
          <span class="badge ${a.class}">${a.text}</span>
        </div>
        <div class="tpl-card-tags">
          <span class="badge badge-accent">${t.platform}</span>
          <span class="badge badge-muted">${t.category}</span>
          <span class="badge badge-muted">${t.tone}</span>
        </div>
      </div>
      <div class="tpl-card-stats">
        <div class="tpl-stat">
          <span class="tpl-stat-val">${t.usage_count}</span>
          <span class="tpl-stat-label">使用</span>
        </div>
        <div class="tpl-stat">
          <span class="tpl-stat-val">${t.target_length}</span>
          <span class="tpl-stat-label">字数</span>
        </div>
        <div class="tpl-stat">
          <span class="tpl-stat-val">${t.variables.length}</span>
          <span class="tpl-stat-label">变量</span>
        </div>
        <div class="tpl-stat">
          <span class="tpl-stat-val">${$(t.last_used_at)}</span>
          <span class="tpl-stat-label">更新</span>
        </div>
      </div>
    </div>
  `}function U(){if(!h)return`
      <div class="card" style="height: 100%;">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-icon">${d("template",40)}</div>
            <div class="empty-title">选择模板</div>
            <div class="empty-desc">点击左侧模板卡片查看完整提示词</div>
          </div>
        </div>
      </div>
    `;const t=y.find(a=>a.template_id===h);return t?`
    <div class="card" style="height: 100%;">
      <div class="card-header">
        <h3 class="card-title">模板预览</h3>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn-sm btn-secondary" id="tpl-edit-btn">${d("edit",14)} 编辑</button>
          <button class="btn btn-sm btn-secondary" id="tpl-delete-btn" style="color: var(--color-error)">${d("trash",14)} 删除</button>
          <button class="btn btn-sm btn-primary" id="tpl-copy-btn">${d("copy",14)} 复制</button>
        </div>
      </div>
      <div class="card-body">
        <div class="tpl-preview">
          <div class="tpl-detail-header">
            <h3>${t.name}</h3>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-2); flex-wrap: wrap;">
              <span class="badge badge-accent">${t.platform}</span>
              <span class="badge badge-muted">${t.category}</span>
              <span class="badge badge-muted">${t.tone}</span>
              <span class="badge ${b(t.status).class}">${b(t.status).text}</span>
            </div>
            <div style="margin-top: var(--space-2); font-size: 10px; color: var(--color-text-muted);">
              目标字数: ${t.target_length} · 使用次数: ${t.usage_count} · 更新于 ${$(t.updated_at)}
            </div>
          </div>
          <div class="tpl-vars">
            <span class="tpl-vars-label">模板变量:</span>
            ${t.variables.map(a=>`<code class="tpl-var">${a}</code>`).join("")}
          </div>
          <pre class="tpl-prompt">${X(t.prompt)}</pre>
        </div>
      </div>
    </div>
  `:""}function F(t){const a=t==="new",s=a?null:y.find(o=>o.template_id===t);return`
    <div class="card tpl-edit-card">
      <div class="card-header">
        <h3 class="card-title">${a?"新建模板":`编辑 · ${(s==null?void 0:s.name)||""}`}</h3>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn-sm btn-secondary" id="tpl-edit-cancel">${d("x",14)} 取消</button>
          <button class="btn btn-sm btn-primary" id="tpl-edit-save">${d("save",14)} 保存</button>
        </div>
      </div>
      <div class="card-body" style="overflow-y: auto; max-height: calc(100vh - 340px);">
        <div class="form-group">
          <label class="form-label">模板名称 <span style="color: var(--color-error)">*</span></label>
          <input type="text" class="form-input" id="tpl-form-name" value="${a?"":(s==null?void 0:s.name)||""}" placeholder="如：微信公众号深度分析文章" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">目标平台 <span style="color: var(--color-error)">*</span></label>
            <select class="form-input" id="tpl-form-platform">
              ${vt.map(o=>`<option value="${o}" ${!a&&(s==null?void 0:s.platform)===o?"selected":""}>${o}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">内容分类</label>
            <select class="form-input" id="tpl-form-category">
              ${pt.map(o=>`<option value="${o}" ${!a&&(s==null?void 0:s.category)===o?"selected":""}>${o}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">语气风格</label>
            <select class="form-input" id="tpl-form-tone">
              ${gt.map(o=>`<option value="${o}" ${!a&&(s==null?void 0:s.tone)===o?"selected":""}>${o}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">目标字数</label>
            <input type="number" class="form-input" id="tpl-form-length" value="${a?2e3:(s==null?void 0:s.target_length)||2e3}" min="100" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">状态</label>
            <select class="form-input" id="tpl-form-status">
              <option value="active" ${!a&&(s==null?void 0:s.status)==="active"?"selected":""}>已启用</option>
              <option value="disabled" ${!a&&(s==null?void 0:s.status)==="disabled"?"selected":""}>已禁用</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">模板变量</label>
            <input type="text" class="form-input" id="tpl-form-vars" value="${a?"{{topic}},{{word_count}}":(s==null?void 0:s.variables.join(","))||""}" placeholder="逗号分隔" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">提示词内容 <span style="color: var(--color-error)">*</span></label>
          <textarea class="form-input form-textarea" id="tpl-form-prompt" rows="14" placeholder="在此编写完整的AI提示词模板内容...">${a?"":(s==null?void 0:s.prompt)||""}</textarea>
        </div>
      </div>
    </div>
  `}function mt(t){var a;t.querySelectorAll(".filter-btn").forEach(s=>{s.addEventListener("click",()=>{t.querySelectorAll(".filter-btn").forEach(e=>e.classList.remove("active")),s.classList.add("active");const o=s.dataset.filter;t.querySelectorAll(".tpl-card").forEach(e=>{e.style.display=o==="all"||e.dataset.platform===o?"":"none"})})}),t.querySelectorAll(".tpl-card").forEach(s=>{s.addEventListener("click",()=>{if(f)return;h=s.dataset.id,f=null,t.querySelectorAll(".tpl-card").forEach(e=>e.classList.remove("selected")),s.classList.add("selected"),j(t)})}),(a=document.getElementById("create-tpl-btn"))==null||a.addEventListener("click",()=>{h=null,f="new",t.querySelectorAll(".tpl-card").forEach(s=>s.classList.remove("selected")),j(t)}),Y(t),K(t)}function j(t){const a=document.getElementById("tpl-right-panel");a&&(a.innerHTML=f?F(f):U(),Y(t),K(t))}function Y(t){const a=document.getElementById("tpl-edit-btn"),s=document.getElementById("tpl-delete-btn"),o=document.getElementById("tpl-copy-btn");if(a&&h&&a.addEventListener("click",()=>{f=h,j(t)}),s&&h&&s.addEventListener("click",()=>{const e=y.find(i=>i.template_id===h);if(!e||!confirm(`确定要删除模板「${e.name}」吗？`))return;const l=y.findIndex(i=>i.template_id===e.template_id);l>-1&&(y.splice(l,1),h=null,f=null,k(`模板「${e.name}」已删除`,"success"),q(t))}),o&&h){const e=y.find(l=>l.template_id===h);e&&o.addEventListener("click",()=>T(e.prompt))}}function K(t){const a=document.getElementById("tpl-edit-cancel"),s=document.getElementById("tpl-edit-save");a&&a.addEventListener("click",()=>{f=null,j(t)}),s&&s.addEventListener("click",()=>{const o=document.getElementById("tpl-form-name").value.trim(),e=document.getElementById("tpl-form-platform").value,l=document.getElementById("tpl-form-category").value,i=document.getElementById("tpl-form-tone").value,n=parseInt(document.getElementById("tpl-form-length").value)||2e3,c=document.getElementById("tpl-form-status").value,r=document.getElementById("tpl-form-vars").value.trim(),p=document.getElementById("tpl-form-prompt").value.trim();if(!o){k("请填写模板名称","warning");return}if(!p){k("请填写提示词内容","warning");return}const _=r?r.split(",").map(m=>m.trim()).filter(m=>m):[],g=new Date().toISOString();if(f==="new"){const m=`tpl_${String(y.length+1).padStart(3,"0")}`;y.push({template_id:m,name:o,platform:e,category:l,prompt:p,variables:_,target_length:n,tone:i,status:c,usage_count:0,last_used_at:g,created_at:g,updated_at:g}),h=m,k(`模板「${o}」已创建`,"success")}else{const m=y.find(J=>J.template_id===f);m&&(Object.assign(m,{name:o,platform:e,category:l,tone:i,target_length:n,status:c,variables:_,prompt:p,updated_at:g}),k(`模板「${o}」已更新`,"success"))}f=null,q(t)})}function yt(){if(document.getElementById("template-styles"))return;const t=document.createElement("style");t.id="template-styles",t.textContent=`
    .tpl-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      align-items: start;
    }
    @media (max-width: 1024px) {
      .tpl-layout { grid-template-columns: 1fr; }
    }
    .tpl-list-wrap {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .tpl-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border-card);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-card);
    }
    .tpl-card:hover {
      border-color: var(--color-accent-border);
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .tpl-card.selected {
      border-color: var(--color-accent);
      background: var(--gradient-accent-subtle);
    }
    .tpl-card.editing {
      border-color: var(--color-warning);
      background: var(--color-warning-bg);
    }
    .tpl-card-top { margin-bottom: var(--space-3); }
    .tpl-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
    .tpl-name { font-size: var(--text-base); font-weight: var(--font-bold); color: var(--color-text-primary); letter-spacing: -0.01em; }
    .tpl-card-tags { display: flex; gap: var(--space-1-5); flex-wrap: wrap; }
    .tpl-card-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-2);
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-border-light);
    }
    .tpl-stat { text-align: center; }
    .tpl-stat-val { display: block; font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text-primary); }
    .tpl-stat-label { font-size: 10px; color: var(--color-text-muted); }
    .tpl-preview-wrap { position: sticky; top: 0; }
    .tpl-preview { max-height: 560px; overflow-y: auto; }
    .tpl-detail-header {
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--color-border-light);
    }
    .tpl-detail-header h3 { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text-primary); }
    .tpl-vars {
      display: flex; align-items: center; gap: var(--space-2);
      margin-bottom: var(--space-4); flex-wrap: wrap;
    }
    .tpl-vars-label { font-size: var(--text-xs); color: var(--color-text-tertiary); font-weight: var(--font-medium); }
    .tpl-var {
      font-family: var(--font-mono); font-size: 10px; padding: 2px 8px;
      background: var(--color-accent-bg); color: var(--color-accent);
      border: 1px solid var(--color-accent-border); border-radius: var(--radius-sm);
    }
    .tpl-prompt {
      font-family: var(--font-mono); font-size: var(--text-xs);
      line-height: var(--leading-relaxed); color: var(--color-text-secondary);
      background: var(--color-bg-tertiary); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); padding: var(--space-5);
      white-space: pre-wrap; word-wrap: break-word; overflow-x: auto;
    }
    .tpl-edit-card .form-textarea {
      min-height: 200px;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      line-height: var(--leading-relaxed);
    }
  `,document.head.appendChild(t)}function bt(t){const a=M.filter(n=>n.status==="published"),s=a.reduce((n,c)=>n+c.views,0),o=a.reduce((n,c)=>n+c.likes,0),e=a.reduce((n,c)=>n+c.shares,0),l=a.reduce((n,c)=>n+c.comments,0),i={};M.forEach(n=>{i[n.platform]||(i[n.platform]=[]),i[n.platform].push(n)}),t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">社交媒体管理</h2>
      <p class="page-subtitle">社交平台内容发布与互动数据 · 共 ${M.length} 条发布</p>
    </div>

    <!-- 互动数据 -->
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info)">👁️</div>
        <div class="stat-value">${x(s)}</div>
        <div class="stat-label">总浏览量</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">❤️</div>
        <div class="stat-value">${x(o)}</div>
        <div class="stat-label">总点赞</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">🔄</div>
        <div class="stat-value">${x(e)}</div>
        <div class="stat-label">总转发</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">💬</div>
        <div class="stat-value">${x(l)}</div>
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
            ${M.map(n=>{const c=b(n.status),r=S.find(p=>p.article_id===n.article_id);return`
                <tr>
                  <td><span class="badge badge-accent">${n.platform}</span></td>
                  <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text-primary)">${n.content}</td>
                  <td style="font-size: var(--text-xs)">${r?r.title.slice(0,15)+"...":"-"}</td>
                  <td style="font-size: var(--text-xs)">${I(n.scheduled_time)}</td>
                  <td><span class="badge ${c.class}">${c.text}</span></td>
                  <td style="font-weight: 500">${x(n.views)}</td>
                  <td style="color: var(--color-error)">${x(n.likes)}</td>
                  <td style="color: var(--color-success)">${x(n.shares)}</td>
                  <td style="color: var(--color-warning)">${x(n.comments)}</td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 按平台统计 -->
    <div class="grid-${Object.keys(i).length}" style="margin-top: var(--space-4);">
      ${Object.entries(i).map(([n,c])=>{const r=c.filter(g=>g.status==="published"),p=r.reduce((g,m)=>g+m.views,0),_=r.reduce((g,m)=>g+m.likes,0);return`
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${n}</h3>
              <span class="badge badge-muted">${c.length} 条</span>
            </div>
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
                <div><span style="color: var(--color-text-tertiary)">浏览</span><br><strong>${x(p)}</strong></div>
                <div><span style="color: var(--color-text-tertiary)">点赞</span><br><strong>${x(_)}</strong></div>
                <div><span style="color: var(--color-text-tertiary)">已发布</span><br><strong>${r.length}</strong></div>
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `}function ft(t){const a=O.filter(e=>e.status==="processed").length,s=O.filter(e=>e.status==="pending").length,o={hotspot_report:"热点报告",task_assignment:"任务分配",task_completion:"任务完成",analysis_report:"分析报告",status_update:"状态更新"};t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">消息中心</h2>
      <p class="page-subtitle">智能体间集中式通信记录 · 共 ${O.length} 条消息</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">💬</div>
        <div class="stat-value">${O.length}</div>
        <div class="stat-label">总消息数</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">✅</div>
        <div class="stat-value">${a}</div>
        <div class="stat-label">已处理</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">⏳</div>
        <div class="stat-value">${s}</div>
        <div class="stat-label">待处理</div>
      </div>
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="processed">已处理</button>
      <button class="filter-btn" data-filter="pending">待处理</button>
    </div>

    <!-- 消息时间线 -->
    <div class="card">
      <div class="card-body">
        <div class="message-list" id="message-list">
          ${O.map(e=>{const l=u.find(r=>r.agent_id===e.sender_agent_id),i=u.find(r=>r.agent_id===e.receiver_agent_id),n=b(e.status),c=B(e.priority);return`
              <div class="message-item" data-status="${e.status}">
                <div class="message-header">
                  <div class="message-route">
                    <span class="message-sender">${(l==null?void 0:l.icon)||"📨"} ${e.sender_agent_name}</span>
                    <span class="message-arrow">→</span>
                    <span class="message-receiver">${(i==null?void 0:i.icon)||"📨"} ${e.receiver_agent_name}</span>
                  </div>
                  <div class="message-badges">
                    <span class="badge badge-accent">${o[e.message_type]||e.message_type}</span>
                    <span class="badge ${c.class}">${c.text}</span>
                    <span class="badge ${n.class}">${n.text}</span>
                  </div>
                </div>
                <div class="message-body">
                  <div class="message-payload">
                    <span class="payload-label">消息内容:</span>
                    <code>${JSON.stringify(e.payload_json,null,0).slice(0,120)}${JSON.stringify(e.payload_json).length>120?"...":""}</code>
                  </div>
                  <div class="message-meta-row">
                    <span class="badge badge-muted">v${e.protocol_version}</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${I(e.timestamp)}</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-tertiary)">${$(e.timestamp)}</span>
                  </div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>
  `,t.querySelectorAll(".filter-btn").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".filter-btn").forEach(i=>i.classList.remove("active")),e.classList.add("active");const l=e.dataset.filter;t.querySelectorAll(".message-item").forEach(i=>{i.style.display=l==="all"||i.dataset.status===l?"":"none"})})}),ht()}function ht(){if(document.getElementById("message-styles"))return;const t=document.createElement("style");t.id="message-styles",t.textContent=`
    .message-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .message-item {
      padding: var(--space-4); border: 1px solid var(--color-border-light);
      border-radius: var(--radius-md); transition: all var(--transition-fast);
    }
    .message-item:hover { border-color: var(--color-accent-border); background: var(--color-accent-bg); }
    .message-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2); }
    .message-route { display: flex; align-items: center; gap: var(--space-2); }
    .message-sender, .message-receiver { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-primary); }
    .message-arrow { color: var(--color-accent); font-weight: bold; }
    .message-badges { display: flex; gap: var(--space-1); flex-wrap: wrap; }
    .message-body { }
    .message-payload {
      font-size: var(--text-xs); padding: var(--space-2) var(--space-3);
      background: var(--color-bg-tertiary); border-radius: var(--radius-sm);
      margin-bottom: var(--space-2); overflow: hidden;
    }
    .message-payload code { font-family: var(--font-mono); color: var(--color-text-secondary); word-break: break-all; }
    .payload-label { color: var(--color-text-tertiary); margin-right: var(--space-2); }
    .message-meta-row { display: flex; align-items: center; gap: var(--space-3); }
  `,document.head.appendChild(t)}let E="logs";function G(t){const a={info:A.filter(s=>s.level==="info").length,warning:A.filter(s=>s.level==="warning").length,error:A.filter(s=>s.level==="error").length};t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">系统监控</h2>
      <p class="page-subtitle">系统运行状态、日志与性能监控</p>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info)">ℹ️</div>
        <div class="stat-value">${a.info}</div>
        <div class="stat-label">INFO 日志</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">⚠️</div>
        <div class="stat-value">${a.warning}</div>
        <div class="stat-label">WARNING 日志</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-error)">
        <div class="stat-icon" style="background: var(--color-error-bg); color: var(--color-error)">❌</div>
        <div class="stat-value">${a.error}</div>
        <div class="stat-label">ERROR 日志</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">💚</div>
        <div class="stat-value">正常</div>
        <div class="stat-label">系统状态</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab ${E==="logs"?"active":""}" data-tab="logs">系统日志</button>
      <button class="tab ${E==="maintenance"?"active":""}" data-tab="maintenance">维护记录</button>
      <button class="tab ${E==="backup"?"active":""}" data-tab="backup">备份管理</button>
    </div>

    <div id="monitoring-content">
      ${E==="logs"?_t():E==="maintenance"?wt():xt()}
    </div>
  `,t.querySelectorAll(".tab").forEach(s=>{s.addEventListener("click",()=>{E=s.dataset.tab,G(t)})}),t.querySelectorAll(".filter-btn").forEach(s=>{s.addEventListener("click",()=>{t.querySelectorAll(".filter-btn").forEach(e=>e.classList.remove("active")),s.classList.add("active");const o=s.dataset.filter;t.querySelectorAll(".log-item").forEach(e=>{e.style.display=o==="all"||e.dataset.level===o?"":"none"})})})}function _t(){return`
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">系统日志</h3>
        <div class="filter-bar" style="margin-bottom: 0;">
          <button class="filter-btn active" data-filter="all">全部</button>
          <button class="filter-btn" data-filter="info">INFO</button>
          <button class="filter-btn" data-filter="warning">WARN</button>
          <button class="filter-btn" data-filter="error">ERROR</button>
        </div>
      </div>
      <div class="card-body">
        <div class="log-list">
          ${A.map(t=>`
            <div class="log-item" data-level="${t.level}">
              <span class="log-level ${t.level}">${t.level}</span>
              <span class="log-time">${I(t.timestamp)}</span>
              <span class="log-agent">[${t.agent_id}]</span>
              <span style="font-size: var(--text-xs); color: var(--color-text-muted)">${t.component}</span>
              <span class="log-message">${t.message}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function wt(){return`
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">维护记录</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>类型</th><th>描述</th><th>执行者</th><th>状态</th><th>耗时</th><th>时间</th></tr>
          </thead>
          <tbody>
            ${[{type:"数据库优化",title:"运行VACUUM和索引重建",performed_by:"tech_specialist",status:"completed",duration:120,time:new Date(Date.now()-1728e5).toISOString()},{type:"日志清理",title:"清理30天前的系统日志",performed_by:"tech_specialist",status:"completed",duration:45,time:new Date(Date.now()-432e6).toISOString()},{type:"系统检查",title:"全面系统健康检查",performed_by:"tech_specialist",status:"completed",duration:300,time:new Date(Date.now()-6048e5).toISOString()}].map(a=>`
              <tr>
                <td><span class="badge badge-accent">${a.type}</span></td>
                <td style="color: var(--color-text-primary)">${a.title}</td>
                <td>🔧 ${a.performed_by}</td>
                <td><span class="badge badge-success">已完成</span></td>
                <td>${a.duration}秒</td>
                <td style="font-size: var(--text-xs)">${$(a.time)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function xt(){return`
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">备份记录</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>类型</th><th>文件名</th><th>大小</th><th>状态</th><th>校验</th><th>时间</th></tr>
          </thead>
          <tbody>
            ${[{type:"full",filename:"mission_control_full_20260221.db",size:"1.3 MB",verified:!0,time:new Date(Date.now()-864e5).toISOString()},{type:"incremental",filename:"mission_control_incr_20260220.db",size:"256 KB",verified:!0,time:new Date(Date.now()-1728e5).toISOString()},{type:"full",filename:"mission_control_full_20260214.db",size:"1.1 MB",verified:!0,time:new Date(Date.now()-6912e5).toISOString()}].map(a=>`
              <tr>
                <td><span class="badge ${a.type==="full"?"badge-accent":"badge-muted"}">${a.type==="full"?"全量":"增量"}</span></td>
                <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-primary)">${a.filename}</td>
                <td>${a.size}</td>
                <td><span class="badge badge-success">已完成</span></td>
                <td>${a.verified?'<span style="color: var(--color-success)">✅ 已验证</span>':'<span style="color: var(--color-warning)">⏳ 待验证</span>'}</td>
                <td style="font-size: var(--text-xs)">${$(a.time)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function $t(t){const a=C.filter(e=>["system_name","system_version","system_mode","protocol_version","timezone","database_version"].includes(e.config_key)),s=C.filter(e=>["max_concurrent_tasks","agent_health_check_interval","task_timeout_hours","total_agents"].includes(e.config_key)),o=C.filter(e=>["backup_enabled","notification_enabled"].includes(e.config_key));t.innerHTML=`
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
      <p class="page-subtitle">系统配置与参数管理</p>
    </div>

    <!-- 系统信息卡片 -->
    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card" style="--stat-color: var(--color-accent)">
        <div class="stat-icon" style="background: var(--color-accent-bg); color: var(--color-accent)">🎯</div>
        <div class="stat-value" style="font-size: var(--text-lg)">Mission Control</div>
        <div class="stat-label">系统名称</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-info)">
        <div class="stat-icon" style="background: var(--color-info-bg); color: var(--color-info)">📦</div>
        <div class="stat-value">v2.0.0</div>
        <div class="stat-label">系统版本</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success)">
        <div class="stat-icon" style="background: var(--color-success-bg); color: var(--color-success)">🌐</div>
        <div class="stat-value" style="font-size: var(--text-lg)">Production</div>
        <div class="stat-label">运行模式</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning)">
        <div class="stat-icon" style="background: var(--color-warning-bg); color: var(--color-warning)">🤖</div>
        <div class="stat-value">${u.length}</div>
        <div class="stat-label">已注册智能体</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- 基础设置 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">基础设置</h3>
        </div>
        <div class="card-body">
          <div class="config-list">
            ${a.map(e=>`
              <div class="config-item">
                <div>
                  <div class="config-key">${e.config_key}</div>
                  <div class="config-desc">${e.description}</div>
                </div>
                <div class="config-value">${e.config_value}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- 运行参数 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">运行参数</h3>
        </div>
        <div class="card-body">
          <div class="config-list">
            ${s.map(e=>`
              <div class="config-item">
                <div>
                  <div class="config-key">${e.config_key}</div>
                  <div class="config-desc">${e.description}</div>
                </div>
                <div class="config-value">${e.config_value}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- 功能开关 -->
    <div class="card" style="margin-top: var(--space-4)">
      <div class="card-header">
        <h3 class="card-title">功能开关</h3>
      </div>
      <div class="card-body">
        <div class="config-list">
          ${o.map(e=>`
            <div class="config-item">
              <div>
                <div class="config-key">${e.config_key}</div>
                <div class="config-desc">${e.description}</div>
              </div>
              <div class="config-value">
                <span class="badge ${e.config_value==="true"?"badge-success":"badge-error"}">${e.config_value==="true"?"已启用":"已禁用"}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- 智能体注册列表 -->
    <div class="card" style="margin-top: var(--space-4)">
      <div class="card-header">
        <h3 class="card-title">已注册智能体</h3>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>图标</th><th>名称</th><th>ID</th><th>类型</th><th>版本</th><th>状态</th></tr>
          </thead>
          <tbody>
            ${u.map(e=>`
              <tr>
                <td>${e.icon}</td>
                <td style="color: var(--color-text-primary); font-weight: 500">${e.agent_name}</td>
                <td style="font-family: var(--font-mono); font-size: var(--text-xs)">${e.agent_id}</td>
                <td>${e.agent_type}</td>
                <td>${e.version}</td>
                <td><span class="badge badge-${e.status==="active"?"success":e.status==="standby"?"warning":"error"}">${e.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function kt(){const t=localStorage.getItem("mc-theme")||"dark";document.documentElement.setAttribute("data-theme",t),document.getElementById("theme-toggle").addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("mc-theme",o)})}function St(){const t=document.getElementById("sidebar-toggle"),a=document.getElementById("app-sidebar");t.addEventListener("click",()=>{a.classList.toggle("collapsed"),localStorage.setItem("mc-sidebar",a.classList.contains("collapsed")?"collapsed":"expanded")}),localStorage.getItem("mc-sidebar")==="collapsed"&&a.classList.add("collapsed")}function Dt(){const t=new W;t.register("/dashboard",Q).register("/agents",et).register("/tasks",H).register("/hotspots",rt).register("/articles",ct).register("/templates",q).register("/social",bt).register("/messages",ft).register("/monitoring",G).register("/settings",$t),t.start()}document.addEventListener("DOMContentLoaded",()=>{kt(),St(),Dt()});
