import React, { useState, useEffect, useRef } from 'react';
import {
    Play, User, Scissors, ShoppingBag, Smartphone, Menu, X,
    ArrowRight, Heart, ChevronRight, Star, Gift,
    Briefcase, MessageSquare, CheckCircle, ShoppingCart,
    MapPin, Clock, Truck, Share2, Info, ChevronLeft,
    Filter, Award, MousePointerClick, TrendingUp, Users, Activity,
    Calendar, Globe, Mail, ChevronDown, Camera, Layers, Zap,
    Target, PenTool, Layout, Grid, Tag, Timer, Package, ShieldCheck, Gem
} from 'lucide-react';

// --- 全局样式 & 动画 (Cyber-Heritage Style) ---
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
    
    :root {
      --neon-red: #FF2E2E;       /* 霓虹红 */
      --neon-gold: #FFD700;      /* 霓虹金 */
      --deep-bg: #050505;        /* 深空黑 */
      --card-bg: #111111;        /* 卡片黑 */
      --text-main: #F0F0F0;      /* 亮白 */
      --text-dim: #888888;       /* 暗灰 */
    }

    body {
      background-color: var(--deep-bg);
      color: var(--text-main);
      font-family: 'Noto Serif SC', serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    ::-webkit-scrollbar { width: 6px; height: 6px; background: var(--deep-bg); }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--neon-red); }

    .cursor-glow {
      pointer-events: none;
      position: fixed;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 46, 46, 0.04) 0%, rgba(0,0,0,0) 70%);
      transform: translate(-50%, -50%);
      z-index: 9999;
      mix-blend-mode: screen;
      transition: opacity 0.3s ease;
    }

    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(40px);
      transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .tilt-card {
      transform-style: preserve-3d;
      transition: transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }

    .noise-bg {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0; opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .text-glow-hover:hover { text-shadow: 0 0 15px var(--neon-red); color: #fff; }
    
    .glass-border {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(10px);
    }

    .horizontal-scroll {
        display: flex; overflow-x: auto; padding-bottom: 20px;
        scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none;
    }
    .horizontal-scroll::-webkit-scrollbar { display: none; }

    @keyframes breathe {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    .animate-breathe { animation: breathe 3s infinite ease-in-out; }
  `}</style>
);

// --- 基础数据 ---
const historyTimeline = [
    { year: "汉代", title: "起源", desc: "造纸术发明，金银箔剪裁初现雏形。" },
    { year: "唐代", title: "发展", desc: "剪纸处于大发展时期，杜甫诗云“暖汤濯我足，剪纸招我魂”。" },
    { year: "明清", title: "繁荣", desc: "剪纸走向生活化、民俗化，窗花成为节日标配。" },
    { year: "2006", title: "入遗", desc: "剪纸经国务院批准列入第一批国家级非物质文化遗产名录。" },
    { year: "2009", title: "世界级", desc: "中国剪纸入选联合国教科文组织“人类非物质文化遗产代表作名录”。" },
    { year: "2025", title: "新生", desc: "《剪韵新生》项目启动，AR与设计赋能传统技艺。" },
];

const faqs = [
    { q: "定制产品的制作周期是多久？", a: "普通定制约为 7-15 个工作日，复杂的大型作品可能需要 30 天以上。我们会在设计对接阶段与您确认具体时间。" },
    { q: "是否支持国际物流配送？", a: "支持。我们已与多家国际物流公司合作，可将非遗作品送达全球 50 多个国家和地区。" },
    { q: "剪纸作品如何保养？", a: "建议使用相框装裱，避免阳光直射和潮湿环境。如果是无装裱作品，请平铺夹在书中保存。" },
    { q: "银青结对计划对设计师有什么要求？", a: "我们欢迎所有热爱传统文化的设计师，不限专业背景。只要您有创意，愿意与传承人沟通协作，都可以申请。" }
];

const profiles = {
    inheritor: {
        name: "李秀芳",
        age: 72,
        title: "国家级非遗传承人",
        role: "安塞剪纸 / 抓髻娃娃",
        desc: "剪纸六十余载，一把剪刀剪出黄土高原的悲欢离合。坚持传统技法，不用画稿，随心而剪。",
        tags: ["安塞剪纸", "国宝级"],
        timeline: [
            { year: "1965", event: "12岁开始随母学习剪纸" },
            { year: "1995", event: "作品《迎亲》被中国美术馆收藏" },
            { year: "2008", event: "被评为国家级非物质文化遗产传承人" }
        ]
    },
    designer: {
        name: "林晓",
        age: 24,
        title: "新锐视觉设计师",
        role: "视觉传达 / 95后",
        desc: "非遗不应该被供在博物馆里。我想用设计语言翻译它，让它变成潮玩、变成表情包，重新回到年轻人的生活里。",
        tags: ["央美毕业", "红点奖得主"],
        timeline: [
            { year: "2023", event: "毕业设计《纸间代码》获金奖" },
            { year: "2024", event: "加入剪韵新生项目，负责纹样矢量化" },
            { year: "2025", event: "主导设计《生肖·潮》系列文创" }
        ]
    }
};

const allProducts = [
    { id: 1, category: "现代家居", name: "“五谷丰登”剪纸镂空台灯", price: 159, sales: 1200, image: "lamp", tag: "热销", desc: "将传统《五谷丰登》纹样进行矢量化提取，结合现代金属镂空工艺。灯光透过剪纸纹样投射出斑驳光影，寓意生活富足。", workshop: "安塞魏塔村工坊", workers: 12, material: "黄铜、胡桃木", designer: "林晓" },
    { id: 2, category: "节日礼品", name: "2026 蛇年大吉·定制伴手礼盒", price: 299, sales: 850, image: "giftbox", tag: "新品", desc: "专为2026乙巳蛇年设计。内含纯手工剪纸窗花、剪纸纹样丝巾及红包套装。支持企业Logo烫金定制。", workshop: "延川文安驿工坊", workers: 8, material: "宣纸、真丝", designer: "陈一鸣" },
    { id: 3, category: "生活周边", name: "陕北民俗纹样·棉麻抱枕", price: 89, sales: 2100, image: "pillow", tag: "", desc: "选取经典的“老鼠娶亲”与“回娘家”场景，通过数码印花技术还原于亲肤棉麻面料之上，让非遗更有温度。", workshop: "米脂杨家沟工坊", workers: 15, material: "天然棉麻", designer: "王艺" },
    { id: 4, category: "时尚配饰", name: "抓髻娃娃·纯银珐琅吊坠", price: 368, sales: 450, image: "pendant", tag: "设计师款", desc: "提取抓髻娃娃的核心轮廓，采用古法珐琅填色。既是护身符，也是国潮时尚单品。", workshop: "上海设计研发中心", workers: 5, material: "925银、珐琅", designer: "林晓" },
    { id: 5, category: "现代家居", name: "团花纹样·艺术挂毯", price: 129, sales: 300, image: "carpet", tag: "", desc: "大幅团花剪纸的织造化呈现，适合新中式装修风格。", workshop: "安塞魏塔村工坊", workers: 12, material: "棉线混纺", designer: "Team A" },
    { id: 6, category: "节日礼品", name: "DIY剪纸体验包(入门级)", price: 39, sales: 5000, image: "diy-kit", tag: "爆款", desc: "内含刻刀、红纸、底样和教学视频二维码，适合亲子互动。", workshop: "统一配送中心", workers: 20, material: "纸类", designer: "教研组" }
];

const curatedCollections = [
    { id: 1, title: "岁朝清供", subtitle: "2026 新春限定系列", image: "collection-newyear", color: "from-[#FF2E2E] to-black" },
    { id: 2, title: "婚庆大典", subtitle: "龙凤呈祥·双喜临门", image: "collection-wedding", color: "from-[#D4AF37] to-black" },
    { id: 3, title: "书房雅物", subtitle: "文人墨客的案头清玩", image: "collection-study", color: "from-[#00F0FF] to-black" }
];

const customCases = [
    { id: 1, title: "某知名车企·年会伴手礼", desc: "将车型轮廓与剪纸纹样结合，定制5000份。", image: "car-gift" },
    { id: 2, title: "景区文创·地标剪纸", desc: "为延安革命纪念馆开发的红色文创系列。", image: "red-tour" },
    { id: 3, title: "婚礼定制·龙凤呈祥", desc: "新人专属姓名嵌入纹样，独一无二的纪念。", image: "wedding" }
];

const arTutorials = [
    { id: 1, title: "五折团花", level: "入门", time: "15 min", image: "tutorial-1", status: "LIVE" },
    { id: 2, title: "抓髻娃娃", level: "进阶", time: "45 min", image: "tutorial-2", status: "LOCKED" },
    { id: 3, title: "十二生肖", level: "大师", time: "2 hr", image: "tutorial-3", status: "LOCKED" },
    { id: 4, title: "立体春字", level: "创意", time: "30 min", image: "tutorial-4", status: "NEW" }
];

// 定制工坊：新增材质和工艺数据
const craftMaterials = [
    { id: 1, name: "万年红宣纸", desc: "色泽纯正，千年不褪", bg: "bg-[#FF2E2E]" },
    { id: 2, name: "洒金红纸", desc: "富贵典雅，节日首选", bg: "bg-gradient-to-br from-[#FF2E2E] to-[#FFD700]" },
    { id: 3, name: "纯金箔", desc: "999足金，收藏级", bg: "bg-[#FFD700]" },
    { id: 4, name: "靛蓝蜡染", desc: "少数民族风情", bg: "bg-blue-900" }
];

// 定制工坊：新增服务套餐
const serviceTiers = [
    {
        id: 1, name: "个人轻定制", price: "¥299 起", icon: User,
        features: ["现有纹样微调", "加刻姓名/日期", "电子版证书", "7天交付"]
    },
    {
        id: 2, name: "企业礼品定制", price: "¥50/份 起", icon: Briefcase,
        features: ["Logo植入设计", "专属包装定制", "批量生产优惠", "全链路品控"]
    },
    {
        id: 3, name: "大师孤品创作", price: "¥10,000 起", icon: Gem,
        features: ["非遗大师亲手剪制", "独一无二设计", "收藏证书 & 视频", "永久保修"]
    }
];

// --- Hooks ---
const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const updateMousePosition = ev => setMousePosition({ x: ev.clientX, y: ev.clientY });
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);
    return mousePosition;
};

// --- 通用交互组件 ---

const TiltCard = ({ children, className, onClick, noTilt = false }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');

    const handleMouseMove = (e) => {
        if (noTilt || !cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        const tiltX = (y - 0.5) * 5;
        const tiltY = (x - 0.5) * -5;
        setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    };

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ transform }}
        >
            {children}
        </div>
    );
};

const VideoModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-0 animate-fade-in backdrop-blur-xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-[#FF2E2E] transition z-50">
            <X size={32} />
        </button>
        <div className="w-full max-w-6xl aspect-video bg-[#050505] relative shadow-2xl border border-zinc-800 group overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <h1 className="text-[12vw] font-black text-white tracking-tighter select-none">SHANBEI</h1>
                </div>
                <img src="/api/placeholder/1920/1080?text=Video+Player" alt="Video" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                    <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center mb-6 hover:scale-110 hover:border-[#FF2E2E] hover:bg-[#FF2E2E]/20 transition duration-500 backdrop-blur-sm cursor-pointer group/btn">
                        <Play size={32} className="fill-white ml-2 group-hover/btn:text-[#FF2E2E] transition" />
                    </div>
                    <p className="mt-4 text-2xl font-bold tracking-[0.2em] text-glow">《剪韵新生》纪录片</p>
                    <div className="w-12 h-[1px] bg-[#FF2E2E] my-4"></div>
                    <p className="text-sm text-zinc-400 font-sans tracking-widest">00:00 / 03:45</p>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800">
                <div className="w-1/3 h-full bg-[#FF2E2E] shadow-[0_0_10px_#FF2E2E]"></div>
            </div>
        </div>
    </div>
);

const ProductModal = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
            <div className="w-full max-w-6xl max-h-[90vh] bg-[#0A0A0A] relative z-10 flex flex-col md:flex-row overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(255,46,46,0.1)] reveal-on-scroll is-visible">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-zinc-400 hover:text-white hover:bg-[#FF2E2E] transition z-20">
                    <X size={24} />
                </button>

                <div className="w-full md:w-1/2 bg-[#111] relative group">
                    <img src={`/api/placeholder/800/800?text=${product.image}`} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur px-4 py-2 border-l-2 border-[#FF2E2E]">
                        <div className="flex items-center gap-2 mb-1 text-[#FF2E2E]">
                            <MapPin size={14} />
                            <span className="text-xs font-bold tracking-widest text-white">产地溯源：{product.workshop}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                            <User size={10} />
                            <span>{product.workers}位村民参与制作</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto bg-[#0A0A0A] border-l border-zinc-900">
                    <div className="mb-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[#FF2E2E] border border-[#FF2E2E]/30 px-2 py-0.5 text-xs font-bold tracking-wider">{product.category}</span>
                            {product.tag && <span className="bg-[#FF2E2E] text-black px-2 py-0.5 text-xs font-bold">{product.tag}</span>}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">{product.name}</h2>
                        <div className="flex items-baseline gap-4 mb-8 border-b border-zinc-800 pb-6">
                            <span className="text-4xl font-light text-[#FF2E2E]">¥{product.price}</span>
                            <span className="text-sm text-zinc-600 line-through">¥{Math.floor(product.price * 1.2)}</span>
                            <span className="text-xs text-zinc-500 ml-auto flex items-center gap-1">
                                <Activity size={12} /> {product.sales}人已付款
                            </span>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2 uppercase tracking-widest">
                                    <Info size={14} className="text-[#FF2E2E]" /> 设计理念
                                </h4>
                                <p className="text-zinc-400 text-sm leading-relaxed text-justify border-l border-zinc-800 pl-4">
                                    {product.desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-[#111] p-4 border border-zinc-800">
                                    <span className="block text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">材质工艺</span>
                                    <span className="text-sm font-medium text-zinc-300">{product.material}</span>
                                </div>
                                <div className="bg-[#111] p-4 border border-zinc-800">
                                    <span className="block text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">主设计师</span>
                                    <span className="text-sm font-medium text-zinc-300">{product.designer}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-zinc-900 flex gap-4">
                        <button className="flex-1 border border-zinc-700 py-3 font-bold text-zinc-400 hover:text-white hover:border-white transition uppercase tracking-widest text-xs">
                            联系客服
                        </button>
                        <button
                            onClick={() => { onAddToCart(); onClose(); }}
                            className="flex-1 bg-white text-black py-3 font-bold hover:bg-[#FF2E2E] hover:text-white transition flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_#FF2E2E]"
                        >
                            <ShoppingCart size={16} /> 加入购物车
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GameModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-[#0A0A0A] w-full max-w-md overflow-hidden relative z-10 p-8 text-center border border-zinc-800 shadow-[0_0_40px_rgba(255,46,46,0.15)]">
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition"><X size={20} /></button>

            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-[#FF2E2E] blur-[40px] opacity-10 rounded-full"></div>
                <div className="w-20 h-20 bg-[#111] border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <Scissors size={32} className="text-[#FF2E2E]" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wider mb-2">每日纹样挑战</h3>
                <p className="text-zinc-500 text-xs">完成拼图，解锁今日非遗知识卡片</p>
            </div>

            <div className="aspect-square bg-[#111] mb-8 relative overflow-hidden group cursor-pointer border border-zinc-800 hover:border-[#FF2E2E] transition duration-500">
                <img src="/api/placeholder/400/400?text=Puzzle" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-[#FF2E2E] text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:scale-105 transition shadow-[0_0_15px_#FF2E2E]">
                        <MousePointerClick size={14} className="inline mr-2" /> Start Game
                    </span>
                </div>
            </div>

            <button className="w-full bg-white text-black py-3 font-bold hover:bg-[#FF2E2E] hover:text-white transition uppercase tracking-widest text-xs">
                开始挑战 (赢积分)
            </button>
        </div>
    </div>
);

const Navbar = ({ activePage, setActivePage, cartCount }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', label: '首页' },
        { id: 'profiles', label: '银青结对' },
        { id: 'ar', label: 'AR 传习馆' },
        { id: 'mall', label: '文创市集' },
        { id: 'custom', label: '定制工坊' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-zinc-900 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer group gap-3" onClick={() => setActivePage('home')}>
                        <div className="w-10 h-10 bg-[#FF2E2E] flex items-center justify-center text-white shadow-[0_0_15px_#FF2E2E] transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                            <Scissors size={20} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-[0.2em]">剪韵新生</h1>
                            <p className="text-[10px] text-[#FF2E2E] font-bold tracking-[0.3em] uppercase">Paper Revival</p>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                className={`relative px-2 py-2 text-sm font-bold tracking-wider transition-colors duration-300 ${activePage === item.id
                                        ? 'text-[#FF2E2E]'
                                        : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {item.label}
                                {activePage === item.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF2E2E] shadow-[0_0_8px_#FF2E2E]"></span>
                                )}
                            </button>
                        ))}
                        {/* Shopping Cart Icon */}
                        <div
                            className="relative p-2 text-zinc-500 hover:text-[#FF2E2E] cursor-pointer group transition-colors"
                            onClick={() => setActivePage('mall')}
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-black bg-[#FF2E2E] rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <div
                            className="relative p-2 text-zinc-500"
                            onClick={() => {
                                setActivePage('mall');
                                setIsMenuOpen(false);
                            }}
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#FF2E2E] text-black text-[10px] px-1.5 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0A0A0A] border-t border-zinc-800 absolute w-full z-50 animate-slide-down">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActivePage(item.id);
                                    setIsMenuOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-4 text-base font-bold tracking-widest border-l-2 transition-all ${activePage === item.id ? 'bg-zinc-900 border-[#FF2E2E] text-[#FF2E2E]' : 'border-transparent text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

// --- Page Components ---

const HomePage = ({ setActivePage }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [showGame, setShowGame] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);
    useScrollReveal();
    const mousePos = useMousePosition();

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#050505]">
            {/* Modals */}
            {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
            {showGame && <GameModal onClose={() => setShowGame(false)} />}

            {/* Dynamic Background Blob */}
            <div
                className="fixed w-[800px] h-[800px] bg-[#FF2E2E] rounded-full blur-[150px] opacity-[0.08] pointer-events-none transition-transform duration-75 ease-out mix-blend-screen z-0"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${(mousePos.x - window.innerWidth / 2) * 0.05}px), calc(-50% + ${(mousePos.y - window.innerHeight / 2) * 0.05}px))`
                }}
            ></div>

            {/* Hero Section */}
            <div className="relative h-[80vh] w-full flex flex-col justify-center items-center overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#050505]/60 z-10"></div>
                    <img src="/api/placeholder/1920/1080?text=Paper+Art" alt="Background" className="object-cover w-full h-full opacity-40 scale-105 animate-pulse-slow" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <div className="reveal-on-scroll">
                        <span className="inline-block px-4 py-1 mb-8 border border-[#FF2E2E]/50 rounded-full text-[#FF2E2E] text-xs tracking-[0.3em] font-bold uppercase glass-border">
                            青年设计师 × 银发传承人
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight text-glow-hover transition-all duration-500">
                            让非遗在<span className="text-[#FF2E2E] italic mx-4 inline-block border-b-4 border-[#FF2E2E]">指尖</span>重生
                        </h1>
                        <p className="max-w-2xl text-lg text-zinc-400 mb-12 font-light leading-relaxed mx-auto tracking-wide">
                            连接陕北黄土高原与现代都市生活。<br />通过"青年设计师 + 银发传承人"结对合作平台，结合AR科技与国潮设计，不仅传承一项技艺，更守护一片乡愁，助力乡村振兴。
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button onClick={() => setShowVideo(true)} className="flex items-center gap-3 text-white px-8 py-3 rounded-full transition border border-zinc-600 hover:border-[#FF2E2E] hover:text-[#FF2E2E] hover:bg-[#FF2E2E]/10 group">
                                <Play size={16} className="fill-white group-hover:fill-[#FF2E2E] transition" />
                                <span className="tracking-[0.2em] text-xs font-bold">观看项目纪录片</span>
                            </button>
                            <button onClick={() => setActivePage('ar')} className="px-10 py-4 bg-[#FF2E2E] text-white rounded-full font-bold hover:bg-white hover:text-black transition shadow-[0_0_20px_#FF2E2E] flex items-center justify-center group uppercase tracking-[0.2em] text-xs">
                                <Smartphone size={18} className="mr-3" />
                                体验 AR 教学
                            </button>
                            <button onClick={() => setActivePage('profiles')} className="px-8 py-4 text-zinc-400 hover:text-white transition flex items-center justify-center group tracking-[0.2em] text-xs font-bold">
                                <Users size={18} className="mr-2 group-hover:text-[#FF2E2E]" />
                                了解结对计划
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Banner */}
            <div className="bg-[#1a1a1a] border-y border-zinc-800 py-4 px-4 relative overflow-hidden group cursor-pointer hover:bg-[#222] transition">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm relative z-10 text-white">
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <span className="bg-[#FF2E2E] text-white px-3 py-1 text-[10px] font-bold tracking-wider">NEW EVENT</span>
                        <span className="tracking-wide text-zinc-300 group-hover:text-white transition">每日剪纸挑战上线啦！完成挑战赢取文创优惠券。</span>
                    </div>
                    <button onClick={() => setShowGame(true)} className="text-[#FF2E2E] font-bold flex items-center hover:translate-x-2 transition uppercase text-xs tracking-widest">
                        立即挑战 <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* History Timeline */}
            <div className="py-24 border-b border-zinc-900 relative bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end reveal-on-scroll">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-wide">非遗编年史</h2>
                        <div className="w-12 h-1 bg-[#FF2E2E] mt-2"></div>
                    </div>
                    <div className="text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} /> 历史长河
                    </div>
                </div>

                <div className="max-w-7xl mx-auto horizontal-scroll px-6 pb-8 reveal-on-scroll">
                    <div className="flex gap-12">
                        {historyTimeline.map((item, idx) => (
                            <div key={idx} className="min-w-[280px] group relative pt-12">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-800 group-hover:bg-[#FF2E2E] transition duration-500"></div>
                                <div className="absolute top-[-4px] left-0 w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-[#FF2E2E] transition duration-500"></div>
                                <h3 className="text-4xl font-black text-zinc-800 group-hover:text-white transition-colors duration-500 mb-4">{item.year}</h3>
                                <h4 className="text-xl font-bold text-[#FF2E2E] mb-2">{item.title}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Features Grid */}
            <div className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-16 reveal-on-scroll border-b border-zinc-800 pb-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide">核心板块</h2>
                            <div className="w-20 h-1 bg-[#FF2E2E]"></div>
                        </div>
                        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase hidden md:block">Digital Empowerment · Rural Revitalization</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { id: 'ar', icon: Smartphone, title: 'AR 互动传习', desc: '利用AR技术将平面剪纸3D分解，沉浸式拆解每一刀的技法细节。' },
                            { id: 'custom', icon: User, title: '设计订单下乡', desc: '连接上海设计与陕北乡村。在线提交定制需求，由乡村工坊制作，非遗助力乡村增收。' },
                            { id: 'mall', icon: ShoppingBag, title: '国潮文创市集', desc: '家居装饰、节日礼品，让传统剪纸成为现代生活的一部分。' },
                            { id: 'profiles', icon: Users, title: '银青结对计划', desc: '传统技法与现代设计理念碰撞，共同孵化非遗新作品。' }
                        ].map((card, index) => (
                            <TiltCard key={card.id} onClick={() => setActivePage(card.id)} className="group cursor-pointer">
                                <div className="bg-[#111] border border-zinc-800 p-8 h-full flex flex-col hover:border-[#FF2E2E]/50 transition duration-500 relative overflow-hidden reveal-on-scroll">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E2E]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#FF2E2E] group-hover:text-white text-zinc-400 transition-colors duration-300 relative z-10">
                                        <card.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#FF2E2E] transition-colors relative z-10">{card.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 relative z-10 text-justify">
                                        {card.desc}
                                    </p>
                                    <div className="mt-auto flex items-center text-[#FF2E2E] text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 relative z-10">
                                        Enter <ArrowRight size={14} className="ml-2" />
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </div>

            {/* Workshop Live Feed */}
            <div className="bg-[#0A0A0A] py-24 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-12 reveal-on-scroll">
                        <div>
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                工坊实况连接
                            </h2>
                            <p className="text-zinc-500 text-sm mt-2">实时连线陕北各村落剪纸工坊，见证非遗诞生</p>
                        </div>
                        <div className="text-[#FF2E2E] text-xs font-bold border border-[#FF2E2E] px-3 py-1 rounded animate-pulse">LIVE FEED</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal-on-scroll">
                        {[
                            { loc: '安塞·魏塔村', status: '正在授课', master: '李秀芳', viewers: '1.2k' },
                            { loc: '延川·文安驿', status: '赶制订单', master: '高金爱', viewers: '856' },
                            { loc: '米脂·杨家沟', status: '纹样整理', master: '张凤兰', viewers: '542' }
                        ].map((feed, i) => (
                            <div key={i} className="relative aspect-video bg-zinc-900 border border-zinc-800 overflow-hidden group cursor-pointer">
                                <img src={`/api/placeholder/400/300?text=Live+${i + 1}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500 grayscale group-hover:grayscale-0" />
                                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 backdrop-blur-sm">
                                    <Camera size={10} className="text-red-500" /> REC
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{feed.loc}</h4>
                                            <p className="text-zinc-400 text-xs">传承人: {feed.master}</p>
                                        </div>
                                        <div className="text-[#FF2E2E] text-xs flex items-center gap-1">
                                            <Users size={12} /> {feed.viewers}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 border-2 border-[#FF2E2E]/0 group-hover:border-[#FF2E2E]/50 transition duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Impact Data */}
            <div className="bg-black text-white py-24 relative overflow-hidden border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { num: '300+', label: '银发传承人' },
                            { num: '50+', label: '设计订单' },
                            { num: '1.2万', label: '户均增收(元)' },
                            { num: '98%', label: '满意度' }
                        ].map((stat, idx) => (
                            <div key={idx} className="group reveal-on-scroll">
                                <div className="text-5xl md:text-6xl font-black mb-2 text-white group-hover:text-[#FF2E2E] transition-colors duration-300 tracking-tighter">{stat.num}</div>
                                <div className="text-xs text-zinc-500 tracking-[0.3em] uppercase group-hover:text-white transition-colors">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 bg-[#080808] border-t border-zinc-900">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center tracking-widest reveal-on-scroll">常见问题</h2>
                    <div className="space-y-4 reveal-on-scroll">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border border-zinc-800 bg-[#111] overflow-hidden group">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-zinc-900 transition"
                                >
                                    <span className="text-white font-bold text-sm tracking-wide">{faq.q}</span>
                                    <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#FF2E2E]' : ''}`} />
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-500 bg-black/50 ${activeFaq === idx ? 'max-h-40 py-5' : 'max-h-0 py-0'}`}>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MallPage = ({ addToCart }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCategory, setActiveCategory] = useState('全部');
    useScrollReveal();

    const filteredProducts = activeCategory === '全部'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#050505] animate-fade-in pb-20 pt-10">
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={addToCart}
                />
            )}

            {/* Flash Sale Banner (Limited Drop) */}
            <div className="pt-24 pb-8 bg-gradient-to-r from-[#FF2E2E]/20 to-transparent border-b border-[#FF2E2E]/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center relative z-10">
                    <div className="mb-4 md:mb-0">
                        <span className="bg-[#FF2E2E] text-white px-2 py-1 text-[10px] font-bold tracking-widest uppercase">Limited Drop</span>
                        <h2 className="text-3xl font-black text-white mt-2 italic">“金蛇狂舞” 限定礼盒</h2>
                    </div>
                    <div className="flex gap-4 text-center">
                        {['08', '45', '12'].map((t, i) => (
                            <div key={i} className="bg-black/50 border border-[#FF2E2E] p-3 w-16 backdrop-blur">
                                <div className="text-xl font-bold text-white font-mono">{t}</div>
                                <div className="text-[9px] text-[#FF2E2E] uppercase">{['Hrs', 'Min', 'Sec'][i]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-16">

                {/* [NEW] Curated Collections (Horizontal Scroll) */}
                <div className="mb-20 reveal-on-scroll">
                    <div className="flex justify-between items-end mb-8">
                        <h3 className="text-2xl font-bold text-white tracking-wide">专题策展</h3>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-[#FF2E2E]">
                            View All <ArrowRight size={12} />
                        </div>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {curatedCollections.map((col) => (
                            <div key={col.id} className="min-w-[300px] md:min-w-[400px] h-[240px] relative rounded-lg overflow-hidden group cursor-pointer border border-zinc-800 hover:border-zinc-600 transition">
                                <img src={`/api/placeholder/600/400?text=${col.image}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500" />
                                <div className={`absolute inset-0 bg-gradient-to-t ${col.color} opacity-80 mix-blend-multiply`}></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h4 className="text-2xl font-bold text-white mb-1">{col.title}</h4>
                                    <p className="text-sm text-zinc-300 font-light">{col.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-on-scroll">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">STORE</h2>
                        <p className="text-zinc-500 text-sm">将非遗美学融入现代生活</p>
                    </div>
                    <div className="flex gap-3 mt-6 md:mt-0 flex-wrap">
                        {['全部', '现代家居', '节日礼品', '生活周边', '时尚配饰'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border uppercase tracking-wider ${activeCategory === cat
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <TiltCard
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="group cursor-pointer reveal-on-scroll"
                        >
                            <div className="bg-[#111] border border-zinc-800 overflow-hidden relative">
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    <img
                                        src={`/api/placeholder/400/500?text=${product.image}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                    />
                                    {product.tag && (
                                        <span className="absolute top-3 left-3 bg-[#FF2E2E] text-white text-[10px] px-2 py-1 font-bold tracking-wider uppercase shadow-lg">
                                            {product.tag}
                                        </span>
                                    )}
                                    {/* Quick Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                                        <button className="w-full bg-white text-black py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#FF2E2E] hover:text-white transition flex items-center justify-center gap-2">
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5 bg-[#111] relative z-10 border-t border-zinc-900">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[10px] text-[#FF2E2E] font-bold uppercase tracking-widest">{product.category}</div>
                                        <div className="flex text-zinc-600 text-[10px] gap-1">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-white text-base mb-3 line-clamp-1 group-hover:text-[#FF2E2E] transition-colors">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-lg font-light text-white">¥{product.price}</span>
                                            <span className="text-xs text-zinc-600 line-through ml-2">¥{Math.floor(product.price * 1.2)}</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                            {product.sales} sold
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>

                {/* [NEW] Designer Spotlight in Mall */}
                <div className="mt-32 p-8 border border-zinc-800 bg-gradient-to-r from-[#111] to-black flex flex-col md:flex-row items-center gap-8 reveal-on-scroll">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                        <img src="/api/placeholder/200/200?text=Designer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[#FF2E2E] text-xs font-bold uppercase tracking-widest mb-1">Featured Designer</div>
                        <h3 className="text-2xl font-bold text-white mb-2">林晓 (Lin Xiao)</h3>
                        <p className="text-sm text-zinc-400 max-w-xl">"试图用代码的逻辑去解构剪纸的感性，让每一次镂空都成为光影的算法。" —— 2026 年度新锐设计师</p>
                    </div>
                    <button className="px-6 py-2 border border-zinc-700 text-white text-xs font-bold uppercase hover:bg-white hover:text-black transition">
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

const CustomPage = () => {
    const [submitted, setSubmitted] = useState(false);
    useScrollReveal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] animate-fade-in pt-20">
            {/* Custom Hero */}
            <div className="relative h-[60vh] bg-[#111] overflow-hidden flex items-center justify-center border-b border-zinc-800">
                <div className="absolute inset-0 bg-lattice opacity-10"></div>
                <img src="/api/placeholder/1920/600" alt="Workshop" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" />
                <div className="relative z-20 text-center px-4">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter" >设计订单下乡</h2>
                    <p className="text-lg text-zinc-400 max-w-2xl font-light mx-auto tracking-wide">
                        以<span className="text-[#FF2E2E] font-bold mx-2">设计</span>为桥梁，让非遗技艺变现。<br />
                        您的每一个定制需求，都将转化为陕北乡村工坊的实实在在的订单。
                    </p>
                </div>
            </div>

            {/* [NEW] Craft Lab - Material & Technique */}
            <div className="py-20 border-b border-zinc-900 bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-3xl font-bold text-white mb-12 tracking-wide text-center">工艺实验室</h3>
                    <div className="grid md:grid-cols-4 gap-6 reveal-on-scroll">
                        {craftMaterials.map((mat) => (
                            <div key={mat.id} className="group cursor-pointer">
                                <div className={`h-40 rounded-lg ${mat.bg} mb-4 transform group-hover:scale-105 transition duration-500 shadow-lg relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                                </div>
                                <h4 className="text-white font-bold">{mat.name}</h4>
                                <p className="text-xs text-zinc-500">{mat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map & Process */}
            <div className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Map Visual */}
                    <div className="lg:col-span-2 reveal-on-scroll">
                        <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                            <h3 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                                <MapPin className="text-[#FF2E2E]" /> 陕北乡村工坊网络
                            </h3>
                            <div className="flex gap-4 text-[10px] uppercase tracking-widest text-zinc-500">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> 生产中</span>
                                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#FFD700] rounded-full"></div> 待接单</span>
                            </div>
                        </div>

                        <div className="aspect-[16/9] bg-[#111] border border-zinc-800 relative overflow-hidden group">
                            {/* Grid BG */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                            <div className="absolute inset-0 p-8">
                                {/* SVG Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <path d="M30%,30% Q40%,45% 45%,60%" stroke="#FF2E2E" strokeWidth="1" strokeDasharray="4,4" fill="none" className="opacity-50" />
                                    <path d="M45%,60% Q60%,55% 75%,50%" stroke="#FF2E2E" strokeWidth="1" strokeDasharray="4,4" fill="none" className="opacity-50" />
                                </svg>

                                {/* Nodes */}
                                <div className="absolute top-[25%] left-[25%]">
                                    <div className="flex items-center gap-2 text-white bg-black/80 px-3 py-1 border border-zinc-700 rounded-full text-xs font-bold shadow-lg">
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                                        榆林·米脂工坊
                                    </div>
                                </div>
                                <div className="absolute top-[55%] left-[42%]">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-white bg-[#FF2E2E]/20 px-4 py-2 border border-[#FF2E2E] rounded-full text-sm font-bold shadow-[0_0_15px_#FF2E2E]">
                                            <div className="w-2 h-2 bg-[#FF2E2E] rounded-full animate-ping"></div>
                                            延安·安塞工坊 (Core)
                                        </div>
                                        <div className="mt-2 text-[10px] text-zinc-400 bg-black px-2 rounded">订单饱和度 80%</div>
                                    </div>
                                </div>
                                <div className="absolute top-[45%] right-[20%]">
                                    <div className="flex items-center gap-2 text-white bg-black/80 px-3 py-1 border border-zinc-700 rounded-full text-xs font-bold shadow-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        延川·文安驿
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data & Process */}
                    <div className="space-y-8 reveal-on-scroll">
                        <div className="bg-[#111] p-8 border-t-4 border-[#FF2E2E]">
                            <h4 className="text-xs font-bold tracking-[0.2em] text-[#FF2E2E] uppercase mb-8 flex items-center gap-2">
                                <Activity size={16} /> 实时助农数据
                            </h4>
                            <div className="space-y-8">
                                <div>
                                    <div className="text-4xl font-light text-white mb-1 font-sans">23</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">今日新增订单</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-light text-white mb-1 font-sans">¥128,500</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">本月累计增收</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                                    <div>
                                        <div className="text-xl font-bold text-white">32</div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">合作工坊</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">500+</div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">带动就业</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111] p-8 border border-zinc-800">
                            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-6">定制流程</h4>
                            <div className="space-y-4">
                                {['提交需求', '设计对接', '大师监制', '制作交付'].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4 text-sm text-zinc-400">
                                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-mono">{i + 1}</div>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* [NEW] Service Tiers */}
                <div className="py-20">
                    <h3 className="text-3xl font-bold text-white mb-12 text-center tracking-wide">定制套餐</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {serviceTiers.map((tier) => (
                            <TiltCard key={tier.id} className="group">
                                <div className="bg-[#111] border border-zinc-800 p-8 h-full flex flex-col hover:border-[#FF2E2E] transition duration-300 relative">
                                    {tier.id === 2 && <div className="absolute top-0 right-0 bg-[#FF2E2E] text-white text-[10px] font-bold px-2 py-1 uppercase">Recommended</div>}
                                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-white group-hover:text-[#FF2E2E] transition">
                                        <tier.icon size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                                    <div className="text-2xl font-light text-[#FF2E2E] mb-6">{tier.price}</div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {tier.features.map((f, i) => (
                                            <li key={i} className="text-zinc-400 text-sm flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></div> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-3 border border-zinc-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">
                                        Select Plan
                                    </button>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="mt-24 max-w-4xl mx-auto reveal-on-scroll">
                    <div className="bg-[#111] border border-zinc-800 flex flex-col md:flex-row min-h-[500px]">
                        <div className="bg-[#0A0A0A] p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden border-r border-zinc-800">
                            <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#FF2E2E]/10 rounded-full blur-3xl"></div>

                            <div>
                                <h3 className="text-3xl font-bold text-white mb-6 tracking-wide">开始定制</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    您的每一份订单，<br />都是对非遗技艺的最好守护。
                                </p>
                            </div>
                            <div className="space-y-4 text-xs tracking-wider text-zinc-400">
                                <p className="flex items-center gap-3"><CheckCircle size={14} className="text-[#FF2E2E]" /> 免费设计咨询</p>
                                <p className="flex items-center gap-3"><CheckCircle size={14} className="text-[#FF2E2E]" /> 全程可视化品控</p>
                                <p className="flex items-center gap-3"><CheckCircle size={14} className="text-[#FF2E2E]" /> 支持小批量起订</p>
                            </div>
                        </div>

                        <div className="p-12 md:w-3/5 bg-[#111] relative">
                            {!submitted ? (
                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">姓名/称呼</label>
                                            <input required type="text" className="w-full bg-[#0A0A0A] border border-zinc-800 p-3 text-white focus:border-[#FF2E2E] outline-none transition text-sm" placeholder="Name" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">联系电话</label>
                                            <input required type="tel" className="w-full bg-[#0A0A0A] border border-zinc-800 p-3 text-white focus:border-[#FF2E2E] outline-none transition text-sm" placeholder="Phone" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-widest">定制类型</label>
                                        <div className="flex gap-4 flex-wrap">
                                            {['企业礼品', '个人收藏', '家居装饰', '其他'].map(type => (
                                                <label key={type} className="flex items-center cursor-pointer group">
                                                    <div className="w-4 h-4 border border-zinc-700 mr-2 flex items-center justify-center group-hover:border-[#FF2E2E] transition bg-[#0A0A0A]">
                                                        <input type="radio" name="type" className="opacity-0 w-2 h-2 bg-[#FF2E2E] checked:opacity-100 transition-opacity" />
                                                    </div>
                                                    <span className="text-sm text-zinc-400 group-hover:text-white transition">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">需求描述</label>
                                        <textarea required className="w-full bg-[#0A0A0A] border border-zinc-800 p-3 text-white focus:border-[#FF2E2E] outline-none transition h-24 resize-none text-sm" placeholder="请简要描述您的定制想法，例如：用于婚礼伴手礼..." />
                                    </div>

                                    <button className="w-full bg-white text-black py-4 font-bold tracking-[0.2em] hover:bg-[#FF2E2E] hover:text-white transition shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase text-xs">
                                        提交需求
                                    </button>
                                </form>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#111]">
                                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">提交成功！</h3>
                                    <p className="text-zinc-500 mb-8 text-sm max-w-xs">感谢您的信任。我们的设计顾问将在 24 小时内通过电话与您联系。</p>
                                    <button onClick={() => setSubmitted(false)} className="text-[#FF2E2E] text-xs font-bold tracking-widest hover:text-white uppercase border-b border-[#FF2E2E] pb-1">
                                        提交新的需求
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* [NEW] Recent Deliveries - Marquee */}
                <div className="mt-32 pt-16 border-t border-zinc-900">
                    <h4 className="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">近期交付案例</h4>
                    <div className="flex justify-between gap-4 overflow-hidden opacity-50 hover:opacity-100 transition">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="min-w-[200px] bg-[#111] p-4 border border-zinc-800 flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white"><Package size={16} /></div>
                                <div>
                                    <div className="text-white text-sm font-bold">Order #202{i}</div>
                                    <div className="text-zinc-500 text-xs">Shipped to Shanghai</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfilesPage = () => {
    useScrollReveal();
    return (
        <div className="min-h-screen bg-[#050505] py-20 animate-fade-in">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 relative reveal-on-scroll">
                    <span className="text-[#FF2E2E] font-bold tracking-[0.5em] text-xs uppercase mb-4 block">Project Connect</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                        银青<span className="text-zinc-800 text-stroke">结对</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-zinc-400 text-lg font-light leading-relaxed">
                        我们搭建了"青年设计师 + 银发传承人"的结对平台。<br />传统的技法与现代的灵感在这里碰撞，
                        共同孵化出具有市场生命力的非遗新作品，实现文化传承与乡村振兴双重目标。
                    </p>
                </div>

                <div className="relative">
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#FF2E2E]/50 to-transparent"></div>

                    <div className="grid md:grid-cols-2 gap-20">
                        {/* Inheritor */}
                        <div className="flex flex-col items-end text-right reveal-on-scroll">
                            <div className="relative w-full max-w-sm mb-8 group">
                                <div className="absolute inset-0 bg-[#FF2E2E] opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>
                                <div className="relative aspect-[3/4] bg-[#111] border border-zinc-800 overflow-hidden grayscale group-hover:grayscale-0 transition duration-700">
                                    <img src="/api/placeholder/400/600?text=Master" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute bottom-0 right-0 bg-black/90 px-6 py-4 border-t border-l border-zinc-800">
                                        <div className="text-2xl font-bold text-white">{profiles.inheritor.name}</div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">坚守·传统技艺</h3>
                            <p className="text-[#FF2E2E] text-xs font-bold tracking-widest uppercase mb-6">{profiles.inheritor.title}</p>
                            <p className="text-zinc-400 text-sm leading-8 max-w-md">
                                “{profiles.inheritor.desc}”
                            </p>
                            <div className="flex gap-2 mt-4 justify-end">
                                {profiles.inheritor.tags.map(tag => (
                                    <span key={tag} className="text-[10px] border border-zinc-800 text-zinc-500 px-2 py-1">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Designer */}
                        <div className="flex flex-col items-start text-left md:pt-32 reveal-on-scroll">
                            <div className="relative w-full max-w-sm mb-8 group">
                                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>
                                <div className="relative aspect-[3/4] bg-[#111] border border-zinc-800 overflow-hidden grayscale group-hover:grayscale-0 transition duration-700">
                                    <img src="/api/placeholder/400/600?text=Designer" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute top-0 left-0 bg-black/90 px-6 py-4 border-b border-r border-zinc-800">
                                        <div className="text-2xl font-bold text-white">{profiles.designer.name}</div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">重塑·视觉语言</h3>
                            <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-6">{profiles.designer.title}</p>
                            <p className="text-zinc-400 text-sm leading-8 max-w-md">
                                “{profiles.designer.desc}”
                            </p>
                            <div className="flex gap-2 mt-4">
                                {profiles.designer.tags.map(tag => (
                                    <span key={tag} className="text-[10px] border border-zinc-800 text-zinc-500 px-2 py-1">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Outcome Card */}
                    <div className="mt-32 border border-zinc-800 p-10 bg-[#111] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden reveal-on-scroll">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2E2E]/5 rounded-full blur-3xl"></div>
                        <div className="flex-1 relative z-10">
                            <span className="text-[#FF2E2E] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">共创成果</span>
                            <h4 className="text-3xl font-bold text-white mb-4">2026《生肖·潮》系列</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-xl">
                                李秀芳老师提供核心抓髻娃娃剪纸纹样，林晓团队进行矢量化重构并应用于手机壳、帆布袋。
                            </p>
                            <div className="flex gap-12 border-t border-zinc-800 pt-6">
                                <div>
                                    <div className="text-2xl font-light text-white">5,000+</div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">销量</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-light text-white">15人</div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">带动就业</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-light text-white">¥75k</div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">乡村增收</div>
                                </div>
                            </div>
                        </div>
                        <button className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition uppercase text-xs font-bold tracking-widest z-10">
                            查看作品
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ARPage = ({ onExit }) => (
    <div className="min-h-screen bg-black text-white animate-fade-in flex flex-col font-sans overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
            <div className="flex items-center gap-6 pointer-events-auto">
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-white/70 hover:text-[#FF2E2E] transition-all group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
                    <span className="text-xs font-bold tracking-widest uppercase">返回</span>
                </button>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FF2E2E] rounded-full animate-pulse shadow-[0_0_10px_#FF2E2E]"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">AR 剪纸传习馆</span>
            </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row h-screen pt-20 pb-10 px-6 gap-6">
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 h-full flex flex-col justify-between pointer-events-auto z-40 bg-black/40 backdrop-blur-md border border-zinc-800 p-6 rounded-xl overflow-y-auto">
                <div>
                    <h3 className="text-2xl font-bold mb-8 text-white tracking-widest">选择教程</h3>
                    <div className="space-y-4">
                        {arTutorials.map((tut) => (
                            <div key={tut.id} className={`p-4 border ${tut.status === 'LIVE' ? 'border-[#FF2E2E] bg-[#FF2E2E]/5' : 'border-zinc-800 bg-black/50 hover:border-zinc-600'} rounded-lg cursor-pointer group transition relative overflow-hidden`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-bold text-white">{tut.title}</span>
                                    {tut.status === 'LIVE' ? (
                                        <span className="text-[9px] bg-[#FF2E2E] text-black px-1.5 py-0.5 font-bold rounded animate-pulse">LIVE</span>
                                    ) : (
                                        <span className="text-[9px] text-zinc-500 border border-zinc-700 px-1.5 py-0.5 rounded">{tut.status}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                                    <span className="flex items-center gap-1"><Target size={10} /> {tut.level}</span>
                                    <span className="flex items-center gap-1"><Timer size={10} /> {tut.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toolbox Section */}
                <div className="mt-8">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">工具箱</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: PenTool, label: "虚拟刻刀" },
                            { icon: Layers, label: "图层拆解" },
                            { icon: Grid, label: "辅助网格" },
                            { icon: Zap, label: "自动吸附" }
                        ].map((tool, i) => (
                            <button key={i} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition group">
                                <tool.icon size={18} className="text-zinc-400 group-hover:text-[#FF2E2E] mb-2" />
                                <span className="text-[10px] text-zinc-300">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main AR Viewport */}
            <div className="flex-1 relative rounded-xl overflow-hidden border border-zinc-800 bg-[#050505]">
                <img src="/api/placeholder/1200/800?text=AR+Scene" alt="Camera Feed" className="absolute inset-0 w-full h-full object-cover opacity-60" />

                {/* HUD Elements */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="bg-black/60 backdrop-blur border border-[#FF2E2E]/30 px-4 py-2 rounded text-xs font-mono text-[#FF2E2E]">
                        ACCURACY: 98.4%
                    </div>
                    <div className="bg-black/60 backdrop-blur border border-zinc-700 px-4 py-2 rounded text-xs font-mono text-zinc-300">
                        TIME: 04:12
                    </div>
                </div>

                {/* AR UI Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[500px] h-[500px] border border-[#FF2E2E]/30 relative animate-pulse-slow">
                        {/* Reticle Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FF2E2E]"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FF2E2E]"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FF2E2E]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FF2E2E]"></div>

                        {/* 3D Paper Simulation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-[#FF2E2E]/80 backdrop-blur-sm rotate-45 shadow-[0_0_80px_rgba(255,46,46,0.3)] animate-breathe flex items-center justify-center border border-white/20">
                                <div className="absolute inset-0 border-t border-dashed border-white/60 top-1/2 -translate-y-1/2 w-[140%] -left-[20%]"></div>
                                <span className="text-white font-mono text-xs bg-black/50 px-2 py-1 transform -rotate-45">FOLD HERE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats & Actions */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="flex gap-4">
                        <button className="w-12 h-12 bg-black/60 backdrop-blur rounded-full flex items-center justify-center border border-zinc-700 hover:bg-[#FF2E2E] hover:border-[#FF2E2E] transition text-white pointer-events-auto">
                            <Clock size={20} />
                        </button>
                        <button className="w-12 h-12 bg-black/60 backdrop-blur rounded-full flex items-center justify-center border border-zinc-700 hover:bg-[#FF2E2E] hover:border-[#FF2E2E] transition text-white pointer-events-auto">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="bg-black/80 backdrop-blur border-l-4 border-[#FF2E2E] p-4 max-w-sm rounded-r-lg">
                        <h5 className="text-white text-sm font-bold mb-1">步骤 2/5: 对角折叠</h5>
                        <p className="text-xs text-zinc-400">请沿着虚线将正方形红纸对折。注意边角对齐，并使用工具压实折痕。</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- App Root ---
const App = () => {
    const [activePage, setActivePage] = useState('home');
    const [cartCount, setCartCount] = useState(0);
    const mousePos = useMousePosition();

    const addToCart = () => setCartCount(c => c + 1);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activePage]);

    return (
        <>
            <GlobalStyles />
            {/* 动态噪点层 */}
            <div className="noise-bg"></div>

            {/* 光标跟随 (桌面端) */}
            <div
                className="cursor-glow hidden md:block"
                style={{ left: mousePos.x, top: mousePos.y }}
            ></div>

            <div className="relative z-10">
                {activePage !== 'ar' && <Navbar activePage={activePage} setActivePage={setActivePage} cartCount={cartCount} />}

                <main>
                    {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
                    {activePage === 'mall' && <MallPage addToCart={addToCart} />}
                    {activePage === 'profiles' && <ProfilesPage />}
                    {activePage === 'ar' && <ARPage onExit={() => setActivePage('home')} />}
                    {activePage === 'custom' && <CustomPage />}
                </main>

                {/* Footer (Dark Mode + Enhanced Content) */}
                {activePage !== 'ar' && (
                    <footer className="bg-[#050505] text-zinc-500 py-24 border-t border-zinc-900 relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 text-sm relative z-10">
                            <div className="col-span-1 md:col-span-1">
                                <div className="flex items-center text-white text-xl font-bold mb-6 tracking-widest">
                                    <div className="w-8 h-8 bg-[#FF2E2E] rounded flex items-center justify-center mr-3 shadow-[0_0_10px_#FF2E2E]">
                                        <Scissors size={18} className="text-white" />
                                    </div>
                                    剪韵新生
                                </div>
                                <p className="mb-6 leading-relaxed text-xs">
                                    致力于陕北剪纸非遗活化与乡村振兴融合创新。<br />
                                    让古老的技艺在数字化时代焕发新生，让乡村通过非遗产业实现共同富裕。
                                </p>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center hover:border-[#FF2E2E] hover:text-[#FF2E2E] transition cursor-pointer">
                                            <Share2 size={14} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b border-[#FF2E2E] inline-block pb-1">项目导航</h4>
                                <ul className="space-y-3">
                                    <li><button onClick={() => setActivePage('home')} className="hover:text-[#FF2E2E] transition-colors">首页概览</button></li>
                                    <li><button onClick={() => setActivePage('profiles')} className="hover:text-[#FF2E2E] transition-colors">银青结对</button></li>
                                    <li><button onClick={() => setActivePage('mall')} className="hover:text-[#FF2E2E] transition-colors">文创市集</button></li>
                                    <li><button onClick={() => setActivePage('ar')} className="hover:text-[#FF2E2E] transition-colors">AR 传习馆</button></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b border-[#FF2E2E] inline-block pb-1">联系与支持</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2"><Mail size={14} /> business@paper-revival.cn</li>
                                    <li className="flex items-center gap-2"><User size={14} /> hr@paper-revival.cn</li>
                                    <li className="flex items-center gap-2"><MapPin size={14} /> 陕西省延安市非遗创新产业园 A座</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-b border-[#FF2E2E] inline-block pb-1">订阅动态</h4>
                                <p className="text-xs mb-4">订阅我们的通讯，第一时间获取新品发布和非遗展览信息。</p>
                                <div className="flex">
                                    <input type="email" placeholder="您的邮箱" className="bg-[#111] border border-zinc-800 text-white text-xs px-3 py-2 outline-none focus:border-[#FF2E2E] flex-1" />
                                    <button className="bg-[#FF2E2E] text-white px-4 py-2 text-xs font-bold hover:bg-white hover:text-black transition">订阅</button>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
                            <div className="mb-4 md:mb-0">© 2025 剪韵新生项目组 All Rights Reserved.</div>
                            <div className="flex gap-8">
                                <span className="hover:text-white cursor-pointer transition">隐私政策</span>
                                <span className="hover:text-white cursor-pointer transition">服务条款</span>
                                <span className="hover:text-white cursor-pointer transition">Cookie 设置</span>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </>
    );
};

export default App;