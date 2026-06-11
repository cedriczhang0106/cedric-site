/* ============ 双语文案字典(v3 Cappen 版) ============
 * 改文案只改这里。
 * 注:大字标题(DECODING AESTHETICS / COLLABORATORS...)是排版的一部分,中英都保留英文。
 * WORKS 模块暂时隐藏(index.html 中带 hidden 属性),work.* 键先留着。
 */
const DICT = {
  zh: {
    "nav.about": "关于", "nav.done": "能力", "nav.collab": "协作", "nav.contact": "开始对话",

    "intro.line": "一个人的工作室 —— 用 AI 搭建,由人决定。",

    "hero.edgeL": "AI TRAINING LEAD",
    "hero.edgeR": "AIGC ARTIST",
    "hero.blurb": "A studio of one. <em>AI is fast; I am right</em> — it drafts a hundred answers, I pick the one that matters.",

    "statement.text": "这是一间一个人的工作室:我出<i>想法</i>和<i>品味</i>,模型出<i>手速</i>和<i>体力</i>——我们一起,做真正重要的数字体验。",
    "statement.sign": "CEDRIC — A STUDIO OF ONE",

    "about.chapter": "ABOUT / 六个字母,六个关键词",
    "about.k1": "审美是底层操作系统。技术会过时,品味不会。",
    "about.k2": "用 AI 撬动十倍杠杆。把 AI 工具当成合伙人,一个人能做完过去需要团队的事。",
    "about.k3": "数据是我的母语。训练、标注、评测,每个判断都从证据出发。",
    "about.k4": "标准、SOP、质量闭环——严谨是创意的地基。",
    "about.k5": "小步快跑,持续迭代,版本号永远在涨。",
    "about.k6": "为机器服务,也对抗机器。创作是最后的护城河。",

    "done.title": "WHAT I HAVE DONE",
    "done.lead": "不止于\"单点突破\",更在于系统建构。七份档案,构成我能力的全部。",
    "done.c1": "数据训练", "done.c1d": "从标注规则到质量闭环:修订规则文档、统一判断口径、整理边界样本——让训练数据稳定、可用、可复核。",
    "done.c2": "模型评测", "done.c2d": "把\"模型好不好\"从感觉变成标准:评测集、维度拆解、验收门槛,用数据给模型迭代指路。",
    "done.c3": "工作流搭建", "done.c3d": "把散落的人工环节串成链路:从信息抓取到生成、审核、发布,一次搭好,反复复用。",
    "done.c4": "自媒体", "done.c4d": "镜头前说话的人。选题、脚本、出镜、剪辑一人全包,靠内容本身把个人口播账号做起来。",
    "done.c5": "自动化", "done.c5d": "同一件事不做第二遍:脚本、Bot、批量生成,把重复劳动打包扔给机器,人留给判断。",
    "done.c6": "AIGC 创作", "done.c6d": "用模型造画面:文生图、图生视频,从 moodboard 到成片——这个站的首屏视频就是产出之一。",
    "done.c7": "Vibe Coding", "done.c7d": "我描述,AI 施工,我验收。你正在看的这个网站,从设计、动效到文案,就是我和 AI 结对的作品。",

    "work.title": "WORKS",
    "work.w1": "【作品一】", "work.w1t": "AIGC · POSTER",
    "work.w2": "【作品二】", "work.w2t": "AI FILM · SHORT",
    "work.w3": "【作品三】", "work.w3t": "WORKFLOW · TOOL",

    "collab.chapter": "COLLABORATORS / 协作者",
    "collab.lead": "我不是一个人在工作 —— 这是我和它们之间的分工。",
    "collab.g1": "[ AI PARTNERS ]",
    "collab.g2": "[ CRAFT + INFRA ]",
    "collab.claudeRole": "思维副驾",
    "collab.claudeDesc": "想清楚一件事的对象。策略、文案、架构——我和它聊,它搭骨架,我给灵魂。",
    "collab.codexRole": "代码施工",
    "collab.codexDesc": "前端脏活累活全包。我描述要什么,它把代码写出来,我审稿、调方向、验收。",
    "collab.geminiRole": "文案·杂务",
    "collab.geminiDesc": "日常文本的批量处理器。邮件、翻译、纪要、摘要——琐碎交给它,我留给更高阶判断。",
    "collab.typelessRole": "语音口述",
    "collab.typelessDesc": "嘴比手快。想法直接说出来,落地就是能用的文字——prompt、文案、备忘一气呵成。",
    "collab.cozeRole": "工作流编排",
    "collab.cozeDesc": "Bot 搭建与自动化流程平台。把重复任务打包成工作流,让 AI 替我跑通整条链路。",
    "collab.obsidianRole": "知识管理",
    "collab.obsidianDesc": "我的第二大脑。笔记、项目复盘、Prompt 库都在这里沉淀,双向链接构建思维网络。",
    "collab.vscodeRole": "工作台",
    "collab.vscodeDesc": "每天写 prompt、文案、代码的地方。不只是编辑器,是我的第二大脑入口。",
    "collab.githubRole": "生态与扩展",
    "collab.githubDesc": "我的技术武器库。插件、MCP、Skills 在这里发现和调试,让我跟得上 AI 节奏。",
    "collab.me": "导演 / 编剧 / 制片 — CEDRIC",

    "contact.line": "有想一起做的事,或只是想聊聊 AI 与创作——随时来信。",
    "contact.foot": "用 AI 搭建,由人决定。"
  },

  en: {
    "nav.about": "About", "nav.done": "Done", "nav.collab": "Collab", "nav.contact": "Start a talk",

    "intro.line": "A studio of one — built with AI, decided by a human.",

    "hero.edgeL": "AI TRAINING LEAD",
    "hero.edgeR": "AIGC ARTIST",
    "hero.blurb": "A studio of one. <em>AI is fast; I am right</em> — it drafts a hundred answers, I pick the one that matters.",

    "statement.text": "A studio of one: I bring the <i>ideas</i> and the <i>taste</i>; the models bring <i>speed</i> and <i>stamina</i> — together we make digital experiences that matter.",
    "statement.sign": "CEDRIC — A STUDIO OF ONE",

    "about.chapter": "ABOUT / six letters, six keywords",
    "about.k1": "Taste is the operating system. Tech expires; taste doesn't.",
    "about.k2": "10x leverage through AI. Treating AI tools as partners — one person doing what used to take a team.",
    "about.k3": "Data is my native tongue. Training, labeling, evals — every judgment starts from evidence.",
    "about.k4": "Standards, SOPs, quality loops — rigor is the foundation of creativity.",
    "about.k5": "Ship small, iterate fast. The version number always goes up.",
    "about.k6": "Making art for, and against, the machine.",

    "done.title": "WHAT I HAVE DONE",
    "done.lead": "Not single breakthroughs but system building. Seven files form the whole of what I do.",
    "done.c1": "Data Training", "done.c1d": "From annotation rules to quality loops: revising rule docs, unifying judgment criteria, curating edge cases — training data that holds up.",
    "done.c2": "Model Evaluation", "done.c2d": "Turning \"is the model good\" from a feeling into a standard: eval sets, dimension breakdowns, acceptance gates.",
    "done.c3": "Workflow Building", "done.c3d": "Chaining scattered manual steps into one pipeline: sourcing, generation, review, publishing — build once, reuse forever.",
    "done.c4": "On Air", "done.c4d": "The one talking on camera. Topics, scripts, presenting, editing — all solo, growing a channel on content alone.",
    "done.c5": "Automation", "done.c5d": "Never do the same thing twice: scripts, bots, batch generation — repetition goes to machines, judgment stays with me.",
    "done.c6": "AIGC Creation", "done.c6d": "Making images with models: text-to-image, image-to-video, moodboard to final cut — this site's hero video is one of the outputs.",
    "done.c7": "Vibe Coding", "done.c7d": "I describe, AI builds, I review. The site you're looking at — design, motion, copy — is my pair-work with AI.",

    "work.title": "WORKS",
    "work.w1": "[Project One]", "work.w1t": "AIGC · POSTER",
    "work.w2": "[Project Two]", "work.w2t": "AI FILM · SHORT",
    "work.w3": "[Project Three]", "work.w3t": "WORKFLOW · TOOL",

    "collab.chapter": "COLLABORATORS",
    "collab.lead": "I don't work alone — this is how the labor is divided between me and them.",
    "collab.g1": "[ AI PARTNERS ]",
    "collab.g2": "[ CRAFT + INFRA ]",
    "collab.claudeRole": "Thinking Copilot",
    "collab.claudeDesc": "Who I think with. Strategy, copy, architecture — we talk, it builds the skeleton, I give it the soul.",
    "collab.codexRole": "Code Labor",
    "collab.codexDesc": "All the frontend grunt work. I describe what I want, it writes the code; I review, steer, accept.",
    "collab.geminiRole": "Text Utilities",
    "collab.geminiDesc": "Batch processor for everyday text. Mail, translation, minutes, digests — trivia goes to it, judgment stays with me.",
    "collab.typelessRole": "Voice Input",
    "collab.typelessDesc": "Mouth beats hands. Speak the thought and it lands as usable text — prompts, copy, memos in one breath.",
    "collab.cozeRole": "Workflow Orchestration",
    "collab.cozeDesc": "Bots and automation. Repetitive tasks get packaged into workflows that AI runs end-to-end for me.",
    "collab.obsidianRole": "Knowledge Base",
    "collab.obsidianDesc": "My second brain. Notes, retros and the prompt library settle here — bi-directional links weave the network.",
    "collab.vscodeRole": "Workbench",
    "collab.vscodeDesc": "Where prompts, copy and code get written daily. Not just an editor — the portal to my second brain.",
    "collab.githubRole": "Ecosystem",
    "collab.githubDesc": "My arsenal. Plugins, MCP and Skills get discovered and debugged here — keeping pace with AI.",
    "collab.me": "Directed / Written / Produced by — CEDRIC",

    "contact.line": "Got something to build together, or just want to talk AI and craft — write anytime.",
    "contact.foot": "Built with AI. Decided by a human."
  }
};

let currentLang = localStorage.getItem("cedric-lang") || "zh";

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("cedric-lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const dict = DICT[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  const btn = document.getElementById("langToggle");
  if (btn) btn.textContent = lang === "zh" ? "EN" : "CN";
}
